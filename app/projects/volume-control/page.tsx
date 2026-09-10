import Link from "next/link"
import type { Metadata } from "next"
import { VolumeControlBody } from "@/components/wii/channel-bodies"
import { WiiPointer } from "@/components/wii/wii-pointer"
import { volumeControl } from "@/lib/site-content"

export const metadata: Metadata = {
  title: `${volumeControl.title} · Hans Vador`,
  description: volumeControl.shortDescription,
}

/**
 * The Volume Control channel also lives at its own URL, since it was linked
 * that way before the redesign. Same content, same chrome as in the menu.
 */
export default function VolumeControlProject() {
  return (
    <>
      <WiiPointer />
      <div className="fixed inset-0 flex flex-col">
        <div className="wii-room" aria-hidden="true" />

        <header className="wii-anim-banner relative z-10 shrink-0 border-b border-[var(--wii-bar-line)] bg-gradient-to-b from-white/95 to-[#e6eef4]/95 px-5 py-3 backdrop-blur-sm">
          <h1 className="wii-title truncate text-center text-lg sm:text-xl">{volumeControl.title}</h1>
        </header>

        <div className="wii-scroll relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="wii-anim-up mx-auto w-full max-w-4xl">
            <VolumeControlBody />
          </div>
          <div className="h-6" aria-hidden="true" />
        </div>

        <footer className="wii-bottom-bar relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <Link href="/" className="wii-oval px-6 py-3 text-sm no-underline sm:px-9">
            Wii Menu
          </Link>
          {volumeControl.demo && (
            <a
              href={volumeControl.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="wii-oval px-6 py-3 text-sm no-underline sm:px-9"
              style={{
                boxShadow:
                  "inset 0 0 0 2px var(--wii-blue), 0 0 16px var(--wii-blue-glow), 0 3px 8px rgba(70,96,120,0.3)",
                color: "var(--wii-blue-deep)",
              }}
            >
              Live Demo
            </a>
          )}
        </footer>
      </div>
    </>
  )
}
