import { useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import type { HandPoint } from '../mediapipe/useHandTracking'

const TRACK_URL = '/audio/coral-spectrum.mp3'
const DETUNE_RANGE_CENTS = 1200 // ±1 octave
const SMOOTHING = 0.08
// A comfortable hand position rarely reaches the frame's literal edge, so
// mapping wet = hand.x directly left a hint of distortion even at the left.
// Everything left of this threshold is fully clean; only past it does
// distortion start ramping in toward the right edge.
const DISTORTION_DEADZONE = 0.25

function distortionForHandX(x: number) {
  return Math.max(0, (x - DISTORTION_DEADZONE) / (1 - DISTORTION_DEADZONE))
}

// Classic waveshaper distortion curve (k controls how hard it crushes).
function makeDistortionCurve(amount: number) {
  const n = 44100
  const curve = new Float32Array(n)
  const deg = Math.PI / 180
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

/**
 * Plays an ambient track on loop and lets hand position steer it live:
 * vertical position detunes the pitch (up = higher), horizontal position
 * crossfades in a fixed distortion curve (right = more crushed). Falls back
 * to the clean, untransposed track whenever no hand is tracked. AudioContext
 * only starts on a real user gesture (browser autoplay policy), so callers
 * must invoke `start` from a click handler.
 */
export function useHandAudio(handRef: MutableRefObject<HandPoint | null>) {
  const [started, setStarted] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const dryGainRef = useRef<GainNode | null>(null)
  const wetGainRef = useRef<GainNode | null>(null)
  const fx = useRef({ detune: 0, wet: 0 })
  const distortionRef = useRef(0)

  useEffect(() => {
    if (!started) return
    let rafId = 0

    function tick() {
      const hand = handRef.current
      const targetDetune = hand ? (0.5 - hand.y) * 2 * DETUNE_RANGE_CENTS : 0
      const targetWet = hand ? distortionForHandX(hand.x) : 0
      fx.current.detune += (targetDetune - fx.current.detune) * SMOOTHING
      fx.current.wet += (targetWet - fx.current.wet) * SMOOTHING

      if (sourceRef.current) sourceRef.current.detune.value = fx.current.detune
      if (dryGainRef.current) dryGainRef.current.gain.value = 1 - fx.current.wet
      if (wetGainRef.current) wetGainRef.current.gain.value = fx.current.wet
      distortionRef.current = fx.current.wet

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [started, handRef])

  useEffect(() => {
    return () => {
      ctxRef.current?.close()
    }
  }, [])

  async function start() {
    if (ctxRef.current) return
    const ctx = new AudioContext()
    ctxRef.current = ctx
    // iOS Safari can create the context in a suspended state even inside a
    // user gesture — without an explicit resume() here, playback stays silent.
    if (ctx.state === 'suspended') await ctx.resume()

    const analyser = ctx.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.6
    analyser.connect(ctx.destination)
    analyserRef.current = analyser

    // Dry/wet crossfade instead of rebuilding the curve every frame — cheap
    // and glitch-free to drive continuously from hand position.
    const dryGain = ctx.createGain()
    dryGain.gain.value = 1
    const wetGain = ctx.createGain()
    wetGain.gain.value = 0
    // Pushes the signal into the curve's saturated range first — ambient
    // material is too quiet on its own to hit real clipping, so without
    // this the "distortion" barely leaves the curve's linear zone.
    const drive = ctx.createGain()
    drive.gain.value = 6
    const shaper = ctx.createWaveShaper()
    shaper.curve = makeDistortionCurve(300)
    shaper.oversample = '4x'
    // Compensate for the drive stage so full-wet isn't just louder, it's crunchier.
    const postGain = ctx.createGain()
    postGain.gain.value = 0.5

    dryGain.connect(analyser)
    drive.connect(shaper)
    shaper.connect(postGain)
    postGain.connect(wetGain)
    wetGain.connect(analyser)
    dryGainRef.current = dryGain
    wetGainRef.current = wetGain

    const response = await fetch(TRACK_URL)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

    const source = ctx.createBufferSource()
    source.buffer = audioBuffer
    source.loop = true
    source.connect(dryGain)
    source.connect(drive)
    source.start()
    sourceRef.current = source

    setStarted(true)
  }

  return { start, started, analyserRef, distortionRef }
}
