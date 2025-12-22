"use client"

import { useEffect, useRef } from "react"

interface Bubble {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  mass: number
  color: string
}

interface InteractiveBubblesProps {
  colors?: string[]
  count?: number
}

export function InteractiveBubbles({ colors = ["rgb(59, 130, 246)"], count = 40 }: InteractiveBubblesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()
  const lastScrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    bubblesRef.current = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 60 + 40,
      vx: (Math.random() - 0.5) * 2, // Slight increase in initial random velocity for floatiness
      vy: (Math.random() - 0.5) * 2,
      mass: Math.random() * 0.5 + 0.5, // Normalized mass
      color: colors[index % colors.length],
    }))

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleScroll = () => {
      const currentScroll = window.scrollY
      const scrollDelta = currentScroll - lastScrollRef.current
      lastScrollRef.current = currentScroll

      // Optional: Add parallax or other scroll effects here if needed
      // preventing manual position adjustment to let physics handle the "floor drop" naturally
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gravity = 0.2 // Moderate gravity
      const friction = 0.95
      const wallDamping = 0.6

      // Floor is the bottom of the visible canvas (viewport)
      const floorY = canvas.height

      bubblesRef.current.forEach((bubble) => {
        const dx = mouseRef.current.x - bubble.x
        const dy = mouseRef.current.y - bubble.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200) {
          const force = (200 - distance) / 200
          bubble.vx -= (dx / distance) * force * 0.5
          bubble.vy -= (dy / distance) * force * 0.5
        }

        bubble.vy += gravity * bubble.mass

        bubble.x += bubble.vx
        bubble.y += bubble.vy

        bubble.vx *= friction
        bubble.vy *= friction

        if (bubble.x < bubble.radius) {
          bubble.x = bubble.radius
          bubble.vx *= -wallDamping
        } else if (bubble.x > canvas.width - bubble.radius) {
          bubble.x = canvas.width - bubble.radius
          bubble.vx *= -wallDamping
        }

        // Floor Collision
        if (bubble.y > floorY - bubble.radius) {
          bubble.y = floorY - bubble.radius
          bubble.vy *= -wallDamping
        }

        // Draw Rings
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)

        // Fill (More pronounced)
        const pureColor = bubble.color.replace('rgb(', '').replace(')', '')
        ctx.fillStyle = `rgba(${pureColor}, 0.1)` // Increased from 0.05
        ctx.fill()

        // Stroke (More pronounced)
        ctx.strokeStyle = `rgba(${pureColor}, 0.6)` // Increased from 0.4
        ctx.lineWidth = 2
        ctx.stroke()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [colors, count])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none blur-sm" aria-hidden="true" />
}
