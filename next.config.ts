import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix cross-origin warnings for local development
  allowedDevOrigins: ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://192.168.98.42:3001", "http://192.168.98.42:3002", "http://192.168.98.42:3003"],

  // Configure domains for external images
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
    ],
  },
};

export default nextConfig;
