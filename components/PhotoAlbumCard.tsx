
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Image as ImageIcon, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface PhotoAlbumCardProps {
    id: string
    title: string
    description: string
    albumUrl: string
    localPhotos: string[]
    coverImageUrl?: string
    date?: string
    imageCount?: number
    featured?: boolean
    category?: string
    className?: string
}

export function PhotoAlbumCard({
    title,
    description,
    albumUrl,
    localPhotos,
    date,
    imageCount,
    featured,
    category,
    className,
}: PhotoAlbumCardProps) {
    const [currentSlide, setCurrentSlide] = useState(0)

    const nextSlide = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentSlide((prev) => (prev + 1) % localPhotos.length)
    }

    const prevSlide = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentSlide((prev) => (prev - 1 + localPhotos.length) % localPhotos.length)
    }

    const hasExternalLink = albumUrl && albumUrl.length > 0
    const showSlideshow = !hasExternalLink && localPhotos.length > 0

    return (
        <Card className={`overflow-hidden hover:border-primary/50 transition-colors h-full flex flex-col group/card ${className}`}>
            <div className="relative aspect-video bg-muted overflow-hidden group">
                {showSlideshow ? (
                    // Slideshow Mode
                    <div className="relative w-full h-full bg-black">
                        {/* Blurred Background for Fill */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                key={`bg-${currentSlide}`}
                                src={localPhotos[currentSlide]}
                                alt=""
                                className="w-full h-full object-cover blur-xl opacity-50 scale-110"
                            />
                        </div>

                        {/* Main Image */}
                        <img
                            key={`main-${currentSlide}`}
                            src={localPhotos[currentSlide]}
                            alt={`${title} slide ${currentSlide + 1}`}
                            className="relative w-full h-full object-contain transition-opacity duration-300 z-10"
                        />

                        {/* Navigation Overlay */}
                        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 text-white hover:text-white border border-white/10"
                                onClick={prevSlide}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 text-white hover:text-white border border-white/10"
                                onClick={nextSlide}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Slide Counter */}
                        <div className="absolute bottom-2 right-2 bg-background/20 backdrop-blur-md border border-white/10 text-white text-[10px] px-2 py-0.5 rounded-full z-20">
                            {currentSlide + 1} / {localPhotos.length}
                        </div>
                    </div>
                ) : localPhotos.length > 0 ? (
                    // Grid Preview Mode (for external links)
                    <>
                        <div className="grid grid-cols-2 h-full">
                            {localPhotos.slice(0, 4).map((photo, i) => (
                                <div key={i} className="relative w-full h-full border-[0.5px] border-background/10">
                                    <img src={photo} alt={`${title} preview ${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                            <Button variant="secondary" asChild className="bg-background/80 backdrop-blur-md border-white/10">
                                <a href={albumUrl} target="_blank" rel="noopener noreferrer">
                                    View Link <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </>
                ) : (
                    // Fallback if no photos
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}
            </div>

            <CardHeader className="space-y-1">
                <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {date && <span>{date}</span>}
                    {date && category && <span>•</span>}
                    {category && <span className="capitalize">{category}</span>}
                    {imageCount && <span>•</span>}
                    {imageCount && <span>{imageCount} photos</span>}
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{description}</p>
            </CardContent>
        </Card>
    )
}
