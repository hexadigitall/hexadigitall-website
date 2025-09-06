// src/app/layout.tsx
import type { Metadata } from 'next';
import { Montserrat, Lato } from 'next/font/google'; // <-- Swapped to correct fonts
import './globals.css';

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
        </AppCartProvider>
      </body>
    </html>
  );
}