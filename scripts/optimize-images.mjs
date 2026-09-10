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
import sharp from "sharp"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const SRC = join(root, "public", "work")
const OUT = join(root, "public", "work-opt")

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"])
// GIFs are animations here, so they are copied through by sharp unchanged.
const PASSTHROUGH_EXT = new Set([".gif"])

const MAX_EDGE = 2200
const QUALITY = 80

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
  const isPass = PASSTHROUGH_EXT.has(ext)
  if (!isImage && !isPass) continue

  const rel = relative(SRC, file)
  // Everything lands as .jpg except animations, which keep their format.
  const outRel = isImage ? rel.replace(/\.[^.]+$/, ".jpg") : rel
  const out = join(OUT, outRel)

  const srcStat = await stat(file)
  if (await exists(out)) {
    const outStat = await stat(out)
    if (outStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++
      continue
    }
  }

  await mkdir(dirname(out), { recursive: true })

  if (isPass) {
    const buf = await sharp(file, { animated: true }).toBuffer()
    await writeFile(out, buf)
    copied++
    bytesIn += srcStat.size
    bytesOut += buf.length
    continue
  }

  const buf = await sharp(file)
    .rotate() // honour EXIF orientation before it is stripped
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toBuffer()

  await writeFile(out, buf)
  converted++
  bytesIn += srcStat.size
  bytesOut += buf.length
}

const mb = (n) => (n / 1048576).toFixed(1)
console.log(
  `images: ${converted} converted, ${copied} copied, ${skipped} up to date — ` +
    `${mb(bytesIn)}MB in, ${mb(bytesOut)}MB out`,
)
