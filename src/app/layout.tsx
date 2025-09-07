// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'; // 👈 1. Import Viewport
import { Montserrat, Lato } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// Import Header and Footer
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AppCartProvider from '@/components/CartProvider';

// Define the fonts from your style guide
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['700'],
});
const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['400', '700'],
});

// ✅ The metadata object is now cleaner
export const metadata: Metadata = {
  title: 'Hexadigitall | Business Planning, Web Dev & Digital Marketing',
  description: 'Your all-in-one digital partner in Nigeria, turning ideas into reality.',
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
    <html lang="en">
      <body className={`${montserrat.variable} ${lato.variable} font-body bg-white text-darkText`}>
        <AppCartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#10B981',
                color: '#fff',
              },
            }}
          />
        </AppCartProvider>
      </body>
    </html>
  );
}