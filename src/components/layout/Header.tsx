// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const serviceLinks = [
    { href: "/services/business-plan-logo", label: "Business Plan & Logo" },
    { href: "/services/web-mobile-development", label: "Web & Mobile Dev" },
    { href: "/services/social-media-marketing", label: "Social Media Marketing" },
    { href: "/services/portfolio-building", label: "Portfolio Building" },
    { href: "/services/mentoring-consulting", label: "Mentoring & Consulting" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/hexadigitall-logo.png"
            alt="Hexadigitall Logo"
            width={180}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/about">About</Link>
          
          {/* Services Dropdown */}
          <div className="relative group">
            <Link href="/services" className="inline-flex items-center">
              Services
              <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 w-60">
              {serviceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block px-4 py-2 text-sm text-darkText hover:bg-lightGray">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/portfolio">Portfolio</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/faq">FAQs</Link>
        </div>
        
        <div className="hidden md:flex">
          <Link href="/contact" className="btn-primary">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            {/* Hamburger Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 flex flex-col space-y-4">
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/faq">FAQs</Link>
          <Link href="/contact" className="btn-primary text-center">Contact</Link>
        </div>
      )}
    </header>
  );
};

export default Header;