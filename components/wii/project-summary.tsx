import type { Project } from "@/lib/site-content"

export function ProjectSummary({ project }: { project: Project }) {
  const robot = project.id === "proj-hexapod"
  const facts = robot ? [
    ["My role", "Project lead on a two-person team; inverse kinematics, gait control, and modular payload design."],
    ["Engineering challenge", "Coordinate 18 servos into stable walking motion using a Raspberry Pi and Servo2040."],
    ["What I built", "Python motion control, a tripod gait, PS4 teleoperation, and a state machine for walking and manual leg control."],
    ["Result", "A teleoperated robotics platform with under 30ms command-to-actuation latency. Built on MakeYourPet’s base design with custom control and payload integration."],
  ] : [
    ["My role", "Designed and iterated the mechanical assembly, Arduino firmware, and React control interface."],
    ["Engineering challenge", "Turn a physical volume knob remotely with fast, repeatable motion."],
    ["What I built", "An Arduino R4 WiFi controller, React frontend, and servo-driven gear system with a friction-hold mount."],
    ["Result", "A working fourth-generation prototype with sub-30ms response time, following iterations on WiFi latency, servo mounting, and gear alignment."],
  ]
  return <section className="wii-plate p-5 sm:p-6" aria-label="Project at a glance">
    <h3 className="wii-title text-xl">Project at a glance</h3>
    <dl className="mt-5 grid gap-5 sm:grid-cols-2">{facts.map(([title, body]) => <div key={title}><dt className="font-semibold text-[var(--wii-blue-deep)]">{title}</dt><dd className="mt-1 text-sm leading-relaxed">{body}</dd></div>)}</dl>
    {project.github && <a className="wii-oval mt-5 mr-4 inline-flex px-5 py-2 text-sm" href={project.github} target="_blank" rel="noopener noreferrer">View source code</a>}
    <a className="mt-5 inline-block text-sm underline underline-offset-4" href={robot ? "/projects/hexapod" : "/projects/volume-control"}>Open shareable project page →</a>
  </section>
}
