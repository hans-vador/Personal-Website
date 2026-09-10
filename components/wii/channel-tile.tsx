"use client"

import type { ReactNode } from "react"

interface ChannelTileProps {
  label: string
  preview: ReactNode
  /** Receives the tile's on-screen rect so the channel can zoom out of it. */
  onOpen: (rect: DOMRect) => void
  onHover: () => void
  /** Set while this tile is animating out into a full-screen channel. */
  launching?: boolean
}

export function ChannelTile({ label, preview, onOpen, onHover, launching }: ChannelTileProps) {
  return (
    <button
      type="button"
      className="wii-channel wii-gloss"
      onClick={(e) => onOpen(e.currentTarget.getBoundingClientRect())}
      onMouseEnter={onHover}
      aria-label={`Open ${label}`}
      style={launching ? { visibility: "hidden" } : undefined}
    >
      <span className="wii-channel-face">
        <span className="absolute inset-0 bottom-[27px] overflow-hidden">{preview}</span>
      </span>
      <span className="wii-channel-label wii-title truncate">{label}</span>
    </button>
  )
}

/** A dead slot, kept so the grid keeps its console-like rhythm. */
export function EmptyChannel() {
  return (
    <div className="wii-channel wii-channel-empty wii-gloss" aria-hidden="true">
      <span className="wii-channel-face" />
    </div>
  )
}
