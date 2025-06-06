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
  // For Netlify, we need static export
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
}

export default nextConfig
