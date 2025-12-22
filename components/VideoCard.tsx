
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"

interface VideoCardProps {
    title: string
    description: string
    videoUrl: string
    duration?: string
    tags?: string[]
    featured?: boolean
}

export function VideoCard({ title, description, videoUrl, duration, tags, featured }: VideoCardProps) {
    return (
        <Card className="overflow-hidden hover:border-primary/50 transition-colors h-full flex flex-col group/card">
            <div className="relative aspect-video bg-muted group">
                {/* Featured Badge Overlay */}
                {featured && (
                    <div className="absolute top-2 left-2 z-10">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-white/10 shadow-sm">
                            Featured
                        </Badge>
                    </div>
                )}

                {videoUrl.includes("drive.google.com") ? (
                    <iframe
                        src={videoUrl}
                        className="w-full h-full"
                        allow="autoplay"
                        allowFullScreen
                        title={title}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}
            </div>
            <CardHeader className="space-y-1">
                <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{description}</p>
            </CardContent>
        </Card>
    )
}
