"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Code, X } from "lucide-react"
import { TiltCard } from "@/components/ui/tilt-card"
import { useRouter } from "next/navigation"

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [visibleProjects, setVisibleProjects] = useState<Set<number>>(new Set())
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter()

  const projects = [
    {
      title: "E-Commerce Platform",
      shortDescription: "Full-stack e-commerce solution with real-time inventory management",
      fullDescription:
        "Developed a comprehensive e-commerce platform from scratch using Next.js and Node.js. Features include real-time inventory tracking, secure payment processing, user authentication, and an admin dashboard for managing products and orders.",
      image: "/ecommerce-dashboard-interface.png",
      tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
      process: [
        {
          title: "Planning & Design",
          description: "Created wireframes and user flows. Designed the database schema and API architecture.",
          images: ["/wireframe-design-sketches.jpg", "/database-schema.png"],
          video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
        {
          title: "Development",
          description:
            "Built the frontend with Next.js and implemented the backend API. Integrated Stripe for payments.",
          images: ["/code-editor-interface.png", "/payment-integration.png"],
        },
        {
          title: "Testing & Launch",
          description:
            "Conducted thorough testing, fixed bugs, and deployed to production. Set up monitoring and analytics.",
          images: ["/testing-dashboard.jpg", "/analytics-dashboard.png"],
        },
      ],
      demo: "https://demo.example.com",
      github: "https://github.com",
    },
    {
      title: "AI Chat Application",
      shortDescription: "Real-time chat application powered by AI with smart responses",
      fullDescription:
        "Built an intelligent chat application that uses AI to provide contextual responses. Features include real-time messaging, user presence indicators, message history, and AI-powered suggestions.",
      image: "/chat-application-interface.png",
      tags: ["React", "WebSocket", "OpenAI", "MongoDB"],
      process: [
        {
          title: "Research",
          description: "Researched AI APIs and real-time communication protocols. Evaluated different tech stacks.",
          images: ["/research-notes-and-diagrams.jpg", "/technology-comparison-chart.jpg"],
        },
        {
          title: "Implementation",
          description: "Set up WebSocket connections, integrated OpenAI API, and built the chat interface.",
          images: ["/modern-chat-interface.jpg", "/websocket-architecture.jpg"],
          video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
        {
          title: "Optimization",
          description: "Optimized message delivery, implemented caching, and improved AI response quality.",
          images: ["/performance-metrics-dashboard.png"],
        },
      ],
      demo: "https://demo.example.com",
      github: "https://github.com",
    },
    {
      title: "Volume Control",
      shortDescription: "A custom-built robotic volume controller with <30ms response time",
      fullDescription:
        "The final and working version with sub-30ms response times and polished user experience. After learning from all my mistakes I was finally able to make friction-hold design with a working gear system.",
      image: "/work/IMG_2445.JPG", // Using the main image from the provided code
      tags: ["React", "Arduino R4 Wifi", "SolidWorks", "C++"],
      process: [], // Process details are on the dedicated page
      demo: "https://volume-control-reactapp-demo.vercel.app/",
      github: "https://github.com/hans-vador/volume-control",
      link: "/projects/volume-control",
    },
  ]

  useEffect(() => {
    const observers = projectRefs.current.map((project, index) => {
      if (!project) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleProjects((prev) => new Set(prev).add(index))
            }
          })
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -100px 0px",
        },
      )

      observer.observe(project)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  const selectedProjectData = selectedProject !== null ? projects[selectedProject] : null

  return (
    <section id="projects" className="container mx-auto px-6 py-24 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border rounded-full px-6 py-3 shadow-sm">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              ref={(el) => {
                projectRefs.current[index] = el
              }}
              className={`transition-all duration-700 ${visibleProjects.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <TiltCard className="h-full">
                <Card
                  className="group h-full cursor-pointer border-border hover:border-primary transition-all duration-500 shadow-xl hover:shadow-2xl bg-card/70 backdrop-blur-md"
                  onClick={() => {
                    if ((project as any).link) {
                      router.push((project as any).link)
                    } else {
                      setSelectedProject(index)
                    }
                  }}
                >
                  <div className="relative overflow-hidden rounded-t-lg aspect-video">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.shortDescription}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </div>
          ))}
        </div>

        {selectedProject !== null && selectedProjectData && (
          <div
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 overflow-y-auto animate-in fade-in duration-300"
            onClick={() => setSelectedProject(null)}
          >
            <div className="flex items-center justify-center min-h-screen py-24 px-4 sm:px-6 lg:px-8" onClick={(e) => e.stopPropagation()}>
              <div className="max-w-4xl w-full mx-auto">
                <div className="bg-background/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="sticky top-0 bg-background/95 backdrop-blur-md p-4 flex items-start justify-between z-10">
                    <div className="flex-1 mr-4">
                      <h2 className="text-2xl font-bold mb-2">{selectedProjectData.title}</h2>
                      <div className="flex flex-wrap gap-2">
                        {selectedProjectData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSelectedProject(null)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-8">
                    {/* Hero Image */}
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={selectedProjectData.image || "/placeholder.svg"}
                        alt={selectedProjectData.title}
                        className="w-full h-auto"
                      />
                    </div>

                    {/* Overview */}
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-primary">Overview</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {selectedProjectData.fullDescription}
                      </p>
                    </div>

                    {/* Development Process */}
                    <div>
                      <h3 className="text-2xl font-semibold mb-8 text-primary">Development Process</h3>
                      <div className="space-y-12">
                        {selectedProjectData.process.map((step, idx) => (
                          <div key={idx} className="relative">
                            <div className="flex items-start gap-6">
                              <div className="shrink-0 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                                <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>

                                {/* Images Grid */}
                                {step.images && step.images.length > 0 && (
                                  <div className={`grid gap-4 mb-6 ${step.images.length > 1 ? "md:grid-cols-2" : ""}`}>
                                    {step.images.map((img, imgIdx) => (
                                      <div key={imgIdx} className="rounded-lg overflow-hidden">
                                        <img
                                          src={img || "/placeholder.svg"}
                                          alt={`${step.title} ${imgIdx + 1}`}
                                          className="w-full h-auto"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Video Embed */}
                                {step.video && (
                                  <div className="aspect-video rounded-lg overflow-hidden">
                                    <iframe
                                      src={step.video}
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
                      <Button size="lg" asChild>
                        <a href={selectedProjectData.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-5 w-5 mr-2" />
                          View Live Demo
                        </a>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <a href={selectedProjectData.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-5 w-5 mr-2" />
                          View Source Code
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
