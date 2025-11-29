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
  const [currentCurrency, setCurrentCurrency] = useState<Currency>({
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸'
  });
  const [currencies] = useState<Currency[]>(currencyService.getSupportedCurrencies());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize currency detection
    const initializeCurrency = async () => {
      try {
        // Update exchange rates
        await currencyService.updateExchangeRates();
        
        // Get current currency (might be from localStorage or geo-detected)
        const current = currencyService.getCurrentCurrency();
        setCurrentCurrency(current);
      } catch (error) {
        console.error('Failed to initialize currency:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();

    // Listen for currency changes from other components
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
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency: newCurrency } 
    }));
  };

  const formatPrice = (usdPrice: number, options?: {
    currency?: string;
    showCurrency?: boolean;
    showOriginal?: boolean;
    applyNigerianDiscount?: boolean;
  }) => {
    return currencyService.formatPrice(usdPrice, options);
  };

  const formatPriceWithDiscount = (usdPrice: number, options?: {
    currency?: string;
    showCurrency?: boolean;
    showOriginal?: boolean;
    applyNigerianDiscount?: boolean;
  }) => {
    return currencyService.formatPriceWithDiscount(usdPrice, options);
  };

  const formatPriceRange = (minUsd: number, maxUsd: number, options?: {
    currency?: string;
    showCurrency?: boolean;
  }) => {
    return currencyService.formatPriceRange(minUsd, maxUsd, options);
  };

  const convertPrice = (usdPrice: number, toCurrency?: string) => {
    return currencyService.convertPrice(usdPrice, toCurrency);
  };

  const isLocalCurrency = () => {
    return currencyService.isLocalCurrency();
  };

  const isLaunchSpecialActive = () => {
    return currencyService.isLaunchSpecialActive();
  };

  const getLocalDiscountMessage = () => {
    return currencyService.getLocalDiscountMessage();
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
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
