/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: 'output: export' removed to support CRM features (API routes, sessions, cookies)
  // For static export of marketing pages only, use a separate build config
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

