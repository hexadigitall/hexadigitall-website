// src/components/sections/FinalCTA.tsx
import Link from 'next/link';

const FinalCTA = () => {
  return (
    <section className="bg-primary">
      <div className="container mx-auto px-6 py-16 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Have a business idea but feeling unsure?
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-200">
          The path from a great idea to a successful business can be complex. You don&apos;t have to navigate it alone.
        </p>
        <Link href="/contact" className="btn-secondary">
          Send us a message
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;