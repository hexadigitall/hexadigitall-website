// src/types/course.ts
// Enhanced TypeScript interfaces for monthly course billing and scheduling

export interface RecommendedDuration {
  weeks: number;
  hoursPerWeek: number;
  totalHours: number;
  flexibility: 'fixed' | 'flexible' | 'semi-flexible';
}

export interface SessionMatrix {
  sessionsPerWeek: {
    min: number;
    max: number;
    default: number;
  };
  hoursPerSession: {
    min: number;
    max: number;
    default: number;
  };
  totalHoursLimit: number;
}

export interface AvailabilityWindow {
  daysOfWeek: string[];
  timeSlots: string[];
}

export interface SessionPricing {
  oneOnOneMultiplier: number;
  smallGroupMultiplier: number;
  largeGroupMultiplier: number;
}

export interface MonthlyScheduling {
  billingType: 'monthly' | 'per-session' | 'package';
  sessionMatrix: SessionMatrix;
  availabilityWindow: AvailabilityWindow;
  sessionPricing: SessionPricing;
}

// Updated Course interface with new fields
export interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  courseType: 'self-paced' | 'live';
  
  // Legacy pricing (for self-paced courses)
  price?: number;
  nairaPrice?: number;
  dollarPrice?: number;
  
  // Live course hourly rates
  hourlyRateNGN?: number;
  hourlyRateUSD?: number;
  
  // Professional duration guidelines
  recommendedDuration?: RecommendedDuration;
  duration?: string; // Legacy field for display compatibility
  
  // Monthly billing and scheduling
  monthlyScheduling?: MonthlyScheduling;
  
  // Course metadata
  level: string;
  instructor: string;
  description: string;
  prerequisites?: string[];
  maxStudents?: number;
  currentEnrollments?: number;
  mainImage?: string;
  curriculum: {
    modules: number;
    lessons: number;
    duration: string;
  };
  includes: string[];
  certificate: boolean;
  featured?: boolean;
  
  // Session management
  timeZones?: string[];
  sessionFormats?: string[];
  bannerBackgroundImage?: { asset: { url: string } };
  ogImage?: { asset: { url: string } };
  ogTitle?: string;
  ogDescription?: string;
}

// Session customization for student enrollment
export interface SessionCustomization {
  sessionsPerWeek: number;
  hoursPerSession: number;
  totalHoursPerWeek: number;
  sessionFormat: 'one-on-one' | 'small-group' | 'large-group';
  preferredDays?: string[];
  preferredTimeSlots?: string[];
}

// Monthly billing calculation
export interface MonthlyBillingCalculation {
  baseHourlyRate: number; // USD or NGN based on currency
  sessionFormatMultiplier: number;
  adjustedHourlyRate: number;
  hoursPerWeek: number;
  hoursPerMonth: number; // hoursPerWeek * 4
  monthlyTotal: number;
  currency: string;
  
  // Breakdown for display
  breakdown: {
    sessions: string; // "2 sessions per week"
    duration: string; // "1.5 hours per session"
    weekly: string; // "3 hours per week"
    monthly: string; // "12 hours per month"
    rate: string; // "$50/hour (one-on-one)"
  };
}

// Student enrollment data for monthly courses
export interface CourseEnrollmentData {
  _id: string;
  title: string;
  courseType: 'self-paced' | 'live';
  
  // Pricing data
  price?: number; // Legacy for self-paced
  nairaPrice?: number;
  dollarPrice?: number;
  hourlyRateNGN?: number;
  hourlyRateUSD?: number;
  
  // Course structure
  recommendedDuration?: RecommendedDuration;
  monthlyScheduling?: MonthlyScheduling;
  duration: string;
  level: string;
  instructor: string;
  description: string;
  prerequisites?: string[];
  maxStudents?: number;
  currentEnrollments?: number;
  mainImage?: string;
  curriculum: {
    modules: number;
    lessons: number;
    duration: string;
  };
  includes: string[];
  certificate: boolean;
}

// Course pricing display helpers
export interface CoursePricingDisplay {
  type: 'one-time' | 'monthly' | 'hourly';
  displayPrice: string;
  originalPrice?: string; // For discounts
  hasDiscount: boolean;
  discountPercentage?: number;
  billingNote: string; // "One-time payment" or "Per month" or "Per hour"
  customizationNote?: string; // "Starting from..." or "Customize your schedule"
}

// Form data for monthly course enrollment
export interface MonthlyEnrollmentData {
  courseId: string;
  studentDetails: {
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    goals?: string;
  };
  sessionCustomization: SessionCustomization;
  billing: MonthlyBillingCalculation;
  startDate?: string;
  paymentMethod: 'recurring' | 'manual';
}