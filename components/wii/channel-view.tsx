"use client"

import { useEffect, useRef, useState } from "react"
import type { Channel } from "./channels"

interface ChannelViewProps {
  channel: Channel
  /** Grid rect of the tile that launched this, for the zoom-out effect. */
  origin: DOMRect | null
  onClose: () => void
}

/**
 * A channel that has been "started": it grows out of its tile to fill the
 * screen, shows a banner and a scrolling body, and keeps the console's
 * two-button bar pinned along the bottom.
 */
export function ChannelView({ channel, origin, onClose }: ChannelViewProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)

  // FLIP: start the overlay scaled down onto the tile, then release it.
  useEffect(() => {
    const el = shellRef.current
    if (!el) return
    if (!origin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1"
      return
    }

    const sx = origin.width / window.innerWidth
    const sy = origin.height / window.innerHeight
    el.style.transformOrigin = "top left"
    el.style.transform = `translate(${origin.left}px, ${origin.top}px) scale(${sx}, ${sy})`
    el.style.opacity = "0.35"
    el.style.borderRadius = "16px"

    const raf = requestAnimationFrame(() => {
      el.style.transition =
        "transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease, border-radius 380ms ease"
      el.style.transform = "translate(0px, 0px) scale(1, 1)"
      el.style.opacity = "1"
      el.style.borderRadius = "0px"
    })

    // A lingering transform would make this element the containing block for
    // any position:fixed descendant, which traps the photo viewer inside the
    // channel. Drop it once the flight is over.
    const settle = window.setTimeout(() => {
      el.style.transition = ""
      el.style.transform = "none"
      el.style.opacity = "1"
    }, 420)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
    }
  }, [origin])

  const close = () => {
    const el = shellRef.current
    if (!el || !origin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose()
      return
    }
    setClosing(true)
    const sx = origin.width / window.innerWidth
    const sy = origin.height / window.innerHeight
    el.style.transition =
      "transform 300ms cubic-bezier(0.5, 0, 0.75, 0), opacity 260ms ease, border-radius 300ms ease"
    el.style.transform = `translate(${origin.left}px, ${origin.top}px) scale(${sx}, ${sy})`
    el.style.opacity = "0"
    el.style.borderRadius = "16px"
    window.setTimeout(onClose, 290)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Let the lightbox own Escape when one is open.
      if (e.key === "Escape" && !document.querySelector('[role="dialog"]')) close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin])

  return (
    <div
      ref={shellRef}
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[var(--wii-bg-mid)]"
      style={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={channel.title}
    >
      <div className="wii-room" aria-hidden="true" />

      {/* banner */}
      <header className="wii-anim-banner relative z-10 shrink-0 border-b border-[var(--wii-bar-line)] bg-gradient-to-b from-white/95 to-[#e6eef4]/95 px-5 py-3 backdrop-blur-sm">
        <h1 className="wii-title truncate text-center text-lg sm:text-xl">{channel.title}</h1>
      </header>

      {/* body */}
      <div
        ref={scrollRef}
        className="wii-scroll relative z-10 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6"
      >
        <div className={`mx-auto w-full max-w-4xl ${closing ? "" : "wii-anim-up"}`}>{channel.body}</div>
        <div className="h-6" aria-hidden="true" />
      </div>

      {/* the console's two-button bar */}
      <footer className="wii-bottom-bar relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <button type="button" className="wii-oval px-6 py-3 text-sm sm:px-9" onClick={close}>
          Wii Menu
        </button>

        <button
          type="button"
          className="wii-oval hidden px-4 py-2 text-xs sm:block"
          onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top
        </button>

        {channel.start ? (
          <a
            href={channel.start.href}
            target="_blank"
            rel="noopener noreferrer"
            className="wii-oval px-6 py-3 text-sm no-underline sm:px-9"
            style={{
              boxShadow:
                "inset 0 0 0 2px var(--wii-blue), 0 0 16px var(--wii-blue-glow), 0 3px 8px rgba(70,96,120,0.3)",
              color: "var(--wii-blue-deep)",
            }}
          >
            {channel.start.label}
          </a>
        ) : (
          <span className="w-[104px]" aria-hidden="true" />
        )}
      </footer>
    </div>
  )
}
