// src/components/sections/FinalCTA.tsx
import Link from 'next/link';

const FinalCTA = () => {
  return (
    <section className="bg-primary" aria-labelledby="final-cta-heading">
      <div className="container mx-auto px-6 py-16 text-center text-white">
        <h2 id="final-cta-heading" className="text-3xl md:text-4xl font-bold font-heading mb-4 !text-white">
          Ready to Transform Your Business Idea?
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-200 text-lg leading-relaxed">
          Join hundreds of successful entrepreneurs who trusted Hexadigitall to bring their vision to life. From business planning to digital marketing, we&apos;re your complete solution.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link 
            href="/contact" 
            className="btn-white inline-flex items-center justify-center transition-transform hover:scale-105 focus:scale-105"
            aria-describedby="cta-description"
          >
            Start Your Project Today
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
          <Link 
            href="/services" 
            className="text-accent hover:text-white transition-colors duration-300 underline underline-offset-4"
          >
            Explore Our Services
          </Link>
        </div>
        <p id="cta-description" className="text-sm text-gray-300 max-w-lg mx-auto">
          Free consultation • Quick 24-hour response • No obligation
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;