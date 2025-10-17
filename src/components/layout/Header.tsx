// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSafeShoppingCart } from '@/hooks/useSafeShoppingCart';
import "@/types/shopping-cart"; // Import CartDetails type extension
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';

type CartItem = {
  id: string;
  name: string;
  image?: string;
  formattedValue?: string;
};

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isMobileServicesOpen, setMobileServicesOpen] = useState(false);

  // Shopping cart with fallback for testing
  const { cartCount, cartDetails, removeItem, formattedTotalPrice, isAvailable } = useSafeShoppingCart();
  const [isCartOpen, setCartOpen] = useState(false);
  
  // Debug cart state changes
  useEffect(() => {
    console.log('Cart state changed:', isCartOpen);
  }, [isCartOpen]);

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
        setCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    // Handle body class for desktop cart push effect
    if (typeof window !== 'undefined') {
      if (isCartOpen && window.innerWidth >= 1024) {
        document.body.classList.add('cart-open');
        // Add CSS for cart open state
        const style = document.createElement('style');
        style.id = 'cart-push-styles';
        style.textContent = `
          @media (min-width: 1024px) {
            body.cart-open {
              margin-right: 384px;
              transition: margin-right 300ms ease-in-out;
            }
          }
        `;
        if (!document.getElementById('cart-push-styles')) {
          document.head.appendChild(style);
        }
      } else {
        document.body.classList.remove('cart-open');
      }
    }
  }, [isCartOpen]);

  const handleCheckout = async () => {
    console.log('🛒 Checkout button clicked');
    console.log('Cart available:', isAvailable);
    console.log('Cart details:', cartDetails);
    console.log('Cart count:', cartCount);
    
    try {
      if (!isAvailable) {
        console.log('❌ Cart not available, redirecting to contact');
        alert('Checkout is temporarily unavailable. Please contact us to complete your purchase.');
        window.location.href = '/contact';
        return;
      }

      if (!cartDetails || Object.keys(cartDetails).length === 0) {
        console.log('❌ Cart is empty');
        alert('Your cart is empty. Please add items before checkout.');
        return;
      }

      console.log('📤 Sending checkout request...');
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartDetails),
      });
      
      console.log('📥 Checkout response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Checkout response error (status:', response.status, '):', errorText);
        
        // Try to parse the error response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
          console.error('❌ Parsed error data:', errorData);
        } catch {
          console.error('❌ Could not parse error response as JSON');
        }
        
        throw new Error(errorMessage);
      }
      
      const session = await response.json();
      console.log('✅ Session received:', session);
      
      if (session.error) {
        console.error('❌ Session error:', session.error);
        if (session.details) {
          console.error('❌ Error details:', session.details);
        }
        throw new Error(session.error);
      }
      
      if (session.id && session.url) {
        console.log('🚀 Redirecting to Stripe checkout:', session.id);
        console.log('🔗 Checkout URL:', session.url);
        // Redirect directly to Stripe's checkout URL
        window.location.href = session.url;
      } else {
        console.error('❌ No session ID or URL received:', session);
        throw new Error('No session ID or checkout URL received from server');
      }
    } catch (error) {
      console.error('💥 Checkout failed:', error);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`);
    }
  };


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
            <button onClick={() => { console.log('Desktop cart button clicked'); setCartOpen(true); }} className="relative" aria-label={`Shopping cart with ${cartCount || 0} items`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartCount && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" aria-label={`${cartCount} items in cart`}>{cartCount}</span>
              )}
            </button>
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
            
            {/* Right actions - Currency, Cart, Contact */}
            <div className="flex items-center space-x-1.5 xl:space-x-2">
              <div className="scale-90">
                <CurrencySwitcher />
              </div>
              <button onClick={() => { console.log('Tablet cart button clicked'); setCartOpen(true); }} className="relative p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cartCount && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-3.5 w-3.5 flex items-center justify-center">{cartCount}</span>
                )}
              </button>
              <Link href="/contact" className="bg-primary text-white px-2 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button - Only show on small screens */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => { console.log('Mobile cart button clicked'); setCartOpen(true); }} className="relative" aria-label={`Shopping cart with ${cartCount || 0} items`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartCount && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" aria-label={`${cartCount} items in cart`}>{cartCount}</span>
              )}
            </button>
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

      {/* Cart Side Panel - Enhanced with slide behavior */}
      {isCartOpen && (
        <>
          {/* Background Overlay */}
          <div 
            onClick={() => setCartOpen(false)} 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out lg:hidden"
          />
          
          {/* Cart Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md lg:max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                <h2 className="text-2xl font-bold font-heading text-primary">Your Cart</h2>
                <button 
                  onClick={() => { console.log('Cart close button clicked'); setCartOpen(false); }}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Close cart"
                >
                  &times;
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {(!cartCount || cartCount === 0) ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add some services to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.values(cartDetails ?? {}).map((item) => {
                      const cartItem = item as CartItem;
                      return (
                        <div key={cartItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center flex-1">
                            {cartItem.image ? (
                              <Image src={cartItem.image} alt={cartItem.name} width={64} height={64} className="rounded-md mr-4 object-cover" sizes="64px" />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-primary truncate">{cartItem.name}</p>
                              <p className="text-sm text-green-600 font-medium">{cartItem.formattedValue}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeItem(cartItem.id)} 
                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors duration-200 ml-4"
                            aria-label={`Remove ${cartItem.name} from cart`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {cartCount && cartCount > 0 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between items-center font-bold text-xl mb-4 text-primary">
                    <span>Total</span>
                    <span className="text-green-600">{formattedTotalPrice}</span>
                  </div>
                  <button 
                    onClick={handleCheckout} 
                    className="btn-primary w-full text-center py-4 text-lg font-semibold"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
