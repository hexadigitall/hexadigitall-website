// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isMobileServicesOpen, setMobileServicesOpen] = useState(false);

  const serviceLinks = [
    { href: "/services/business-plan-logo", label: "Business Plan & Logo" },
    { href: "/services/web-mobile-development", label: "Web & Mobile Dev" },
    { href: "/services/social-media-marketing", label: "Social Media Marketing" },
    { href: "/services/portfolio-building", label: "Portfolio Building" },
    { href: "/services/mentoring-consulting", label: "Mentoring & Consulting" },
  ];

  // Close dropdowns when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.services-dropdown')) {
        setServicesOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMobileServicesOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/hexadigitall-logo.svg"
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
          <div className="relative services-dropdown">
            <button 
              onClick={() => setServicesOpen(!isServicesOpen)}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              className="inline-flex items-center hover:text-secondary transition-colors"
            >
              Services
              <svg 
                className={`ml-1 h-5 w-5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div 
              className={`absolute left-0 bg-white shadow-lg rounded-md mt-2 w-60 z-50 transition-all duration-200 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link 
                href="/services" 
                className="block px-4 py-3 text-sm font-medium text-primary border-b border-gray-100 hover:bg-lightGray"
                onClick={() => setServicesOpen(false)}
              >
                All Services
              </Link>
              {serviceLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="block px-4 py-2 text-sm text-darkText hover:bg-lightGray transition-colors"
                  onClick={() => setServicesOpen(false)}
                >
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
        <div className="md:hidden bg-white px-6 pb-4 border-t border-gray-100">
          <div className="flex flex-col space-y-4 pt-4">
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            
            {/* Mobile Services Dropdown */}
            <div>
              <button 
                onClick={() => setMobileServicesOpen(!isMobileServicesOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                Services
                <svg 
                  className={`h-5 w-5 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isMobileServicesOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  <Link 
                    href="/services" 
                    className="block text-sm text-primary font-medium py-1"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileServicesOpen(false);
                    }}
                  >
                    All Services
                  </Link>
                  {serviceLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="block text-sm text-darkText py-1 hover:text-secondary"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileServicesOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>FAQs</Link>
            <Link 
              href="/contact" 
              className="btn-primary text-center" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;