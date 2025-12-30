/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
