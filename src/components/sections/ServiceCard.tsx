// src/components/sections/ServiceCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  backgroundImage?: string;
}

// Service background images mapping
const getServiceImage = (title: string): string => {
  const imageMap: { [key: string]: string } = {
    'Business Plan & Logo': '/assets/images/services/service-consulting.jpg',
    'Web & Mobile Development': '/assets/images/services/service-web-development.jpg',
    'Social Media Marketing': '/digitall_partner.png', // fallback
    'Profile & Portfolio Building': '/digitall_partner.png', // fallback
    'Mentoring & Consulting': '/assets/images/services/service-consulting.jpg',
  };
  return imageMap[title] || '/digitall_partner.png';
};

const ServiceCard = ({ icon, title, description, href, backgroundImage }: ServiceCardProps) => {
  const serviceImage = backgroundImage || getServiceImage(title);
  
  return (
    <Link 
      href={href} 
      className="block group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl card-enhanced"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Image
          src={serviceImage}
          alt={`${title} background`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Icon with gradient background */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold font-heading mb-3 text-gray-900 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-darkText leading-relaxed mb-4">
          {description}
        </p>
        
        {/* Call to action */}
        <div className="flex items-center text-secondary font-semibold group-hover:text-primary transition-colors duration-300">
          <span>Learn more</span>
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
};

export default ServiceCard;