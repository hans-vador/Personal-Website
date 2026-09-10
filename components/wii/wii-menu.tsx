"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { about } from "@/lib/site-content"
import { CHANNELS_PER_PAGE, channels, getChannel } from "./channels"
import { ChannelTile, EmptyChannel } from "./channel-tile"
import { ChannelView } from "./channel-view"
import { WiiPointer } from "./wii-pointer"
import { useWiiSound } from "./use-wii-sound"

/* ------------------------------------------------------------------ clock */

function Clock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])

  // Render nothing server-side so the markup can't mismatch the client.
  if (!now) return <div className="h-[46px]" aria-hidden="true" />

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const hours24 = now.getHours()
  const hours = hours24 % 12 === 0 ? 12 : hours24 % 12
  const mins = String(now.getMinutes()).padStart(2, "0")

  return (
    <div className="flex shrink-0 items-baseline gap-2 whitespace-nowrap sm:gap-4">
      <span className="wii-title text-[26px] leading-none sm:text-[38px]">
        {hours}
        <span className="animate-pulse">:</span>
        {mins}
      </span>
      <span className="wii-sub text-xs sm:text-sm">
        {days[now.getDay()]} {now.getMonth() + 1}/{now.getDate()}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ icons */

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 9.5h3.6L12 5.6v12.8L7.6 14.5H4z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {on ? (
        <>
          <path d="M15.6 9.2a4 4 0 0 1 0 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M18.2 6.6a7.6 7.6 0 0 1 0 10.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : (
        <path d="M16 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  )
}

function EnvelopeIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 24 18" fill="none" aria-hidden="true">
      <rect x="1.2" y="1.2" width="21.6" height="15.6" rx="3" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M2.4 3.2 12 10.4l9.6-7.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------- the shell */

export function WiiMenu() {
  const [page, setPage] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const [origin, setOrigin] = useState<DOMRect | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const { play, muted, toggleAudio } = useWiiSound()

  const pages = Math.max(1, Math.ceil(channels.length / CHANNELS_PER_PAGE))
  const pageChannels = useMemo(
    () => channels.slice(page * CHANNELS_PER_PAGE, (page + 1) * CHANNELS_PER_PAGE),
    [page],
  )
  const blanks = Math.max(0, CHANNELS_PER_PAGE - pageChannels.length)
  const openChannel = getChannel(openId)

  const openFrom = useCallback(
    (id: string, rect: DOMRect | null) => {
      setOrigin(rect)
      setOpenId(id)
      play("select")
      window.setTimeout(() => play("boot"), 120)
    },
    [play],
  )

  const turnPage = useCallback(
    (dir: 1 | -1) => {
      setPage((p) => {
        const next = p + dir
        if (next < 0 || next >= pages) return p
        play("page")
        return next
      })
    },
    [pages, play],
  )

  // Keep the body from scrolling behind an open channel.
  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [openId])

  // Arrow keys page the grid, the way the shoulder buttons do.
  useEffect(() => {
    if (openId) return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "ArrowRight") turnPage(1)
      if (e.key === "ArrowLeft") turnPage(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [openId, turnPage])

  return (
    <>
      <WiiPointer />

      <div className="fixed inset-0 flex flex-col">
        <div className="wii-room" aria-hidden="true" />

        {/* top: name plate and the live clock */}
        <header className="relative z-10 flex shrink-0 items-center justify-between px-5 pb-2 pt-4 sm:px-9 sm:pt-6">
          <div className="min-w-0">
            <p className="wii-title truncate text-lg leading-tight sm:text-xl">{about.name}</p>
            <p className="wii-sub hidden truncate text-[11px] uppercase tracking-[0.16em] sm:block">
              {about.eyebrow}
            </p>
          </div>
          <Clock />
        </header>

        {/* the channel grid */}
        <main className="relative z-10 flex min-h-0 flex-1 items-stretch px-2 sm:px-6">
          <button
            type="button"
            className="wii-oval mr-1 hidden h-16 w-9 shrink-0 text-xl sm:grid"
            onClick={() => turnPage(-1)}
            disabled={page === 0}
            style={{ opacity: page === 0 ? 0.35 : 1 }}
            aria-label="Previous page"
          >
            ‹
          </button>

          <div
            ref={gridRef}
            className="wii-scroll grid min-h-0 flex-1 auto-rows-min grid-cols-2 content-center gap-3 overflow-y-auto px-1 py-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          >
            {pageChannels.map((c) => (
              <ChannelTile
                key={c.id}
                label={c.label}
                preview={c.preview}
                launching={openId === c.id}
                onHover={() => play("hover")}
                onOpen={(rect) => openFrom(c.id, rect)}
              />
            ))}
            {Array.from({ length: blanks }).map((_, i) => (
              <EmptyChannel key={`blank-${i}`} />
            ))}
          </div>

          <button
            type="button"
            className="wii-oval ml-1 hidden h-16 w-9 shrink-0 text-xl sm:grid"
            onClick={() => turnPage(1)}
            disabled={page >= pages - 1}
            style={{ opacity: page >= pages - 1 ? 0.35 : 1 }}
            aria-label="Next page"
          >
            ›
          </button>
        </main>

        {/* the disc bar */}
        <footer className="wii-bottom-bar relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <button
            type="button"
            className="wii-oval h-12 px-7 text-base sm:px-10"
            onClick={(e) => openFrom("about", e.currentTarget.getBoundingClientRect())}
            aria-label="About Me"
          >
            Hans
          </button>

          <div className="flex items-center gap-2">
            {pages > 1 &&
              Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPage(i)
                    play("page")
                  }}
                  aria-label={`Page ${i + 1}`}
                  className="h-2.5 w-2.5 rounded-full transition-all"
                  style={{
                    background: i === page ? "var(--wii-blue)" : "#b7c8d5",
                    boxShadow: i === page ? "0 0 8px var(--wii-blue-glow)" : "none",
                    transform: i === page ? "scale(1.25)" : "scale(1)",
                  }}
                />
              ))}
            <button
              type="button"
              className="wii-oval ml-2 h-9 w-9 text-xs"
              onClick={() => {
                toggleAudio()
                play("toggle")
              }}
              aria-pressed={!muted}
              aria-label={muted ? "Turn sound on" : "Turn sound off"}
              title={muted ? "Sound off" : "Sound on"}
            >
              <SpeakerIcon on={!muted} />
            </button>
          </div>

          <button
            type="button"
            className="wii-oval h-12 w-12 text-lg"
            onClick={(e) => openFrom("contact", e.currentTarget.getBoundingClientRect())}
            aria-label="Contact"
            title="Contact"
          >
            <EnvelopeIcon />
          </button>
        </footer>
      </div>

      {openChannel && (
        <ChannelView
          channel={openChannel}
          origin={origin}
          onClose={() => {
            setOpenId(null)
            play("back")
          }}
        />
      )}
    </>
  )
}
