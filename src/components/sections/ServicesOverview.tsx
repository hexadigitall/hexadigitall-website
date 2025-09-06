// src/components/sections/ServicesOverview.tsx
import ServiceCard from './ServiceCard';
import { FaBullhorn, FaCode, FaPaintBrush, FaUserTie, FaChalkboardTeacher } from 'react-icons/fa';

const services = [
  {
    icon: <FaPaintBrush size={40} />,
    title: 'Business Plan & Logo',
    description: 'Crafting strategic business plans and memorable logos to launch your brand successfully.',
    href: '/services/business-plan-and-logo-design', // ✅ Corrected
  },
  {
    icon: <FaCode size={40} />,
    title: 'Web & Mobile Development',
    description: 'Building bespoke, scalable software solutions that bring your digital ideas to life.',
    href: '/services/web-and-mobile-software-development', // ✅ Corrected
  },
  {
    icon: <FaBullhorn size={40} />,
    title: 'Social Media Marketing',
    description: 'Boosting your online presence with data-driven advertising and marketing strategies.',
    href: '/services/social-media-advertising-and-marketing', // ✅ Corrected
  },
  {
    icon: <FaUserTie size={40} />,
    title: 'Profile & Portfolio Building',
    description: 'Developing compelling professional profiles and portfolios to showcase your expertise.',
    href: '/services/profile-and-portfolio-building', // ✅ Corrected
  },
  {
    icon: <FaChalkboardTeacher size={40} />,
    title: 'Mentoring & Consulting',
    description: 'Providing expert guidance and mentorship to navigate your business challenges.',
    href: '/services/mentoring-and-consulting', // ✅ Corrected
  },
];

const ServicesOverview = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading">Our Core Services</h2>
          <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">We provide a holistic suite of services to build your vision from the ground up.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              href={service.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;