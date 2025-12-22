"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTheme } from "next-themes"

interface Particle {
    x: number
    y: number
    originX: number
    originY: number
    color: string
    size: number
}

interface Trace {
    x1: number
    y1: number
    x2: number
    y2: number
    color: string
    width?: number
}

const darkColors = ["rgb(255, 203, 5)", "rgb(50, 150, 255)"]
const lightColors = ["rgb(0, 39, 76)", "rgb(0, 39, 76)", "rgb(220, 165, 20)"]

export function ParticleWave() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const tracesRef = useRef<Trace[]>([])
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const animationFrameRef = useRef<number | null>(null)
    const { resolvedTheme } = useTheme()

    const initParticles = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        if (typeof window === "undefined") return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = Math.max(window.innerHeight, document.body.scrollHeight || 0, document.documentElement.scrollHeight || 0)

        const activeColors = resolvedTheme === "dark" ? darkColors : lightColors
        const particles: Particle[] = []
        const traces: Trace[] = []

        const gap = 30
        const rows = Math.max(1, Math.ceil(canvas.height / gap))
        const cols = Math.max(1, Math.ceil(canvas.width / gap))
        const isDesktop = canvas.width > 768

        // Hero M Matrix
        const mShape = [
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
        const mWidthCols = mShape[0].length
        const mHeightRows = mShape.length

        let startCol = isDesktop
            ? Math.floor(cols * 0.8) - Math.floor(mWidthCols / 2)
            : Math.floor(cols * 0.5) - Math.floor(mWidthCols / 2)
        if (isDesktop) startCol -= 2
        const startRow = Math.floor((window.innerHeight / gap) * 0.5) - Math.floor(mHeightRows / 2) + 2
        const padding = 2

        // Project Section Detection
        const projectsEl = document.getElementById("projects")
        let projectsStartRow = -1
        let projectsEndRow = -1
        let exclusionStartRow = -1
        let exclusionEndRow = -1

        const circuitGrid: boolean[][] = Array(rows).fill(false).map(() => Array(cols).fill(false))

        const circuitBaseColor = resolvedTheme === "dark"
            ? "rgba(255, 255, 255, 0.75)"
            : "rgba(0, 0, 0, 0.75)"

        const padColor = resolvedTheme === "dark"
            ? "rgb(255, 255, 255)"
            : "rgb(0, 0, 0)"

        if (projectsEl) {
            const rect = projectsEl.getBoundingClientRect()

            // Reduced vertical spread (was 200)
            const topMargin = 50
            const bottomMargin = 50

            // Header offset to align with content better
            const headerOffset = isDesktop ? 100 : 80

            // Schematic Zone (The canvas for the circuits)
            // Starts slightly above the section, ends slightly below
            const startY = Math.max(0, window.scrollY + rect.top + headerOffset - topMargin)
            const endY = window.scrollY + rect.top + rect.height + bottomMargin

            projectsStartRow = Math.max(0, Math.min(rows - 1, Math.floor(startY / gap)))
            projectsEndRow = Math.max(0, Math.min(rows - 1, Math.floor(endY / gap)))

            // Exclusion Zone (Specifically the Card area)
            // Cards are roughly in the vertical center of the section content
            // Let's approximate: They start ~150px down from the top?
            // "Projects" title is ~100px. Cards below that.
            const cardsTopOffset = 180 + headerOffset
            const cardsBottomOffset = 100 // up from bottom

            const exclTop = window.scrollY + rect.top + cardsTopOffset
            const exclBottom = window.scrollY + rect.top + rect.height - cardsBottomOffset

            exclusionStartRow = Math.floor(exclTop / gap)
            exclusionEndRow = Math.floor(exclBottom / gap)

            const zoneHeight = projectsEndRow - projectsStartRow

            // Horizontal Margins for Content
            const excludeStartCol = Math.floor(cols * 0.15)
            const excludeEndCol = Math.floor(cols * 0.85)

            // Helpers
            const getCoords = (r: number, c: number) => ({ x: c * gap + gap / 2, y: r * gap + gap / 2 })
            const isClear = (r: number, c: number) => {
                if (r < 0 || r >= rows || c < 0 || c >= cols) return false
                return !circuitGrid[r][c]
            }
            const markOccupied = (r: number, c: number) => {
                if (r >= 0 && r < rows && c >= 0 && c < cols) circuitGrid[r][c] = true
            }

            // --- COMPONENTS ---
            const addResistor = (r: number, c: number, dr: number, dc: number, color: string) => {
                const p1 = getCoords(r, c)
                const p2 = getCoords(r + dr, c + dc)
                const midX = (p1.x + p2.x) / 2
                const midY = (p1.y + p2.y) / 2
                const amp = 8
                const perpX = dc !== 0 ? 0 : amp
                const perpY = dr !== 0 ? 0 : amp
                traces.push(
                    { x1: p1.x, y1: p1.y, x2: (p1.x * 2 + p2.x) / 3, y2: (p1.y * 2 + p2.y) / 3, color },
                    { x1: (p1.x * 2 + p2.x) / 3, y1: (p1.y * 2 + p2.y) / 3, x2: midX + perpX, y2: midY + perpY, color },
                    { x1: midX + perpX, y1: midY + perpY, x2: midX - perpX, y2: midY - perpY, color },
                    { x1: midX - perpX, y1: midY - perpY, x2: (p1.x + p2.x * 2) / 3, y2: (p1.y + p2.y * 2) / 3, color },
                    { x1: (p1.x + p2.x * 2) / 3, y1: (p1.y + p2.y * 2) / 3, x2: p2.x, y2: p2.y, color }
                )
            }
            const addCapacitor = (r: number, c: number, dr: number, dc: number, color: string) => {
                const p1 = getCoords(r, c)
                const p2 = getCoords(r + dr, c + dc)
                const cx = (p1.x + p2.x) / 2
                const cy = (p1.y + p2.y) / 2
                const plateSize = 10
                const dx = p2.x - p1.x
                const dy = p2.y - p1.y
                const len = Math.sqrt(dx * dx + dy * dy) || 1
                const ux = dx / len
                const uy = dy / len
                const px = -uy * plateSize
                const py = ux * plateSize
                const gapSize = 4
                const gapStartX = cx - ux * gapSize
                const gapStartY = cy - uy * gapSize
                const gapEndX = cx + ux * gapSize
                const gapEndY = cy + uy * gapSize
                traces.push({ x1: p1.x, y1: p1.y, x2: gapStartX, y2: gapStartY, color },
                    { x1: gapEndX, y1: gapEndY, x2: p2.x, y2: p2.y, color },
                    { x1: gapStartX + px, y1: gapStartY + py, x2: gapStartX - px, y2: gapStartY - py, color, width: 2 },
                    { x1: gapEndX + px, y1: gapEndY + py, x2: gapEndX - px, y2: gapEndY - py, color, width: 2 })
            }
            const addInductor = (r: number, c: number, dr: number, dc: number, color: string) => {
                const p1 = getCoords(r, c)
                const p2 = getCoords(r + dr, c + dc)
                const numBumps = 3
                const dx = p2.x - p1.x
                const dy = p2.y - p1.y
                const len = Math.sqrt(dx * dx + dy * dy) || 1
                const ux = dx / len
                const uy = dy / len
                const leadScale = 0.15
                const lead1End = { x: p1.x + dx * leadScale, y: p1.y + dy * leadScale }
                const lead2Start = { x: p2.x - dx * leadScale, y: p2.y - dy * leadScale }
                traces.push({ x1: p1.x, y1: p1.y, x2: lead1End.x, y2: lead1End.y, color },
                    { x1: lead2Start.x, y1: lead2Start.y, x2: p2.x, y2: p2.y, color })
                const bumpLen = (len * (1 - 2 * leadScale)) / numBumps
                const px = -uy * 8
                const py = ux * 8
                let curr = lead1End
                for (let i = 0; i < numBumps; i++) {
                    const nextX = curr.x + ux * bumpLen
                    const nextY = curr.y + uy * bumpLen
                    const midX = (curr.x + nextX) / 2
                    const midY = (curr.y + nextY) / 2
                    const topX = midX + px
                    const topY = midY + py
                    traces.push({ x1: curr.x, y1: curr.y, x2: topX, y2: topY, color },
                        { x1: topX, y1: topY, x2: nextX, y2: nextY, color })
                    curr = { x: nextX, y: nextY }
                }
            }
            const addOpAmp = (r: number, c: number, dr: number, dc: number, color: string) => {
                const p1 = getCoords(r, c)
                const p2 = getCoords(r + dr, c + dc)
                const dx = p2.x - p1.x
                const dy = p2.y - p1.y
                const len = Math.sqrt(dx * dx + dy * dy) || 1
                const ux = dx / len
                const uy = dy / len
                const cx = (p1.x + p2.x) / 2
                const cy = (p1.y + p2.y) / 2
                const size = 15
                const tipX = cx + ux * size
                const tipY = cy + uy * size
                const baseX = cx - ux * (size * 0.5)
                const baseY = cy - uy * (size * 0.5)
                const px = -uy * size
                const py = ux * size
                const baseTopX = baseX + px
                const baseTopY = baseY + py
                const baseBotX = baseX - px
                const baseBotY = baseY - py
                traces.push({ x1: baseTopX, y1: baseTopY, x2: baseBotX, y2: baseBotY, color, width: 2 },
                    { x1: baseBotX, y1: baseBotY, x2: tipX, y2: tipY, color, width: 2 },
                    { x1: tipX, y1: tipY, x2: baseTopX, y2: baseTopY, color, width: 2 },
                    { x1: p1.x, y1: p1.y, x2: baseX, y2: baseY, color },
                    { x1: tipX, y1: tipY, x2: p2.x, y2: p2.y, color })
            }
            const addDiode = (r: number, c: number, dr: number, dc: number, color: string) => {
                const p1 = getCoords(r, c)
                const p2 = getCoords(r + dr, c + dc)
                const dx = p2.x - p1.x
                const dy = p2.y - p1.y
                const len = Math.sqrt(dx * dx + dy * dy) || 1
                const ux = dx / len
                const uy = dy / len
                const cx = (p1.x + p2.x) / 2
                const cy = (p1.y + p2.y) / 2
                const size = 10
                const tipX = cx + ux * size
                const tipY = cy + uy * size
                const baseX = cx - ux * size
                const baseY = cy - uy * size
                const px = -uy * size
                const py = ux * size
                const baseTopX = baseX + px
                const baseTopY = baseY + py
                const baseBotX = baseX - px
                const baseBotY = baseY - py
                const barTopX = tipX + px
                const barTopY = tipY + py
                const barBotX = tipX - px
                const barBotY = tipY - py
                traces.push({ x1: baseTopX, y1: baseTopY, x2: baseBotX, y2: baseBotY, color, width: 1.5 },
                    { x1: baseBotX, y1: baseBotY, x2: tipX, y2: tipY, color, width: 1.5 },
                    { x1: tipX, y1: tipY, x2: baseTopX, y2: baseTopY, color, width: 1.5 },
                    { x1: barTopX, y1: barTopY, x2: barBotX, y2: barBotY, color, width: 2 },
                    { x1: p1.x, y1: p1.y, x2: baseX, y2: baseY, color },
                    { x1: tipX, y1: tipY, x2: p2.x, y2: p2.y, color })
            }
            const addGround = (r: number, c: number, dr: number, dc: number, color: string) => {
                const p1 = getCoords(r, c)
                const p2 = getCoords(r + dr, c + dc)
                const mx = (p1.x + p2.x) / 2
                const my = (p1.y + p2.y) / 2
                traces.push({ x1: p1.x, y1: p1.y, x2: mx, y2: my, color })
                const size = 12
                const dx = p2.x - p1.x
                const dy = p2.y - p1.y
                const ux = dx / (Math.sqrt(dx * dx + dy * dy) || 1)
                const uy = dy / (Math.sqrt(dx * dx + dy * dy) || 1)
                const px = -uy
                const py = ux
                const m2x = mx + ux * 4
                const m2y = my + uy * 4
                const m3x = mx + ux * 8
                const m3y = my + uy * 8
                traces.push({ x1: mx + px * size, y1: my + py * size, x2: mx - px * size, y2: my - py * size, color, width: 2 },
                    { x1: m2x + px * (size * 0.7), y1: m2y + py * (size * 0.7), x2: m2x - px * (size * 0.7), y2: m2y - py * (size * 0.7), color, width: 2 },
                    { x1: m3x + px * (size * 0.3), y1: m3y + py * (size * 0.3), x2: m3x - px * (size * 0.3), y2: m3y - py * (size * 0.3), color, width: 2 })
            }

            // --- GENERATION LOOP ---
            const numWalkers = 60

            // Mark exclusion zone - BUT only in the center rows/cols
            // We want to allow filling above/below the cards in the middle columns.
            for (let r = exclusionStartRow; r <= exclusionEndRow; r++) {
                for (let c = excludeStartCol; c <= excludeEndCol; c++) {
                    markOccupied(r, c)
                }
            }

            for (let w = 0; w < numWalkers; w++) {
                let spawned = false
                let r = 0, c = 0

                for (let attempt = 0; attempt < 10; attempt++) {
                    if (zoneHeight > 0) {
                        r = projectsStartRow + Math.floor(Math.random() * zoneHeight)
                        c = Math.floor(Math.random() * cols)

                        // Valid spawn logic:
                        // 1. Must be clear
                        // 2. If it's in the side margins (c < excludeStartCol || c > excludeEndCol), ANY row is allowed.
                        // 3. If it's in the middle (between excludeStartCol and excludeEndCol), it MUST be Outside the Card Box (exclusionStartRow...exclusionEndRow).
                        // Since we already marked the Card Box as occupied, `isClear(r,c)` handles condition 3 automatically!

                        if (isClear(r, c)) {
                            spawned = true
                            break
                        }
                    }
                }
                if (!spawned) continue

                markOccupied(r, c)

                const steps = 30 + Math.floor(Math.random() * 50)
                for (let s = 0; s < steps; s++) {
                    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
                    // Find all valid moves
                    const validDirs = dirs.filter(d => isClear(r + d[0], c + d[1]))

                    if (validDirs.length === 0) {
                        if (Math.random() < 0.3) {
                            const dir = dirs[Math.floor(Math.random() * dirs.length)]
                            addGround(r, c, dir[0], dir[1], circuitBaseColor)
                        }
                        break
                    }

                    const dir = validDirs[Math.floor(Math.random() * validDirs.length)]
                    const nextR = r + dir[0]
                    const nextC = c + dir[1]

                    // Check lateral space for components
                    const perpR = dir[1]
                    const perpC = dir[0]
                    const leftClear = isClear(r + perpR, c + perpC) && isClear(nextR + perpR, nextC + perpC)
                    const rightClear = isClear(r - perpR, c - perpC) && isClear(nextR - perpR, nextC - perpC)
                    const hasCompSpace = leftClear && rightClear

                    let componentType = 'wire'
                    const rand = Math.random()

                    if (hasCompSpace) {
                        if (rand < 0.10) componentType = 'resistor'
                        else if (rand < 0.20) componentType = 'capacitor'
                        else if (rand < 0.30) componentType = 'inductor'
                        else if (rand < 0.40) componentType = 'opamp'
                        else if (rand < 0.50) componentType = 'diode'
                    }

                    markOccupied(nextR, nextC)
                    if (componentType !== 'wire') {
                        markOccupied(r + perpR, c + perpC)
                        markOccupied(r - perpR, c - perpC)
                        markOccupied(nextR + perpR, nextC + perpC)
                        markOccupied(nextR - perpR, nextC - perpC)
                    }

                    if (componentType === 'resistor') addResistor(r, c, dir[0], dir[1], circuitBaseColor)
                    else if (componentType === 'capacitor') addCapacitor(r, c, dir[0], dir[1], circuitBaseColor)
                    else if (componentType === 'inductor') addInductor(r, c, dir[0], dir[1], circuitBaseColor)
                    else if (componentType === 'opamp') addOpAmp(r, c, dir[0], dir[1], circuitBaseColor)
                    else if (componentType === 'diode') addDiode(r, c, dir[0], dir[1], circuitBaseColor)
                    else {
                        traces.push({
                            x1: c * gap + gap / 2,
                            y1: r * gap + gap / 2,
                            x2: nextC * gap + gap / 2,
                            y2: nextR * gap + gap / 2,
                            color: circuitBaseColor
                        })
                    }

                    r = nextR
                    c = nextC
                }
            }
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = j * gap + gap / 2
                const y = i * gap + gap / 2
                let color = activeColors[Math.floor(Math.random() * activeColors.length)]
                const mRow = i - startRow
                const mCol = j - startCol

                const inVoidZone = mRow >= -padding && mRow < mHeightRows + padding && mCol >= -padding && mCol < mWidthCols + padding
                if (inVoidZone) {
                    const isMPixel = mRow >= 0 && mRow < mHeightRows && mCol >= 0 && mCol < mWidthCols && mShape[mRow][mCol] === 1
                    if (isMPixel) {
                        color = resolvedTheme === "dark" ? "rgb(255, 203, 5)" : "rgb(0, 39, 76)"
                        particles.push({ x, y, originX: x, originY: y, color, size: 2.5 })
                    }
                    continue
                }

                if (projectsStartRow !== -1 && i >= projectsStartRow && i <= projectsEndRow) {
                    if (circuitGrid[i][j]) {
                        particles.push({ x, y, originX: x, originY: y, color: padColor, size: 2 })
                    }
                    continue
                }

                particles.push({ x, y, originX: x, originY: y, color, size: 2.5 })
            }
        }

        particlesRef.current = particles
        tracesRef.current = traces

    }, [resolvedTheme])

    useEffect(() => {
        initParticles()
        window.addEventListener("resize", initParticles)
        const resizeObserver = new ResizeObserver(initParticles)
        resizeObserver.observe(document.body)

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY }
        }
        const handleMouseLeave = () => { mouseRef.current = { x: -1000, y: -1000 } }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseleave", handleMouseLeave)

        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")

        const animate = () => {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const mouse = mouseRef.current

            tracesRef.current.forEach(t => {
                if (t.y1 < window.scrollY - 100 || t.y1 > window.scrollY + window.innerHeight + 100) return
                ctx.lineWidth = t.width || 1.5
                ctx.strokeStyle = t.color
                ctx.beginPath()
                ctx.moveTo(t.x1, t.y1)
                ctx.lineTo(t.x2, t.y2)
                ctx.stroke()
            })

            particlesRef.current.forEach((p) => {
                if (p.y < window.scrollY - 100 || p.y > window.scrollY + window.innerHeight + 100) return

                let px = p.x
                let py = p.y

                const dx = mouse.x - px
                const dy = mouse.y - py
                const distance = Math.sqrt(dx * dx + dy * dy)
                const maxDistance = 120

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance
                    const repulsionStrength = 20
                    px -= (dx / distance) * force * repulsionStrength
                    py -= (dy / distance) * force * repulsionStrength
                }

                px += (p.originX - px) * 0.1
                py += (p.originY - py) * 0.1

                p.x = px
                p.y = py

                ctx.fillStyle = p.color
                ctx.beginPath()
                ctx.arc(px, py, p.size, 0, Math.PI * 2)
                ctx.fill()
            })
            animationFrameRef.current = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            window.removeEventListener("resize", initParticles)
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseleave", handleMouseLeave)
            resizeObserver.disconnect()
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        }
    }, [initParticles])

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full z-0 opacity-80 pointer-events-none"
            aria-hidden="true"
        />
    )
}
