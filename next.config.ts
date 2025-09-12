import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ],

  // Turbopack configuration for experimental features
  experimental: {
    // This is the correct way to enable Turbopack
    // Use turbopack: true if you want to use it for all builds.
    // Otherwise, use the 'next dev --turbopack' command.
    // turbopack: true,
    
    // Enabling a feature that was previously handled by Webpack
    // This removes the "fs" dependency from the client-side bundle
    serverComponentsExternalPackages: ['fs'], 
  },
};

export default nextConfig;