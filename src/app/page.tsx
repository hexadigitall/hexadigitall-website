// src/app/page.tsx

import Hero from '@/components/sections/Hero';
import ServicesOverview from '@/components/sections/ServicesOverview';
import FeaturedCourses from '@/components/sections/FeaturedCourses';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import Testimonials from '@/components/sections/Testimonials';
import FinalCTA from '@/components/sections/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeaturedCourses />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
