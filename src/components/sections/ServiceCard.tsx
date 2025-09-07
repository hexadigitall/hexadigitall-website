// src/components/sections/ServiceCard.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

const ServiceCard = ({ icon, title, description, href }: ServiceCardProps) => {
  return (
    <Link href={href} className="block p-8 bg-lightGray rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="text-secondary mb-4">{icon}</div>
      <h3 className="text-xl font-bold font-heading mb-2">{title}</h3>
      <p className="text-darkText">{description}</p>
    </Link>
  );
};

export default ServiceCard;