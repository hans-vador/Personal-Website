/**
 * Builds web-sized copies of everything in public/work into public/work-opt.
 *
 * The originals are camera files — several are over 40MB — which are far too
 * large to hand to the image optimizer at request time. This mirrors the tree
 * once, at build time, and leaves the originals alone.
 *
 * Run with: npm run images
 */
import { mkdir, readdir, stat, writeFile, access } from "node:fs/promises"
import { dirname, extname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

// Loaded only when there is something to convert. The outputs are committed,
// so a deploy build normally finds every file present and never needs sharp
// at all; a build should not fail on loading a native module it won't use.
let sharpModule = null
async function getSharp() {
  if (!sharpModule) sharpModule = (await import("sharp")).default
  return sharpModule
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const SRC = join(root, "public", "work")
const OUT = join(root, "public", "work-opt")

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"])
// GIFs are animations. Re-encoded as animated WebP they keep every frame
// and its delay but come out roughly five times smaller than the GIF.
const ANIMATED_EXT = new Set([".gif"])

const MAX_EDGE = 1920
const QUALITY = 78
const FORCE = process.argv.includes("--force")

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

let converted = 0
let skipped = 0
let copied = 0
let bytesIn = 0
let bytesOut = 0

for await (const file of walk(SRC)) {
  const ext = extname(file).toLowerCase()
  const isImage = IMAGE_EXT.has(ext)
  const isAnimated = ANIMATED_EXT.has(ext)
  if (!isImage && !isAnimated) continue

  const rel = relative(SRC, file)
  // Everything lands as .webp, animations included.
  const outRel = rel.replace(/\.[^.]+$/, ".webp")
  const out = join(OUT, outRel)

  const srcStat = await stat(file)
  // An existing output is trusted. Git does not keep mtimes, so on a fresh
  // clone (a deploy, say) comparing timestamps would rebuild every file.
  // To refresh an edited photo, delete its output or pass --force.
  if (!FORCE && (await exists(out)) && (await stat(out)).size > 0) {
    skipped++
    continue
  }

  await mkdir(dirname(out), { recursive: true })

  if (isAnimated) {
    const sharp = await getSharp()
    const buf = await sharp(file, { animated: true })
      .webp({ quality: 75, effort: 4 })
      .toBuffer()
    await writeFile(out, buf)
    copied++
    bytesIn += srcStat.size
    bytesOut += buf.length
    continue
  }

  const sharp = await getSharp()
  const buf = await sharp(file)
    .rotate() // honour EXIF orientation before it is stripped
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toBuffer()

  await writeFile(out, buf)
  converted++
  bytesIn += srcStat.size
  bytesOut += buf.length
}

const mb = (n) => (n / 1048576).toFixed(1)
console.log(
  `images: ${converted} converted, ${copied} animations, ${skipped} up to date — ` +
    `${mb(bytesIn)}MB in, ${mb(bytesOut)}MB out`,
)
