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
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    });
  }
  
  return stripeInstance;
};
