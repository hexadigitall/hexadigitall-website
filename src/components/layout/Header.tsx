// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useShoppingCart } from 'use-shopping-cart';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isMobileServicesOpen, setMobileServicesOpen] = useState(false);

  const { cartCount, cartDetails, removeItem, formattedTotalPrice, redirectToCheckout } = useShoppingCart();
  const [isCartOpen, setCartOpen] = useState(false);

  // ✅ Corrected and completed service links array
  const serviceLinks = [
    { href: "/services/business-plan-and-logo-design", label: "Business Plan & Logo" },
    { href: "/services/web-and-mobile-software-development", label: "Web & Mobile Dev" },
    { href: "/services/social-media-advertising-and-marketing", label: "Social Media Marketing" },
    { href: "/services/profile-and-portfolio-building", label: "Profile & Portfolio Building" },
    { href: "/services/mentoring-and-consulting", label: "Mentoring & Consulting" },
  ];

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
        setCartOpen(false); // Also close cart on escape
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartDetails),
      });
      const session = await response.json();
      if (session.id) {
        redirectToCheckout(session.id);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };


  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/hexadigitall-logo-transparent.png"
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
                className="inline-flex items-center hover:text-secondary transition-colors"
              >
                Services
                <svg className={`ml-1 h-5 w-5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`absolute left-0 bg-white shadow-lg rounded-md mt-2 w-60 z-50 transition-all duration-200 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
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
          
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setCartOpen(true)} className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartCount! > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <Link href="/contact" className="btn-primary">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setCartOpen(true)} className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartCount! > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white px-6 pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <div>
                <button onClick={() => setMobileServicesOpen(!isMobileServicesOpen)} className="flex items-center justify-between w-full text-left">
                  Services
                  <svg className={`h-5 w-5 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isMobileServicesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    <Link href="/services" className="block text-sm text-primary font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                      All Services
                    </Link>
                    {serviceLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="block text-sm text-darkText py-1 hover:text-secondary" onClick={() => setMobileMenuOpen(false)}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
              <Link href="/courses" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>FAQs</Link>
              <Link href="/contact" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold font-heading">Your Cart</h2>
            <button onClick={() => setCartOpen(false)} className="text-2xl">&times;</button>
          </div>
          <div className="flex-grow p-6 overflow-y-auto">
            {cartCount === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              Object.values(cartDetails ?? {}).map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4 mb-4">
                  <div className="flex items-center">
                    <Image src={item.image!} alt={item.name} width={64} height={64} className="rounded-md mr-4 object-cover" />
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.formattedValue}</p>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-xl">&times;</button>
                </div>
              ))
            )}
          </div>
          {cartCount! > 0 && (
            <div className="p-6 border-t">
              <div className="flex justify-between items-center font-bold text-lg mb-4">
                <span>Total</span>
                <span>{formattedTotalPrice}</span>
              </div>
              <button onClick={handleCheckout} className="btn-primary w-full text-center">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
      {isCartOpen && <div onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/50 z-40"></div>}
    </>
  );
};

export default Header;