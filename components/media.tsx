"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Video, FileText, Camera } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function Media() {
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null)
  const [visibleMedia, setVisibleMedia] = useState<Set<number>>(new Set())
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([])

  const mediaItems = [
    {
      type: "image",
      title: "Conference Talk 2023",
      category: "Speaking",
      thumbnail: "/conference-stage.png",
      fullImage: "/conference-stage-presentation.jpg",
    },
    {
      type: "video",
      title: "Product Demo",
      category: "Demo",
      thumbnail: "/product-demo-video.png",
      videoUrl: "https://example.com/demo.mp4",
    },
    {
      type: "image",
      title: "Workshop Session",
      category: "Teaching",
      thumbnail: "/workshop-teaching.jpg",
      fullImage: "/workshop-session-teaching.jpg",
    },
    {
      type: "image",
      title: "Team Collaboration",
      category: "Work",
      thumbnail: "/collaborative-teamwork.png",
      fullImage: "/team-collaboration-office.png",
    },
    {
      type: "article",
      title: "Building Scalable Applications",
      category: "Writing",
      thumbnail: "/article-writing.jpg",
      url: "https://example.com/article",
    },
    {
      type: "image",
      title: "Hackathon Win",
      category: "Achievement",
      thumbnail: "/hackathon-winner.jpg",
      fullImage: "/hackathon-winner-team.jpg",
    },
  ]

  useEffect(() => {
    const observers = mediaRefs.current.map((media, index) => {
      if (!media) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleMedia((prev) => new Set(prev).add(index))
            }
          })
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -100px 0px",
        },
      )

      observer.observe(media)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  const selectedMediaData = selectedMedia !== null ? mediaItems[selectedMedia] : null

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      default:
        return <Camera className="h-4 w-4" />
    }
  }

  return (
    <section id="media" className="container mx-auto px-6 py-24 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border rounded-full px-6 py-3 shadow-sm">
            <ImageIcon className="h-6 w-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Media & Highlights</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                mediaRefs.current[index] = el
              }}
              className={`transition-all duration-700 ${visibleMedia.has(index) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card
                className="group cursor-pointer hover:border-primary/50 transition-all duration-300 overflow-hidden"
                onClick={() => setSelectedMedia(index)}
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-2 rounded-full">
                    {getIcon(item.type)}
                  </div>
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {item.category}
                  </Badge>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <Dialog open={selectedMedia !== null} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-4xl">
            {selectedMediaData && (
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {selectedMediaData.category}
                  </Badge>
                  <h3 className="text-2xl font-bold">{selectedMediaData.title}</h3>
                </div>

                {selectedMediaData.type === "image" && selectedMediaData.fullImage && (
                  <img
                    src={selectedMediaData.fullImage || "/placeholder.svg"}
                    alt={selectedMediaData.title}
                    className="w-full rounded-lg"
                  />
                )}

                {selectedMediaData.type === "video" && selectedMediaData.videoUrl && (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Video Player</p>
                  </div>
                )}

                {selectedMediaData.type === "article" && selectedMediaData.url && (
                  <div className="p-6 bg-muted rounded-lg">
                    <p className="text-muted-foreground mb-4">Read the full article on the external site</p>
                    <a
                      href={selectedMediaData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Article →
                    </a>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
