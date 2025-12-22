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
      title: "Project Lead",
      company: "V1 Product Studio",
      period: "September 2025 – Present",
      description: [
        "Engineered a bio-inspired modular hexapod platform utilizing an embedded Raspberry Pi 4 \"brain\" and Servo 2040 \"nervous system\" to orchestrate high-torque PWM signal processing across 18 MG996R servos",
        "Developed custom Inverse Kinematics and spatial gait algorithms in Python/MicroPython to translate Cartesian coordinates into joint angles, achieving fluid locomotion and achieving 98% positioning accuracy during complex 6-DOF maneuvers",
        "Architected a robust Finite State Machine to manage autonomous gait cycles and state transitions, utilizing Serial (UART) communication to bridge high-level logic with low-level actuator control, reducing state-transition jitter by 95%",
        "Designed Human-Machine Interface by integrating a PS4 controller via Python libraries, enabling real-time teleoperation",
        "Optimized system performance to achieve a command-to-actuation latency of under 30ms, ensuring stable operation and reactive positioning while traversing variable terrain and 30° inclines and traversing vertical obstacles up to 20 cm in height",
        "Conceptualized a modular payload system using CAD for interchangeable end-effectors, including LiDAR pods and tactile limit-switches, expanding operational utility across 12+ simulated use cases to maximize hardware versatility",
      ],
      skills: ["Python", "MicroPython", "Raspberry Pi", "CAD", "Robotics", "Inverse Kinematics"],
    },
    {
      title: "Structural Engineer",
      company: "Buckeye Vertical",
      period: "December 2024 – August 2025",
      description: [
        "Engineered and integrated an autonomous drone system achieving 6th place worldwide at the SUAS competition, specializing in precision payload delivery and real time aerial object detection over a 3 mile flight course",
        "Utilized SolidWorks and Onshape to create drone components and optimize battery location for ideal center of mass",
        "Manufactured various drone parts using 3D printing including fabricating a fiberglass hood and camera stabilizer",
        "Developed and deployed YOLOv8 computer vision models on an NVIDIA Jetson Nano, enabling real time target tracking at 8 FPS with 85% average detection accuracy under variable lighting and altitude conditions",
        "Programmed autonomous flight behaviors using ROS 2 for adaptive mission planning, path optimization (completed laps in 4 minutes), and payload interaction, reducing navigation error by 30% across dynamic course environments",
        "Configured and tuned Pixhawk 4 parameters via QGroundControl, synchronizing payload servos and optimizing propeller thrust profiles, resulting in a 10% improvement in lift efficiency and smoother motor transitions",
      ],
      skills: ["SolidWorks", "Onshape", "YOLOv8", "ROS 2", "NVIDIA Jetson", "Pixhawk"],
    },
    {
      title: "Photographer",
      company: "Being Digital",
      period: "September 2022 – Present",
      description: [
        "Capture, edit, and produce high-quality photography and videography for over 50 client projects",
        "Created multiple promotional videos for various clubs and organizations including Buckeye Vertical",
        "Leveraged professional media to develop marketing which elevated brand visibility",
        "Design and deliver media albums tailored to client specifications",
      ],
      skills: ["Photography", "Videography", "Adobe Premiere Pro", "Lightroom", "Marketing"],
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
                  <ul className="list-disc list-outside ml-4 space-y-2 mb-4 text-muted-foreground">
                    {exp.description.map((item, i) => (
                      <li key={i} className="leading-relaxed text-sm pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
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
