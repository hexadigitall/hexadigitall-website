// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'; // 👈 1. Import Viewport
import { Montserrat, Lato } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// Import Header and Footer
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AppCartProvider from '@/components/CartProvider';

// Define the fonts from your style guide with performance optimizations
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['700'],
  display: 'swap', // Improve font loading performance
  preload: true,
});
const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['400', '700'],
  display: 'swap', // Improve font loading performance
  preload: true,
});

// ✅ Enhanced metadata for SEO and accessibility
export const metadata: Metadata = {
  title: {
    default: 'Hexadigitall | Business Planning, Web Dev & Digital Marketing',
    template: '%s | Hexadigitall'
  },
  description: 'Your all-in-one digital partner in Nigeria, turning ideas into reality. Expert web development, digital marketing, and business planning services.',
  keywords: ['web development', 'digital marketing', 'business planning', 'Nigeria', 'technology', 'courses'],
  authors: [{ name: 'Hexadigitall Team' }],
  creator: 'Hexadigitall',
  publisher: 'Hexadigitall',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hexadigitall.com',
    siteName: 'Hexadigitall',
    title: 'Hexadigitall | Business Planning, Web Dev & Digital Marketing',
    description: 'Your all-in-one digital partner in Nigeria, turning ideas into reality.',
    images: [{
      url: '/digitall_partner.png',
      width: 1200,
      height: 630,
      alt: 'Hexadigitall - Your Digital Partner',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hexadigitall | Your Digital Partner',
    description: 'Expert web development, digital marketing, and business planning services in Nigeria.',
    images: ['/digitall_partner.png'],
  },
};

// 👇 2. Add the new viewport export
export const viewport: Viewport = {
  themeColor: '#0A4D68', // Moved from metadata
  initialScale: 1,
  width: 'device-width',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0A4D68" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${montserrat.variable} ${lato.variable} font-body bg-white text-darkText antialiased`}>
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg transition-all"
        >
          Skip to main content
        </a>
        
        <AppCartProvider>
          <Header />
          <main id="main-content" role="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          
          {/* Toast notifications with better accessibility */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#10B981',
                color: '#fff',
                fontSize: '16px',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
            containerStyle={{
              top: '80px', // Account for header height
            }}
          />
        </AppCartProvider>
      </body>
    </html>
  );
}
