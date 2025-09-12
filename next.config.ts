import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,

  // Optimize compilation performance
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Enable tree shaking for better bundle size
      config.optimization.usedExports = true;
    }
    return config;
  },

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
      {
        protocol: 'https',
        hostname: 'puzezel0.apicdn.sanity.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
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
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ],

  // Server external packages (moved from experimental)
  serverExternalPackages: ['fs'],

  // Experimental features
  experimental: {
    // Enable optimized CSS
    optimizeCss: true,
    // Enable static worker optimization
    staticWorkerRequestDeduping: true,
  },

  // TypeScript configuration
  typescript: {
    // Type checking is handled by your IDE and CI
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Lint on build
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
};

export default nextConfig;