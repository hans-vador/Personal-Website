/**
 * Maps an original asset path under /work to its web-sized copy in
 * /work-opt, produced by scripts/optimize-images.mjs.
 *
 * The originals are camera files — several are over 40 MB — and were being
 * served as-is, which is why a first visit pulled down close to 100 MB.
 * Every still image is re-encoded to WebP at most 1920px on its long edge,
 * GIFs become animated WebP, and anything else (video, say) is left alone.
 *
 * Keep this in sync with the script's output naming.
 */

const RESIZED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])

export function optimized(src: string): string {
  if (!src.startsWith("/work/")) return src
  const dot = src.lastIndexOf(".")
  if (dot === -1) return src
  const ext = src.slice(dot).toLowerCase()
  const moved = `/work-opt/${src.slice("/work/".length)}`
  if (RESIZED.has(ext)) return `${moved.slice(0, moved.lastIndexOf("."))}.webp`
  return src
}
