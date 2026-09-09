"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTheme } from "next-themes"

// ── wild.as thermal mosaic ───────────────────────────────────────────────────
// Blocks never move. The cursor is a heat brush (gaussian deposits, fast decay,
// colors climb navy → blue → maize → red → lime). Click = shockwave: a heat
// ring expands from the click with screen shake — hold to charge a bigger one.

function hash2(i: number, j: number): number {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t)
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = smooth(x - xi)
  const yf = smooth(y - yi)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf
}

function fbm(x: number, y: number): number {
  return 0.6 * valueNoise(x, y) + 0.3 * valueNoise(x * 2 + 5.2, y * 2 + 1.3) + 0.1 * valueNoise(x * 4 + 9.7, y * 4 + 8.1)
}

// Michigan block M (1 = block)
const M_SHAPE = [
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
]

const CELL = 14
const BRUSH = 6.5 // heat-brush sigma, in cells
const DECAY = 0.878 // per-frame heat retention (wild.as value)
const INTRO = 1.6 // seconds for the scatter-in reveal

const EMPTY = 0
const TERRAIN = 1
const GLYPH = 2

interface Field {
  cols: number
  rows: number
  kind: Uint8Array
  score: Float32Array
  accent: Uint8Array
  heat: Float32Array
}

interface Wave {
  x: number
  y: number
  t0: number
  pow: number
}


