"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CoursePricingCalculatorProps {
  hourlyRateUSD: number;
  hourlyRateNGN: number;
  schedulingOptions?: {
    minHoursPerSession: number;
    maxHoursPerSession: number;
    minSessionsPerWeek: number;
    maxSessionsPerWeek: number;
    defaultHours: number;
  };
  onPriceChange: (totalPrice: number, configuration: PricingConfiguration) => void;
  className?: string;
}

export interface PricingConfiguration {
  hoursPerWeek: number;
  weeksPerMonth: number;
  totalHours: number;
  sessionFormat: 'one-on-one' | 'small-group' | 'group';
  currency: string;
  hourlyRate: number;
  totalMonthlyPrice: number;
}

const CoursePricingCalculator = ({
  hourlyRateUSD,
  hourlyRateNGN,
  schedulingOptions = {
    minHoursPerSession: 1,
    maxHoursPerSession: 3,
    minSessionsPerWeek: 1,
    maxSessionsPerWeek: 3,
    defaultHours: 1
  },
  onPriceChange,
  className = ""
}: CoursePricingCalculatorProps) => {
  const { isLocalCurrency, currentCurrency } = useCurrency();
  
  const [hoursPerWeek, setHoursPerWeek] = useState(schedulingOptions.defaultHours);
  const [weeksPerMonth] = useState(4); // Fixed to 4 weeks per month
  const [sessionFormat, setSessionFormat] = useState<'one-on-one' | 'small-group' | 'group'>('one-on-one');

  // Session format multipliers for pricing - wrapped in useMemo
  const formatMultipliers = useMemo(() => ({
    'one-on-one': 1.0,
    'small-group': 0.7, // 30% discount for small groups
    'group': 0.5 // 50% discount for larger groups
  }), []);

  // Generate hour options based on scheduling constraints
  const generateHourOptions = useCallback(() => {
    const options: number[] = [];
    const { minHoursPerSession, maxHoursPerSession, minSessionsPerWeek, maxSessionsPerWeek } = schedulingOptions;
    
    for (let sessions = minSessionsPerWeek; sessions <= maxSessionsPerWeek; sessions++) {
      for (let hours = minHoursPerSession; hours <= maxHoursPerSession; hours++) {
        const totalHours = sessions * hours;
        if (!options.includes(totalHours)) {
          options.push(totalHours);
        }
      }
    }
    
    return options.sort((a, b) => a - b);
  }, [schedulingOptions]);

  const hourOptions = generateHourOptions();

  const calculatePrice = useCallback(() => {
    const baseHourlyRate = isLocalCurrency() ? hourlyRateNGN : hourlyRateUSD;
    const adjustedRate = baseHourlyRate * formatMultipliers[sessionFormat];
    const totalHours = hoursPerWeek * weeksPerMonth;
    const totalPrice = adjustedRate * totalHours;

    const configuration: PricingConfiguration = {
      hoursPerWeek,
      weeksPerMonth,
      totalHours,
      sessionFormat,
      currency: currentCurrency.code,
      hourlyRate: adjustedRate,
      totalMonthlyPrice: totalPrice
    };

    return { totalPrice, configuration };
  }, [hoursPerWeek, weeksPerMonth, sessionFormat, currentCurrency.code, isLocalCurrency, hourlyRateNGN, hourlyRateUSD, formatMultipliers]);

  useEffect(() => {
    const { totalPrice, configuration } = calculatePrice();
    onPriceChange(totalPrice, configuration);
  }, [calculatePrice, onPriceChange]);

  const { totalPrice, configuration } = calculatePrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isLocalCurrency() ? 'en-NG' : 'en-US', {
      style: 'currency',
      currency: isLocalCurrency() ? 'NGN' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 space-y-6 ${className}`}>
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Customize Your Learning Schedule
        </h3>
        <p className="text-sm text-gray-600">
          Select your preferred hours and session format for monthly pricing
        </p>
      </div>

      {/* Hours per Week Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Hours per Week
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {hourOptions.map((hours) => (
            <button
              key={hours}
              onClick={() => setHoursPerWeek(hours)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                hoursPerWeek === hours
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {hours}h
            </button>
          ))}
        </div>
      </div>

      {/* Session Format Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Session Format
        </label>
        <div className="space-y-2">
          {[
            { value: 'one-on-one', label: 'One-on-One', description: 'Personal attention' },
            { value: 'small-group', label: 'Small Group', description: '2-4 students (30% discount)' },
            { value: 'group', label: 'Group Session', description: '5-8 students (50% discount)' }
          ].map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={option.value}
                name="sessionFormat"
                type="radio"
                value={option.value}
                checked={sessionFormat === option.value}
                onChange={(e) => setSessionFormat(e.target.value as typeof sessionFormat)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor={option.value} className="ml-3 block text-sm">
                <span className="font-medium text-gray-700">{option.label}</span>
                <span className="text-gray-500 ml-1">- {option.description}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Hourly Rate:</span>
          <span className="font-medium">{formatPrice(configuration.hourlyRate)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Hours/Month:</span>
          <span className="font-medium">{configuration.totalHours} hours</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold text-primary border-t border-gray-100 pt-3">
          <span>Monthly Total:</span>
          <span className="text-green-600">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Schedule Breakdown */}
      <div className="bg-gray-50 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Your Schedule</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• {hoursPerWeek} hour{hoursPerWeek > 1 ? 's' : ''} per week</p>
          <p>• 4 weeks per month</p>
          <p>• {sessionFormat.replace('-', ' ')} sessions</p>
          <p>• Total: {configuration.totalHours} hours monthly</p>
        </div>
      </div>
    </div>
  );
};

export default CoursePricingCalculator;
