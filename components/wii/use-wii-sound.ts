"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Menu audio.
 *
 * Two sources, in priority order:
 *
 *  1. Real audio files, if you drop them into public/sounds/ (see SOUND_FILES
 *     below for the names). Nothing ships with the repo — supply your own,
 *     and only ones you have the right to use.
 *  2. Otherwise, tones synthesized here with the Web Audio API. These are
 *     written to sit in the same register and shape as a console dashboard:
 *     soft mallet blips for the cursor, a two-note lift on select.
 */

const SOUND_FILES: Record<WiiSound, string> = {
  hover: "/sounds/hover.mp3",
  select: "/sounds/select.mp3",
  back: "/sounds/back.mp3",
  page: "/sounds/page.mp3",
  toggle: "/sounds/toggle.mp3",
  boot: "/sounds/boot.mp3",
}

const MUSIC_FILE = "/sounds/menu-music.mp3"

export type WiiSound = "hover" | "select" | "back" | "page" | "toggle" | "boot"

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === "suspended") void ctx.resume()
  return ctx
}

/* ----------------------------------------------------------- synthesis */

/** A soft mallet note: quick attack, filtered decay, faint octave shimmer. */
function mallet(
  c: AudioContext,
  dest: AudioNode,
  freq: number,
  at: number,
  dur = 0.45,
  gain = 0.16,
) {
  const osc = c.createOscillator()
  const shimmer = c.createOscillator()
  const g = c.createGain()
  const shimmerGain = c.createGain()
  const lp = c.createBiquadFilter()

  lp.type = "lowpass"
  lp.frequency.setValueAtTime(4200, at)
  lp.frequency.exponentialRampToValueAtTime(800, at + dur)

  osc.type = "triangle"
  osc.frequency.value = freq
  shimmer.type = "sine"
  shimmer.frequency.value = freq * 2.005
  shimmerGain.gain.value = 0.22

  osc.connect(lp)
  shimmer.connect(shimmerGain).connect(lp)
  lp.connect(g).connect(dest)

  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(gain, at + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)

  osc.start(at)
  shimmer.start(at)
  osc.stop(at + dur + 0.02)
  shimmer.stop(at + dur + 0.02)
}

/**
 * The cursor blip: a sine whose pitch drops a little as it decays, which is
 * what gives the dashboard its rubbery "bloop" rather than a flat beep.
 */
function bloop(c: AudioContext, dest: AudioNode, at: number, from = 1180, to = 760, gain = 0.11) {
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = "sine"
  osc.frequency.setValueAtTime(from, at)
  osc.frequency.exponentialRampToValueAtTime(to, at + 0.085)

  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(gain, at + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.13)

  osc.connect(g).connect(dest)
  osc.start(at)
  osc.stop(at + 0.16)
}

/** Short filtered noise: the plastic tick under a cursor move. */
function tick(c: AudioContext, dest: AudioNode, at: number, gain = 0.04) {
  const len = Math.floor(c.sampleRate * 0.025)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
  }
  const src = c.createBufferSource()
  src.buffer = buf
  const bp = c.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.value = 2800
  bp.Q.value = 1.5
  const g = c.createGain()
  g.gain.value = gain
  src.connect(bp).connect(g).connect(dest)
  src.start(at)
}

function synth(sound: WiiSound) {
  const c = getCtx()
  if (!c) return
  const now = c.currentTime
  const master = c.createGain()
  master.gain.value = 0.9
  master.connect(c.destination)

  switch (sound) {
    case "hover":
      tick(c, master, now, 0.035)
      bloop(c, master, now)
      break
    case "select":
      tick(c, master, now, 0.05)
      mallet(c, master, 659.25, now, 0.3, 0.13)
      mallet(c, master, 987.77, now + 0.05, 0.38, 0.11)
      break
    case "back":
      mallet(c, master, 587.33, now, 0.26, 0.1)
      mallet(c, master, 392.0, now + 0.055, 0.34, 0.09)
      break
    case "page":
      tick(c, master, now, 0.045)
      bloop(c, master, now, 900, 1320, 0.08)
      break
    case "toggle":
      mallet(c, master, 523.25, now, 0.22, 0.1)
      break
    case "boot":
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        mallet(c, master, f, now + i * 0.07, 0.45, 0.09)
      })
      break
  }
}

/* ------------------------------------------------------- file playback */

const buffers = new Map<string, AudioBuffer | null>()

