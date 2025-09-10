// src/lib/stripe.ts
import Stripe from 'stripe';

// Lazy initialization - only create Stripe instance when needed
let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  // Only initialize Stripe when actually needed (at runtime)
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }

    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-08-27.basil', // Latest supported version
      typescript: true,
      // Enhanced configuration for better performance
      maxNetworkRetries: 3,
      timeout: 30000, // 30 seconds timeout
      appInfo: {
        name: 'Hexadigitall Learning Platform',
        version: '1.0.0',
        url: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  }
  
  return stripeInstance;
};
