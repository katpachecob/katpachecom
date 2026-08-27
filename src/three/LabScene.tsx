import { useMemo, useRef } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  IcosahedronGeometry,
  PointsMaterial,
  type Group,
  type Points as ThreePoints,
} from 'three'
import type { MutableRefObject } from 'react'
import type { HandPoint } from '../lib/mediapipe/useHandTracking'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

const idleSpin = prefersReducedMotion() ? 0 : 0.15
const COLORS = ['#ffffff', '#ffb37a', '#ff7e3d', '#e8632a']

// Matches the analyser's fftSize in useHandAudio — time-domain buffers are
// one sample per fftSize slot (vs. fftSize/2 for frequency-domain).
const AUDIO_SAMPLE_SIZE = 128
// Ambient material rarely swings loud, so raw RMS reads as near-silent —
// boost it so quiet passages still visibly move the sphere and nebula.
const AUDIO_LEVEL_BOOST = 4.5

// RMS of the waveform itself reads as steady loudness across an ambient
// track's whole spectrum, unlike averaging frequency bins (which stays low
// whenever the high end is quiet, even during a loud passage).
function readAudioLevel(analyser: AnalyserNode | null | undefined, timeData: Uint8Array<ArrayBuffer>) {
  if (!analyser) return 0
  analyser.getByteTimeDomainData(timeData)
  let sumSquares = 0
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128
    sumSquares += v * v
  }
  const rms = Math.sqrt(sumSquares / timeData.length)
  return Math.min(1, rms * AUDIO_LEVEL_BOOST)
}

function getDotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.7)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  return new CanvasTexture(canvas)
}

function getCloudTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255,255,255,0.55)')
    gradient.addColorStop(0.3, 'rgba(255,179,122,0.3)')
    gradient.addColorStop(0.65, 'rgba(232,99,42,0.12)')
    gradient.addColorStop(1, 'rgba(232,99,42,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  return new CanvasTexture(canvas)
}

const NEBULA_COLORS = ['#ffd8a8', '#ffb37a', '#ff7e3d', '#e8632a']

// Sum of uniforms (Irwin-Hall) approximates a bell curve — cheap way to get
// soft, center-weighted jitter without a full Box-Muller transform.
function softJitter() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5
}

// Three overlapping layers — a small dense core, a mid puff, and a big soft
// haze — instead of a few isolated blobs. Every layer samples the same
// center-weighted cloud, just at different point sizes, so their edges melt
// into each other into one continuous glow rather than leaving gaps.
const NEBULA_LAYERS = [
  { count: 40, size: 0.42, spread: 0.32 },
  { count: 22, size: 0.75, spread: 0.44 },
  { count: 10, size: 1.15, spread: 0.5 },
]

function buildNebulaLayer(count: number, spread: number) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const color = new Color()

  for (let i = 0; i < count; i++) {
    positions[i * 3] = softJitter() * spread
    positions[i * 3 + 1] = softJitter() * spread
    positions[i * 3 + 2] = softJitter() * spread

    color.set(NEBULA_COLORS[i % NEBULA_COLORS.length])
    colors.set([color.r, color.g, color.b], i * 3)
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
  return geo
}

interface NebulaProps {
  analyserRef?: MutableRefObject<AnalyserNode | null>
  distortionRef?: MutableRefObject<number>
}

function Nebula({ analyserRef, distortionRef }: NebulaProps) {
  const groupRef = useRef<Group>(null)
  const cloudTexture = useMemo(() => getCloudTexture(), [])
  const layers = useMemo(
    () => NEBULA_LAYERS.map((layer) => ({ ...layer, geometry: buildNebulaLayer(layer.count, layer.spread) })),
    [],
  )
  const materialRefs = useRef<Array<InstanceType<typeof PointsMaterial> | null>>([])
  const timeData = useMemo(() => new Uint8Array(AUDIO_SAMPLE_SIZE), [])
  const level = useRef(0)
  const drift = useRef(0)

  useFrame((_, delta) => {
    const targetLevel = readAudioLevel(analyserRef?.current, timeData)
    level.current += (targetLevel - level.current) * 0.25
    // Already smoothed upstream in useHandAudio's own tick loop.
    const distortion = distortionRef?.current ?? 0

    drift.current += delta * 0.06
    if (groupRef.current) {
      groupRef.current.rotation.y = drift.current
      groupRef.current.rotation.x = Math.sin(drift.current * 0.5) * 0.2
      const scale = 1 + level.current * 0.45 + distortion * 0.7
      groupRef.current.scale.setScalar(scale)
    }

    layers.forEach((layer, i) => {
      const material = materialRefs.current[i]
      if (!material) return
      material.size = layer.size + level.current * layer.size * 0.9 + distortion * layer.size * 0.8
      material.opacity = Math.min(1, 0.35 + level.current * 0.55 + distortion * 0.15)
    })
  })

  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => (
        <points key={i} geometry={layer.geometry}>
          <pointsMaterial
            ref={(el) => {
              materialRefs.current[i] = el
            }}
            size={layer.size}
            map={cloudTexture}
            vertexColors
            transparent
            opacity={0.35}
            blending={AdditiveBlending}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      ))}
    </group>
  )
}

