
export interface VideoProject {
    id: string
    title: string
    description: string
    videoUrl: string
    thumbnailUrl?: string
    date?: string
    duration?: string
    tags?: string[]
    featured?: boolean
    category?: 'showreel' | 'documentary' | 'promotional' | 'event' | 'creative'
}

export interface PhotoAlbum {
    id: string
    title: string
    description: string
    albumUrl: string
    localPhotos: string[] // Array of local photo paths (up to 20 photos)
    coverImageUrl?: string
    date?: string
    imageCount?: number
    tags?: string[]
    featured?: boolean
    category?: 'photography' | 'events' | 'travel' | 'portraits' | 'commercial' | 'personal'
}

// Video Projects Data
export const videoProjects: VideoProject[] = [
    {
        id: "showreel-2025",
        title: "Buckeye Vertical 2025 Video",
        description: "A short video I put together from my time on the team highlighting our building and competition. The experience was incredible and was one of my most notable trips.",
        videoUrl: "https://drive.google.com/file/d/1Ly_wOraeMngsvn84HUS9JUvyoEyUPdTg/preview",
        featured: true,
        category: "showreel"
    },
    {
        id: "showreel-2025-2",
        title: "BHT Camp 2025 Video",
        description: "A longer form video documenting the 4 day overnight summer camp hosted at my local temple. Truly one of the most fun times in my life.",
        videoUrl: "https://drive.google.com/file/d/YOUR_VIDEO_ID_2/preview", // Replace with your actual video URL
        featured: true,
        category: "showreel"
    },
    {
        id: "showreel-2024",
        title: "BHT Camp 2024 Video",
        description: "My first time tackling a longer form video project. This was a fun experience and I learned a lot about storytelling and pacing.",
        videoUrl: "https://drive.google.com/file/d/1K1gN6O053-Yjr6TntIZ6qn8sBroV5lWG/preview", // Replace with your actual video URL
        featured: true,
        category: "showreel"
    }
]

// Photo Albums Data
export const photoAlbums: PhotoAlbum[] = [
    {
        id: "travel-photos-2024",
        title: "Michigan Trip 2025",
        description: "Some flicks from my senior trip up to Michigan. I got some really nice pictures from the Silver Lake and Sleeping Bear sand dunes, and Mackinaw Island. Notably my favorite trip 😍.",
        albumUrl: "https://photos.app.goo.gl/7YMvAezGRTj8zYdj7", // Your existing album URL
        localPhotos: [
            "/work/Michigan/Vador-4.jpg",
            "/work/Michigan/Vador-17.jpg",
            "/work/Michigan/Vador-34.jpg",
            "/work/Michigan/Vador-78.jpg",
            "/work/Michigan/Vador-82.jpg",
            "/work/Michigan/Vador-130.jpg",
            "/work/Michigan/Vador-165.jpg",
            "/work/Michigan/Vador-179.jpg",
            "/work/Michigan/Vador-248.jpg",
            "/work/Michigan/Vador-262.jpg",
            "/work/Michigan/Vador-276.jpg",
            "/work/Michigan/Vador-294.jpg",
            "/work/Michigan/Vador-311.jpg",
            "/work/Michigan/Vador-330.jpg",
            "/work/Michigan/Vador-340.jpg",
        ],
        date: "2025",
        imageCount: 342,
        tags: ["travel", "landscape", "nature"],
        featured: true,
        category: "travel"
    },
    {
        id: "event-photography",
        title: "Wedding Ceremonials",
        description: "A collection of wedding ceremonial photography, a personal favorite of mine to capture.",
        albumUrl: "", // Replace with your actual album URL
        localPhotos: [
            "/work/wedding/DSVR-33.jpg",
            "/work/wedding/DSVR-75.jpg",
            "/work/wedding/NWR-207.jpg",
            "/work/wedding/Vador-3.jpg",
            "/work/wedding/Vador-21.jpg",
            "/work/wedding/Vador-36.jpg",
            "/work/wedding/Vador-47.jpg",
            "/work/wedding/Vador-51.jpg",
            "/work/wedding/Vador-122.jpg",
            "/work/wedding/Vador-134.jpg",
            "/work/wedding/Vador-180.jpg",
            "/work/wedding/Vador-249.jpg",
        ],
        date: "2024-2025",
        imageCount: 120,
        tags: ["wedding", "professional"],
        featured: true,
        category: "events"
    },
    {
        id: "portrait-session",
        title: "Portrait Sessions",
        description: "A few images from my favorite portrait sessions I've done recently.",
        albumUrl: "", // Replace with your actual album URL
        localPhotos: [
            "/work/portraits/Vador-7.jpg",
            "/work/portraits/Vador-3.jpg",
            "/work/portraits/Vador-4.jpg",
            "/work/portraits/Vador-15.jpg",
            "/work/portraits/Vador-21.jpg",
            "/work/portraits/Vador-22.jpg",
            "/work/portraits/Vador-147.jpg",
            "/work/portraits/Vador-155.jpg",
            "/work/portraits/Vador-214.jpg",
            "/work/portraits/Vador-358.jpg",
            "/work/portraits/Vador-399.jpg",
        ],
        date: "2024-2025",
        imageCount: 78,
        tags: ["portraits", "professional"],
        category: "portraits"
    }
]

// Helper functions
export function getFeaturedVideos(): VideoProject[] {
    return videoProjects.filter(video => video.featured)
}

export function getFeaturedAlbums(): PhotoAlbum[] {
    return photoAlbums.filter(album => album.featured)
}

export function getVideosByCategory(category: string): VideoProject[] {
    return videoProjects.filter(video => video.category === category)
}

export function getAlbumsByCategory(category: string): PhotoAlbum[] {
    return photoAlbums.filter(album => album.category === category)
}

export function getAllVideoCategories(): string[] {
    const categories = videoProjects.map(video => video.category).filter(Boolean)
    return Array.from(new Set(categories)) as string[]
}

export function getAllAlbumCategories(): string[] {
    const categories = photoAlbums.map(album => album.category).filter(Boolean)
    return Array.from(new Set(categories)) as string[]
}
