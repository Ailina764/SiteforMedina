// PAGES_BASE_PATH задаётся только при сборке для GitHub Pages
// (см. .github/workflows/pages.yml). Без неё сайт собирается как обычно.
const basePath = process.env.PAGES_BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(basePath && { output: 'export', basePath, trailingSlash: true }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
