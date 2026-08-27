import { Vector3 } from 'three'
import type { HandPoint } from '../lib/mediapipe/useHandTracking'

/**
 * Maps normalized hand-landmark coordinates (0–1, mirrored) to the small
 * fixed stage the orb/particles live on. A direct linear map — not a real
 * camera unproject — since the stage's scale is arbitrary and this is easier
 * to reason about and tune than matching perspective depth.
 */
export function handToWorld(point: HandPoint, target = new Vector3()): Vector3 {
  return target.set((point.x - 0.5) * 5.2, -(point.y - 0.5) * 2.4, (0.5 - point.z) * 1.2)
}
