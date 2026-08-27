import { useEffect } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

/** Mounts once at the app root — replaces native scroll jumps with inertia-eased scrolling. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis()
    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
