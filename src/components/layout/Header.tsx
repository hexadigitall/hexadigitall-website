// src/components/layout/Header.tsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-heading font-bold text-primary">
          Hexadigitall
        </Link>
        {/* Full navigation would be built out here */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="hover:text-secondary">About</Link>
          <Link href="/services" className="hover:text-secondary">Services</Link>
          <Link href="/portfolio" className="hover:text-secondary">Portfolio</Link>
          <Link href="/blog" className="hover:text-secondary">Blog</Link>
        </div>
        <Link href="/contact" className="bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-primary transition-colors">
          Contact Us
        </Link>
      </nav>
    </header>
  );
};

export default Header;