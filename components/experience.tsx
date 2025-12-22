"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase } from "lucide-react"

export function Experience() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const experiences = [
    {
      title: "Senior Software Engineer",
      company: "Tech Company",
      period: "2022 — Present",
      description:
        "Lead development of cutting-edge web applications. Collaborate with cross-functional teams to deliver scalable solutions that drive business growth.",
      skills: ["React", "TypeScript", "Next.js", "Node.js"],
    },
    {
      title: "Software Engineer",
      company: "Startup Inc",
      period: "2020 — 2022",
      description:
        "Built and maintained core product features. Implemented CI/CD pipelines and improved application performance by 40%.",
      skills: ["JavaScript", "Python", "AWS", "Docker"],
    },
    {
      title: "Junior Developer",
      company: "Digital Agency",
      period: "2018 — 2020",
      description:
        "Developed responsive websites and web applications for diverse clients. Gained experience in modern web technologies and agile methodologies.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
    },
  ]

  useEffect(() => {
    const observers = cardRefs.current.map((card, index) => {
      if (!card) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set(prev).add(index))
            }
          })
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -100px 0px",
        },
      )

      observer.observe(card)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <section id="experience" className="container mx-auto px-6 py-24 relative z-10 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border rounded-full px-6 py-3 shadow-sm">
            <Briefcase className="h-6 w-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
          </div>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              className={`transition-all duration-700 ${visibleCards.has(index) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="border-border/50 hover:border-primary/50 transition-colors bg-card/70 backdrop-blur-md shadow-xl hover:shadow-2xl">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                    <CardTitle className="text-xl">{exp.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">{exp.period}</span>
                  </div>
                  <p className="text-primary font-medium">{exp.company}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
