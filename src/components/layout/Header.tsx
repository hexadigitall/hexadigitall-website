// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import { getWhatsAppLink, getGeneralInquiryMessage } from '@/lib/whatsapp';

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

  const handleWhatsAppClick = () => {
    const link = getWhatsAppLink(getGeneralInquiryMessage());
    window.open(link, '_blank');
    closeMobileMenus();
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            
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

            <Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            <CurrencySwitcher />
            
            {/* Desktop WhatsApp Icon */}
            <button 
              onClick={handleWhatsAppClick}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-full transition-colors"
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>

            <Link href="/contact" className="btn-primary">
              Contact
            </Link>
          </div>

          {/* Tablet Navigation - Optimized */}
          <div className="hidden md:flex lg:hidden items-center justify-between flex-1 ml-4">
            <div className="flex items-center space-x-3 xl:space-x-4">
              <Link href="/about" className="text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap">About</Link>
              
              {/* Services Dropdown Tablet */}
              <div className="relative services-dropdown">
                <button 
                  id="services-button"
                  onClick={() => setServicesOpen(!isServicesOpen)}
                  className="inline-flex items-center text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap"
                >
                  Services
                  <svg className={`ml-1 h-3 w-3 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className={`absolute left-0 xl:left-auto xl:right-0 bg-white shadow-lg rounded-md mt-2 w-72 z-50 transition-all duration-200 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <Link href="/services" className="block px-4 py-3 text-sm font-medium text-primary border-b border-gray-100 hover:bg-lightGray whitespace-nowrap" onClick={() => setServicesOpen(false)}>
                    All Services
                  </Link>
                  {serviceLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="block px-4 py-2.5 text-sm text-darkText hover:bg-lightGray transition-colors whitespace-nowrap" onClick={() => setServicesOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link href="/portfolio" className="text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap">Portfolio</Link>
              <Link href="/courses" className="text-sm font-medium hover:text-secondary transition-colors whitespace-nowrap">Courses</Link>
            </div>
            
            <div className="flex items-center space-x-1.5 xl:space-x-2">
               <button 
                onClick={handleWhatsAppClick}
                className="text-green-600 hover:text-green-700 p-1.5"
                title="Chat on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
              <div className="scale-90">
                <CurrencySwitcher />
              </div>
              <Link href="/contact" className="bg-primary text-white px-2 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle mobile menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white px-4 sm:px-6 pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/about" onClick={closeMobileMenus}>About</Link>
              <div>
                <button onClick={() => setMobileServicesOpen(!isMobileServicesOpen)} className="flex items-center justify-between w-full text-left">
                  Services
                  <svg className={`h-5 w-5 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isMobileServicesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
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
                
                {/* Mobile WhatsApp Button */}
                <button 
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center space-x-2 py-2 mb-3 border-2 border-green-500 text-green-600 rounded-lg font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span>Chat on WhatsApp</span>
                </button>

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