import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Canonical redirects for proposal templates
  async redirects() {
    return [
      {
        source: '/proposals/divas-kloset',
        destination: '/proposals/social-media-marketing/divas-kloset',
        permanent: false,
      },
    ]
  },
  // Rewrite rules for static files
  async rewrites() {
    return [
      {
        source: '/socialmediaform',
        destination: '/socialmediaform/index.html',
      },
    ];
  },

  // Enable strict mode for better development experience
  reactStrictMode: true, 

  // Image optimization - Enhanced for better performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'puzezel0.apicdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 300, // 5 minutes cache
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add timeout and error handling
    loader: 'default',
    path: '/_next/image',
    // Limit image dimensions to prevent large image processing
    domains: [],
    unoptimized: false,
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

  // Experimental features and performance optimizations
  experimental: {
    // Enable optimized CSS
    optimizeCss: true,
    // Performance optimizations
    webpackBuildWorker: true,
    // Enable PPR (Partial Prerendering) for better performance
    ppr: false, // Keep false for now as it's experimental
    // Optimize package imports
    optimizePackageImports: ['@heroicons/react', '@portabletext/react'],
  },

  // Turbopack configuration (migrated from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
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

  // Performance optimizations - Increased for better stability
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000, // 60 seconds (increased from 25s)
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5, // Increased from 2 to prevent aggressive disposal
  },

  // Note: Webpack config removed for Turbopack compatibility
  // Turbopack handles optimization automatically
};

export default withBundleAnalyzer(nextConfig);