import type React from "react"
import type { Metadata, Viewport } from "next"
import { Varela_Round, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// A soft rounded gothic, close in spirit to a console dashboard face.
const wiiRound = Varela_Round({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-wii-round",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Hans Vador",
  description: "Personal portfolio showcasing my work, experience, and projects",
  // app/icon.svg is the only icon asset that exists; the PNG variants the
  // previous version pointed at were never in the repo and 404'd.
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#eef4f8",
  width: "device-width",
  initialScale: 1,
  // The menu is a fixed, full-bleed surface; pinch-zoom would fight it.
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${wiiRound.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
