// src/app/success/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Successful | Hexadigitall',
  description: 'Your payment was successful. Thank you for your purchase!',
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-lightGray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-16 w-16 text-green-600">
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold font-heading text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. You should receive a confirmation email shortly.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold font-heading mb-2">What&apos;s Next?</h3>
            <ul className="text-sm text-gray-600 text-left space-y-2">
              <li>• Check your email for course access details</li>
              <li>• We&apos;ll contact you within 24 hours with next steps</li>
              <li>• Course materials will be shared via email or our platform</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/courses" className="btn-secondary flex-1">
              View All Courses
            </Link>
            <Link href="/contact" className="btn-primary flex-1">
              Contact Support
            </Link>
          </div>
          
          <Link href="/" className="text-primary hover:text-secondary text-sm block">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
