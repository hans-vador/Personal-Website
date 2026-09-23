import Link from "next/link"
import { links, type Project } from "@/lib/site-content"

export function ProjectPage({ project, children }: { project: Project; children: React.ReactNode }) {
 return <div className="project-document fixed inset-0 overflow-y-auto">
  <header className="portfolio-header"><Link href="/" className="wii-title text-xl">Hans Vador</Link><nav aria-label="Project navigation" className="flex flex-wrap gap-4 text-sm"><Link href="/projects">All projects</Link><a href={links.linkedin}>LinkedIn</a><a href={`mailto:${links.email}`}>Contact</a></nav></header>
  <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12"><p className="mb-4 text-sm text-[var(--wii-blue-deep)]">Engineering / Project case study</p><h1 className="sr-only">{project.title}</h1>{children}<Link className="wii-oval mt-8 inline-flex px-6 py-3" href="/projects">← All projects</Link></main>
 </div>
}
