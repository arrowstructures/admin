/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure for Netlify deployment
  trailingSlash: true,
  experimental: {
    appDir: true,
  },
}

export default nextConfig
