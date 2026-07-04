import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    const backendOrigin =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
      process.env.BACKEND_URL?.replace(/\/api\/v1\/?$/, '') ||
      process.env.BACKEND_URL ||
      'http://localhost:3001';
    return [
      {
        source: '/backend/:path*',
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
