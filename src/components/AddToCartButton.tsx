// src/components/AddToCartButton.tsx
"use client";
import { useSafeShoppingCart } from "@/hooks/useSafeShoppingCart";
import { toast } from "react-hot-toast"; // We'll install this for notifications
import "@/types/shopping-cart"; // Import CartDetails type extension

export interface CourseCartItem {
  name: string;
  id: string; // This should be the Sanity document _id
  price: number;
  currency: string;
  image?: string;
}

export default function AddToCartButton({ course }: { course: CourseCartItem }) {
  const { addItem, isAvailable, cartDetails } = useSafeShoppingCart();
  // Check if the course ID already exists in the cart
  const isInCart = isAvailable && !!cartDetails?.[course.id];

  const handleAddItem = () => {
    if (isAvailable) {
      addItem(course);
      toast.success(`${course.name} has been added to your cart!`);
    } else {
      // If cart is not available, show alert and redirect to contact
      alert('Cart functionality is temporarily unavailable. You will be redirected to our contact form to complete your enrollment.');
      window.location.href = '/contact';
    }
  };

  return (
    <button 
      onClick={handleAddItem} 
      disabled={isInCart}
      className="btn-primary w-full text-center block disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isInCart ? "Added to Cart" : (isAvailable ? 'Add to Cart' : 'Enroll Now')}
    </button>
  );
}
