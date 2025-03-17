import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**'
      }
    ]
  }
};

export default nextConfig;
