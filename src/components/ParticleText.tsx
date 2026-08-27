import { useEffect, useRef } from 'react'

interface ParticleTextProps {
  texts: string[]
  className?: string
  colors?: string[]
  /** How long (ms) each phrase holds fully-formed before scattering into the next. */
  interval?: number
}

interface Point {
  x: number
  y: number
}

interface Particle extends Point {
  tx: number
  ty: number
  color: string
}

const EASE = 0.08
const SETTLE_THRESHOLD = 0.3

/**
 * Samples the alpha mask of each phrase rendered to an offscreen canvas, then
 * cycles between them: particles ease onto the current phrase's pixels, hold,
 * scatter to random points, and reform into the next phrase — like an airport
 * departure board, but built on the same "resolve out of noise" particle look.
 */
export function ParticleText({
  texts,
  className,
  colors = ['#ff7e3d', '#ffb37a', '#e8632a'],
  interval = 3200,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const srRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || texts.length === 0) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = container.clientWidth
    const height = container.clientHeight
    if (width === 0 || height === 0) return

    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    function sampleTargets(text: string): Point[] {
      if (!ctx) return []
      const fontSize = Math.min(width / (text.length * 0.62), height * 0.75)
      ctx.clearRect(0, 0, width, height)
      ctx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#fff'
      ctx.fillText(text, width / 2, height / 2)

      const mask = ctx.getImageData(0, 0, width * dpr, height * dpr)
      ctx.clearRect(0, 0, width, height)

      const step = 4
      const points: Point[] = []
      for (let y = 0; y < height * dpr; y += step) {
        for (let x = 0; x < width * dpr; x += step) {
          const alpha = mask.data[(y * width * dpr + x) * 4 + 3]
          if (alpha > 128) points.push({ x: x / dpr, y: y / dpr })
        }
      }
      return points
    }

    const phraseTargets = texts.map(sampleTargets)
    const poolSize = Math.max(...phraseTargets.map((t) => t.length), 1)

    const particles: Particle[] = Array.from({ length: poolSize }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      tx: 0,
      ty: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    function assignPhrase(index: number) {
      const targets = phraseTargets[index]
      if (!targets.length) return
      particles.forEach((p, i) => {
        const t = targets[i % targets.length]
        p.tx = t.x
        p.ty = t.y
      })
      if (srRef.current) srRef.current.textContent = texts[index]
    }

    function assignScatter() {
      particles.forEach((p) => {
        p.tx = Math.random() * width
        p.ty = Math.random() * height
      })
    }

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, 1.6, 1.6)
      }
    }

    if (reducedMotion) {
      assignPhrase(0)
      particles.forEach((p) => {
        p.x = p.tx
        p.y = p.ty
      })
      draw()
      return
    }

    let rafId = 0
    let phraseIndex = 0
    let phase: 'forming' | 'holding' | 'scattering' = 'forming'
    let holdStart = 0

    function loop(now: number) {
      let allSettled = true
      for (const p of particles) {
        const dx = p.tx - p.x
        const dy = p.ty - p.y
        if (Math.abs(dx) > SETTLE_THRESHOLD || Math.abs(dy) > SETTLE_THRESHOLD) {
          p.x += dx * EASE
          p.y += dy * EASE
          allSettled = false
        }
      }
      draw()

      if (phase === 'forming' && allSettled) {
        phase = 'holding'
        holdStart = now
      } else if (phase === 'holding' && now - holdStart > interval) {
        phase = 'scattering'
        assignScatter()
      } else if (phase === 'scattering' && allSettled) {
        phraseIndex = (phraseIndex + 1) % texts.length
        assignPhrase(phraseIndex)
        phase = 'forming'
      }

      rafId = requestAnimationFrame(loop)
    }

    let started = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          started = true
          assignPhrase(0)
          rafId = requestAnimationFrame(loop)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(container)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [texts, colors, interval])

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block' }} />
      <span ref={srRef} className="sr-only">
        {texts[0]}
      </span>
    </div>
  )
}
