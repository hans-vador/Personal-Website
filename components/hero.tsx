import { Mail } from "lucide-react"

export function Hero() {
  return (
    <section id="about" className="relative w-full px-6 py-24 md:py-32 min-h-screen flex items-center overflow-hidden">
      <div className="max-w-[90%] md:max-w-7xl ml-0 w-full relative z-10 grid md:grid-cols-5 gap-12 items-center">
        {/* Left Column: Text */}
        <div className="md:col-span-3 bg-card/80 backdrop-blur-md border border-border rounded-2xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Hans Vador</h1>
          <p className="text-xl md:text-2xl text-primary mb-4">Mechanical & Computer Engineering Student</p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            Bridging the gap between hardware design and computational logic. Dedicated to building responsive,
            intelligent robots that make a difference.
          </p>

          <div className="mb-8 p-4 bg-muted/50 border border-border rounded-lg backdrop-blur-sm">
            <div className="text-muted-foreground flex flex-col gap-1">
              <span className="font-semibold text-foreground">Bachelor of Science in Mechanical and Computer Engineering</span>
              <span>University of Michigan</span>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/hans-vador"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/hansvador/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span className="sr-only">LinkedIn</span>
            </a>

            <a
              href="mailto:hvador@umich.edu"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>

        {/* Right Column: Empty for M */}
        <div className="flex justify-center md:justify-end">
          {/* M appears here via background pattern */}
        </div>
      </div>
    </section>
  )
}
