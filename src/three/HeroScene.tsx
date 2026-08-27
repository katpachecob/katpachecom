import { Canvas } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { HandTrail } from './HandTrail'
import type { HandPoint } from '../lib/mediapipe/useHandTracking'

export function HeroScene({ handRef }: { handRef: MutableRefObject<HandPoint | null> }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <HandTrail handRef={handRef} />
    </Canvas>
  )
}
