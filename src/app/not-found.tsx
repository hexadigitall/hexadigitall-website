// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold font-heading">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">Sorry, the page you are looking for does not exist.</p>
      <div className="mt-8">
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  );
}