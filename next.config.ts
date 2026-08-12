import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  
  // Enable proxy support (this is valid)
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },

  // ✅ CORRECT: Use `remotePatterns` for Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;