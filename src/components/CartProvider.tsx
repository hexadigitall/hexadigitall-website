// src/components/CartProvider.tsx
"use client";

// Paystack doesn't require a cart provider wrapper like Stripe
// This component now just passes through children
export default function AppCartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}