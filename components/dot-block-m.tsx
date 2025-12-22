"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

interface Particle {
    x: number
    y: number
    originX: number
    originY: number
    color: string
    size: number
}

export function DotBlockM() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const animationFrameRef = useRef<number>()
    const { resolvedTheme } = useTheme()

    // M shape matrix (1 = particle)
    const mShape = [
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    ]

    const gap = 30 // Spacing between dots (matched to background)
    const padding = 40 // Padding around the M in the canvas

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Colors mirroring particle-wave.tsx
        // Dark Mode Colors (Bright/Vibrant to pop on dark bg)
        const darkColors = [
            "rgb(255, 203, 5)", // Official Maize (Bright)
            "rgb(50, 150, 255)", // Electric Blue
        ]

        // Light Mode Colors (Dark/Deep to pop on white bg)
        const lightColors = [
            "rgb(0, 39, 76)", // Official Michigan Blue
            "rgb(0, 39, 76)", // Official Michigan Blue
            "rgb(220, 165, 20)", // Legible Maize (Yellow-Gold)
        ]

        const activeColors = resolvedTheme === "dark" ? darkColors : lightColors

        const initParticles = () => {
            // Calculate necessary canvas size
            const cols = mShape[0].length
            const rows = mShape.length
            const canvasWidth = cols * gap + padding * 2
            const canvasHeight = rows * gap + padding * 2

            canvas.width = canvasWidth
            canvas.height = canvasHeight
            // Set CSS style for sharpness if needed, or controlled by container
            canvas.style.width = `${canvasWidth}px`
            canvas.style.height = `${canvasHeight}px`

            const particles: Particle[] = []

            mShape.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell === 1) {
                        const x = padding + c * gap + gap / 2
                        const y = padding + r * gap + gap / 2
                        particles.push({
                            x,
                            y,
                            originX: x,
                            originY: y,
                            color: activeColors[Math.floor(Math.random() * activeColors.length)],
                            size: 2.5, // Matches particle-wave.tsx size
                        })
                    }
                })
            })
            particlesRef.current = particles
        }

        initParticles()

        // Interaction handlers
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }
        }

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 }
        }

        canvas.addEventListener("mousemove", handleMouseMove)
        canvas.addEventListener("mouseleave", handleMouseLeave)

        // Animation Loop
        const animate = () => {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const mouse = mouseRef.current

            particlesRef.current.forEach((p) => {
                // Physics
                const dx = mouse.x - p.x
                const dy = mouse.y - p.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const maxDistance = 80 // Interaction radius
                let force = 0

                if (distance < maxDistance) {
                    force = (maxDistance - distance) / maxDistance
                    const repulsionStrength = 15 // Strength
                    const forceDirectionX = dx / distance
                    const forceDirectionY = dy / distance
                    p.x -= forceDirectionX * force * repulsionStrength
                    p.y -= forceDirectionY * force * repulsionStrength
                }

                // Spring back
                const springX = (p.originX - p.x) * 0.1
                const springY = (p.originY - p.y) * 0.1
                p.x += springX
                p.y += springY

                // Draw
                ctx.fillStyle = p.color
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove)
            canvas.removeEventListener("mouseleave", handleMouseLeave)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [resolvedTheme])

    // Responsive wrapper
    return (
        <div className="flex items-center justify-center pointer-events-auto">
            <canvas ref={canvasRef} className="cursor-crosshair" />
        </div>
    )
}
