"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

// ── BabyTrack blob-tracking overlay ──────────────────────────────────────────
// A section-scoped canvas where the cursor is "detected" like a tracked blob:
// a hub box locks onto it, satellite boxes orbit at drifting offsets, thin
// lines wire them to the hub, and every box carries a mono confidence label
// that re-rolls when the tracker re-acquires. Fades out when the cursor leaves.

interface Satellite {
  ang: number
  dist: number
  targetAng: number
  targetDist: number
  w: number
  h: number
  conf: string
  seed: number
  nextRetarget: number
}

export function TrackingField() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1, y: -1, inside: false })
  const hubRef = useRef({ x: -1, y: -1 })
  const alphaRef = useRef(0)
  const satsRef = useRef<Satellite[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const { resolvedTheme } = useTheme()
  const themeRef = useRef(resolvedTheme)
  themeRef.current = resolvedTheme

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (!fine) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = () => {
      const r = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(r.width * dpr))
      canvas.height = Math.max(1, Math.round(r.height * dpr))
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(wrap)

    if (satsRef.current.length === 0) {
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + Math.random()
        satsRef.current.push({
          ang: a, dist: 90 + Math.random() * 120, targetAng: a, targetDist: 90 + Math.random() * 120,
          w: 22 + Math.random() * 46, h: 22 + Math.random() * 40,
          conf: (Math.random() * 1.9 + 0.1).toFixed(4), seed: Math.random() * 100, nextRetarget: 0,
        })
      }
    }

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height
      mouseRef.current = { x, y, inside }
    }
    const onLeave = () => {
      mouseRef.current.inside = false
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)

    const animate = (ts: number) => {
      animationFrameRef.current = requestAnimationFrame(animate)
      const now = ts / 1000
      const m = mouseRef.current
      const hub = hubRef.current
      const dark = themeRef.current === "dark"
      const HUD = dark ? "255, 255, 255" : "10, 10, 10"
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      // ease overall visibility in/out
      alphaRef.current += ((m.inside ? 1 : 0) - alphaRef.current) * 0.08
      const A = alphaRef.current
      ctx.clearRect(0, 0, w, h)
      if (A < 0.01) return

      if (hub.x < 0) { hub.x = m.x; hub.y = m.y }
      hub.x += (m.x - hub.x) * 0.14
      hub.y += (m.y - hub.y) * 0.14

      ctx.font = '10px "Geist Mono", ui-monospace, monospace'
      ctx.lineWidth = 1

      // satellites: drifting offsets that periodically re-acquire
      for (const s of satsRef.current) {
        if (now > s.nextRetarget) {
          s.targetAng = s.ang + (Math.random() - 0.5) * 2.4
          s.targetDist = 80 + Math.random() * 150
          s.conf = (Math.random() * 1.9 + 0.1).toFixed(4)
          s.nextRetarget = now + 0.9 + Math.random() * 1.6
        }
        s.ang += (s.targetAng - s.ang) * 0.03
        s.dist += (s.targetDist - s.dist) * 0.03
        const sx = hub.x + Math.cos(s.ang) * s.dist + Math.sin(now * 9 + s.seed) * 1.5
        const sy = hub.y + Math.sin(s.ang) * s.dist * 0.7 + Math.cos(now * 11 + s.seed) * 1.5

        ctx.strokeStyle = `rgba(${HUD}, ${0.3 * A})`
        ctx.beginPath()
        ctx.moveTo(hub.x, hub.y)
        ctx.lineTo(sx, sy)
        ctx.stroke()

        ctx.strokeStyle = `rgba(${HUD}, ${0.65 * A})`
        ctx.strokeRect(sx - s.w / 2, sy - s.h / 2, s.w, s.h)
        ctx.fillStyle = `rgba(${HUD}, ${0.85 * A})`
        ctx.fillText(s.conf, sx - s.w / 2, sy - s.h / 2 - 4)
      }

      // hub box with L-frame corners + live confidence
      const bw = 44 + Math.sin(now * 2.2) * 3
      ctx.strokeStyle = `rgba(${HUD}, ${0.9 * A})`
      ctx.strokeRect(hub.x - bw / 2, hub.y - bw / 2, bw, bw)
      const L = 9
      const x0 = hub.x - bw / 2 - 4
      const y0 = hub.y - bw / 2 - 4
      const x1 = hub.x + bw / 2 + 4
      const y1 = hub.y + bw / 2 + 4
      ctx.beginPath()
      ctx.moveTo(x0, y0 + L); ctx.lineTo(x0, y0); ctx.lineTo(x0 + L, y0)
      ctx.moveTo(x1 - L, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - L)
      ctx.stroke()
      ctx.fillStyle = `rgba(${HUD}, ${0.95 * A})`
      ctx.fillText((0.9 + 0.08 * Math.sin(now * 2.7)).toFixed(4), hub.x + bw / 2 + 6, hub.y - bw / 2 + 4)
    }
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      ro.disconnect()
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
