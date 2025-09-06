// src/components/AddToCartButton.tsx
"use client";

import { useShoppingCart } from "use-shopping-cart";

// Define a more specific type for the course data needed by the cart
export interface CourseCartItem {
  name: string;
  id: string; // This should be the Sanity document _id
  price: number;
  currency: string;
  image?: string;
}

export default function AddToCartButton({ course }: { course: CourseCartItem }) {
  const { addItem } = useShoppingCart();

  const handleAddItem = () => {
    addItem(course);
  };

  return (
    <button onClick={handleAddItem} className="btn-primary w-full text-center block">
      Add to Cart
    </button>
  );
}