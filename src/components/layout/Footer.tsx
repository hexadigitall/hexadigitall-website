// src/components/layout/Footer.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useServices } from '@/hooks/useServices';

const Footer = () => {
  const { services: serviceLinks } = useServices();
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Hexadigitall */}
          <div className="col-span-1">
            <div className="mb-4">
              <Image
                src="/hexadigitall-logo.svg"
                alt="Hexadigitall Logo"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-gray-300">From Idea to Impact. Your All-in-One Digital Partner.</p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link href="/portfolio" className="text-gray-300 hover:text-white">Portfolio</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQs</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="text-gray-300 hover:text-white font-medium">All Services</Link></li>
              {serviceLinks.slice(0, 4).map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="text-gray-300 hover:text-white">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
            </ul>
            {/* Add Social Media Icons here */}
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Hexadigitall. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;