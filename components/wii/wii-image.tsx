"use client"

import Image from "next/image"

/**
 * The source photos are camera originals — some over 40MB. Everything on the
 * site goes through the Next image optimizer so a channel loads resized,
 * modern-format copies instead of the raw files.
 */

const RESIZED = new Set([".jpg", ".jpeg", ".png", ".webp"])

/**
 * Maps an original asset path to its build-time web copy in /work-opt.
 * Anything that is not a still image (video, say) is left alone.
 * Keep this in sync with scripts/optimize-images.mjs.
 */
export function optimized(src: string): string {
  if (!src.startsWith("/work/")) return src
  const dot = src.lastIndexOf(".")
  if (dot === -1) return src
  const ext = src.slice(dot).toLowerCase()
  const moved = `/work-opt/${src.slice("/work/".length)}`
  if (ext === ".gif") return moved
  if (RESIZED.has(ext)) return `${moved.slice(0, moved.lastIndexOf("."))}.jpg`
  return src
}

interface FillImageProps {
  src: string
  alt: string
  /** Viewport-width hint so the optimizer picks a sensible source size. */
  sizes: string
  className?: string
  position?: string
  priority?: boolean
}

/** Fills its positioned parent, cropping to cover. */
export function FillImage({ src, alt, sizes, className = "", position, priority }: FillImageProps) {
  return (
    <Image
      src={optimized(src)}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      draggable={false}
      className={`object-cover ${className}`}
      style={position ? { objectPosition: position } : undefined}
    />
  )
}

/** Keeps the photo's own proportions; used inside content panels. */
export function FlowImage({
  src,
  alt,
  sizes,
  className = "",
}: {
  src: string
  alt: string
  sizes: string
  className?: string
}) {
  return (
    <Image
      src={optimized(src)}
      alt={alt}
      width={1600}
      height={1200}
      sizes={sizes}
      draggable={false}
      className={`h-auto w-full ${className}`}
      style={{ objectFit: "cover" }}
    />
  )
}
