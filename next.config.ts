import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Turbopack configuration (webpack config removed for Turbopack compatibility)
  // Note: SWC is now the default minifier in Next.js 13+

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
    // Performance optimizations
    webpackBuildWorker: true,
  },

  // Turbopack is enabled via CLI flag --turbopack
  // No additional configuration needed for basic usage

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

  // Performance optimizations
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000, // 25 seconds
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Note: Webpack config removed for Turbopack compatibility
  // Turbopack handles optimization automatically
};

export default withBundleAnalyzer(nextConfig);
