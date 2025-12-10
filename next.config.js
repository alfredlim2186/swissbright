/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: 'output: export' removed to support CRM features (API routes, sessions, cookies)
  // For static export of marketing pages only, use a separate build config
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig

