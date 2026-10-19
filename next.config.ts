import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  allowedDevOrigins: [
    "localhost", 
    "127.0.0.1", 
    "192.168.1.57", 
    "[IP_ADDRESS]"
  ],
};

export default nextConfig;