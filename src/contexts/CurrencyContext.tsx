'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { currencyService, type Currency } from '@/lib/currency';

interface CurrencyContextType {
  currentCurrency: Currency
  currencies: Currency[]
  setCurrency: (currencyCode: string) => void
  formatPrice: (usdPrice: number, options?: {
    currency?: string;
    showCurrency?: boolean;
    showOriginal?: boolean;
    applyNigerianDiscount?: boolean;
  }) => string;
  formatPriceWithDiscount: (usdPrice: number, options?: {
    currency?: string;
    showCurrency?: boolean;
    showOriginal?: boolean;
    applyNigerianDiscount?: boolean;
  }) => { originalPrice: string; discountedPrice: string; discountPercentage: number; hasDiscount: boolean };
  formatPriceRange: (minUsd: number, maxUsd: number, options?: {
    currency?: string;
    showCurrency?: boolean;
  }) => string;
  convertPrice: (usdPrice: number, toCurrency?: string) => number;
  isLocalCurrency: () => boolean;
  isLaunchSpecialActive: () => boolean;
  getLocalDiscountMessage: () => string | null;
  isLoading: boolean;
  isInitialized: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  // 1. DEFAULT TO SERVER STATE (USD)
  const [currentCurrency, setCurrentCurrency] = useState<Currency>({
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸'
  });
  const [currencies] = useState<Currency[]>(currencyService.getSupportedCurrencies());
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. INITIALIZATION FLAG
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        await currencyService.updateExchangeRates();
        const current = currencyService.getCurrentCurrency();
        setCurrentCurrency(current);
      } catch (error) {
        console.error('Failed to initialize currency:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true); // 3. MARK AS READY AFTER HYDRATION
      }
    };

    initializeCurrency();

    const handleCurrencyChange = (event: CustomEvent) => {
      const { currency } = event.detail;
      setCurrentCurrency(currency);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
      }
    };
  }, []);

  const setCurrency = (currencyCode: string) => {
    currencyService.setCurrency(currencyCode);
    const newCurrency = currencyService.getCurrentCurrency();
    setCurrentCurrency(newCurrency);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('currencyChanged', { 
        detail: { currency: newCurrency } 
      }));
    }
  };

  // --- SAFE GUARDED HELPER FUNCTIONS ---
  // These functions now force "Server Mode" (USD/No Discount) if called before hydration is complete.
  
  const isLocalCurrency = () => {
    if (!isInitialized) return false; 
    return currencyService.isLocalCurrency();
  };

  const isLaunchSpecialActive = () => {
    if (!isInitialized) return false;
    return currencyService.isLaunchSpecialActive();
  };

  const getLocalDiscountMessage = () => {
    if (!isInitialized) return null;
    return currencyService.getLocalDiscountMessage();
  };

  // --- CRITICAL FIX FOR PRICING COMPONENTS ---
  // We strictly override options to ensure USD/No Discount until initialized.
  
  const formatPrice = (usdPrice: number, options?: any) => {
    if (!isInitialized) {
      return currencyService.formatPrice(usdPrice, { 
        ...options, 
        currency: 'USD', 
        applyNigerianDiscount: false 
      });
    }
    return currencyService.formatPrice(usdPrice, options);
  };

  const formatPriceWithDiscount = (usdPrice: number, options?: any) => {
    if (!isInitialized) {
      return currencyService.formatPriceWithDiscount(usdPrice, { 
        ...options, 
        currency: 'USD', 
        applyNigerianDiscount: false 
      });
    }
    return currencyService.formatPriceWithDiscount(usdPrice, options);
  };

  const formatPriceRange = (minUsd: number, maxUsd: number, options?: any) => {
    if (!isInitialized) {
      return currencyService.formatPriceRange(minUsd, maxUsd, { 
        ...options, 
        currency: 'USD' 
      });
    }
    return currencyService.formatPriceRange(minUsd, maxUsd, options);
  };

  const convertPrice = (usdPrice: number, toCurrency?: string) => {
    // If specific currency requested, allow it. Otherwise default to context currency.
    if (toCurrency) return currencyService.convertPrice(usdPrice, toCurrency);
    
    // If relying on context currency, check initialization
    if (!isInitialized) return usdPrice; // Return raw USD value
    
    return currencyService.convertPrice(usdPrice);
  };

  const value: CurrencyContextType = {
    currentCurrency,
    currencies,
    setCurrency,
    formatPrice,
    formatPriceWithDiscount,
    formatPriceRange,
    convertPrice,
    isLocalCurrency,
    isLaunchSpecialActive,
    getLocalDiscountMessage,
    isLoading,
    isInitialized,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
