// src/types/shopping-cart.ts
// Type extensions for use-shopping-cart library

export interface CartDetails {
  [key: string]: {
    id: string;
    name: string;
    price: number;
    currency: string;
    quantity?: number;
    image?: string;
    formattedValue?: string;
    [key: string]: unknown; // Allow for additional properties
  };
}

// Extend the module declaration to include our index signature
declare module 'use-shopping-cart' {
  interface CartDetails {
    [key: string]: {
      id: string;
      name: string;
      price: number;
      currency: string;
      quantity?: number;
      image?: string;
      formattedValue?: string;
      [key: string]: unknown;
    };
  }
}
