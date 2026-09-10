"use client"

import { useEffect, useState } from "react"
import { about, experiences, photoAlbums, videoProjects } from "@/lib/site-content"
import { FillImage } from "./wii-image"

/** Channel-window sizing hint: at most a quarter of the screen. */
const TILE_SIZES = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"

/* A photo filling the channel window. */
export function ImagePreview({ src, alt, position }: { src: string; alt: string; position?: string }) {
  return <FillImage src={src} alt={alt} sizes={TILE_SIZES} position={position} />
}

/**
 * Company initials on a tinted field — stands in for a channel logo.
 * The name itself is drawn by the tile's own label, so the art carries
 * only the mark, nudged up clear of that band.
 */
export function MonogramPreview({ initials, hue }: { initials: string; hue: number }) {
  return (
    <span
      className="flex h-full w-full items-center justify-center pb-[16%]"
      style={{
        background: `linear-gradient(160deg, hsl(${hue} 72% 92%) 0%, hsl(${hue} 60% 80%) 100%)`,
      }}
    >
      <span
        className="leading-none tracking-tight"
        style={{ color: `hsl(${hue} 55% 30%)`, fontSize: "calc(9 * var(--wii-u))" }}
      >
        {initials}
      </span>
    </span>
  )
}

/* Photo channel: cross-fades through a handful of real shots. */
export function SlideshowPreview({ images }: { images: string[] }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const t = window.setInterval(() => setI((n) => (n + 1) % images.length), 2600)
    return () => window.clearInterval(t)
  }, [images.length])

  // Every frame stays mounted. Swapping them in and out faster than the
  // lazy-loader can react leaves the images with no source at all.
  return (
    <span className="relative block h-full w-full bg-[#dbe6ee]">
      {images.map((src, idx) => (
        <span
          key={src}
          className="absolute inset-0 transition-opacity duration-[900ms]"
          style={{ opacity: idx === i ? 1 : 0 }}
        >
          <FillImage src={src} alt="" sizes={TILE_SIZES} priority={idx === 0} />
        </span>
      ))}
    </span>
  )
}

/* Video channel: a play badge over a dark film-strip field. */
export function VideoPreview() {
  return (
    <span className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2b3a47] to-[#16202a]">
      <span
        className="absolute inset-x-0 top-0 h-3 opacity-70"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, #0d151c 0 5px, transparent 5px 11px)",
        }}
      />
      <span
        className="absolute inset-x-0 bottom-0 h-3 opacity-70"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, #0d151c 0 5px, transparent 5px 11px)",
        }}
      />
      <span className="mb-[14%] grid h-[38%] w-auto aspect-square place-items-center rounded-full bg-white/95 shadow-lg">
        <svg width="15" height="17" viewBox="0 0 15 17" aria-hidden="true">
          <path d="M2 1.6 13.2 8.5 2 15.4z" fill="#16202a" />
        </svg>
      </span>
    </span>
  )
}

/* Contact channel: the little envelope, echoing the console mail slot. */
export function MailPreview() {
  return (
    <span className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#eaf6fd] to-[#c3e2f5]">
      <svg width="60" height="42" viewBox="0 0 60 42" aria-hidden="true">
        <rect
          x="2"
          y="2"
          width="56"
          height="38"
          rx="5"
          fill="#ffffff"
          stroke="#5f92b3"
          strokeWidth="2.4"
        />
        <path
          d="M4 6.5 30 24 56 6.5"
          fill="none"
          stroke="#5f92b3"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

/* About channel: portrait plus name plate. */
export function AboutPreview() {
  return (
    <span className="relative block h-full w-full">
      <FillImage src={about.portrait} alt="" sizes={TILE_SIZES} position="center 28%" priority />
    </span>
  )
}

/* Hue per employer so each experience channel reads as its own tile. */
export const experienceHues: Record<string, { hue: number; initials: string }> = {
  "exp-pave": { hue: 205, initials: "PR" },
  "exp-v1": { hue: 268, initials: "V1" },
  "exp-buckeye": { hue: 12, initials: "BV" },
  "exp-being-digital": { hue: 150, initials: "BD" },
}

export function ExperiencePreviewFor({ id }: { id: string }) {
  const exp = experiences.find((e) => e.id === id)
  const meta = experienceHues[id]
  if (!exp || !meta) return null
  return <MonogramPreview initials={meta.initials} hue={meta.hue} />
}

export const albumCovers = photoAlbums.flatMap((a) => a.localPhotos.slice(0, 2))
