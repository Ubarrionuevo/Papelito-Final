import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizations for Vercel deployment
  experimental: {
    // Enable Turbopack for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Image optimization
  images: {
    domains: ['cdn.sanity.io', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // API route optimization
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
  
  // Environment variables validation
  env: {
    BFL_API_KEY: process.env.BFL_API_KEY,
  },
};

export default nextConfig;
