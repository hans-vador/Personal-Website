import { hexapod } from "@/lib/site-content"
import { HexapodBody } from "@/components/wii/channel-bodies"
import { ProjectPage } from "@/components/wii/project-page"
export const metadata = { title: `${hexapod.title} · Hans Vador`, description: hexapod.shortDescription }
export default function Page() { return <ProjectPage project={hexapod}><HexapodBody /></ProjectPage> }
