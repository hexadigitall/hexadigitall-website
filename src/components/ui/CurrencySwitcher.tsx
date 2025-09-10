'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Currency } from '@/lib/currency';

interface CurrencySwitcherProps {
  className?: string;
  showLabel?: boolean;
  position?: 'header' | 'footer' | 'inline';
}

export default function CurrencySwitcher({ 
  className = '', 
  showLabel = true, 
  position = 'header' 
}: CurrencySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentCurrency, currencies, setCurrency, isLoading } = useCurrency();

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencyChange = (currency: Currency) => {
    setCurrency(currency.code);
    setIsOpen(false);
  };

  if (isLoading || !currentCurrency) {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
        <div className="h-4 w-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Different styles based on position
  const getPositionStyles = () => {
    switch (position) {
      case 'footer':
        return {
          button: 'text-gray-300 hover:text-white text-sm',
          dropdown: 'bottom-full mb-2 border-gray-700 bg-gray-800',
          item: 'text-gray-300 hover:text-white hover:bg-gray-700'
        };
      case 'inline':
        return {
          button: 'text-gray-600 hover:text-gray-900 text-sm border border-gray-300 rounded-md px-3 py-1.5',
          dropdown: 'top-full mt-2 border-gray-200 bg-white shadow-lg',
          item: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        };
      default: // header
        return {
          button: 'text-gray-700 hover:text-blue-600 text-sm',
          dropdown: 'top-full mt-2 border-gray-200 bg-white shadow-lg',
          item: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        };
    }
  };

  const styles = getPositionStyles();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 transition-colors duration-200 ${styles.button}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select currency"
      >
        <GlobeAltIcon className="h-4 w-4" />
        <span className="flex items-center space-x-1">
          <span className="text-sm">{currentCurrency.flag}</span>
          <span className="font-medium">{currentCurrency.code}</span>
          {showLabel && (
            <span className="hidden sm:inline text-xs text-gray-500">
              ({currentCurrency.symbol})
            </span>
          )}
        </span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div 
          className={`absolute right-0 z-50 min-w-[200px] rounded-md border py-1 ${styles.dropdown}`}
          role="menu"
        >
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency)}
              className={`w-full px-4 py-2 text-left flex items-center justify-between transition-colors duration-150 ${styles.item} ${
                currentCurrency.code === currency.code ? 'bg-blue-50 text-blue-600' : ''
              }`}
              role="menuitem"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{currency.flag}</span>
                <div>
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-xs opacity-75">{currency.name}</div>
                </div>
              </div>
              <span className="text-sm opacity-75">{currency.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
