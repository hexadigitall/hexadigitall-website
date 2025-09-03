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

// The GROQ query to fetch all testimonials
const testimonialQuery = groq`*[_type == "testimonial"]{
  _id,
  quote,
  authorName,
  authorCompany
}`;

const Testimonials = async () => {
  // Fetch the data on the server
  const testimonials: Testimonial[] = await client.fetch(testimonialQuery);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading">What Our Clients Say</h2>
          <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">Real feedback from partners we've helped succeed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="bg-lightGray p-8 rounded-lg shadow-sm">
              <p className="text-darkText italic mb-6">"{testimonial.quote}"</p>
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