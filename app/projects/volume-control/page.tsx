import { volumeControl } from "@/lib/site-content"
import { VolumeControlBody } from "@/components/wii/channel-bodies"
import { ProjectPage } from "@/components/wii/project-page"
export const metadata = { title: `${volumeControl.title} · Hans Vador`, description: volumeControl.shortDescription }
export default function Page() { return <ProjectPage project={volumeControl}><VolumeControlBody /></ProjectPage> }
