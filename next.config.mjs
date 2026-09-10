/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // The dev badge sits exactly where the menu's left button is.
  devIndicators: false,
  images: {
    // The originals in /public/work run to tens of megabytes each, so the
    // built-in optimizer does the resizing rather than shipping them raw.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [96, 160, 240, 320, 420],
  },
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
