import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
      },
      {
        protocol: 'https',
        hostname: 'nyc.cloud.appwrite.io',
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Set the body size limit for server actions
    }
  },
};
export default nextConfig;

