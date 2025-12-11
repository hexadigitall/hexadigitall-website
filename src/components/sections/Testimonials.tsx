// src/components/sections/Testimonials.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';

// Define the type for our testimonial data
interface Testimonial {
  _id: string;
  quote: string;
  authorName: string;
  authorCompany: string;
  authorImage?: string;
  rating?: number;
}

// Fallback testimonials data with profile images
const fallbackTestimonials: Testimonial[] = [
  {
    _id: "1",
    quote: "Hexadigitall transformed our business idea into a thriving digital platform. Their comprehensive approach saved us months of trial and error.",
    authorName: "Sarah Johnson",
    authorCompany: "TechStart Nigeria",
    authorImage: "/assets/images/testimonials/testimonial-person-2.jpg",
    rating: 5
  },
  {
    _id: "2",
    quote: "The mentorship and technical expertise provided by the Hexadigitall team was invaluable. They didn't just deliver a product, they built our capacity.",
    authorName: "Adebayo Okafor",
    authorCompany: "Green Energy Solutions",
    authorImage: "/assets/images/testimonials/testimonial-person-3.jpg",
    rating: 5
  },
  {
    _id: "3",
    quote: "Professional, reliable, and results-driven. Hexadigitall helped us establish a strong digital presence and grow our customer base significantly.",
    authorName: "Fatima Al-Hassan",
    authorCompany: "Lagos Fashion Hub",
    authorImage: "/assets/images/testimonials/testimonial-person-1.jpg",
    rating: 5
  }
];

// The GROQ query to fetch all testimonials - order by _createdAt to get consistent ordering
const testimonialQuery = groq`*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  quote,
  authorName,
  authorCompany,
  rating,
  "authorImage": authorImage.asset->url
}`;

const Testimonials = async () => {
  let testimonials: Testimonial[] = fallbackTestimonials;
  
  const dedupe = (items: Testimonial[]) => {
    const seen = new Set<string>();
    const unique: Testimonial[] = [];
    
    for (const t of items) {
      // Create a more robust deduplication key using multiple fields
      const quoteSnippet = (t.quote || '').toLowerCase().slice(0, 50);
      const key = `${quoteSnippet}|${(t.authorName || '').toLowerCase()}|${(t.authorCompany || '').toLowerCase()}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(t);
      }
    }
    
    return unique;
  };
  
  try {
    // Only attempt to fetch if Sanity is properly configured
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET) {
      const sanityTestimonials = await client.fetch(testimonialQuery);
      if (Array.isArray(sanityTestimonials) && sanityTestimonials.length > 0) {
        testimonials = dedupe(sanityTestimonials).slice(0, 6);
      }
    }
  } catch (error) {
    console.warn('Failed to fetch testimonials from Sanity, using fallback data:', error);
    // testimonials already set to fallback
  }

  // Ensure fallback set is also unique and capped
  testimonials = dedupe(testimonials).slice(0, 6);

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <p className="text-lg text-darkText max-w-2xl mx-auto leading-relaxed">
            Real feedback from partners we&apos;ve helped succeed in their digital journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial._id} 
              className="testimonial-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Quote */}
                <div className="mb-6">
                  <div className="text-4xl text-secondary mb-3 opacity-50">&ldquo;</div>
                  <p className="text-darkText italic leading-relaxed text-base">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                )}

                {/* Author section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                      {testimonial.authorImage ? (
                        <Image
                          src={testimonial.authorImage}
                          alt={testimonial.authorName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.authorName.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-bold text-primary font-heading">{testimonial.authorName}</p>
                    <p className="text-sm text-gray-600">{testimonial.authorCompany}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-lg text-darkText mb-4">Ready to join our success stories?</p>
          <Link 
            href="/courses" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold rounded-lg hover:from-primary hover:to-secondary transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explore Our Courses
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
