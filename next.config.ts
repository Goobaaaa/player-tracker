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
      'i.gyazo.com',
      'i.postimg.cc',
      'image.ibb.co',
      'preview.ibb.co',
      'www.gettyimages.com',
      'media.istockphoto.com',
      'www.shutterstock.com',
      'image.shutterstock.com',
      'cdn.dribbble.com',
      'images.pexels.com',
      'www.canva.com',
      'media.discordapp.net',
    ],
  },
};

export default nextConfig;
