"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink, Download, ChevronLeft, ChevronRight, ArrowLeft, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function VolumeControlProject() {
    const [currentVersion, setCurrentVersion] = useState(0)

    const versions = [
        {
            version: "Version 1.0",
            title: "Initial Concept & Prototype",
            description:
                "The first working prototype with basic functionality. Using salvaged parts from a toy drone, I built the foundation for remote volume control with Arduino and basic mechanical components. However there are is no remote control and direction, duration, and PWM values must manually be inputted.",
            highlights: [
                "Basic volume control mechanism",
                "Initial Arduino setup",
                "Simple mechanical design using H-Bridge",
            ],
            media: [
                { type: "image", src: "/work/IMG_2210.JPG", title: "Salvaged Drone Motor & Gear Assembly" },
                { type: "image", src: "/work/IMG_2214.JPG", title: "Custom Volume Knob Holder Design" },
                { type: "video", src: "/work/IMG_2217.MOV", title: "Initial Test Setup & Wiring" },
                { type: "video", src: "/work/IMG_2220.MOV", title: "First Successful Volume Control Test" },
                { type: "video", src: "/work/IMG_2221.MOV", title: "Bird's Eye View of Prototype Operation" },
            ],
        },
        {
            version: "Version 2.0",
            title: "Remote Control",
            description:
                "Using HTML I was able to host a simple web app off the Arduino which could send requests to change the volume. While not visually pretty or functional it allowed to test the Wifi functions of the Arduino R4. However I quickly found the web app to be quite laggy and responsive enough.",
            highlights: ["Remote Control", "HTML Webapp"],
            media: [
                {
                    type: "video",
                    src: "https://drive.google.com/file/d/1YfzlnmGV2A6P6bFQhHVtcOAPBksovfN3/preview",
                    title: "Remote Control Web Interface Demo",
                },
                {
                    type: "video",
                    src: "https://drive.google.com/file/d/1iD0EXk3751JRVvyYkNfNIMk4qy5nm7gc/preview",
                    title: "WiFi Volume Control Test",
                },
            ],
        },
        {
            version: "Version 3.0",
            title: "Failed Design",
            description:
                "Learning from the past versions I realized that in order to make accurate and fast volume changes I would need to develop a frontend/backend system as well redo the design for a servo. I soon had a new frontend using React.js which was able to send requests to the new backend I developed in IDE. Unfortunately my SolidWorks skills were not up to par and I had some funny fails.",
            highlights: ["New Backend/Frontend", "React.js", "Failed Center Distance"],
            media: [
                { type: "video", src: "/work/IMG_2330.MOV", title: "React Frontend & Arduino Backend Integration" },
                { type: "image", src: "/work/IMG_2334.JPG", title: "Design Oversight: Missing Servo Mount Hole" },
                { type: "image", src: "/work/IMG_2339.JPG", title: "Redesigned Gear System with Servo Motor" },
                { type: "video", src: "/work/IMG_2340.MOV", title: "Gear Alignment Issues & Troubleshooting" },
            ],
        },
        {
            version: "Version 4.0",
            title: "Final Working Design and Polishes",
            description:
                "The final and working version with sub-30ms response times and polished user experience. After learning from all my mistakes I was finally able to make friction-hold design with a working gear system.",
            highlights: [
                "Working Gear System",
                "Friction Hold Design",
                "Fully Working and Optimized Frontend/Backend System",
            ],
            media: [
                { type: "image", src: "/work/IMG_2444.JPG", title: "Final Assembly: Front View" },
                { type: "image", src: "/work/IMG_2442.JPG", title: "Complete System Overview" },
                {
                    type: "video",
                    src: "https://drive.google.com/file/d/1r2iITi2uNqlSEdHvDmlK9auvoo-S3hyV/preview",
                    title: "Final System Setup & Configuration",
                },
                {
                    type: "video",
                    src: "https://drive.google.com/file/d/1JAr6bxXjE85b0ROWRSGQ2jaG0dMnf2mZ/preview",
                    title: "Real-Time Volume Control Demonstration",
                },
                {
                    type: "video",
                    src: "https://drive.google.com/file/d/1I1lSmxp165gkqYzLzng_kAViax1hredg/preview",
                    title: "Performance Test: Sub-30ms Response Time",
                },
            ],
        },
    ]

    const nextVersion = () => {
        setCurrentVersion((prev) => (prev + 1) % versions.length)
    }

    const prevVersion = () => {
        setCurrentVersion((prev) => (prev - 1 + versions.length) % versions.length)
    }

    return (
        <div className="min-h-screen bg-background relative">
            {/* Close Button */}
            <Button
                variant="ghost"
                size="icon"
                asChild
                className="fixed top-6 right-6 z-50 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-accent"
            >
                <Link href="/#projects">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </Link>
            </Button>

            {/* Project Detail */}
            <section className="container px-4 py-16 mx-auto">
                <div className="space-y-12">

                    {/* Project Header */}
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl font-bold tracking-tighter">Volume Control</h1>
                        <div className="w-full flex justify-center">
                            <Image
                                src="/work/IMG_2445.JPG"
                                alt="Volume Control Project"
                                width={400}
                                height={300}
                                className="rounded-lg object-cover mx-auto"
                            />
                        </div>
                    </div>

                    {/* Project Info Grid */}
                    <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Project Overview</h3>
                                <p className="text-muted-foreground text-pretty">
                                    As a lazy teenager the last thing I want to do when brainrotting on my bed is get up, but how am I
                                    going to turn up the Drake playing in my room? The over engineered solution is a building a robot,
                                    which is exactly what I did.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-3">Technologies Used</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">React</Badge>
                                    <Badge variant="secondary">IDE</Badge>
                                    <Badge variant="secondary">Arduino R4 Wifi</Badge>
                                    <Badge variant="secondary">SolidWorks</Badge>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <Button asChild>
                                    <a href="https://volume-control-reactapp-demo.vercel.app/" target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Live Demo
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href="https://github.com/hans-vador/volume-control" target="_blank" rel="noopener noreferrer">
                                        <Github className="mr-2 h-4 w-4" />
                                        View Code
                                    </a>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-3">My Process</h3>
                                <p className="text-muted-foreground text-pretty">
                                    The process of building the robot was a lot of trial and error. Starting with salvaging parts from an
                                    old toy drone I ran into countless issues both in my hardware, software, and design. With multiple
                                    iterations and improvements with each one I eventually had a fully working product.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-3">Key Achievements</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>Real time volume control &lt;30ms delay</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>Fully functional backend and front end system</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span>Implemented responsive user interface for volume control</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Version Carousel */}
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-4">Project Evolution</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                                Follow the evolution of my project through 4 major versions, each representing significant improvements
                                and iterations.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Navigation Buttons at Top */}
                            <div className="flex justify-between items-center">
                                <Button variant="ghost" size="sm" onClick={prevVersion} disabled={currentVersion === 0}>
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                {/* Version Indicator at Top */}
                                <div className="text-center space-y-4">
                                    <div className="relative">
                                        <div className="text-6xl font-bold text-primary/20">{currentVersion + 1}</div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-2xl font-bold text-primary">V{currentVersion + 1}.0</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center space-x-2">
                                        {versions.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentVersion(idx)}
                                                className={`h-3 w-12 rounded-full transition-all duration-300 hover:scale-105 ${idx === currentVersion ? "bg-primary shadow-lg" : "bg-muted hover:bg-muted-foreground/20"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={nextVersion}
                                    disabled={currentVersion === versions.length - 1}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Carousel Card */}
                            <div className="relative">
                                <Card className="p-8 border-2 border-primary/20">
                                    <div className="space-y-6">
                                        {/* Version Info */}
                                        <div className="text-center space-y-4">
                                            <Badge variant="default" className="text-sm px-3 py-1 bg-primary text-primary-foreground">
                                                {versions[currentVersion].version}
                                            </Badge>
                                            <h4 className="text-2xl font-bold">{versions[currentVersion].title}</h4>
                                            <p className="text-muted-foreground text-pretty max-w-4xl mx-auto">
                                                {versions[currentVersion].description}
                                            </p>
                                            <div className="flex justify-center">
                                                <div className="space-y-2">
                                                    <h5 className="font-semibold text-sm">Key Highlights</h5>
                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                        {versions[currentVersion].highlights.map((highlight, j) => (
                                                            <Badge key={j} variant="secondary" className="text-xs">
                                                                {highlight}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Media Grid */}
                                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                            {versions[currentVersion].media.map((m, idx) => (
                                                <Card key={idx} className="overflow-hidden">
                                                    <div className="relative aspect-[4/5] bg-muted/30 flex items-center justify-center">
                                                        {m.type === "image" ? (
                                                            <Image
                                                                src={m.src || "/placeholder.svg"}
                                                                alt={m.title}
                                                                fill
                                                                className="object-contain p-3"
                                                            />
                                                        ) : typeof m.src === "string" && m.src.includes("drive.google.com") ? (
                                                            <iframe
                                                                src={m.src}
                                                                className="w-full h-full p-2"
                                                                allow="autoplay"
                                                                allowFullScreen
                                                                title={m.title}
                                                            />
                                                        ) : (
                                                            <video src={m.src} className="w-full h-full object-contain p-3" controls playsInline />
                                                        )}
                                                    </div>
                                                    <CardContent className="p-3">
                                                        <h5 className="font-semibold text-sm text-center leading-tight">{m.title}</h5>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </Card>

                                {/* Side navigation (middle left/right) */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={prevVersion}
                                    disabled={currentVersion === 0}
                                    aria-label="Previous version"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-background/90 backdrop-blur-sm border shadow-md"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={nextVersion}
                                    disabled={currentVersion === versions.length - 1}
                                    aria-label="Next version"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-background/90 backdrop-blur-sm border shadow-md"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>

                                {/* Navigation below carousel */}
                                <div className="flex justify-between items-center mt-4">
                                    <Button variant="outline" size="sm" onClick={prevVersion} disabled={currentVersion === 0}>
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={nextVersion}
                                        disabled={currentVersion === versions.length - 1}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
