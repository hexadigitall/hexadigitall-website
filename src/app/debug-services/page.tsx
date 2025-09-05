// src/app/debug-services/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';

interface Service {
  _id: string;
  title: string;
  slug: { current: string };
  overview?: string;
}

export default async function DebugServicesPage() {
  const services: Service[] = await client.fetch(
    groq`*[_type == "service"] | order(title asc) {
      _id,
      title,
      slug,
      overview
    }`
  );

  const expectedSlugs = [
    'business-plan-logo',
    'web-mobile-development', 
    'social-media-marketing',
    'portfolio-building',
    'mentoring-consulting'
  ];

  const actualSlugs = services.map(s => s.slug.current);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Services Debug Page</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Expected Slugs (from Navigation)</h2>
          <ul className="space-y-2">
            {expectedSlugs.map(slug => (
              <li key={slug} className="p-2 bg-gray-100 rounded">
                <code>{slug}</code>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Actual Services in Sanity</h2>
          <ul className="space-y-2">
            {services.map(service => (
              <li key={service._id} className="p-2 bg-gray-100 rounded">
                <div><strong>{service.title}</strong></div>
                <div><code>slug: {service.slug.current}</code></div>
                <div><a href={`/services/${service.slug.current}`} className="text-blue-600 hover:underline">Test Link</a></div>
              </li>
            ))}
          </ul>
          
          {services.length === 0 && (
            <p className="text-red-600">⚠️ No services found in Sanity!</p>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Slug Comparison</h2>
        <div className="space-y-2">
          {expectedSlugs.map(expectedSlug => {
            const exists = actualSlugs.includes(expectedSlug);
            return (
              <div key={expectedSlug} className={`p-2 rounded ${exists ? 'bg-green-100' : 'bg-red-100'}`}>
                <code>{expectedSlug}</code> - {exists ? '✅ Exists' : '❌ Missing'}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Instructions</h2>
        <p className="mb-4">To fix the 404 errors, either:</p>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Create services in Sanity with the exact slugs shown above, OR</li>
          <li>Use the new dynamic navigation system (already implemented)</li>
        </ol>
        
        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <strong>Note:</strong> This debug page can be deleted after fixing the service URLs.
        </div>
      </div>
    </div>
  );
}
