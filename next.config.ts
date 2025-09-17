import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix cross-origin warnings for local development
  allowedDevOrigins: ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://192.168.98.42:3001", "http://192.168.98.42:3002", "http://192.168.98.42:3003"],

  // Configure domains for external images
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'i.imgur.com',
      'i.ibb.co',
      'upload.wikimedia.org',
      'www.w3schools.com',
      'cdn.pixabay.com',
      'www.freepnglogos.com',
      'upload.wikimedia.org',
      'i.gyazo.com',
    ],
  },
};

export default nextConfig;
