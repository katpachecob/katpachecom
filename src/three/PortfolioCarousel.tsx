import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import {
  CanvasTexture,
  SRGBColorSpace,
  TextureLoader,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type Texture,
} from 'three'

const ANGLE_STEP = Math.PI / 6.5
const RADIUS = 6.4
const ITEM_W = 3.4
const ITEM_H = 2.1
const DRAG_SENSITIVITY = 0.006
const FRICTION = 0.9
const COAST_STOP = 0.05

function createGradientTexture(colorA: string, colorB: string) {
  const width = 256
  const height = Math.round(width * (ITEM_H / ITEM_W))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, colorA)
    gradient.addColorStop(1, colorB)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
  return new CanvasTexture(canvas)
}

// Mimics CSS `background-size: cover` — crops instead of stretching so a
// portrait photo still fills the carousel's landscape card cleanly.
function fitCover(texture: Texture, frameAspect: number) {
  const { width, height } = texture.image as { width: number; height: number }
  const imageAspect = width / height
  if (imageAspect > frameAspect) {
    const scale = frameAspect / imageAspect
    texture.repeat.set(scale, 1)
    texture.offset.set((1 - scale) / 2, 0)
  } else {
    const scale = imageAspect / frameAspect
    texture.repeat.set(1, scale)
    texture.offset.set(0, (1 - scale) / 2)
  }
  texture.needsUpdate = true
}

interface CarouselProps {
  colors: [string, string][]
  covers?: (string | undefined)[]
  active: number
  onActiveChange: (index: number) => void
}

function Carousel({ colors, covers, active, onActiveChange }: CarouselProps) {
  const groupRef = useRef<Group>(null)
  const meshRefs = useRef<(Mesh | null)[]>([])
  const materialRefs = useRef<(MeshBasicMaterial | null)[]>([])
  const rotation = useRef(0)
  const targetRotation = useRef(-active * ANGLE_STEP)
  const velocity = useRef(0)
  const pointerX = useRef(0)
  const prevPointerX = useRef(0)
  const dragging = useRef(false)
  const coasting = useRef(false)
  const moved = useRef(false)

  const textures = useMemo(() => colors.map(([a, b]) => createGradientTexture(a, b)), [colors])

  useEffect(() => {
    const loader = new TextureLoader()
    covers?.forEach((url, i) => {
      if (!url) return
      loader.load(url, (texture) => {
        texture.colorSpace = SRGBColorSpace
        fitCover(texture, ITEM_W / ITEM_H)
        const material = materialRefs.current[i]
        if (material) {
          material.map = texture
          material.needsUpdate = true
        }
      })
    })
  }, [covers])

  useEffect(() => {
    if (!dragging.current && !coasting.current) targetRotation.current = -active * ANGLE_STEP
  }, [active])

  const clampIndex = (i: number) => Math.min(colors.length - 1, Math.max(0, i))
  const minRotation = -(colors.length - 1) * ANGLE_STEP - ANGLE_STEP * 0.4
  const maxRotation = ANGLE_STEP * 0.4
  const maxVelocity = ANGLE_STEP * 6

  useFrame((_, delta) => {
    if (dragging.current) {
      const dx = pointerX.current - prevPointerX.current
      const dRot = dx * DRAG_SENSITIVITY
      if (Math.abs(dx) > 2) moved.current = true
      rotation.current += dRot
      velocity.current = delta > 0 ? Math.max(-maxVelocity, Math.min(maxVelocity, dRot / delta)) : 0
      prevPointerX.current = pointerX.current
    } else if (coasting.current) {
      rotation.current += velocity.current * delta
      velocity.current *= FRICTION
      if (Math.abs(velocity.current) < COAST_STOP) {
        coasting.current = false
        const nearest = clampIndex(Math.round(-rotation.current / ANGLE_STEP))
        targetRotation.current = -nearest * ANGLE_STEP
        onActiveChange(nearest)
      }
    } else {
      rotation.current += (targetRotation.current - rotation.current) * 0.15
    }

    rotation.current = Math.max(minRotation, Math.min(maxRotation, rotation.current))
    if (groupRef.current) groupRef.current.rotation.y = rotation.current

    colors.forEach((_, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      const worldAngle = rotation.current + i * ANGLE_STEP
      const closeness = Math.max(0, 1 - Math.abs(worldAngle) / (ANGLE_STEP * 1.6))
      mesh.scale.setScalar(0.72 + closeness * 0.34)
      const material = mesh.material as MeshBasicMaterial
      material.opacity = 0.35 + closeness * 0.65
    })
  })

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    dragging.current = true
    coasting.current = false
    moved.current = false
    pointerX.current = e.clientX
    prevPointerX.current = e.clientX
    velocity.current = 0
    ;(e.target as unknown as Element | null)?.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return
    pointerX.current = e.clientX
  }

  const onPointerUp = () => {
    if (!dragging.current) return
    dragging.current = false
    coasting.current = true
  }

  return (
    <>
      {/* Invisible full-frustum plane so drag tracking never loses the pointer between cards */}
      <mesh
        position={[0, 0, -10]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerOut={onPointerUp}
      >
        <planeGeometry args={[40, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/*
        Items sit on a true circle of radius RADIUS centered on the group's own
        origin. Rotating the group by -i*ANGLE_STEP brings item i to local
        (0,0,RADIUS) exactly, regardless of i — the constant "pull the circle
        toward the camera" offset has to live on the group's own position
        (applied *after* rotation), not baked into each item's pre-rotation
        position, or it un-cancels for every item except i=0.
      */}
      <group ref={groupRef} position={[0, 0, -RADIUS]}>
        {colors.map((_, i) => (
          <mesh
            key={i}
            ref={(el) => {
              meshRefs.current[i] = el
            }}
            position={[RADIUS * Math.sin(i * ANGLE_STEP), 0, RADIUS * Math.cos(i * ANGLE_STEP)]}
            rotation={[0, i * ANGLE_STEP, 0]}
            onClick={(e) => {
              e.stopPropagation()
              if (!moved.current) onActiveChange(i)
            }}
          >
            <planeGeometry args={[ITEM_W, ITEM_H]} />
            <meshBasicMaterial
              ref={(el) => {
                materialRefs.current[i] = el
              }}
              map={textures[i]}
              transparent
            />
          </mesh>
        ))}
      </group>
    </>
  )
}

export function PortfolioCarousel({ colors, covers, active, onActiveChange }: CarouselProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'none' }}
    >
      <Carousel colors={colors} covers={covers} active={active} onActiveChange={onActiveChange} />
    </Canvas>
  )
}