function buildPointCloud() {
  // Sample the icosahedron's own subdivided vertices as a shell of particles —
  // reads as the same silhouette, just made of light instead of a solid face.
  const source = new IcosahedronGeometry(1.6, 4)
  const positions = source.attributes.position.array as Float32Array
  const count = positions.length / 3
  const colors = new Float32Array(positions.length)
  const color = new Color()

  for (let i = 0; i < count; i++) {
    color.set(COLORS[i % COLORS.length])
    colors.set([color.r, color.g, color.b], i * 3)
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
  return geo
}

interface RotatingObjectProps {
  handRef: MutableRefObject<HandPoint | null>
  analyserRef?: MutableRefObject<AnalyserNode | null>
  distortionRef?: MutableRefObject<number>
}

function RotatingObject({ handRef, analyserRef, distortionRef }: RotatingObjectProps) {
  const groupRef = useRef<Group>(null)
  const pointsRef = useRef<ThreePoints>(null)
  const dotTexture = useMemo(() => getDotTexture(), [])
  const pointGeometry = useMemo(() => buildPointCloud(), [])
  const rotation = useRef({ x: 0.3, y: 0 })
  const drag = useRef({ active: false, lastX: 0, lastY: 0 })
  const timeData = useMemo(() => new Uint8Array(AUDIO_SAMPLE_SIZE), [])
  const level = useRef(0)

  useFrame((_, delta) => {
    const hand = handRef.current
    if (hand) {
      const targetY = (hand.x - 0.5) * Math.PI * 1.6
      const targetX = (hand.y - 0.5) * Math.PI * 0.9
      rotation.current.y += (targetY - rotation.current.y) * 0.08
      rotation.current.x += (targetX - rotation.current.x) * 0.08
    } else if (!drag.current.active) {
      rotation.current.y += delta * idleSpin
    }

    const targetLevel = readAudioLevel(analyserRef?.current, timeData)
    level.current += (targetLevel - level.current) * 0.25

    if (groupRef.current) {
      groupRef.current.rotation.y = rotation.current.y
      groupRef.current.rotation.x = rotation.current.x
      groupRef.current.scale.setScalar(1 + level.current * 0.15)
    }
  })

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    drag.current = { active: true, lastX: e.clientX, lastY: e.clientY }
    ;(e.target as unknown as Element | null)?.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return
    rotation.current.y += (e.clientX - drag.current.lastX) * 0.006
    rotation.current.x += (e.clientY - drag.current.lastY) * 0.006
    drag.current.lastX = e.clientX
    drag.current.lastY = e.clientY
  }

  const onPointerUp = () => {
    drag.current.active = false
  }

  return (
    <>
      {/* Sibling of the hand-rotated group, not a child — spins on its own axis regardless of hand/drag input */}
      <Nebula analyserRef={analyserRef} distortionRef={distortionRef} />
      <group ref={groupRef}>
        {/* Invisible hit target — keeps drag-to-rotate working since raycasting against Points is unreliable */}
        <mesh
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerOut={onPointerUp}
        >
          <icosahedronGeometry args={[1.6, 1]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <points ref={pointsRef} geometry={pointGeometry}>
          <pointsMaterial
            size={0.05}
            map={dotTexture}
            vertexColors
            transparent
            opacity={0.9}
            blending={AdditiveBlending}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      </group>
    </>
  )
}

interface LabSceneProps {
  handRef: MutableRefObject<HandPoint | null>
  analyserRef?: MutableRefObject<AnalyserNode | null>
  distortionRef?: MutableRefObject<number>
}

export function LabScene({ handRef, analyserRef, distortionRef }: LabSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
      <RotatingObject handRef={handRef} analyserRef={analyserRef} distortionRef={distortionRef} />
    </Canvas>
  )
}
