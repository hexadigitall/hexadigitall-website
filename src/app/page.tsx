// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-lightGray py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-4">
            From Idea to Impact. Your All-in-One Digital Partner.
          </h1>
          <p className="text-lg md:text-xl text-darkText max-w-3xl mx-auto mb-8">
            We transform concepts into market-ready realities with strategic business planning, custom software development, and data-driven marketing.
          </p>
          <Link href="/contact" className="bg-secondary text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-primary transition-colors">
            Let's Build Your Vision
          </Link>
        </div>
      </section>

      {/* Other sections (Services Overview, Testimonials, etc.) would follow */}
    </>
  );
}