import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix cross-origin warnings for local development
  allowedDevOrigins: ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://192.168.98.42:3001", "http://192.168.98.42:3002", "http://192.168.98.42:3003"],
};

export default nextConfig;
