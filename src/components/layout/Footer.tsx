// src/components/layout/Footer.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useServices } from '@/hooks/useServices';

const Footer = () => {
  const { services: serviceLinks } = useServices();
  return (
    <footer className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 py-16 relative">
        {/* Hero Logo Section - Enhanced with Text */}
        <div className="text-center mb-16">
          <div className="inline-block">
            {/* Logo and Text Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <Image
                src="/hexadigitall-logo-transparent.png"
                alt="Hexadigitall Logo"
                width={500}
                height={150}
                className="h-24 sm:h-32 w-auto filter brightness-110"
                priority
              />
              <div className="text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-2">
                  Hexadigitall
                </h2>
                <p className="text-base sm:text-lg text-accent font-medium">
                  Digital Solutions
                </p>
              </div>
            </div>
            
            <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
              From Idea to Impact. Your All-in-One Digital Partner.
            </p>
            <div className="w-20 h-1 bg-accent mx-auto mt-4 rounded-full" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-accent/30 pb-2 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-300 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-accent/30 pb-2 mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-accent hover:text-white font-medium transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent rounded-full mr-3 group-hover:bg-white transition-colors duration-300" />
                  All Services
                </Link>
              </li>
              {serviceLinks.slice(0, 4).map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="text-gray-300 hover:text-accent transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-accent/30 pb-2 mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-accent/30 pb-2 mb-4">
              Stay Updated
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest updates on digital trends and our services.
            </p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-300"
              />
              <button className="bg-accent hover:bg-accent/80 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                Subscribe
              </button>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-4">
              {/* Twitter */}
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors duration-300 group" title="Follow us on Twitter">
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors duration-300 group" title="Follow us on Instagram">
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors duration-300 group" title="Connect on LinkedIn">
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Hexadigitall. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-400">Made with ❤️ in Nigeria</span>
              <div className="flex items-center space-x-2 text-gray-400">
                <span>Built with</span>
                <span className="text-accent font-medium">Next.js</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;