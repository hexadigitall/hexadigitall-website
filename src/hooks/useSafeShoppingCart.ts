// src/hooks/useSafeShoppingCart.ts
"use client";

import { useShoppingCart } from 'use-shopping-cart';
import { useEffect, useState } from 'react';

// Safe wrapper for useShoppingCart that handles SSR and missing provider
export const useSafeShoppingCart = () => {
  const [isClient, setIsClient] = useState(false);
  
  // Default fallback functions and data
  const defaultCartData = {
    cartCount: 0,
    cartDetails: {},
    formattedTotalPrice: '$0.00',
    addItem: () => {},
    removeItem: () => {},
    redirectToCheckout: () => Promise.resolve(),
    isAvailable: false,
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  try {
    const shoppingCart = useShoppingCart();
    
    if (isClient && shoppingCart) {
      return {
        ...shoppingCart,
        isAvailable: true,
      };
    }
  } catch (error) {
    // Cart provider not available or other error
    console.warn('Shopping cart not available:', error);
  }

  return defaultCartData;
};
