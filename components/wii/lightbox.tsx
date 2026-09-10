"use client"

import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { optimized } from "./wii-image"

interface LightboxProps {
  photos: string[]
  index: number
  onClose: () => void
  onIndex: (i: number) => void
  title?: string
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 4 7 12l8 8" : "M9 4l8 8-8 8"}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function Lightbox({ photos, index, onClose, onIndex, title }: LightboxProps) {
  const many = photos.length > 1
  const prev = useCallback(
    () => onIndex((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndex],
  )
  const next = useCallback(() => onIndex((index + 1) % photos.length), [index, photos.length, onIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, prev, next])

  // Mounted flag so the portal only runs on the client.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  // Rendered into <body>: a channel's own transforms would otherwise become
  // the containing block and trap this inside the panel.
  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-[#0d1620]/93 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Photo viewer"}
    >
      <div className="flex shrink-0 items-center justify-between px-5 py-3 text-white/90">
        <span className="text-sm">
          {title ? `${title} · ` : ""}
          {index + 1} / {photos.length}
        </span>
        <button type="button" className="wii-viewer-btn h-10 w-10" onClick={onClose} aria-label="Close viewer">
          <Cross />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-5">
        {many && (
          <button
            type="button"
            className="wii-viewer-btn absolute left-3 z-10 h-12 w-12"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Previous photo"
          >
            <Chevron dir="left" />
          </button>
        )}

        <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
          <Image
            src={optimized(photos[index])}
            alt={`${title ?? "Photo"} ${index + 1}`}
            fill
            sizes="100vw"
            priority
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {many && (
          <button
            type="button"
            className="wii-viewer-btn absolute right-3 z-10 h-12 w-12"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Next photo"
          >
            <Chevron dir="right" />
          </button>
        )}
      </div>
    </div>,
    document.body,
  )
}