async function loadBuffer(url: string): Promise<AudioBuffer | null> {
  if (buffers.has(url)) return buffers.get(url) ?? null
  const c = getCtx()
  if (!c) return null
  try {
    const res = await fetch(url)
    // A missing file returns the HTML 404 page, so check before decoding.
    if (!res.ok) throw new Error("missing")
    const data = await res.arrayBuffer()
    const buf = await c.decodeAudioData(data)
    buffers.set(url, buf)
    return buf
  } catch {
    buffers.set(url, null)
    return null
  }
}

/* ------------------------------------------------------------- the hook */

export function useWiiSound() {
  const [muted, setMuted] = useState(true)
  const mutedRef = useRef(true)
  const musicRef = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    mutedRef.current = muted
  }, [muted])

  useEffect(() => {
    try {
      if (window.localStorage.getItem("wii-audio") === "on") setMuted(false)
    } catch {
      /* storage may be unavailable; stay muted */
    }
  }, [])

  const play = useCallback((sound: WiiSound) => {
    if (mutedRef.current) return
    const c = getCtx()
    if (!c) return

    const cached = buffers.get(SOUND_FILES[sound])
    if (cached) {
      const src = c.createBufferSource()
      src.buffer = cached
      const g = c.createGain()
      g.gain.value = 0.85
      src.connect(g).connect(c.destination)
      src.start()
      return
    }

    // Not loaded (or known missing): use the synthesized voice, and kick off
    // a load so a supplied file takes over from the next play onward.
    synth(sound)
    if (!buffers.has(SOUND_FILES[sound])) void loadBuffer(SOUND_FILES[sound])
  }, [])

  /** A gentle original lounge vamp, unless a music file is supplied. */
  const startMusic = useCallback(() => {
    if (musicRef.current) return
    const c = getCtx()
    if (!c) return

    let cancelled = false
    let stopFile: (() => void) | null = null
    let timer = 0

    void loadBuffer(MUSIC_FILE).then((buf) => {
      if (cancelled || !buf) return
      // A real track was supplied: loop it and drop the synthesized vamp.
      window.clearInterval(timer)
      const src = c.createBufferSource()
      const g = c.createGain()
      src.buffer = buf
      src.loop = true
      g.gain.value = 0.5
      src.connect(g).connect(c.destination)
      src.start()
      stopFile = () => src.stop()
    })

    const master = c.createGain()
    master.gain.value = 0.0001
    master.connect(c.destination)
    master.gain.exponentialRampToValueAtTime(0.11, c.currentTime + 2.5)

    const chords = [
      [349.23, 440.0, 523.25, 659.25],
      [293.66, 349.23, 440.0, 587.33],
      [392.0, 466.16, 587.33, 698.46],
      [261.63, 329.63, 392.0, 466.16],
    ]
    const bassNotes = [87.31, 73.42, 98.0, 65.41]
    const beat = 0.62
    let bar = 0
    let nextTime = c.currentTime + 0.4

    const schedule = () => {
      if (!musicRef.current || stopFile) return
      const lookahead = c.currentTime + 1.5
      while (nextTime < lookahead) {
        const chord = chords[bar % chords.length]
        const b = c.createOscillator()
        const bg = c.createGain()
        b.type = "sine"
        b.frequency.value = bassNotes[bar % bassNotes.length]
        bg.gain.setValueAtTime(0.0001, nextTime)
        bg.gain.exponentialRampToValueAtTime(0.08, nextTime + 0.04)
        bg.gain.exponentialRampToValueAtTime(0.0001, nextTime + beat * 2)
        b.connect(bg).connect(master)
        b.start(nextTime)
        b.stop(nextTime + beat * 2 + 0.05)

        const pattern = [0, 2, 1, 3]
        for (let i = 0; i < 4; i++) {
          if (bar % 2 === 1 && i === 2) continue
          mallet(c, master, chord[pattern[i]] ?? chord[0], nextTime + i * beat, 0.85, 0.06)
        }
        nextTime += beat * 4
        bar++
      }
    }

    schedule()
    timer = window.setInterval(schedule, 500)

    musicRef.current = {
      stop: () => {
        cancelled = true
        window.clearInterval(timer)
        stopFile?.()
        try {
          master.gain.cancelScheduledValues(c.currentTime)
          master.gain.setValueAtTime(master.gain.value, c.currentTime)
          master.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.5)
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
        // Warm the cache so supplied files are ready on the first hover.
        Object.values(SOUND_FILES).forEach((url) => void loadBuffer(url))
        startMusic()
      }
      return next
    })
  }, [startMusic, stopMusic])

  useEffect(() => () => stopMusic(), [stopMusic])

  return { play, muted, toggleAudio }
}
