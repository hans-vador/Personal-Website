"use client"

import { useState } from "react"
import {
  about,
  bookingPitch,
  experiences,
  hexapod,
  links,
  mediaIntro,
  photoAlbums,
  videoProjects,
  volumeControl,
  volumeVersions,
  type Experience,
  type ProcessImage,
  type Project,
} from "@/lib/site-content"
import { Lightbox } from "./lightbox"
import { FillImage, FlowImage } from "./wii-image"

/** Width hints for the optimizer, per surface. */
const PANEL_SIZES = "(max-width: 896px) 100vw, 896px"
const HALF_PANEL_SIZES = "(max-width: 640px) 100vw, 440px"
const THUMB_SIZES = "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 220px"

/* ------------------------------------------------------------- primitives */

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="wii-pill">{children}</span>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="wii-title mb-3 border-b border-[var(--wii-plate-line)] pb-2 text-lg">{children}</h3>
  )
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`wii-plate wii-gloss p-5 sm:p-6 ${className}`}>{children}</div>
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="wii-oval px-5 py-2.5 text-sm no-underline"
    >
      {children}
    </a>
  )
}

/* ----------------------------------------------------------------- about */

export function AboutBody() {
  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <span className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_4px_#fff,0_0_0_6px_var(--wii-plate-line),0_8px_18px_rgba(70,96,120,0.3)]">
            <FillImage src={about.portrait} alt={about.name} sizes="144px" position="center 25%" priority />
          </span>
          <div className="min-w-0 text-center sm:text-left">
            <p className="wii-sub text-xs uppercase tracking-[0.18em]">{about.eyebrow}</p>
            <h2 className="wii-title mt-1 text-4xl sm:text-5xl">{about.name}</h2>
            <p className="mt-3 leading-relaxed text-[var(--wii-ink)]">{about.tagline}</p>
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Education</SectionTitle>
        <p className="text-[var(--wii-ink-strong)]">{about.degree}</p>
        <p className="wii-sub mt-1 text-sm">{about.school}</p>
      </Panel>

      <Panel>
        <SectionTitle>Find me</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={links.github}>GitHub</LinkButton>
          <LinkButton href={links.linkedin}>LinkedIn</LinkButton>
          <a href={`mailto:${links.email}`} className="wii-oval px-5 py-2.5 text-sm no-underline">
            Email
          </a>
        </div>
      </Panel>
    </div>
  )
}

/* ------------------------------------------------------------ experience */

