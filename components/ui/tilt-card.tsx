"use client"

import type React from "react"
import { useState, useRef, type MouseEvent } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    rotationFactor?: number
    isMobile?: boolean
}

export function TiltCard({
    children,
    className,
    rotationFactor = 15,
    isMobile = false,
    ...props
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || isMobile) return

        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -rotationFactor
        const rotateY = ((x - centerX) / centerX) * rotationFactor

        setRotation({ x: rotateX, y: rotateY })
    }

    const handleMouseEnter = () => {
        if (!isMobile) setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
        setRotation({ x: 0, y: 0 })
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn("relative transition-all duration-200 ease-out", className)}
            style={{
                transform: isHovering
                    ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                    : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                transformStyle: "preserve-3d",
            }}
            {...props}
        >
            {children}
        </div>
    )
}
