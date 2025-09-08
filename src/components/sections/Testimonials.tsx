// src/components/sections/Testimonials.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';

// Define the type for our testimonial data
interface Testimonial {
  _id: string;
  quote: string;
  authorName: string;
  authorCompany: string;
}

// Fallback testimonials data
const fallbackTestimonials: Testimonial[] = [
  {
    _id: "1",
    quote: "Hexadigitall transformed our business idea into a thriving digital platform. Their comprehensive approach saved us months of trial and error.",
    authorName: "Sarah Johnson",
    authorCompany: "TechStart Nigeria"
  },
  {
    _id: "2",
    quote: "The mentorship and technical expertise provided by the Hexadigitall team was invaluable. They didn't just deliver a product, they built our capacity.",
    authorName: "Adebayo Okafor",
    authorCompany: "Green Energy Solutions"
  },
  {
    _id: "3",
    quote: "Professional, reliable, and results-driven. Hexadigitall helped us establish a strong digital presence and grow our customer base significantly.",
    authorName: "Fatima Al-Hassan",
    authorCompany: "Lagos Fashion Hub"
  }
];

// The GROQ query to fetch all testimonials
const testimonialQuery = groq`*[_type == "testimonial"]{
  _id,
  quote,
  authorName,
  authorCompany
}`;

const Testimonials = async () => {
  let testimonials: Testimonial[] = fallbackTestimonials;
  
  try {
    // Only attempt to fetch if Sanity is properly configured
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET) {
      const sanityTestimonials = await client.fetch(testimonialQuery);
      if (Array.isArray(sanityTestimonials) && sanityTestimonials.length > 0) {
        testimonials = sanityTestimonials;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch testimonials from Sanity, using fallback data:', error);
    // testimonials already set to fallback
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading">What Our Clients Say</h2>
          <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">Real feedback from partners we&apos;ve helped succeed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="bg-lightGray p-8 rounded-lg shadow-sm">
              <p className="text-darkText italic mb-6">&quot;{testimonial.quote}&quot;</p>
              <div className="text-right">
                <p className="font-bold text-primary font-heading">{testimonial.authorName}</p>
                <p className="text-sm text-gray-600">{testimonial.authorCompany}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
