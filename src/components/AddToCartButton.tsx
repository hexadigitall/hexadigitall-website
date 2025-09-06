// src/components/AddToCartButton.tsx
"use client";

import { useSafeShoppingCart } from "@/hooks/useSafeShoppingCart";
import Link from 'next/link';

// Define a more specific type for the course data needed by the cart
export interface CourseCartItem {
  name: string;
  id: string; // This should be the Sanity document _id
  price: number;
  currency: string;
  image?: string;
}

export default function AddToCartButton({ course }: { course: CourseCartItem }) {
  const { addItem, isAvailable } = useSafeShoppingCart();

  const handleAddItem = () => {
    if (isAvailable) {
      addItem(course);
    }
  };

  // If cart is not available, show a contact link instead
  if (!isAvailable) {
    return (
      <Link href="/contact" className="btn-primary w-full text-center block">
        Enroll Now
      </Link>
    );
  }

  return (
    <button onClick={handleAddItem} className="btn-primary w-full text-center block">
      Add to Cart
    </button>
  );
}
