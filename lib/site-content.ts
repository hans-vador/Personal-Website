// Single source of truth for every piece of content on the site.
// Copy is preserved verbatim from the previous version of the portfolio.

export type ChannelId =
  | "about"
  | "exp-pave"
  | "exp-v1"
  | "exp-buckeye"
  | "exp-being-digital"
  | "proj-hexapod"
  | "proj-volume"
  | "photos"
  | "videos"
  | "contact"

/* ------------------------------------------------------------------ about */

export const about = {
  name: "Hans Vador",
  eyebrow: "Mechanical & Computer Engineering Student",
  tagline:
    "Bridging the gap between hardware design and computational logic. Dedicated to building responsive, intelligent robots that make a difference.",
  degree: "Bachelor of Science in Mechanical and Computer Engineering",
  school: "University of Michigan",
  portrait: "/work/PFP.JPG",
}

export const links = {
  github: "https://github.com/hans-vador",
  linkedin: "https://www.linkedin.com/in/hansvador/",
  email: "hvador@umich.edu",
}

/* ------------------------------------------------------------- experience */

export interface Experience {
  id: ChannelId
  title: string
  company: string
  period: string
  description: string[]
  skills: string[]
}

export const experiences: Experience[] = [
  {
    id: "exp-pave",
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
    id: "exp-v1",
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
    id: "exp-buckeye",
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
    id: "exp-being-digital",
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

/* --------------------------------------------------------------- projects */

export interface Material {
  name: string
  amount: string
  link?: string
}

export type ProcessImage = string | { src: string; caption: string }

export interface ProcessStep {
  title: string
  description: string
  materials?: Material[]
  materialsFootnote?: string
  images?: ProcessImage[]
  video?: string
}

export interface Project {
  id: ChannelId
  title: string
  shortDescription: string
  fullDescription: string
  image: string
  tags: string[]
  process: ProcessStep[]
  demo?: string
  github?: string
}

export const hexapod: Project = {
  id: "proj-hexapod",
  title: "Modular Hexapod Robotics Platform",
  shortDescription:
    "A modular hexapod consisting of 18 MG996R servos, a Raspberry Pi, and a Servo2040 capable of teleoperation through a PS4 Controller",
  fullDescription:
    "As part of V1's new cohort, I had the opportunity to pursue a passion project, and as a die-hard Hardware engineer (no pun intended), I decided to take this opportunity to build the coolest robot possible. A modular hexapod \u{1F577}\u{FE0F}",
  image: "/work/SpiderBot/1.JPG",
  tags: ["MicroPython", "Raspberry Pi", "Servo2040", "CAD", "3D Printing"],
  process: [
    {
      title: "Step 1: How in the world do we make this within 8 weeks?",
      description:
        "My partner and I had one main goal for this project which was to have somewhat of a working product by 8 weeks. With 2 weeks used up in club initiations and brainstorming, we knew doing this whole project from scratch might be out of our time scope. Luckily we found a YouTuber by the name of MakeYourPet who gave us the perfect base to work off of. Using his design models as a guide, we quickly ordered and printed all the necessary parts. We also had in mind the general embedded system architecture we would use, which is displayed below.",
      materials: [
        {
          name: "MG996R Servos (4-pack)",
          amount: "5",
          link: "https://www.amazon.com/4-Pack-MG996R-Torque-Digital-Helicopter/dp/B07MFK266B?th=1",
        },
        {
          name: "18 Channel Servo Controller",
          amount: "1",
          link: "https://www.adafruit.com/product/5437?srsltid=AfmBOorn52bKxREJuZnsdrBYkauNoF4JrYDRb7Y_26m78wRmBdA5mPlZ",
        },
        {
          name: "Screws/Nuts",
          amount: "1",
          link: "https://www.amazon.com/gp/product/B0CJJFFCW2/ref=ewc_pr_img_1?smid=A2XXMW1BKOEL72&th=1",
        },
        {
          name: "Grippy Tips",
          amount: "1",
          link: "https://www.amazon.com/uxcell-Thread-Protectors-16-inch-Flexible/dp/B07V5T8RL1?th=1",
        },
        {
          name: "Limit Switches",
          amount: "1",
          link: "https://www.amazon.com/MXRS-Hinge-Momentary-Button-Switch/dp/B088W8WMTB",
        },
      ],
      materialsFootnote:
        "Plus some stuff I used laying around the house (Raspberry Pi 4, Power Supply, Breakout Board, Wires, etc.)...",
      images: ["/work/SpiderBot/2.png"],
    },
    {
      title: "Step 2: Assemble and Code",
      description:
        "With everything ready, we got to work. After plenty of hot glue, screws, and countless hours, we finally assembled the legs. The next step was developing the inverse kinematics equations in Python, where we encountered several calibration and edge-case issues due to the high dimensionality of our specific setup. However, through rigorous debugging, we moved past those hurdles and began developing the walking gait functions. Without getting into the nitty-gritty, we designed a program that utilizes a tripod gait: three legs remain in a stance phase to provide stability while the other three swing forward to advance. We also implemented a “flex” function to adjust the robot's orientation and an individual leg override for manual control. To manage these various behaviors, we utilized a State Machine to handle all the operational modes.",
      images: [
        "/work/SpiderBot/Gif6.gif",
        "/work/SpiderBot/Gif3.gif",
        "/work/SpiderBot/6.png",
        "/work/SpiderBot/5.png",
        "/work/SpiderBot/3.JPG",
        "/work/SpiderBot/4.png",
        {
          src: "/work/SpiderBot/Gif4.gif",
          caption:
            "This was still in testing phase as you can see the legs are walking against each other here \u{1F923}",
        },
      ],
    },
  ],
  demo: "https://youtube.com",
  github: "https://github.com/hans-vador/SpiderBot",
}

export interface VolumeVersion {
  version: string
  title: string
  description: string
  highlights: string[]
  media: { type: "image" | "video"; src: string; title: string }[]
}

export const volumeVersions: VolumeVersion[] = [
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

export const volumeControl: Project = {
  id: "proj-volume",
  title: "Volume Control",
  shortDescription: "A custom-built robotic volume controller with <30ms response time",
  fullDescription:
    "The final and working version with sub-30ms response times and polished user experience. After learning from all my mistakes I was finally able to make friction-hold design with a working gear system.",
  image: "/work/IMG_2445.JPG",
  tags: ["React", "Arduino R4 Wifi", "SolidWorks", "C++"],
  process: [],
  demo: "https://volume-control-reactapp-demo.vercel.app/",
  github: "https://github.com/hans-vador/volume-control",
}

export const projects: Project[] = [hexapod, volumeControl]

/* ------------------------------------------------------------------ media */

export const mediaIntro =
  "Creative projects and visual content showcasing my media production skills across video and photography."

export const bookingPitch = {
  heading: "Interested in booking a session or seeing more?",
  body: "Contact me for rates, availability, or a detailed portfolio walkthrough.",
}

export {
  videoProjects,
  photoAlbums,
  type VideoProject,
  type PhotoAlbum,
} from "./media-data"