export function ExperienceBody({ id }: { id: string }) {
  const exp = experiences.find((e) => e.id === id) as Experience | undefined
  if (!exp) return null

  return (
    <div className="space-y-5">
      <Panel>
        <p className="wii-sub text-xs uppercase tracking-[0.18em]">{exp.period}</p>
        <h2 className="wii-title mt-1 text-3xl sm:text-4xl">{exp.title}</h2>
        <p className="mt-1 text-lg text-[var(--wii-blue-deep)]">{exp.company}</p>
      </Panel>

      <Panel>
        <SectionTitle>What I did</SectionTitle>
        <ul className="space-y-3">
          {exp.description.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-[var(--wii-ink)]">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--wii-blue)]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <SectionTitle>Skills</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {exp.skills.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>
      </Panel>
    </div>
  )
}

/* --------------------------------------------------------------- hexapod */

function ProcessImages({ images, stepTitle }: { images: ProcessImage[]; stepTitle: string }) {
  const flat = images.map((img) => (typeof img === "string" ? { src: img, caption: null } : img))
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {flat.map((img, i) => (
          <figure key={img.src} className="wii-plate overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="block w-full cursor-none"
              aria-label={`Enlarge ${stepTitle} image ${i + 1}`}
            >
              <FlowImage src={img.src} alt={`${stepTitle} ${i + 1}`} sizes={HALF_PANEL_SIZES} />
            </button>
            {img.caption && (
              <figcaption className="wii-sub border-t border-[var(--wii-plate-line)] p-3 text-center text-sm">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      {open !== null && (
        <Lightbox
          photos={flat.map((f) => f.src)}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          title={stepTitle}
        />
      )}
    </>
  )
}

export function HexapodBody() {
  const p: Project = hexapod
  return (
    <div className="space-y-5">
      <Panel>
        <h2 className="wii-title text-3xl sm:text-4xl">{p.title}</h2>
        <p className="mt-2 leading-relaxed text-[var(--wii-ink)]">{p.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </Panel>

      <div className="wii-plate overflow-hidden p-2">
        <div className="relative h-[46vh] w-full overflow-hidden rounded-lg">
          <FillImage src={p.image} alt={p.title} sizes={PANEL_SIZES} priority />
        </div>
      </div>

      <Panel>
        <SectionTitle>Overview</SectionTitle>
        <p className="leading-relaxed text-[var(--wii-ink)]">{p.fullDescription}</p>
      </Panel>

      <Panel>
        <SectionTitle>Development Process</SectionTitle>
        <div className="space-y-10">
          {p.process.map((step, idx) => (
            <div key={step.title} className="flex gap-4">
              <div
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg"
                style={{
                  background: "linear-gradient(to bottom,#fff,#dceffa)",
                  boxShadow: "inset 0 0 0 2px var(--wii-blue), 0 2px 5px rgba(70,96,120,0.25)",
                  color: "var(--wii-blue-deep)",
                }}
              >
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="wii-title mb-2 text-lg">{step.title}</h4>
                <p className="leading-relaxed text-[var(--wii-ink)]">{step.description}</p>

                {step.materials && (
                  <div className="mt-5">
                    <h5 className="wii-title mb-2 text-base">Materials List</h5>
                    <div className="wii-plate overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-[var(--wii-plate-line)] text-[var(--wii-ink-strong)]">
                            <th className="p-3">Material</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Link</th>
                          </tr>
                        </thead>
                        <tbody>
                          {step.materials.map((m) => (
                            <tr key={m.name} className="border-t border-[var(--wii-plate-line)]">
                              <td className="p-3 text-[var(--wii-ink)]">{m.name}</td>
                              <td className="p-3 text-[var(--wii-ink)]">{m.amount}</td>
                              <td className="p-3">
                                {m.link ? (
                                  <a
                                    href={m.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--wii-blue-deep)] underline"
                                  >
                                    Link
                                  </a>
                                ) : (
                                  <span className="wii-sub">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {step.materialsFootnote && (
                      <p className="wii-sub mt-3 text-sm italic">{step.materialsFootnote}</p>
                    )}
                  </div>
                )}

                {step.images && step.images.length > 0 && (
                  <ProcessImages images={step.images} stepTitle={step.title} />
                )}

                {step.video && (
                  <div className="mt-4 aspect-video overflow-hidden rounded-lg">
                    <iframe
                      src={step.video}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={step.title}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {p.github && (
        <Panel>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={p.github}>View Source Code</LinkButton>
          </div>
        </Panel>
      )}
    </div>
  )
}

/* -------------------------------------------------------- volume control */

function isRemote(src: string) {
  return src.startsWith("http")
}

export function VolumeControlBody() {
  const [v, setV] = useState(0)
  const version = volumeVersions[v]

  return (
    <div className="space-y-5">
      <Panel>
        <h2 className="wii-title text-3xl sm:text-4xl">{volumeControl.title}</h2>
        <p className="mt-2 leading-relaxed text-[var(--wii-ink)]">{volumeControl.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {volumeControl.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {volumeControl.demo && <LinkButton href={volumeControl.demo}>Live Demo</LinkButton>}
          {volumeControl.github && <LinkButton href={volumeControl.github}>View Source Code</LinkButton>}
        </div>
      </Panel>

      <div className="wii-plate overflow-hidden p-2">
        <div className="relative h-[46vh] w-full overflow-hidden rounded-lg">
          <FillImage src={volumeControl.image} alt={volumeControl.title} sizes={PANEL_SIZES} priority />
        </div>
      </div>

      <Panel>
        <SectionTitle>Overview</SectionTitle>
        <p className="leading-relaxed text-[var(--wii-ink)]">{volumeControl.fullDescription}</p>
      </Panel>

      {/* Version selector, styled like a console channel switcher. */}
      <Panel>
        <SectionTitle>Build Log</SectionTitle>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {volumeVersions.map((ver, i) => (
            <button
              key={ver.version}
              type="button"
              onClick={() => setV(i)}
              className="wii-oval px-4 py-2 text-sm"
              style={
                i === v
                  ? {
                      background: "linear-gradient(to bottom,#fff,#d6ecfa)",
                      boxShadow:
                        "inset 0 0 0 2px var(--wii-blue), 0 0 14px var(--wii-blue-glow), 0 3px 7px rgba(70,96,120,0.28)",
                      color: "var(--wii-blue-deep)",
                    }
                  : undefined
              }
              aria-pressed={i === v}
            >
              {ver.version}
            </button>
          ))}
        </div>

        <div key={version.version} className="wii-anim-up">
          <h4 className="wii-title text-xl">{version.title}</h4>
          <p className="mt-2 leading-relaxed text-[var(--wii-ink)]">{version.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {version.highlights.map((h) => (
              <Pill key={h}>{h}</Pill>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {version.media.map((m) => (
              <figure key={m.src} className="wii-plate overflow-hidden">
                {m.type === "image" ? (
                  <FlowImage src={m.src} alt={m.title} sizes={HALF_PANEL_SIZES} />
                ) : isRemote(m.src) ? (
                  <div className="aspect-video">
                    <iframe
                      src={m.src}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={m.title}
                    />
                  </div>
                ) : (
                  <video src={m.src} controls playsInline className="h-auto w-full" preload="metadata" />
                )}
                <figcaption className="wii-sub border-t border-[var(--wii-plate-line)] p-3 text-center text-sm">
                  {m.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  )
}

/* ---------------------------------------------------------------- photos */

function AlbumBlock({ album }: { album: (typeof photoAlbums)[number] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <Panel>
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="wii-title text-xl">{album.title}</h3>
        <span className="wii-sub text-sm">
          {album.date}
          {album.imageCount ? ` · ${album.imageCount} photos` : ""}
        </span>
      </div>
      <p className="mt-2 leading-relaxed text-[var(--wii-ink)]">{album.description}</p>

      {album.tags && album.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {album.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {album.localPhotos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            className="wii-plate aspect-square cursor-none overflow-hidden p-0 transition-transform duration-150 hover:scale-[1.04]"
            aria-label={`Open ${album.title} photo ${i + 1}`}
          >
            <FillImage src={src} alt="" sizes={THUMB_SIZES} />
          </button>
        ))}
      </div>

      {album.albumUrl && (
        <div className="mt-5">
          <LinkButton href={album.albumUrl}>View Full Album</LinkButton>
        </div>
      )}

      {open !== null && (
        <Lightbox
          photos={album.localPhotos}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          title={album.title}
        />
      )}
    </Panel>
  )
}

export function PhotosBody() {
  return (
    <div className="space-y-5">
      <Panel>
        <h2 className="wii-title text-3xl sm:text-4xl">Photo Albums</h2>
        <p className="mt-2 leading-relaxed text-[var(--wii-ink)]">{mediaIntro}</p>
        <p className="wii-sub mt-2 text-sm">{photoAlbums.length} albums</p>
      </Panel>
      {photoAlbums.map((album) => (
        <AlbumBlock key={album.id} album={album} />
      ))}
      <BookingPanel />
    </div>
  )
}

/* ---------------------------------------------------------------- videos */

export function VideosBody() {
  return (
    <div className="space-y-5">
      <Panel>
        <h2 className="wii-title text-3xl sm:text-4xl">Video Projects</h2>
        <p className="mt-2 leading-relaxed text-[var(--wii-ink)]">{mediaIntro}</p>
        <p className="wii-sub mt-2 text-sm">{videoProjects.length} projects</p>
      </Panel>

      {videoProjects.map((video) => (
        <Panel key={video.id}>
          <h3 className="wii-title text-xl">{video.title}</h3>
          <p className="mt-2 leading-relaxed text-[var(--wii-ink)]">{video.description}</p>
          <div className="mt-4 aspect-video overflow-hidden rounded-lg bg-black/5">
            <iframe
              src={video.videoUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          </div>
          {video.tags && video.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {video.tags.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          )}
        </Panel>
      ))}
      <BookingPanel />
    </div>
  )
}

function BookingPanel() {
  return (
    <Panel className="text-center">
      <h3 className="wii-title text-xl">{bookingPitch.heading}</h3>
      <p className="mx-auto mt-2 max-w-lg text-[var(--wii-ink)]">{bookingPitch.body}</p>
      <div className="mt-5 flex justify-center">
        <a href={`mailto:${links.email}`} className="wii-oval px-7 py-3 no-underline">
          Contact Me
        </a>
      </div>
    </Panel>
  )
}

/* --------------------------------------------------------------- contact */

export function ContactBody() {
  return (
    <div className="space-y-5">
      <Panel className="text-center">
        <h2 className="wii-title text-3xl sm:text-4xl">Get in touch</h2>
        <p className="mx-auto mt-2 max-w-lg text-[var(--wii-ink)]">
          The fastest way to reach me is email. I read everything.
        </p>
      </Panel>

      <Panel>
        <SectionTitle>Email</SectionTitle>
        <a
          href={`mailto:${links.email}`}
          className="text-lg text-[var(--wii-blue-deep)] underline underline-offset-4"
        >
          {links.email}
        </a>
      </Panel>

      <Panel>
        <SectionTitle>Elsewhere</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={links.github}>GitHub</LinkButton>
          <LinkButton href={links.linkedin}>LinkedIn</LinkButton>
        </div>
      </Panel>

      <BookingPanel />
    </div>
  )
}
