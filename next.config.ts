import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix cross-origin warnings for local development
  allowedDevOrigins: ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://192.168.98.42:3001", "http://192.168.98.42:3002", "http://192.168.98.42:3003"],

  // Configure ESLint for production builds
  eslint: {
    // Turn off ESLint during builds to avoid Prisma generated file errors
    ignoreDuringBuilds: true
  },

  // Configure TypeScript for production builds
  typescript: {
    // Keep TypeScript checking enabled
    ignoreBuildErrors: false
  },

  // Ensure static export is not interfering with Vercel
  output: undefined,

  // Configure domains for external images using remotePatterns
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.w3schools.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'www.freepnglogos.com' },
      { protocol: 'https', hostname: 'i.gyazo.com' },
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'image.ibb.co' },
      { protocol: 'https', hostname: 'preview.ibb.co' },
      { protocol: 'https', hostname: 'www.gettyimages.com' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 'www.shutterstock.com' },
      { protocol: 'https', hostname: 'image.shutterstock.com' },
      { protocol: 'https', hostname: 'cdn.dribbble.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'www.canva.com' },
      { protocol: 'https', hostname: 'media.discordapp.net' },
    ],
  },
};

export default nextConfig;
