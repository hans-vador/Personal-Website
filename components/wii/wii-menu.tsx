"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { links } from "@/lib/site-content"
import { CHANNELS_PER_PAGE, channels, getChannel } from "./channels"
import { ChannelTile, EmptyChannel } from "./channel-tile"
import { ChannelView } from "./channel-view"
import { WiiPointer } from "./wii-pointer"
import { useWiiSound } from "./use-wii-sound"

/* ------------------------------------------------------------------ clock */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function Clock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])

  // Nothing server-side, so the markup can't mismatch on hydration.
  if (!now) return <div className="h-[62px]" aria-hidden="true" />

  const h24 = now.getHours()
  const hours = h24 % 12 === 0 ? 12 : h24 % 12
  const mins = String(now.getMinutes()).padStart(2, "0")

  return (
    <div className="flex flex-col items-center leading-none">
      <div className="flex items-end gap-1.5">
        <span className="wii-clock-time">
          {hours}
          <span className="animate-pulse">:</span>
          {mins}
        </span>
        <span className="wii-clock-ampm pb-[0.35em]">{h24 < 12 ? "AM" : "PM"}</span>
      </div>
      <span className="wii-clock-date mt-[0.45em]">
        {DAYS[now.getDay()]} {now.getMonth() + 1}/{now.getDate()}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ icons */

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg width="52%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 9.5h3.6L12 5.6v12.8L7.6 14.5H4z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {on ? (
        <path d="M15.4 9.3a3.8 3.8 0 0 1 0 5.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      ) : (
        <path d="M15.6 9.6l4.4 4.8m0-4.8l-4.4 4.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      )}
    </svg>
  )
}

function EnvelopeIcon() {
  return (
    <svg width="46%" viewBox="0 0 30 21" fill="none" aria-hidden="true">
      <rect x="1.2" y="1.2" width="27.6" height="18.6" rx="3.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M2.5 3.2 15 12.2 27.5 3.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="52%" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="50%" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 5.5a2.44 2.44 0 1 1-4.88 0 2.44 2.44 0 0 1 4.88 0zM2.4 9.3h4.3V22H2.4zM14.3 9c-2.06 0-3.06 1.06-3.6 1.87V9.3H6.4c.06 1.2 0 12.7 0 12.7h4.3v-7.05c0-.38.03-.77.14-1.04.31-.77 1-1.57 2.18-1.57 1.53 0 2.15 1.16 2.15 2.87V22h4.3v-7.28c0-3.94-2.13-5.72-4.97-5.72z" />
    </svg>
  )
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="62%" viewBox="0 0 20 32" aria-hidden="true">
      <path d={dir === "left" ? "M16 1 2 16l14 15z" : "M4 1l14 15L4 31z"} fill="currentColor" />
    </svg>
  )
}

/**
 * The footer's top edge. Traced from the reference: level at y=171 out to
 * x=72, easing down to y=196 by x=144, flat across the middle to x=272,
 * then back up by x=352. Expressed here in a 420x65 box, so 171 is 0.
 */
function FooterShape() {
  const edge = "M0 0 L72 0 C 108 0 108 25 144 25 L272 25 C 312 25 312 0 352 0 L420 0"
  return (
    <svg className="wii-footer-shape" viewBox="0 0 420 65" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="wiiBarFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--wii-bar-top)" />
          <stop offset="45%" stopColor="var(--wii-bar-mid)" />
          <stop offset="70%" stopColor="var(--wii-bar-mid)" />
          <stop offset="100%" stopColor="var(--wii-bar-bot)" />
        </linearGradient>
      </defs>
      <path d={`${edge} L420 65 L0 65 Z`} fill="url(#wiiBarFill)" />
      <path
        d={edge}
        fill="none"
        stroke="var(--wii-blue)"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/* ------------------------------------------------------------- the shell */

export function WiiMenu() {
  const [page, setPage] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const [origin, setOrigin] = useState<DOMRect | null>(null)
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
      window.setTimeout(() => play("boot"), 110)
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

  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [openId])

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

        {/* The grid sits in the reference's 8.33% side margins, with the
            page arrows living inside those margins. */}
        <main className="relative z-10 flex min-h-0 flex-1 items-stretch">
          <div className="flex w-[var(--wii-margin)] shrink-0 items-center justify-center">
            <button
              type="button"
              className="wii-arrow"
              onClick={() => turnPage(-1)}
              disabled={page === 0}
              aria-label="Previous page"
            >
              <ArrowIcon dir="left" />
            </button>
          </div>

          {/* Always four across from tablet up, as the console is. The top
              padding puts row one at y=19 of 236, per the reference. */}
          <div className="wii-scroll grid min-h-0 flex-1 auto-rows-min grid-cols-2 wii-grid content-start overflow-y-auto sm:grid-cols-4">
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

          <div className="flex w-[var(--wii-margin)] shrink-0 items-center justify-center">
            <button
              type="button"
              className="wii-arrow"
              onClick={() => turnPage(1)}
              disabled={page >= pages - 1}
              aria-label="Next page"
            >
              <ArrowIcon dir="right" />
            </button>
          </div>
        </main>

        {/* the footer: the swoop, its two ends, and the clock in the dip */}
        <footer className="wii-footer relative z-10">
          <FooterShape />

          {/* Both ends are circles of ~39 diameter centred at x=38 and x=382
              of 420, on y=199 of 236 — that is 43% down the footer. */}
          <button
            type="button"
            className="wii-circle wii-end absolute left-[9.05%] top-[43%] -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => openFrom("about", e.currentTarget.getBoundingClientRect())}
            aria-label="About Me"
            title="About Me"
          >
            Hans
          </button>

          {/* LinkedIn pairs off the left corner, GitHub off the right, both
              at x=80 and x=340 where the bar's edge is still level, so they
              seat exactly like the corner buttons without touching the curve. */}
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="wii-circle wii-end absolute left-[19.05%] top-[43%] -translate-x-1/2 -translate-y-1/2"
            onMouseEnter={() => play("hover")}
            onClick={() => play("select")}
            aria-label="LinkedIn profile"
            title="LinkedIn"
          >
            <LinkedinIcon />
          </a>

          {/* the small slot, where the console shows its card slot */}
          <button
            type="button"
            className="wii-slot wii-slot-btn absolute left-[29.05%] top-[60%] -translate-x-1/2 -translate-y-1/2"
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

          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="wii-circle wii-end absolute right-[19.05%] top-[43%] translate-x-1/2 -translate-y-1/2"
            onMouseEnter={() => play("hover")}
            onClick={() => play("select")}
            aria-label="GitHub profile"
            title="GitHub"
          >
            <GithubIcon />
          </a>

          <button
            type="button"
            className="wii-circle wii-end absolute right-[9.05%] top-[43%] translate-x-1/2 -translate-y-1/2"
            onClick={(e) => openFrom("contact", e.currentTarget.getBoundingClientRect())}
            aria-label="Contact"
            title="Contact"
          >
            <EnvelopeIcon />
          </button>

          {/* the clock, centred in the dipped middle of the bar */}
          <div className="pointer-events-none absolute inset-x-0 top-[62%] flex -translate-y-1/2 flex-col items-center">
            <Clock />
            {pages > 1 && (
              <div className="pointer-events-auto mt-2 flex items-center gap-1.5">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPage(i)
                      play("page")
                    }}
                    aria-label={`Page ${i + 1}`}
                    className="h-2 w-2 rounded-full transition-all"
                    style={{
                      background: i === page ? "var(--wii-blue)" : "#b6b8be",
                      transform: i === page ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
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
