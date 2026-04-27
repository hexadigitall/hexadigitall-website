// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import { getWhatsAppLink, getGeneralInquiryMessage } from '@/lib/whatsapp';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isExploreOpen, setExploreOpen] = useState(false);
  const [isCompanyOpen, setCompanyOpen] = useState(false);
  const [isAccountOpen, setAccountOpen] = useState(false);
  const [isMobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(72);
  const headerRef = useRef<HTMLElement>(null);
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  };

  const themeLabel = theme === 'light' ? 'Switch to dark mode' : theme === 'dark' ? 'Switch to system mode' : 'Switch to light mode';

  // Service links array
  const serviceLinks = [
    { href: "/services/business-plan-and-logo-design", label: "Business Plan & Logo" },
    { href: "/services/web-and-mobile-software-development", label: "Web & Mobile Dev" },
    { href: "/services/social-media-advertising-and-marketing", label: "Social Media Marketing" },
    { href: "/services/profile-and-portfolio-building", label: "Profile & Portfolio Building" },
    { href: "/services/mentoring-and-consulting", label: "Mentoring & Consulting" },
  ];

  const desktopMenuTriggerClass = "inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-darkText dark:text-slate-200 transition-colors hover:bg-lightGray dark:hover:bg-slate-800 hover:text-secondary whitespace-nowrap";
  const tabletMenuTriggerClass = "inline-flex items-center rounded-full px-2.5 py-1.5 text-sm font-medium text-darkText dark:text-slate-200 transition-colors hover:bg-lightGray dark:hover:bg-slate-800 hover:text-secondary whitespace-nowrap";
  const dropdownPanelBaseClass = "absolute bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200 dark:border-slate-700 mt-2 z-50 transition-all duration-200";
  const dropdownItemClass = "block px-4 py-2.5 text-sm text-darkText dark:text-slate-200 hover:bg-lightGray dark:hover:bg-slate-800 transition-colors";
  const dropdownHighlightItemClass = "block px-4 py-2.5 text-sm font-semibold text-primary dark:text-cyan-400 hover:bg-lightGray dark:hover:bg-slate-800 transition-colors";

  // Helper function to close all mobile menus
  const closeMobileMenus = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const closeDesktopMenus = () => {
    setServicesOpen(false);
    setExploreOpen(false);
    setCompanyOpen(false);
    setAccountOpen(false);
  };

  const handleWhatsAppClick = () => {
    const link = getWhatsAppLink(getGeneralInquiryMessage());
    window.open(link, '_blank');
    closeMobileMenus();
  };

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(Math.ceil(headerRef.current.getBoundingClientRect().height));
      }
    };

    updateHeaderHeight();

    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('orientationchange', updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('orientationchange', updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    // Lock body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.nav-dropdown')) {
        closeDesktopMenus();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDesktopMenus();
        setMobileServicesOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header ref={headerRef} className="bg-white dark:bg-slate-950 shadow-md sticky top-0 z-50 border-b border-transparent dark:border-slate-800">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center min-h-[72px] relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0" onClick={closeMobileMenus}>
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
          <div className="hidden lg:flex items-center space-x-3 rounded-full border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-2 py-1 shadow-sm backdrop-blur-sm">
            {/* Services Dropdown */}
            <div className="relative nav-dropdown">
              <button 
                onClick={() => setServicesOpen(!isServicesOpen)}
                onKeyDown={(e) => e.key === 'Enter' && setServicesOpen(!isServicesOpen)}
                className={desktopMenuTriggerClass}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
                aria-label="Services menu"
              >
                Services
                <svg className={`ml-1 h-5 w-5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`absolute left-0 lg:left-auto lg:right-0 w-64 ${dropdownPanelBaseClass} ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`} role="menu" aria-labelledby="services-button">
                <Link href="/services" className="block px-4 py-3 text-sm font-medium text-primary border-b border-gray-100 dark:border-slate-700 hover:bg-lightGray dark:hover:bg-slate-800 rounded-t-2xl" onClick={() => setServicesOpen(false)}>
                  All Services
                </Link>
                {serviceLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={dropdownItemClass} onClick={() => setServicesOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative nav-dropdown">
              <button
                onClick={() => setExploreOpen(!isExploreOpen)}
                onKeyDown={(e) => e.key === 'Enter' && setExploreOpen(!isExploreOpen)}
                className={desktopMenuTriggerClass}
                aria-expanded={isExploreOpen}
                aria-haspopup="true"
                aria-label="Explore menu"
              >
                Explore
                <svg className={`ml-1 h-5 w-5 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`absolute left-0 lg:left-auto lg:right-0 w-56 ${dropdownPanelBaseClass} ${isExploreOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <Link href="/courses" className={dropdownItemClass} onClick={closeDesktopMenus}>
                  Courses
                </Link>
                <Link href="/mentorships" className={dropdownHighlightItemClass} onClick={closeDesktopMenus}>
                  Mentorships
                </Link>
                <Link href="/portfolio" className={dropdownItemClass} onClick={closeDesktopMenus}>
                  Portfolio
                </Link>
              </div>
            </div>

            <div className="relative nav-dropdown">
              <button
                onClick={() => setCompanyOpen(!isCompanyOpen)}
                onKeyDown={(e) => e.key === 'Enter' && setCompanyOpen(!isCompanyOpen)}
                className={desktopMenuTriggerClass}
                aria-expanded={isCompanyOpen}
                aria-haspopup="true"
                aria-label="Company menu"
              >
                Company
                <svg className={`ml-1 h-5 w-5 transition-transform duration-200 ${isCompanyOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`absolute left-0 lg:left-auto lg:right-0 w-48 ${dropdownPanelBaseClass} ${isCompanyOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <Link href="/about" className={dropdownItemClass} onClick={closeDesktopMenus}>
                  About
                </Link>
                <Link href="/blog" className={dropdownItemClass} onClick={closeDesktopMenus}>
                  Blog
                </Link>
                <Link href="/faq" className={dropdownItemClass} onClick={closeDesktopMenus}>
                  FAQs
                </Link>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-3">
            <div className="relative nav-dropdown">
              <button
                onClick={() => setAccountOpen(!isAccountOpen)}
                className="inline-flex items-center rounded-full border border-primary/30 dark:border-cyan-400/40 bg-primary/5 dark:bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-primary dark:text-cyan-300 transition-colors hover:border-primary/40 dark:hover:border-cyan-400/60 hover:bg-primary/10 dark:hover:bg-cyan-400/15"
                aria-expanded={isAccountOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                Account
                <svg className={`ml-1 h-4 w-4 transition-transform duration-200 ${isAccountOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`absolute right-0 w-52 ${dropdownPanelBaseClass} ${isAccountOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <Link href="/student/login" className={dropdownItemClass} onClick={closeDesktopMenus}>
                  Student Login
                </Link>
                <Link href="/teacher/login" className={dropdownItemClass} onClick={closeDesktopMenus}>
                  Teacher Login
                </Link>
                <Link href="/teacher/signup" className={dropdownHighlightItemClass} onClick={closeDesktopMenus}>
                  Apply to Teach
                </Link>
              </div>
            </div>
            <CurrencySwitcher />
            
            {/* Desktop Theme Toggle */}
            <button
              onClick={cycleTheme}
              aria-label={themeLabel}
              title={themeLabel}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                /* Moon icon */
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : theme === 'system' ? (
                /* Monitor icon */
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              ) : (
                /* Sun icon */
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

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

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center justify-between flex-1 ml-4">
            <div className="flex items-center space-x-2 rounded-full border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-2 py-1 shadow-sm backdrop-blur-sm">
              {/* Services Dropdown Tablet */}
              <div className="relative nav-dropdown">
                <button 
                  id="services-button"
                  onClick={() => setServicesOpen(!isServicesOpen)}
                  className={tabletMenuTriggerClass}
                >
                  Services
                  <svg className={`ml-1 h-3 w-3 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className={`absolute left-0 xl:left-auto xl:right-0 w-72 ${dropdownPanelBaseClass} ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <Link href="/services" className="block px-4 py-3 text-sm font-medium text-primary dark:text-cyan-400 border-b border-gray-100 dark:border-slate-700 hover:bg-lightGray dark:hover:bg-slate-800 whitespace-nowrap rounded-t-2xl" onClick={() => setServicesOpen(false)}>
                    All Services
                  </Link>
                  {serviceLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={`${dropdownItemClass} whitespace-nowrap`} onClick={() => setServicesOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative nav-dropdown">
                <button
                  onClick={() => setExploreOpen(!isExploreOpen)}
                  className={tabletMenuTriggerClass}
                >
                  Explore
                  <svg className={`ml-1 h-3 w-3 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className={`absolute left-0 xl:left-auto xl:right-0 w-56 ${dropdownPanelBaseClass} ${isExploreOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <Link href="/courses" className={`${dropdownItemClass} whitespace-nowrap`} onClick={closeDesktopMenus}>
                    Courses
                  </Link>
                  <Link href="/mentorships" className={`${dropdownHighlightItemClass} whitespace-nowrap`} onClick={closeDesktopMenus}>
                    Mentorships
                  </Link>
                  <Link href="/portfolio" className={`${dropdownItemClass} whitespace-nowrap`} onClick={closeDesktopMenus}>
                    Portfolio
                  </Link>
                </div>
              </div>

              <div className="relative nav-dropdown">
                <button
                  onClick={() => setCompanyOpen(!isCompanyOpen)}
                  className={tabletMenuTriggerClass}
                >
                  Company
                  <svg className={`ml-1 h-3 w-3 transition-transform duration-200 ${isCompanyOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className={`absolute left-0 xl:left-auto xl:right-0 w-48 ${dropdownPanelBaseClass} ${isCompanyOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <Link href="/about" className={`${dropdownItemClass} whitespace-nowrap`} onClick={closeDesktopMenus}>
                    About
                  </Link>
                  <Link href="/blog" className={`${dropdownItemClass} whitespace-nowrap`} onClick={closeDesktopMenus}>
                    Blog
                  </Link>
                  <Link href="/faq" className={`${dropdownItemClass} whitespace-nowrap`} onClick={closeDesktopMenus}>
                    FAQs
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5 xl:space-x-2">
              <div className="relative nav-dropdown">
                <button
                  onClick={() => setAccountOpen(!isAccountOpen)}
                  className="inline-flex items-center rounded-full border border-primary/30 dark:border-cyan-400/40 bg-primary/5 dark:bg-cyan-400/10 px-2.5 py-1.5 text-xs font-semibold text-primary dark:text-cyan-300 transition-colors hover:border-primary/40 dark:hover:border-cyan-400/60 hover:bg-primary/10 dark:hover:bg-cyan-400/15 whitespace-nowrap"
                >
                  Account
                  <svg className={`ml-1 h-3 w-3 transition-transform duration-200 ${isAccountOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className={`absolute right-0 w-52 ${dropdownPanelBaseClass} ${isAccountOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <Link href="/student/login" className={dropdownItemClass} onClick={closeDesktopMenus}>
                    Student Login
                  </Link>
                  <Link href="/teacher/login" className={dropdownItemClass} onClick={closeDesktopMenus}>
                    Teacher Login
                  </Link>
                  <Link href="/teacher/signup" className={dropdownHighlightItemClass} onClick={closeDesktopMenus}>
                    Apply to Teach
                  </Link>
                </div>
              </div>
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
              {/* Tablet Theme Toggle */}
              <button
                onClick={cycleTheme}
                aria-label={themeLabel}
                title={themeLabel}
                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : theme === 'system' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
              </button>
              <Link href="/contact" className="bg-primary text-white px-2 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button - Animates between Hamburger and Close X */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} 
              aria-label="Toggle mobile menu"
              className="p-2 -mr-2 text-darkText dark:text-slate-200"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              )}
            </button>
          </div>

        {/* MOBILE MENU OVERLAY & BACKDROP */}
        {isMobileMenuOpen && (
          <>
            {/* Fixed Mobile Menu Top Bar (always visible with close affordance) */}
            <div
              className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-950 shadow-md border-b border-gray-100 dark:border-slate-800 z-[60] md:hidden"
              style={{ height: `${headerHeight}px` }}
            >
              <div className="h-full container mx-auto px-4 sm:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center" onClick={closeMobileMenus} aria-label="Go to homepage">
                  <Image
                    src="/hexadigitall-logo-transparent.png"
                    alt="Hexadigitall Logo"
                    width={150}
                    height={50}
                    className="h-8 w-auto"
                    priority
                  />
                </Link>

                <button
                  onClick={closeMobileMenus}
                  aria-label="Close mobile menu"
                  className="p-2 text-darkText dark:text-slate-200 hover:text-primary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* The Backdrop: Catches clicks outside the menu */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              style={{ top: `${headerHeight}px` }} 
              onClick={closeMobileMenus}
              aria-hidden="true"
            ></div>

            {/* The Menu Panel: Floats over content */}
            <div
              className="fixed left-0 right-0 bg-white dark:bg-slate-950 z-50 shadow-xl border-t border-gray-100 dark:border-slate-800 md:hidden animate-in slide-in-from-top-2 duration-200 overflow-y-auto"
              style={{ top: `${headerHeight}px`, maxHeight: `calc(100dvh - ${headerHeight}px)` }}
            >
              <div className="px-4 sm:px-6 pb-4 pt-3 flex flex-col space-y-1">
                
                {/* 1. Quick Access Row (About | Portfolio | FAQ) */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2 mb-1">
                  <Link href="/about" onClick={closeMobileMenus} className="text-sm font-medium text-darkText dark:text-slate-200 hover:text-secondary py-2 flex-1 text-left">About</Link>
                  <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div> {/* Divider */}
                  <Link href="/portfolio" onClick={closeMobileMenus} className="text-sm font-medium text-darkText dark:text-slate-200 hover:text-secondary py-2 flex-1 text-center">Portfolio</Link>
                  <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div> {/* Divider */}
                  <Link href="/faq" onClick={closeMobileMenus} className="text-sm font-medium text-darkText dark:text-slate-200 hover:text-secondary py-2 flex-1 text-right">FAQ</Link>
                </div>
                
                {/* Mobile Services Accordion */}
                <div className="border-b border-gray-100 dark:border-slate-800 pb-1">
                  <button 
                    onClick={() => setMobileServicesOpen(!isMobileServicesOpen)} 
                    className="flex items-center justify-between w-full text-left text-sm py-2 font-medium text-darkText dark:text-slate-200 hover:text-secondary transition-colors"
                  >
                    Services
                    <svg className={`h-5 w-5 text-gray-400 dark:text-slate-400 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Smooth expand for services */}
                  <div className={`overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <div className="ml-4 space-y-1">
                      <Link href="/services" className="block text-sm text-primary dark:text-cyan-400 font-medium py-1.5" onClick={closeMobileMenus}>
                        All Services
                      </Link>
                      {serviceLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="block text-sm text-darkText dark:text-slate-200 py-1.5 hover:text-secondary transition-colors" onClick={closeMobileMenus}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link href="/courses" onClick={closeMobileMenus} className="block text-sm py-1.5 text-darkText dark:text-slate-200 hover:text-secondary font-medium transition-colors">Courses</Link>
                <Link
                  href="/mentorships"
                  onClick={closeMobileMenus}
                  className="block text-sm py-2 px-3 rounded-lg border border-primary/15 dark:border-cyan-400/30 bg-primary/5 dark:bg-cyan-400/10 text-primary dark:text-cyan-300 font-semibold hover:bg-primary/10 dark:hover:bg-cyan-400/15 transition-colors"
                >
                  Mentorships
                </Link>
                <Link href="/blog" onClick={closeMobileMenus} className="block text-sm py-1.5 text-darkText dark:text-slate-200 hover:text-secondary font-medium transition-colors">Blog</Link>
                <Link href="/student/login" onClick={closeMobileMenus} className="block text-sm py-1.5 text-darkText dark:text-slate-200 hover:text-secondary font-medium transition-colors">Student Login</Link>
                <Link href="/teacher/login" onClick={closeMobileMenus} className="block text-sm py-1.5 text-darkText dark:text-slate-200 hover:text-secondary font-medium transition-colors">Teacher Login</Link>
                <Link href="/teacher/signup" onClick={closeMobileMenus} className="block text-sm py-1.5 text-primary dark:text-cyan-400 font-semibold hover:text-primary/80 dark:hover:text-cyan-300 transition-colors">Apply to Teach</Link>
                
                {/* Action Area (Bottom) - Compacted Spacing */}
                <div className="pt-2 mt-1 border-t border-gray-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-slate-300">Currency:</span>
                    <CurrencySwitcher position="inline" showLabel={false} />
                  </div>

                  {/* Mobile Theme Toggle */}
                  <button
                    onClick={cycleTheme}
                    className="w-full flex items-center justify-between py-2 mb-2 text-sm font-medium text-darkText dark:text-slate-200 hover:text-secondary transition-colors"
                    aria-label={themeLabel}
                  >
                    <span>
                      {theme === 'dark' ? 'Dark mode' : theme === 'system' ? 'System theme' : 'Light mode'}
                    </span>
                    {theme === 'dark' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    ) : theme === 'system' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    )}
                  </button>
                  
                  <button 
                    onClick={handleWhatsAppClick}
                    className="w-full flex items-center justify-center space-x-2 py-2 mb-2 border-2 border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </button>

                  <Link href="/contact" className="btn-primary text-center block w-full py-2" onClick={closeMobileMenus}>
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
        </nav>
      </header>
    </>
  );
};

export default Header;