/** @type {import('next').NextConfig} */
const nextConfig = {
  // 번들 최적화
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  // 이미지 최적화
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // 실험적 기능
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

module.exports = nextConfig;