export function PixelMosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fieldRef = useRef<Field | null>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const prevMouseRef = useRef({ x: -1, y: -1 })
  const wavesRef = useRef<Wave[]>([])
  const shakeRef = useRef(0)
  const chargeRef = useRef<{ on: boolean; t0: number; x: number; y: number }>({ on: false, t0: 0, x: 0, y: 0 })
  const startRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const { resolvedTheme } = useTheme()
  const themeRef = useRef(resolvedTheme)
  themeRef.current = resolvedTheme

  const initField = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === "undefined") return

    const width = window.innerWidth
    const heroH = window.innerHeight
    const height = Math.ceil(heroH * 1.25)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext("2d")
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cols = Math.ceil(width / CELL)
    const rows = Math.ceil(height / CELL)
    const isDesktop = width > 768

    const kind = new Uint8Array(cols * rows)
    const score = new Float32Array(cols * rows)
    const accent = new Uint8Array(cols * rows)
    const heat = new Float32Array(cols * rows)

    const mScale = isDesktop ? 2 : 1
    const mCols = M_SHAPE[0].length * mScale
    const mRows = M_SHAPE.length * mScale
    const mStartCol = Math.max(
      2,
      Math.min(
        isDesktop
          ? Math.floor(cols * 0.8) - Math.floor(mCols / 2) - 2
          : Math.floor(cols * 0.5) - Math.floor(mCols / 2),
        cols - mCols - 2,
      ),
    )
    const mStartRow = Math.floor((heroH / CELL) * 0.45) - Math.floor(mRows / 2)
    const mPad = 2

    const bandBase = (heroH * (isDesktop ? 0.52 : 0.42)) / CELL

    for (let c = 0; c < cols; c++) {
      const bottom = Math.floor(bandBase + (fbm(c * 0.06, 7.31) - 0.5) * 18)

      for (let r = 0; r < Math.min(rows, bottom + 7); r++) {
        const id = r * cols + c
        const mr = r - mStartRow
        const mc = c - mStartCol

        const inVoid = mr >= -mPad && mr < mRows + mPad && mc >= -mPad && mc < mCols + mPad
        if (inVoid) {
          const isM =
            mr >= 0 && mr < mRows && mc >= 0 && mc < mCols &&
            M_SHAPE[Math.floor(mr / mScale)][Math.floor(mc / mScale)] === 1
          if (isM) kind[id] = GLYPH
          continue
        }

        if (r >= bottom) {
          if (hash2(c, r) > 0.4 - (r - bottom) * 0.06) continue
        }

        const rift = fbm(c * 0.09 + r * 0.055, r * 0.03)
        if (Math.abs(rift - 0.5) < 0.028) continue

        kind[id] = TERRAIN

        const depth = r / Math.max(bottom, 1)
        const v = fbm(c * 0.055, r * 0.055)
        score[id] = v * 0.75 + depth * 0.45 + (hash2(c, r) - 0.5) * 0.12

        if (c + r * 1.6 < 26) {
          accent[id] = 3
        } else {
          const h = hash2(c * 3 + 1, r * 7 + 2)
          if (h < 0.012) accent[id] = 1
          else if (h < 0.02) accent[id] = 2
        }
      }
    }

    fieldRef.current = { cols, rows, kind, score, accent, heat }
  }, [])

  const deposit = useCallback((x: number, y: number, amt: number, sig: number) => {
    const f = fieldRef.current
    if (!f) return
    const cc = x / CELL
    const cr = y / CELL
    const rad = Math.ceil(sig * 1.6)
    const inv = 1 / (2 * sig * sig * 0.18)
    for (let dr = -rad; dr <= rad; dr++) {
      for (let dc = -rad; dc <= rad; dc++) {
        const c = (cc + dc) | 0
        const r = (cr + dr) | 0
        if (c < 0 || r < 0 || c >= f.cols || r >= f.rows) continue
        const dx = c + 0.5 - cc
        const dy = r + 0.5 - cr
        const w = Math.exp(-(dx * dx + dy * dy) * inv)
        if (w < 0.02) continue
        const id = r * f.cols + c
        const vv = f.heat[id] + amt * w
        f.heat[id] = vv > 1 ? 1 : vv
      }
    }
  }, [])


  useEffect(() => {
    startRef.current = performance.now()
    initField()
    window.addEventListener("resize", initField)

    const fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY + window.scrollY
      mouseRef.current = { x, y }
      const p = prevMouseRef.current
      if (p.x < 0) {
        prevMouseRef.current = { x, y }
        deposit(x, y, 0.16, BRUSH)
        return
      }
      const dx = x - p.x
      const dy = y - p.y
      const dl = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.max(1, Math.min(48, Math.round(dl / (CELL * 0.8))))
      for (let s = 1; s <= steps; s++) {
        const t = s / steps
        deposit(p.x + dx * t, p.y + dy * t, 0.16, BRUSH)
      }
      prevMouseRef.current = { x, y }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
      prevMouseRef.current = { x: -1, y: -1 }
    }

    // hold to charge, release to detonate (wild.as)
    const handleDown = (e: PointerEvent) => {
      if (!fine) return
      const t = e.target as Element | null
      if (t && t.closest && t.closest("a,button,input,textarea,select,[role='button']")) return
      chargeRef.current = { on: true, t0: performance.now() / 1000, x: e.clientX, y: e.clientY + window.scrollY }
    }
    const release = () => {
      const chg = chargeRef.current
      if (!chg.on) return
      chg.on = false
      const now = performance.now() / 1000
      const ch = Math.min((now - chg.t0) / 2.2, 1)
      wavesRef.current.push({ x: chg.x, y: chg.y, t0: now, pow: 0.35 + ch * 2.1 })
      if (wavesRef.current.length > 6) wavesRef.current.shift()
      deposit(chg.x, chg.y, 1, BRUSH * (2.5 + ch * 10))
      shakeRef.current = 0.45 + ch * 1.9
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("pointerdown", handleDown)
    window.addEventListener("pointerup", release)
    window.addEventListener("pointercancel", release)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const size = CELL - 2

    const animate = (ts: number) => {
      animationFrameRef.current = requestAnimationFrame(animate)
      const f = fieldRef.current
      if (!ctx || !canvas || !f) return

      const dark = themeRef.current === "dark"
      const NAVY = dark ? "#1B2C5E" : "#101A33"
      const BLUE = dark ? "#3E6BFF" : "#3D5BF5"
      const MAIZE = "#FFC40A"
      const AMBER = "#F59E0B"
      const ORANGE = "#F07E12"
      const RED = "#E23B24"
      const LIME = dark ? "#D8FF00" : "#B7CE00"
      const SUNRISE = [AMBER, ORANGE, RED, LIME, MAIZE]
      const M_COLOR = dark ? MAIZE : "#00274C"
      const M_HOT = dark ? "#D8FF00" : "#3D5BF5"
      const HUD = dark ? "255, 255, 255" : "10, 10, 10"

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssW = canvas.width / dpr
      const cssHeight = canvas.height / dpr
      const now = ts / 1000
      const introT = (ts - startRef.current) / 1000

      const heat = f.heat
      for (let i = 0; i < heat.length; i++) {
        heat[i] *= DECAY
        if (heat[i] < 0.003) heat[i] = 0
      }

      // charging: feed a growing blob under the held pointer
      const chg = chargeRef.current
      if (chg.on) {
        const ch = Math.min((now - chg.t0) / 2.2, 1)
        deposit(chg.x, chg.y, 0.3, BRUSH * (1 + ch * 5))
      }

      // shockwaves: an expanding heat ring; heat is set to max(ring, current)
      const waves = wavesRef.current
      for (let wi = waves.length - 1; wi >= 0; wi--) {
        const wv = waves[wi]
        const age = now - wv.t0
        const R = 40 + age * 620 * wv.pow
        const amp = wv.pow * Math.exp(-age * 1.9)
        if (amp < 0.04 || R > cssW + 400) {
          waves.splice(wi, 1)
          continue
        }
        const sigma = 42
        const inv = 1 / (2 * sigma * sigma)
        const c0 = Math.max(0, Math.floor((wv.x - R - sigma * 3) / CELL))
        const c1 = Math.min(f.cols - 1, Math.ceil((wv.x + R + sigma * 3) / CELL))
        const r0 = Math.max(0, Math.floor((wv.y - R - sigma * 3) / CELL))
        const r1 = Math.min(f.rows - 1, Math.ceil((wv.y + R + sigma * 3) / CELL))
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const dx = (c + 0.5) * CELL - wv.x
            const dy = (r + 0.5) * CELL - wv.y
            const dd = Math.sqrt(dx * dx + dy * dy)
            const g = Math.min(1, amp * Math.exp(-((dd - R) * (dd - R)) * inv))
            if (g > 0.02) {
              const id = r * f.cols + c
              if (g > heat[id]) heat[id] = g
            }
          }
        }
      }

      if (window.scrollY > cssHeight + 100) return

      // screen shake (canvas only)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (shakeRef.current > 0.01) {
        shakeRef.current *= 0.9
        ctx.translate((Math.random() - 0.5) * shakeRef.current * 16, (Math.random() - 0.5) * shakeRef.current * 16)
      } else {
        shakeRef.current = 0
      }

      ctx.clearRect(-40, -40, cssW + 80, cssHeight + 80)
      const { cols, rows, kind, score, accent } = f

      for (let r = 0; r < rows; r++) {
        const y = r * CELL + 1
        for (let c = 0; c < cols; c++) {
          const id = r * cols + c
          const k = kind[id]
          const h = heat[id]
          if (k === EMPTY && h < 0.14) continue
          // scatter-in reveal on load
          if (k !== EMPTY && introT < INTRO && hash2(c * 1.7, r * 2.3) > introT / INTRO) continue

          let color: string
          if (k === EMPTY) {
            color = h < 0.35 ? NAVY : h < 0.6 ? BLUE : h < 0.8 ? MAIZE : h < 0.92 ? RED : LIME
          } else if (k === GLYPH) {
            color = h > 0.5 ? M_HOT : M_COLOR
          } else {
            const a = accent[id]
            if (a === 3) {
              color = h > 0.6 ? LIME : SUNRISE[Math.floor(hash2(c + 9, r + 3) * SUNRISE.length)]
            } else if (a !== 0 && h < 0.2) {
              color = a === 1 ? RED : LIME
            } else {
              const v =
                score[id] +
                0.07 * Math.sin(now * 0.35 + (c / cols) * 5 + (r / rows) * 3) +
                h * 0.85
              if (v < 0.5) color = NAVY
              else if (v < 0.78) color = BLUE
              else if (v < 1.0) color = hash2(c + 4, r + 8) < 0.8 ? MAIZE : AMBER
              else if (v < 1.16) color = RED
              else color = LIME
            }
          }

          ctx.fillStyle = color
          ctx.fillRect(c * CELL + 1, y, size, size)
        }
      }

    }
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", initField)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("pointerdown", handleDown)
      window.removeEventListener("pointerup", release)
      window.removeEventListener("pointercancel", release)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [initField, deposit])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
