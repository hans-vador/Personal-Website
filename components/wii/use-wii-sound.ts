"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * All audio here is synthesized from scratch with the Web Audio API.
 * Nothing is sampled from a console — these are original tones written to
 * evoke the same soft, plasticky menu feel.
 */

type Ctx = AudioContext & { __wiiMaster?: GainNode }

let ctx: Ctx | null = null

function getCtx(): Ctx | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC() as Ctx
  }
  if (ctx.state === "suspended") void ctx.resume()
  return ctx
}

/** A single plucked note with a soft mallet/marimba-ish envelope. */
function pluck(
  c: AudioContext,
  dest: AudioNode,
  freq: number,
  at: number,
  dur = 0.5,
  gain = 0.18,
  type: OscillatorType = "triangle",
) {
  const osc = c.createOscillator()
  const osc2 = c.createOscillator()
  const g = c.createGain()
  const filter = c.createBiquadFilter()

  filter.type = "lowpass"
  filter.frequency.setValueAtTime(3200, at)
  filter.frequency.exponentialRampToValueAtTime(900, at + dur)
  filter.Q.value = 0.7

  osc.type = type
  osc.frequency.value = freq
  // A quiet octave above adds the glassy "ping" of the original menu.
  osc2.type = "sine"
  osc2.frequency.value = freq * 2.01

  const g2 = c.createGain()
  g2.gain.value = 0.25
  osc2.connect(g2).connect(filter)
  osc.connect(filter)
  filter.connect(g).connect(dest)

  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(gain, at + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)

  osc.start(at)
  osc2.start(at)
  osc.stop(at + dur + 0.02)
  osc2.stop(at + dur + 0.02)
}

/** Short filtered noise burst — the plastic "tick" under each cursor move. */
function tick(c: AudioContext, dest: AudioNode, at: number, gain = 0.05) {
  const len = Math.floor(c.sampleRate * 0.03)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
  }
  const src = c.createBufferSource()
  src.buffer = buf
  const bp = c.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.value = 2600
  bp.Q.value = 1.4
  const g = c.createGain()
  g.gain.value = gain
  src.connect(bp).connect(g).connect(dest)
  src.start(at)
}

export type WiiSound = "hover" | "select" | "back" | "page" | "toggle" | "boot"

export function useWiiSound() {
  const [muted, setMuted] = useState(true)
  const [ready, setReady] = useState(false)
  const musicRef = useRef<{ stop: () => void } | null>(null)
  const mutedRef = useRef(true)

  useEffect(() => {
    mutedRef.current = muted
  }, [muted])

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("wii-audio")
      if (saved === "on") setMuted(false)
    } catch {
      /* storage can be unavailable; stay muted */
    }
    setReady(true)
  }, [])

  const play = useCallback((sound: WiiSound) => {
    if (mutedRef.current) return
    const c = getCtx()
    if (!c) return
    const now = c.currentTime
    const master = c.createGain()
    master.gain.value = 0.9
    master.connect(c.destination)

    switch (sound) {
      case "hover":
        tick(c, master, now, 0.045)
        pluck(c, master, 1244.5, now, 0.16, 0.05, "sine")
        break
      case "select":
        tick(c, master, now, 0.06)
        pluck(c, master, 659.25, now, 0.34, 0.14)
        pluck(c, master, 987.77, now + 0.055, 0.4, 0.12)
        break
      case "back":
        pluck(c, master, 587.33, now, 0.28, 0.11)
        pluck(c, master, 392.0, now + 0.06, 0.36, 0.1)
        break
      case "page":
        tick(c, master, now, 0.05)
        pluck(c, master, 880, now, 0.2, 0.08, "sine")
        break
      case "toggle":
        pluck(c, master, 523.25, now, 0.22, 0.1)
        break
      case "boot":
        // Rising four-note flourish on channel open.
        ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          pluck(c, master, f, now + i * 0.075, 0.5, 0.1)
        })
        break
    }
  }, [])

  /** A gentle, original lounge loop in the spirit of a console menu. */
  const startMusic = useCallback(() => {
    if (musicRef.current) return
    const c = getCtx()
    if (!c) return

    const master = c.createGain()
    master.gain.value = 0.0001
    master.connect(c.destination)
    master.gain.exponentialRampToValueAtTime(0.13, c.currentTime + 2.5)

    // Two-bar vamp: Fmaj9 -> Dm7 -> Gm7 -> C7, sparse and unhurried.
    const chords = [
      [349.23, 440.0, 523.25, 659.25],
      [293.66, 349.23, 440.0, 587.33],
      [392.0, 466.16, 587.33, 698.46],
      [261.63, 329.63, 392.0, 466.16],
    ]
    const bassNotes = [87.31, 73.42, 98.0, 65.41]
    const beat = 0.62
    const barBeats = 4
    let bar = 0
    let nextTime = c.currentTime + 0.4

    const schedule = () => {
      if (!musicRef.current) return
      const lookahead = c.currentTime + 1.5
      while (nextTime < lookahead) {
        const chord = chords[bar % chords.length]
        const bass = bassNotes[bar % bassNotes.length]

        // Soft bass on the downbeat.
        const b = c.createOscillator()
        const bg = c.createGain()
        b.type = "sine"
        b.frequency.value = bass
        bg.gain.setValueAtTime(0.0001, nextTime)
        bg.gain.exponentialRampToValueAtTime(0.09, nextTime + 0.04)
        bg.gain.exponentialRampToValueAtTime(0.0001, nextTime + beat * 2)
        b.connect(bg).connect(master)
        b.start(nextTime)
        b.stop(nextTime + beat * 2 + 0.05)

        // Arpeggio, with a couple of beats deliberately left empty.
        const pattern = [0, 2, 1, 3]
        for (let i = 0; i < barBeats; i++) {
          if (bar % 2 === 1 && i === 2) continue
          const note = chord[pattern[i]] ?? chord[0]
          pluck(c, master, note, nextTime + i * beat, 0.9, 0.07)
        }
        nextTime += beat * barBeats
        bar++
      }
    }

    schedule()
    const timer = window.setInterval(schedule, 500)
    musicRef.current = {
      stop: () => {
        window.clearInterval(timer)
        try {
          master.gain.cancelScheduledValues(c.currentTime)
          master.gain.setValueAtTime(master.gain.value, c.currentTime)
          master.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.6)
        } catch {
          /* node already torn down */
        }
      },
    }
  }, [])

  const stopMusic = useCallback(() => {
    musicRef.current?.stop()
    musicRef.current = null
  }, [])

  const toggleAudio = useCallback(() => {
    setMuted((m) => {
      const next = !m
      mutedRef.current = next
      try {
        window.localStorage.setItem("wii-audio", next ? "off" : "on")
      } catch {
        /* ignore */
      }
      if (next) {
        stopMusic()
      } else {
        getCtx()
        startMusic()
      }
      return next
    })
  }, [startMusic, stopMusic])

  useEffect(() => () => stopMusic(), [stopMusic])

  return { play, muted, toggleAudio, ready }
}
