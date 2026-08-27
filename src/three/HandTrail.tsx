import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Vector3, type Mesh, type MeshBasicMaterial } from 'three'
import type { MutableRefObject } from 'react'
import type { HandPoint } from '../lib/mediapipe/useHandTracking'
import { handToWorld } from './handWorld'

const MAX_STARS = 200
const LIFETIME = 1.1
const SPEED_THRESHOLD = 0.005
const MAX_SPARKS_PER_FRAME = 1
const FRICTION = 0.5
const COLORS = ['#ff7e3d', '#ff7e3d', '#ff7e3d']

interface StarState {
  age: number
  active: boolean
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
}

/**
 * The only particles in the scene — the canvas is empty black until the hand
 * moves, then sparks trail behind it and fade, comet-style. No hand, no
 * particles: nothing lingers as ambient decoration.
 */
export function HandTrail({ handRef }: { handRef: MutableRefObject<HandPoint | null> }) {
  const meshRefs = useRef<(Mesh | null)[]>([])
  const stars = useRef<StarState[]>(
    Array.from({ length: MAX_STARS }, () => ({
      age: LIFETIME,
      active: false,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
    })),
  )
  const nextSlot = useRef(0)
  const prevHand = useRef<HandPoint | null>(null)
  const prevWorld = useRef(new Vector3())
  const worldPos = useRef(new Vector3())

  useFrame((_, delta) => {
    const hand = handRef.current

    if (hand) {
      handToWorld(hand, worldPos.current)

      if (prevHand.current) {
        const dx = worldPos.current.x - prevWorld.current.x
        const dy = worldPos.current.y - prevWorld.current.y
        const speed = Math.hypot(dx, dy)

        if (speed > SPEED_THRESHOLD) {
          const sparkCount = Math.min(MAX_SPARKS_PER_FRAME, Math.ceil(speed * 40))
          for (let s = 0; s < sparkCount; s++) {
            const slot = nextSlot.current
            stars.current[slot] = {
              age: 0,
              active: true,
              x: worldPos.current.x,
              y: worldPos.current.y,
              z: worldPos.current.z,
              vx: -dx * 6 + (Math.random() - 0.5) * 0.15,
              vy: -dy * 6 + (Math.random() - 0.5) * 0.15,
              vz: (Math.random() - 0.5) * 0.15,
            }
            nextSlot.current = (slot + 1) % MAX_STARS
          }
        }
      }

      prevWorld.current.copy(worldPos.current)
      prevHand.current = hand
    } else {
      prevHand.current = null
    }

    stars.current.forEach((star, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return

      if (!star.active) {
        mesh.visible = false
        return
      }

      star.age += delta
      if (star.age >= LIFETIME) {
        star.active = false
        mesh.visible = false
        return
      }

      star.x += star.vx * delta
      star.y += star.vy * delta
      star.z += star.vz * delta
      star.vx *= FRICTION
      star.vy *= FRICTION
      star.vz *= FRICTION

      const t = star.age / LIFETIME
      mesh.visible = true
      mesh.position.set(star.x, star.y, star.z)
      mesh.scale.setScalar((1 - t) * 0.022 + 0.004)
      ;(mesh.material as MeshBasicMaterial).opacity = 1 - t
    })
  })

  return (
    <>
      {stars.current.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el
          }}
          visible={false}
        >
          <circleGeometry args={[1, 10]} />
          <meshBasicMaterial
            color={COLORS[i % COLORS.length]}
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  )
}
