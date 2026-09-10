"use client"

import type { ReactNode } from "react"
import { experiences, hexapod, volumeControl, photoAlbums } from "@/lib/site-content"
import {
  AboutPreview,
  ExperiencePreviewFor,
  ImagePreview,
  MailPreview,
  SlideshowPreview,
  VideoPreview,
} from "./previews"
import {
  AboutBody,
  ContactBody,
  ExperienceBody,
  HexapodBody,
  PhotosBody,
  VideosBody,
  VolumeControlBody,
} from "./channel-bodies"

export interface Channel {
  id: string
  /** Short name on the channel's bottom strip. */
  label: string
  /** Long name shown on the banner once the channel is open. */
  title: string
  preview: ReactNode
  body: ReactNode
  /** Optional external destination for the channel's Start button. */
  start?: { href: string; label: string }
}

// One cover per album keeps the channel's cross-fade cheap.
const albumThumbs = photoAlbums.map((a) => a.localPhotos[0]).filter(Boolean)

export const channels: Channel[] = [
  {
    id: "about",
    label: "About Me",
    title: "About Me",
    preview: <AboutPreview />,
    body: <AboutBody />,
  },
  ...experiences.map((exp) => ({
    id: exp.id,
    label: exp.company,
    title: `${exp.title} · ${exp.company}`,
    preview: <ExperiencePreviewFor id={exp.id} />,
    body: <ExperienceBody id={exp.id} />,
  })),
  {
    id: hexapod.id,
    label: "Hexapod",
    title: hexapod.title,
    preview: <ImagePreview src={hexapod.image} alt={hexapod.title} />,
    body: <HexapodBody />,
    start: hexapod.github ? { href: hexapod.github, label: "Source" } : undefined,
  },
  {
    id: volumeControl.id,
    label: "Volume Control",
    title: volumeControl.title,
    preview: <ImagePreview src={volumeControl.image} alt={volumeControl.title} />,
    body: <VolumeControlBody />,
    start: volumeControl.demo ? { href: volumeControl.demo, label: "Live Demo" } : undefined,
  },
  {
    id: "photos",
    label: "Photo Channel",
    title: "Photo Albums",
    preview: <SlideshowPreview images={albumThumbs} />,
    body: <PhotosBody />,
  },
  {
    id: "videos",
    label: "Video Channel",
    title: "Video Projects",
    preview: <VideoPreview />,
    body: <VideosBody />,
  },
  {
    id: "contact",
    label: "Contact",
    title: "Get in touch",
    preview: <MailPreview />,
    body: <ContactBody />,
  },
]

export const CHANNELS_PER_PAGE = 12

export function getChannel(id: string | null) {
  return channels.find((c) => c.id === id) ?? null
}
