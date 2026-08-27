import { useEffect, useRef, useState } from 'react'
import type { HandLandmarker } from '@mediapipe/tasks-vision'

export type CameraStatus = 'idle' | 'pending' | 'granted' | 'denied' | 'unsupported'

export interface HandPoint {
  x: number
  y: number
  z: number
}

let landmarkerPromise: Promise<HandLandmarker> | null = null

// Loaded on demand (not at module top-level) so the ~10MB wasm/model only
// ships to visitors who actually reach a camera-driven section.
function getLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = import('@mediapipe/tasks-vision').then(
      async ({ FilesetResolver, HandLandmarker }) => {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm',
        )
        return HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        })
      },
    )
  }
  return landmarkerPromise
}

/**
 * Runs MediaPipe Hand Landmarker against the user's camera, entirely client-side —
 * no frame ever leaves the browser. Exposes the palm position via a ref (not state)
 * so consumers can read it inside a requestAnimationFrame loop without triggering
 * a React re-render on every video frame.
 */
export function useHandTracking() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const handRef = useRef<HandPoint | null>(null)
  const [status, setStatus] = useState<CameraStatus>('idle')

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return
    }

    let stream: MediaStream | null = null
    let rafId = 0
    let cancelled = false

    async function start() {
      setStatus('pending')
      try {
        const [landmarker, mediaStream] = await Promise.all([
          getLandmarker(),
          navigator.mediaDevices.getUserMedia({
            video: { width: 480, height: 360, facingMode: 'user' },
          }),
        ])

        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop())
          return
        }

        stream = mediaStream
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        await video.play()
        setStatus('granted')

        const loop = () => {
          if (cancelled || !video) return
          if (video.readyState >= 2) {
            const result = landmarker.detectForVideo(video, performance.now())
            const landmarks = result.landmarks?.[0]
            if (landmarks) {
              const palm = landmarks[9] // middle-finger MCP ≈ stable palm center
              handRef.current = { x: 1 - palm.x, y: palm.y, z: palm.z }
            } else {
              handRef.current = null
            }
          }
          rafId = requestAnimationFrame(loop)
        }
        loop()
      } catch {
        if (!cancelled) setStatus('denied')
      }
    }

    start()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return { videoRef, handRef, status }
}
