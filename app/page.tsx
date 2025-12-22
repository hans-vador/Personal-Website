import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { Media } from "@/components/media"


import { ParticleWave } from "@/components/particle-wave"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ParticleWave />

      <div className="relative z-10">
        <Header />
        <Hero />
        <Experience />
        <Projects />
        <Media />

      </div>
    </main>
  )
}
