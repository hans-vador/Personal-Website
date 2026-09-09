// Sparse pixel confetti in the wild.as style, tinted maize/blue/navy/red.
// Positions are a fixed constellation (not random) so SSR and client agree.
const PIXELS: { x: number; y: number; c: string; s: number; d: number }[] = [
  { x: 3, y: 12, c: "#FFCB05", s: 7, d: 0.2 },
  { x: 9, y: 34, c: "#3296FF", s: 6, d: 2.1 },
  { x: 14, y: 8, c: "#00274C", s: 6, d: 1.4 },
  { x: 18, y: 55, c: "#3296FF", s: 7, d: 3.3 },
  { x: 23, y: 26, c: "#FFCB05", s: 5, d: 0.9 },
  { x: 29, y: 71, c: "#00274C", s: 6, d: 2.8 },
  { x: 33, y: 15, c: "#3296FF", s: 6, d: 1.7 },
  { x: 38, y: 44, c: "#D92323", s: 5, d: 4.1 },
  { x: 44, y: 9, c: "#3296FF", s: 7, d: 0.5 },
  { x: 47, y: 63, c: "#FFCB05", s: 6, d: 2.4 },
  { x: 53, y: 30, c: "#00274C", s: 5, d: 3.7 },
  { x: 58, y: 79, c: "#3296FF", s: 6, d: 1.1 },
  { x: 63, y: 18, c: "#FFCB05", s: 6, d: 2.9 },
  { x: 67, y: 49, c: "#3296FF", s: 5, d: 0.7 },
  { x: 72, y: 84, c: "#00274C", s: 7, d: 3.9 },
  { x: 76, y: 27, c: "#3296FF", s: 6, d: 1.9 },
  { x: 81, y: 60, c: "#FFCB05", s: 5, d: 3.1 },
  { x: 85, y: 11, c: "#D92323", s: 5, d: 2.2 },
  { x: 89, y: 38, c: "#3296FF", s: 7, d: 0.4 },
  { x: 93, y: 73, c: "#00274C", s: 6, d: 1.6 },
  { x: 96, y: 21, c: "#FFCB05", s: 6, d: 3.5 },
]

export function PixelField({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {PIXELS.map((p, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            backgroundColor: p.c,
            animation: `pixel-blink ${5 + (i % 4)}s ease-in-out ${p.d}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
