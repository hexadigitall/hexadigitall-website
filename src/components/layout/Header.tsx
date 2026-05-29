"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import { getWhatsAppLink, getGeneralInquiryMessage } from '@/lib/whatsapp';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileServicesOpen, setMobileServicesOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  };

  const serviceLinks = [
    { href: "/services/business-plan-and-logo-design", label: "Business Plan & Logo" },
    { href: "/services/web-and-mobile-software-development", label: "Web & Mobile Dev" },
    { href: "/services/social-media-advertising-and-marketing", label: "Social Media Marketing" },
    { href: "/services/profile-and-portfolio-building", label: "Profile & Portfolio Building" },
    { href: "/services/mentoring-and-consulting", label: "Mentoring & Consulting" },
  ];

  const closeAll = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileServicesOpen(false);
  };

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppLink(getGeneralInquiryMessage()), '_blank');
    closeAll();
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const NavItem = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
    <div className="relative nav-dropdown">
      <button 
        onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
        className="inline-flex items-center rounded-full px-2 lg:px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        {label}
        <ChevronDownIcon className={`ml-1 h-3 w-3 transition-transform duration-200 ${activeDropdown === id ? 'rotate-180' : ''}`} />
      </button>
      {activeDropdown === id && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );

  const DropdownLink = ({ href, label, highlight = false }: { href: string; label: string; highlight?: boolean }) => (
    <Link 
      href={href} 
      onClick={closeAll}
      className={`block px-5 py-3 text-sm transition-colors ${highlight ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
    >
      {label}
    </Link>
  );

  return (
    <header ref={headerRef} className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100 dark:border-slate-800">
      <nav className="container mx-auto px-4 lg:px-8 h-[72px] md:h-[80px] flex justify-between items-center gap-2">
        {/* Logo */}
        <Link href="/" onClick={closeAll} className="flex-shrink-0">
          <Image
            src="/hexadigitall-logo-transparent.png"
            alt="Hexadigitall"
            width={160}
            height={50}
            className="h-7 md:h-10 w-auto"
            priority
          />
        </Link>

        {/* Navigation - CHANGED TO MD:FLEX (768px+) for Laptops */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <NavItem label="Services" id="services">
            <DropdownLink href="/services" label="All Services" highlight />
            {serviceLinks.map(l => <DropdownLink key={l.href} href={l.href} label={l.label} />)}
          </NavItem>

          <NavItem label="Explore" id="explore">
            <DropdownLink href="/courses" label="Courses" />
            <DropdownLink href="/store" label="Store" highlight />
            <DropdownLink href="/mentorships" label="Mentorships" />
            <DropdownLink href="/portfolio" label="Portfolio" />
            <DropdownLink href="/publications" label="Library" />
          </NavItem>

          <NavItem label="Company" id="company">
            <DropdownLink href="/about" label="About Us" />
            <DropdownLink href="/blog" label="Blog" />
            <DropdownLink href="/faq" label="FAQs" highlight />
          </NavItem>
        </div>

        {/* Desktop Actions - MD:FLEX */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <div className="relative group">
             <button className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800 px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-bold border border-slate-200 dark:border-slate-700">
               <span>Account</span>
               <ChevronDownIcon className="h-3 w-3" />
             </button>
             <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[110]">
                <DropdownLink href="/student/login" label="Student Login" />
                <DropdownLink href="/teacher/login" label="Teacher Login" />
                <DropdownLink href="/teacher/signup" label="Apply to Teach" highlight />
             </div>
          </div>
          
          <div className="scale-90 lg:scale-100">
            <CurrencySwitcher />
          </div>
          
          <button onClick={cycleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            {theme === 'dark' ? '🌙' : theme === 'system' ? '🖥️' : '☀️'}
          </button>

          <Link href="/contact" className="hidden lg:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg transition-all">
            Contact
          </Link>
        </div>

        {/* Mobile Toggle - ONLY BELOW MD (768px) */}
        <div className="md:hidden flex items-center space-x-3">
          <CurrencySwitcher />
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-900 dark:text-white relative z-[120]">
            {isMobileMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Menu Overlay - FIXED CONTENT VISIBILITY */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[110] md:hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={closeAll}></div>
            
            {/* Panel */}
            <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 z-[120]">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Navigation</span>
                <button onClick={closeAll} className="p-1"><XMarkIcon className="h-6 w-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-4">
                  <Link href="/courses" onClick={closeAll} className="block text-xl font-bold text-slate-900 dark:text-white">Courses</Link>
                  <Link href="/store" onClick={closeAll} className="block text-xl font-bold text-blue-600 dark:text-blue-400">Store</Link>
                  <Link href="/mentorships" onClick={closeAll} className="block text-xl font-bold text-slate-900 dark:text-white">Mentorships</Link>
                  <Link href="/publications" onClick={closeAll} className="block text-xl font-bold text-slate-900 dark:text-white">Library</Link>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Services</p>
                   {serviceLinks.map(l => (
                     <Link key={l.href} href={l.href} onClick={closeAll} className="block text-base font-medium text-slate-600 dark:text-slate-300">{l.label}</Link>
                   ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Link href="/student/login" onClick={closeAll} className="block font-bold">Student Login</Link>
                  <Link href="/teacher/login" onClick={closeAll} className="block font-bold">Teacher Login</Link>
                  <button onClick={cycleTheme} className="w-full text-left font-bold flex justify-between items-center">
                    <span>Theme</span>
                    <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
                  </button>
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                 <Link href="/contact" onClick={closeAll} className="block w-full bg-blue-600 text-white py-4 rounded-2xl text-center font-black uppercase tracking-widest shadow-lg">Contact Us</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
