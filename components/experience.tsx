"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Experience() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const experiences = [
    {
      title: "Mechanical Engineering Intern",
      company: "Pave Robotics (YC W25)",
      period: "May 2026 – Present",
      description: [
        "Co-developing the second-generation Tracer robot — designed compressor and battery mounts that cut system vibration by 20%, and chassis truss reinforcements that boosted precision by 15%",
        "Built liquid-cooling and active air-filtration systems for the electronics enclosures, plus wheel-encoder odometry that increased job speed by 5%",
        "Led fabrication of Tracer 2's exterior panels from raw material through vinyl wrap and final assembly",
      ],
      skills: ["CAD", "Structural Design", "Thermal Systems", "Fabrication"],
    },
    {
      title: "Project Lead",
      company: "V1 Product Studio",
      period: "Sep 2025 – Present",
      description: [
        "Leading a two-person team building a modular 18-servo hexapod robot with a Raspberry Pi brain and Servo 2040 motion controller",
        "Wrote the inverse kinematics and tripod-gait engine in Python — under 30ms command-to-actuation latency across 30° inclines and 20cm obstacles",
        "Added real-time PS4 teleoperation and a CAD-designed modular payload mount for LiDAR and tactile sensors",
      ],
      skills: ["Python", "Raspberry Pi", "Inverse Kinematics", "CAD"],
    },
    {
      title: "Structural Engineer",
      company: "Buckeye Vertical",
      period: "Dec 2024 – Aug 2025",
      description: [
        "Designed and flew an autonomous drone to 6th place worldwide at the SUAS competition",
        "Modeled airframe components in SolidWorks and Onshape; manufactured parts with 3D printing and fiberglass",
        "Deployed YOLOv8 vision on a Jetson Nano for real-time target detection and built autonomous flight behaviors in ROS 2",
      ],
      skills: ["SolidWorks", "Onshape", "YOLOv8", "ROS 2"],
    },
    {
      title: "Photographer",
      company: "Being Digital",
      period: "Sep 2022 – Present",
      description: [
        "Shot and produced photo and video for 50+ client projects, from the shoot through the final edit",
        "Created promotional videos and marketing media for clubs and organizations",
      ],
      skills: ["Photography", "Videography", "Premiere Pro", "Lightroom"],
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
          <p className="eyebrow mb-3">01 / Where I&apos;ve worked</p>
          <h2 className="text-4xl md:text-6xl font-semibold uppercase tracking-[-0.03em]">
            Experience<span className="text-[var(--hud)]">.</span>
          </h2>
        </div>

        <div className="relative">
          {/* timeline rail */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border md:left-[7px]" aria-hidden="true" />

          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                className={`relative pl-8 transition-all duration-700 ${
                  visibleCards.has(index) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* timeline dot */}
                <div
                  className="absolute left-0 top-7 h-[15px] w-[15px] rounded-full border-2 border-primary bg-background shadow-[0_0_10px_hsl(var(--primary)/0.35)]"
                  aria-hidden="true"
                />

                <Card className="border-border/50 hover:border-primary/50 transition-colors bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                      <CardTitle className="text-lg md:text-xl">
                        {exp.title}
                        <span className="text-muted-foreground font-normal"> · </span>
                        <span className="text-primary font-semibold">{exp.company}</span>
                      </CardTitle>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{exp.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4 text-muted-foreground">
                      {exp.description.map((item, i) => (
                        <li key={i} className="leading-relaxed text-sm flex gap-2.5">
                          <span className="text-primary/70 mt-[3px] shrink-0" aria-hidden="true">
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="font-mono text-[10px] font-normal uppercase tracking-wider rounded-sm border-border/70 text-muted-foreground"
                        >
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
      </div>
    </section>
  )
}
