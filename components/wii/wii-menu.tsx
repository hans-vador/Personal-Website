"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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
        <span className="wii-clock-ampm pb-1">{h24 < 12 ? "AM" : "PM"}</span>
      </div>
      <span className="wii-clock-date mt-1.5">
        {DAYS[now.getDay()]} {now.getMonth() + 1}/{now.getDate()}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ icons */

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="30" height="22" viewBox="0 0 30 22" fill="none" aria-hidden="true">
      <rect x="1.3" y="1.3" width="27.4" height="19.4" rx="3.4" stroke="currentColor" strokeWidth="2.1" />
      <path
        d="M2.6 3.4 15 12.6 27.4 3.4"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="20" height="30" viewBox="0 0 20 30" aria-hidden="true">
      <path d={dir === "left" ? "M15 2 3 15l12 13z" : "M5 2l12 13L5 28z"} fill="currentColor" />
    </svg>
  )
}

/* The swooping white footer with its cyan top edge. */
function FooterShape() {
  return (
    <svg
      className="wii-footer-shape"
      viewBox="0 0 1000 150"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 74 C 250 74 250 20 500 20 C 750 20 750 74 1000 74 L1000 150 L0 150 Z"
        fill="var(--wii-bar)"
      />
      <path
        d="M0 74 C 250 74 250 20 500 20 C 750 20 750 74 1000 74"
        fill="none"
        stroke="var(--wii-blue)"
        strokeWidth="3"
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

        {/* the channel grid, flanked by page arrows */}
        <main className="relative z-10 flex min-h-0 flex-1 items-stretch gap-1 px-1 pt-3 sm:gap-2 sm:px-3">
          <button
            type="button"
            className="wii-arrow my-auto shrink-0"
            onClick={() => turnPage(-1)}
            disabled={page === 0}
            aria-label="Previous page"
          >
            <ArrowIcon dir="left" />
          </button>

          <div className="wii-scroll grid min-h-0 flex-1 auto-rows-min grid-cols-2 content-center gap-2 overflow-y-auto px-1 py-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-4">
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
            className="wii-arrow my-auto shrink-0"
            onClick={() => turnPage(1)}
            disabled={page >= pages - 1}
            aria-label="Next page"
          >
            <ArrowIcon dir="right" />
          </button>
        </main>

        {/* the footer: swoop, corner buttons, clock */}
        <footer className="wii-footer relative z-10 h-[118px] sm:h-[150px]">
          <FooterShape />

          {/* Buttons ride the curve: pinned to the ends, centred on the
              white band rather than tucked into a corner. */}
          <div className="absolute inset-x-0 bottom-0 top-[38%] flex items-center justify-between px-3 sm:px-5">
            {/* left cluster: the menu button and the sound slot */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="wii-circle h-[52px] w-[52px] text-sm sm:h-[68px] sm:w-[68px] sm:text-base"
                onClick={(e) => openFrom("about", e.currentTarget.getBoundingClientRect())}
                aria-label="About Me"
                title="About Me"
              >
                Hans
              </button>

              <button
                type="button"
                className="wii-slot"
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

            {/* centre: clock, with the page dots tucked beneath */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center">
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
                        background: i === page ? "var(--wii-blue)" : "#c8ccd1",
                        transform: i === page ? "scale(1.3)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* right: the mail button */}
            <button
              type="button"
              className="wii-circle h-[52px] w-[52px] sm:h-[68px] sm:w-[68px]"
              onClick={(e) => openFrom("contact", e.currentTarget.getBoundingClientRect())}
              aria-label="Contact"
              title="Contact"
            >
              <EnvelopeIcon />
            </button>
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
