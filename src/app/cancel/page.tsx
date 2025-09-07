// src/app/cancel/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Checkout Cancelled | Hexadigitall',
  description: 'Your checkout was cancelled. No payment was processed.',
};

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-lightGray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-16 w-16 text-yellow-600">
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold font-heading text-gray-900">
            Checkout Cancelled
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your checkout was cancelled and no payment was processed.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold font-heading mb-2">What happened?</h3>
            <p className="text-sm text-gray-600 text-left">
              You cancelled the checkout process before completing your payment. 
              Your items are still in your cart if you&apos;d like to try again.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/courses" className="btn-secondary flex-1">
              Continue Shopping
            </Link>
            <Link href="/contact" className="btn-primary flex-1">
              Need Help?
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
