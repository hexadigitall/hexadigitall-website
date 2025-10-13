"use client";

import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { 
  MonthlyScheduling, 
  SessionCustomization, 
  MonthlyBillingCalculation,
  SessionMatrix 
} from '@/types/course';

interface CoursePricingCalculatorProps {
  hourlyRateUSD: number;
  hourlyRateNGN: number;
  monthlyScheduling?: MonthlyScheduling;
  // Legacy support for old scheduling options
  schedulingOptions?: {
    minHoursPerSession: number;
    maxHoursPerSession: number;
    minSessionsPerWeek: number;
    maxSessionsPerWeek: number;
    defaultHours: number;
  };
  onPriceChange: (billingCalculation: MonthlyBillingCalculation, customization: SessionCustomization) => void;
  className?: string;
}

// Session format type
type SessionFormat = 'one-on-one' | 'small-group' | 'large-group';

// Legacy interface for backward compatibility
export interface PricingConfiguration {
  hoursPerWeek: number;
  weeksPerMonth: number;
  totalHours: number;
  sessionFormat: SessionFormat;
  currency: string;
  hourlyRate: number;
  totalMonthlyPrice: number;
}

const CoursePricingCalculator = ({
  hourlyRateUSD,
  hourlyRateNGN,
  monthlyScheduling,
  schedulingOptions,
  onPriceChange,
  className = ""
}: CoursePricingCalculatorProps) => {
  const { isLocalCurrency, currentCurrency, formatPrice } = useCurrency();
  
  // Determine which scheduling configuration to use
  const sessionMatrix: SessionMatrix = useMemo(() => {
    if (monthlyScheduling?.sessionMatrix) {
      return monthlyScheduling.sessionMatrix;
    }
    // Fallback to legacy scheduling options
    return {
      sessionsPerWeek: {
        min: schedulingOptions?.minSessionsPerWeek || 1,
        max: schedulingOptions?.maxSessionsPerWeek || 4,
        default: 1
      },
      hoursPerSession: {
        min: schedulingOptions?.minHoursPerSession || 1,
        max: schedulingOptions?.maxHoursPerSession || 3,
        default: 1
      },
      totalHoursLimit: 12
    };
  }, [monthlyScheduling, schedulingOptions]);
  
  // Session format multipliers - from course config or defaults
  const formatMultipliers = useMemo(() => {
    if (monthlyScheduling?.sessionPricing) {
      return {
        'one-on-one': monthlyScheduling.sessionPricing.oneOnOneMultiplier,
        'small-group': monthlyScheduling.sessionPricing.smallGroupMultiplier,
        'large-group': monthlyScheduling.sessionPricing.largeGroupMultiplier
      };
    }
    // Default multipliers
    return {
      'one-on-one': 1.0,
      'small-group': 0.7, // 30% discount for small groups
      'large-group': 0.5 // 50% discount for larger groups
    };
  }, [monthlyScheduling]);
  
  // State for session customization
  const [sessionsPerWeek, setSessionsPerWeek] = useState(sessionMatrix.sessionsPerWeek.default);
  const [hoursPerSession, setHoursPerSession] = useState(sessionMatrix.hoursPerSession.default);
  const [sessionFormat, setSessionFormat] = useState<'one-on-one' | 'small-group' | 'large-group'>('one-on-one');

  // Validate session selection against total hours limit
  const totalHoursPerWeek = sessionsPerWeek * hoursPerSession;
  const isValidSelection = totalHoursPerWeek <= sessionMatrix.totalHoursLimit;
  
  // Generate session options based on constraints
  const generateSessionOptions = useCallback(() => {
    const options: number[] = [];
    for (let i = sessionMatrix.sessionsPerWeek.min; i <= sessionMatrix.sessionsPerWeek.max; i++) {
      options.push(i);
    }
    return options;
  }, [sessionMatrix]);
  
  const generateHourOptions = useCallback(() => {
    const options: number[] = [];
    for (let i = sessionMatrix.hoursPerSession.min; i <= sessionMatrix.hoursPerSession.max; i++) {
      options.push(i);
    }
    return options;
  }, [sessionMatrix]);

  const sessionOptions = generateSessionOptions();
  const hourOptions = generateHourOptions();

  // Calculate monthly billing with enhanced breakdown
  const calculateMonthlyBilling = useCallback((): MonthlyBillingCalculation => {
    const baseHourlyRate = isLocalCurrency() ? hourlyRateNGN : hourlyRateUSD;
    const sessionFormatMultiplier = formatMultipliers[sessionFormat];
    const adjustedHourlyRate = baseHourlyRate * sessionFormatMultiplier;
    const hoursPerWeek = sessionsPerWeek * hoursPerSession;
    const hoursPerMonth = hoursPerWeek * 4; // 4 weeks per month
    const monthlyTotal = adjustedHourlyRate * hoursPerMonth;

    return {
      baseHourlyRate,
      sessionFormatMultiplier,
      adjustedHourlyRate,
      hoursPerWeek,
      hoursPerMonth,
      monthlyTotal,
      currency: currentCurrency.code,
      breakdown: {
        sessions: `${sessionsPerWeek} session${sessionsPerWeek !== 1 ? 's' : ''} per week`,
        duration: `${hoursPerSession} hour${hoursPerSession !== 1 ? 's' : ''} per session`,
        weekly: `${hoursPerWeek} hour${hoursPerWeek !== 1 ? 's' : ''} per week`,
        monthly: `${hoursPerMonth} hour${hoursPerMonth !== 1 ? 's' : ''} per month`,
        rate: `${formatPrice(adjustedHourlyRate, { applyNigerianDiscount: false })}/hour (${sessionFormat.replace('-', ' ')})`
      }
    };
  }, [sessionsPerWeek, hoursPerSession, sessionFormat, currentCurrency.code, isLocalCurrency, hourlyRateNGN, hourlyRateUSD, formatMultipliers, formatPrice]);
  
  // Create session customization object
  const createSessionCustomization = useCallback((): SessionCustomization => {
    return {
      sessionsPerWeek,
      hoursPerSession,
      totalHoursPerWeek: sessionsPerWeek * hoursPerSession,
      sessionFormat,
      preferredDays: monthlyScheduling?.availabilityWindow?.daysOfWeek,
      preferredTimeSlots: monthlyScheduling?.availabilityWindow?.timeSlots
    };
  }, [sessionsPerWeek, hoursPerSession, sessionFormat, monthlyScheduling]);

  const billingCalculation = calculateMonthlyBilling();
  const sessionCustomization = createSessionCustomization();
  
  // Enhanced handlers
  const handleSessionsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSessions = parseInt(e.target.value);
    setSessionsPerWeek(newSessions);
  };
  
  const handleHoursChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newHours = parseInt(e.target.value);
    setHoursPerSession(newHours);
  };

  const handleFormatChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSessionFormat(e.target.value as SessionFormat);
  };

  // Auto-calculate when values change
  useEffect(() => {
    if (onPriceChange && isValidSelection) {
      onPriceChange(billingCalculation, sessionCustomization);
    }
  }, [billingCalculation, sessionCustomization, isValidSelection, onPriceChange]);

  return (
    <div className={`glass card-enhanced p-6 space-y-6 ${className}`}>
      <div className="border-b border-white/20 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Customize Your Learning Schedule
        </h3>
        <p className="text-sm text-gray-600">
          Configure your sessions and format for monthly billing
        </p>
      </div>

      {/* Session Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sessions Per Week */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Sessions per Week
          </label>
          <select 
            value={sessionsPerWeek} 
            onChange={handleSessionsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          >
            {sessionOptions.map(sessions => (
              <option key={sessions} value={sessions}>{sessions} session{sessions !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Hours Per Session */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Hours per Session
          </label>
          <select 
            value={hoursPerSession} 
            onChange={handleHoursChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          >
            {hourOptions.map(hours => (
              <option key={hours} value={hours}>{hours} hour{hours !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Session Format */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Session Format
          </label>
          <select 
            value={sessionFormat} 
            onChange={handleFormatChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="one-on-one">One-on-One</option>
            <option value="small-group">Small Group (30% discount)</option>
            <option value="large-group">Large Group (50% discount)</option>
          </select>
        </div>
      </div>

      {/* Validation Warning */}
      {!isValidSelection && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Weekly Hours Limit Exceeded
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Total weekly hours ({totalHoursPerWeek}) exceeds the limit of {sessionMatrix.totalHoursLimit} hours.
                  Please adjust your sessions or hours per session.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Breakdown */}
      {isValidSelection && (
        <div className="space-y-4">
          {/* Calculation Summary */}
          <div className="glass rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Monthly Billing Breakdown</h4>
            <div className="space-y-2 text-sm">
              {Object.entries(billingCalculation.breakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between text-gray-600">
                  <span className="capitalize">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Price Display */}
          <div className="border-t border-white/20 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Monthly Total:</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(billingCalculation.monthlyTotal, { applyNigerianDiscount: true })}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Billed monthly • Cancel anytime • Includes {billingCalculation.hoursPerMonth} hours
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePricingCalculator;
