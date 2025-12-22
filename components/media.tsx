"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Grid, List, Play, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { VideoCard } from "@/components/VideoCard"
import React from "react"
import { PhotoAlbumCard } from "@/components/PhotoAlbumCard"
import {
  videoProjects,
  photoAlbums,
  getAllVideoCategories,
  getAllAlbumCategories,
  type VideoProject,
  type PhotoAlbum
} from "@/lib/media-data"
import { useState } from "react"

export function Media() {
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>("all")
  const [selectedAlbumCategory, setSelectedAlbumCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const videoCategories = ["all", ...getAllVideoCategories()]
  const albumCategories = ["all", ...getAllAlbumCategories()]

  const filteredVideos = selectedVideoCategory === "all"
    ? videoProjects
    : videoProjects.filter(video => video.category === selectedVideoCategory)

  const filteredAlbums = selectedAlbumCategory === "all"
    ? photoAlbums
    : photoAlbums.filter(album => album.category === selectedAlbumCategory)

  return (
    <section id="media" className="container px-4 pt-32 pb-16 mx-auto scroll-mt-20">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border rounded-full px-6 py-3 shadow-sm mb-4">
            <Play className="h-6 w-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Media Work</h2>
          </div>
          <div className="max-w-2xl mx-auto bg-muted/30 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-foreground text-pretty">
              Creative projects and visual content showcasing my media production skills across video and photography.
            </p>
          </div>
        </div>

        {/* Video Projects Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <Play className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Video Projects</h2>
              <Badge variant="outline" className="text-xs">
                {filteredVideos.length} projects
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Video Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedVideoCategory}
                  onChange={(e) => setSelectedVideoCategory(e.target.value)}
                  className="px-3 py-1 border border-input bg-background rounded-md text-sm"
                >
                  {videoCategories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Videos" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  description={video.description}
                  videoUrl={video.videoUrl}
                  duration={video.duration}
                  tags={video.tags}
                  featured={video.featured}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-2">
                <Play className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium">No videos found</h3>
                <p className="text-muted-foreground">
                  {selectedVideoCategory === "all"
                    ? "No video projects are configured yet."
                    : `No videos found in the ${selectedVideoCategory} category.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Photo Albums Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Photo Albums</h2>
              <Badge variant="outline" className="text-xs">
                {filteredAlbums.length} albums
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Album Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedAlbumCategory}
                  onChange={(e) => setSelectedAlbumCategory(e.target.value)}
                  className="px-3 py-1 border border-input bg-background rounded-md text-sm"
                >
                  {albumCategories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Albums" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-input rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Albums Grid */}
          {filteredAlbums.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3"
              : "grid-cols-1 w-full"
              } items-start`}
              style={{ gap: '1.5rem' }}
            >
              {filteredAlbums.map((album) => (
                <PhotoAlbumCard
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  description={album.description}
                  albumUrl={album.albumUrl}
                  localPhotos={album.localPhotos}
                  coverImageUrl={album.coverImageUrl}
                  date={album.date}
                  imageCount={album.imageCount}
                  featured={album.featured}
                  category={album.category}
                  className="w-full"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-2">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium">No albums found</h3>
                <p className="text-muted-foreground">
                  {selectedAlbumCategory === "all"
                    ? "No photo albums are configured yet."
                    : `No albums found in the ${selectedAlbumCategory} category.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto mt-12 bg-muted/30 border border-border/50 rounded-2xl p-8 text-center backdrop-blur-sm">
          <h3 className="text-2xl font-semibold">Interested in booking a session or seeing more?</h3>
          <p className="text-foreground mt-2 max-w-lg mx-auto">Contact me for rates, availability, or a detailed portfolio walkthrough.</p>
          <div className="mt-6">
            <Button asChild size="lg" className="rounded-full px-8">
              <a href="mailto:hvador@umich.edu">
                Contact Me
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
