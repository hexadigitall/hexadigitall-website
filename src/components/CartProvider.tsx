// src/components/CartProvider.tsx
"use client";

import { CartProvider } from "use-shopping-cart";

export default function AppCartProvider({ // Renamed to avoid conflict
  children,
}: {
  children: React.ReactNode;
}) {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

  if (!stripeKey) {
    console.warn("Stripe public key is not set. Cart functionality will be disabled.");
    return <>{children}</>;
  }

  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      stripe={stripeKey}
      successUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/success`}
      cancelUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/cancel`}
      currency="NGN"
      allowedCountries={['NG']}
      billingAddressCollection={true}
      shouldPersist={true}
    >
      {children}
    </CartProvider>
  );
}