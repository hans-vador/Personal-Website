/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Optimization had been switched off, so every <img> fetched the raw
    // camera file. With it on, and the sources pre-shrunk into /work-opt,
    // each image is served at the size it is actually displayed.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 96, 160, 240, 320, 420],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/#projects',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
