// src/components/sections/WhyChooseUs.tsx
import Image from 'next/image';
import { ReactNode } from 'react';
import { FaSyncAlt, FaChartLine, FaHandsHelping } from 'react-icons/fa';

// A small, reusable component for each feature item
const FeatureItem = ({ icon, title, children }: { icon: ReactNode, title: string, children: ReactNode }) => (
  <div className="flex">
    <div className="flex-shrink-0 mr-4">
      <div className="bg-secondary text-white rounded-full h-12 w-12 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-xl font-bold font-heading">{title}</h3>
      <p className="mt-1 text-darkText">{children}</p>
    </div>
  </div>
);

const WhyChooseUs = () => {
  return (
    <section className="bg-lightGray py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Column 1: Image */}
          <div className="relative h-80 md:h-full w-full rounded-lg shadow-lg overflow-hidden">
             <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
              alt="Diverse team collaborating on a project"
              layout="fill"
              objectFit="cover"
            />
          </div>
          
          {/* Column 2: Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">Why Partner With Hexadigitall?</h2>
            <div className="space-y-8">
              <FeatureItem icon={<FaSyncAlt size={24} />} title="Holistic Approach">
                We don't just build software; we build businesses. Our services are integrated to provide a seamless journey from concept to market launch.
              </FeatureItem>
              <FeatureItem icon={<FaChartLine size={24} />} title="Data-Driven Strategies">
                Every decision is backed by data. We leverage analytics to optimize your marketing, development, and overall business strategy for maximum impact.
              </FeatureItem>
              <FeatureItem icon={<FaHandsHelping size={24} />} title="Mentorship Focus">
                We succeed when you succeed. Beyond services, we offer genuine mentorship and consulting to empower you with the knowledge to grow.
              </FeatureItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;