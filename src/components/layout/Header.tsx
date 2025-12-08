// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isMobileServicesOpen, setMobileServicesOpen] = useState(false);

  // ✅ Corrected and completed service links array
  const serviceLinks = [
    { href: "/services/business-plan-and-logo-design", label: "Business Plan & Logo" },
    { href: "/services/web-and-mobile-software-development", label: "Web & Mobile Dev" },
    { href: "/services/social-media-advertising-and-marketing", label: "Social Media Marketing" },
    { href: "/services/profile-and-portfolio-building", label: "Profile & Portfolio Building" },
    { href: "/services/mentoring-and-consulting", label: "Mentoring & Consulting" },
  ];

  // Helper function to close all mobile menus
  const closeMobileMenus = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

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
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center min-h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/hexadigitall-logo-transparent.png"
              alt="Hexadigitall Logo"
              width={180}
              height={60}
              className="h-8 sm:h-10 lg:h-12 w-auto"
              priority
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 180px"
            />
          </Link>

          {/* Desktop Navigation - Adjusted breakpoints */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/about">About</Link>
            
            {/* Services Dropdown */}
            <div className="relative services-dropdown">
              <button 
                onClick={() => setServicesOpen(!isServicesOpen)}
                onKeyDown={(e) => e.key === 'Enter' && setServicesOpen(!isServicesOpen)}
                className="inline-flex items-center hover:text-secondary transition-colors"
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
                aria-label="Services menu"
              >
                Services
                <svg className={`ml-1 h-5 w-5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`absolute left-0 lg:left-auto lg:right-0 bg-white shadow-lg rounded-md mt-2 w-60 z-50 transition-all duration-200 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`} role="menu" aria-labelledby="services-button">
                <Link href="/services" className="block px-4 py-3 text-sm font-medium text-primary border-b border-gray-100 hover:bg-lightGray" onClick={() => setServicesOpen(false)}>
                  All Services
                </Link>
                {serviceLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block px-4 py-2 text-sm text-darkText hover:bg-lightGray transition-colors" onClick={() => setServicesOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/portfolio">Portfolio</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/faq">FAQs</Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            <CurrencySwitcher />
            <Link href="/contact" className="btn-primary">
              Contact
            </Link>
          </div>

          {/* Tablet Navigation - Optimized for medium screens (768px - 1023px) */}
          <div className="hidden md:flex lg:hidden items-center justify-between flex-1 ml-4">
            {/* Left navigation links */}
            <div className="flex items-center space-x-3 xl:space-x-4">
              <Link href="/about" className="text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap">About</Link>
              
              {/* Services Dropdown for Tablet */}
              <div className="relative services-dropdown">
                <button 
                  id="services-button"
                  onClick={() => setServicesOpen(!isServicesOpen)}
                  className="inline-flex items-center text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap"
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                  aria-label="Services menu"
                >
                  Services
                  <svg className={`ml-1 h-3 w-3 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div 
                  className={`absolute left-0 xl:left-auto xl:right-0 bg-white shadow-lg rounded-md mt-2 w-72 z-50 transition-all duration-200 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                  role="menu"
                  aria-labelledby="services-button"
                >
                  <Link href="/services" className="block px-4 py-3 text-sm font-medium text-primary border-b border-gray-100 hover:bg-lightGray whitespace-nowrap" onClick={() => setServicesOpen(false)} role="menuitem">
                    All Services
                  </Link>
                  {serviceLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="block px-4 py-2.5 text-sm text-darkText hover:bg-lightGray transition-colors whitespace-nowrap" onClick={() => setServicesOpen(false)} role="menuitem">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link href="/portfolio" className="text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap">Portfolio</Link>
              <Link href="/courses" className="text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap">Courses</Link>
              <Link href="/blog" className="text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap">Blog</Link>
              <Link href="/faq" className="text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap">FAQs</Link>
            </div>
            
            {/* Right actions - Currency, Contact */}
            <div className="flex items-center space-x-1.5 xl:space-x-2">
              <div className="scale-90">
                <CurrencySwitcher />
              </div>
              <Link href="/contact" className="bg-primary text-white px-2 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button - Only show on small screens */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} aria-label={`${isMobileMenuOpen ? 'Close' : 'Open'} mobile menu`} aria-expanded={isMobileMenuOpen}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu - Only show on small screens since tablet has its own nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white px-4 sm:px-6 pb-4 border-t border-gray-100" role="navigation" aria-label="Mobile navigation menu">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/about" onClick={closeMobileMenus}>About</Link>
              <div>
                <button onClick={() => setMobileServicesOpen(!isMobileServicesOpen)} className="flex items-center justify-between w-full text-left" aria-expanded={isMobileServicesOpen} aria-controls="mobile-services-menu">
                  Services
                  <svg className={`h-5 w-5 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isMobileServicesOpen && (
                  <div className="mt-2 ml-4 space-y-2" id="mobile-services-menu" role="menu">
                    <Link href="/services" className="block text-sm text-primary font-medium py-1" onClick={closeMobileMenus}>
                      All Services
                    </Link>
                    {serviceLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="block text-sm text-darkText py-1 hover:text-secondary" onClick={closeMobileMenus}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/portfolio" onClick={closeMobileMenus}>Portfolio</Link>
              <Link href="/courses" onClick={closeMobileMenus}>Courses</Link>
              <Link href="/blog" onClick={closeMobileMenus}>Blog</Link>
              <Link href="/faq" onClick={closeMobileMenus}>FAQs</Link>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Currency:</span>
                  <CurrencySwitcher position="inline" showLabel={false} />
                </div>
                <Link href="/contact" className="btn-primary text-center block" onClick={closeMobileMenus}>
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
