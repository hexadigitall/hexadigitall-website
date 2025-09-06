// src/components/AddToCartButton.tsx
"use client";

import { useSafeShoppingCart } from "@/hooks/useSafeShoppingCart";

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
    } else {
      // If cart is not available, show alert and redirect to contact
      alert('Cart functionality is temporarily unavailable. You will be redirected to our contact form to complete your enrollment.');
      window.location.href = '/contact';
    }
  };

  return (
    <button onClick={handleAddItem} className="btn-primary w-full text-center block">
      {isAvailable ? 'Add to Cart' : 'Enroll Now'}
    </button>
  );
}
