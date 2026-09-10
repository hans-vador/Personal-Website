"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A pointing-hand cursor that lags slightly behind the mouse and tilts into
 * the direction of travel, the way a waggling remote does on screen.
 */
export function WiiPointer() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    // Touch devices get the native behaviour instead.
    if (window.matchMedia("(pointer: coarse)").matches) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...target }
    let tilt = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    const frame = () => {
      const dx = target.x - current.x
      const dy = target.y - current.y
      // Ease toward the real cursor so the hand trails a touch.
      current.x += dx * 0.34
      current.y += dy * 0.34
      // Horizontal velocity drives the wrist tilt, clamped and smoothed.
      const want = Math.max(-19, Math.min(19, dx * 0.85))
      tilt += (want - tilt) * 0.16

      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.x - 12}px, ${current.y - 6}px, 0) rotate(${tilt}deg)`
      }
      raf = requestAnimationFrame(frame)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    document.addEventListener("mouseleave", onLeave)
    raf = requestAnimationFrame(frame)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="wii-pointer"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <svg
        width="40"
        height="46"
        viewBox="0 0 40 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: pressed ? "scale(0.88)" : "scale(1)",
          transition: "transform 110ms cubic-bezier(0.2, 0.9, 0.3, 1.3)",
        }}
      >
        <defs>
          <linearGradient id="wiiHandFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f4f8fb" />
            <stop offset="100%" stopColor="#d8e4ec" />
          </linearGradient>
        </defs>
        {/* A gloved hand with the index finger extended. */}
        <path
          d="M14.5 3.6c0-1.9 1.5-3.4 3.4-3.4s3.4 1.5 3.4 3.4v13.1c0 .5.8.6.9.1l.8-3.6c.4-1.7 2-2.8 3.7-2.5 1.7.3 2.8 1.9 2.5 3.6l-.5 2.6c-.1.5.6.8.8.3.7-1.5 2.5-2.2 4-1.5 1.5.6 2.2 2.4 1.6 3.9l-.5 1.3c-.2.5.4.9.8.5 1.1-1.1 2.9-1.1 4 0 1.1 1.1 1.1 2.9.1 4l-6.4 7.4c-2.2 2.6-3.4 5.1-3.8 8.3-.1 1.1-1.1 2-2.2 2H15c-1 0-1.9-.7-2.2-1.7-1-4-2.7-6.6-5.6-9.6l-4.4-4.6c-1.3-1.4-1.3-3.6.1-4.9 1.4-1.3 3.5-1.3 4.8.1l3 3.2c.3.4 1 .1 1-.4V3.6z"
          fill="url(#wiiHandFill)"
          stroke="#5b7387"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
