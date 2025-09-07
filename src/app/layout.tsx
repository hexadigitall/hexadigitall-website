// src/app/layout.tsx
import type { Metadata } from 'next';
import { Montserrat, Lato } from 'next/font/google'; // <-- Swapped to correct fonts
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

export const metadata: Metadata = {
  title: 'Hexadigitall | Business Planning, Web Dev & Digital Marketing',
  description: 'Your all-in-one digital partner in Nigeria, turning ideas into reality.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  themeColor: '#1F2937'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply font variables to the body */}
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