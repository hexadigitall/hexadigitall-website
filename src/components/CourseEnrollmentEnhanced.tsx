// src/components/CourseEnrollmentEnhanced.tsx
"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';

// Enhanced course interface with session options
export interface CourseEnrollmentData {
  _id: string;
  title: string;
  price: number;
  nairaPrice?: number;
  dollarPrice?: number;
  duration: string;
  level: string;
  prerequisites?: string[];
  maxStudents?: number;
  currentEnrollments?: number;
  startDate?: string;
  instructor: string;
  description: string;
  mainImage?: string | null;
  curriculum: {
    modules: number;
    lessons: number;
    duration: string;
  };
  includes: string[];
  certificate: boolean;
  sessionOptions: {
    perSession: boolean;
    hourly: boolean;
    fixedPrice: boolean;
  };
  sessionPricing?: {
    perSessionPrice?: number;
    hourlyRate?: number;
    minimumHours?: number;
    sessionDuration?: string;
  };
}

interface EnrollmentState {
  step: 'preview' | 'customize' | 'details' | 'payment' | 'processing' | 'success' | 'error';
  loading: boolean;
  error?: string;
}

// Session type options
type SessionType = 'fixed' | 'per_session' | 'hourly';

interface SessionCustomization {
  sessionType: SessionType;
  numberOfSessions?: number;
  totalHours?: number;
  schedule: 'weekdays' | 'weekends' | 'flexible';
  startDate?: string;
  intensity: 'standard' | 'intensive' | 'self_paced';
}

// Payment plan options for courses
type PaymentPlan = {
  id: string
  name: string
  description: string
  installments: number
  downPayment: number // percentage (0-100)
  processingFee: number // flat fee in USD
}

const COURSE_PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'full',
    name: 'Full Payment',
    description: 'Pay the full amount upfront',
    installments: 1,
    downPayment: 100,
    processingFee: 0,
  },
  {
    id: 'split_2',
    name: 'Split Payment',
    description: '50% now, 50% before course starts',
    installments: 2,
    downPayment: 50,
    processingFee: 10,
  },
  {
    id: 'monthly_3',
    name: '3-Month Plan',
    description: '35% down, then 2 monthly payments',
    installments: 3,
    downPayment: 35,
    processingFee: 20,
  },
]

interface StudentDetails {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  goals: string;
  preferredTime: string;
  timezone: string;
}

export default function CourseEnrollmentEnhanced({ course }: { course: CourseEnrollmentData }) {
  const { formatPrice, formatPriceWithDiscount, currentCurrency } = useCurrency();
  const [state, setState] = useState<EnrollmentState>({ step: 'preview', loading: false });
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    goals: '',
    preferredTime: '',
    timezone: 'UTC+1'
  });
  const [sessionCustomization, setSessionCustomization] = useState<SessionCustomization>({
    sessionType: course.sessionOptions.fixedPrice ? 'fixed' : course.sessionOptions.perSession ? 'per_session' : 'hourly',
    numberOfSessions: 8,
    totalHours: 16,
    schedule: 'flexible',
    intensity: 'standard'
  });
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<PaymentPlan>(COURSE_PAYMENT_PLANS[0]);

  // Check course availability
  const isAvailable = !course.maxStudents || 
    (course.currentEnrollments || 0) < course.maxStudents;

  const spotsLeft = course.maxStudents ? 
    course.maxStudents - (course.currentEnrollments || 0) : null;

  // Calculate total price based on session customization
  const calculateTotalPrice = () => {
    if (sessionCustomization.sessionType === 'fixed') {
      return course.dollarPrice || course.price || 0;
    }
    
    if (sessionCustomization.sessionType === 'per_session' && course.sessionPricing?.perSessionPrice) {
      return (sessionCustomization.numberOfSessions || 0) * course.sessionPricing.perSessionPrice;
    }
    
    if (sessionCustomization.sessionType === 'hourly' && course.sessionPricing?.hourlyRate) {
      return (sessionCustomization.totalHours || 0) * course.sessionPricing.hourlyRate;
    }
    
    return course.dollarPrice || course.price || 0;
  };

  const totalPrice = calculateTotalPrice();
  const qualifiesForInstallments = totalPrice >= 200;

  const handleEnrollClick = () => {
    if (!isAvailable) {
      toast.error('This course is currently full. Join the waitlist instead.');
      return;
    }
    
    // If course has session options, go to customization step
    if (course.sessionOptions.perSession || course.sessionOptions.hourly) {
      setState({ ...state, step: 'customize' });
    } else {
      setState({ ...state, step: 'details' });
    }
  };

  const handleCustomizationNext = () => {
    setState({ ...state, step: 'details' });
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ ...state, step: 'payment' });
  };

  const handlePayment = async () => {
    setState({ ...state, loading: true });
    
    try {
      const response = await fetch('/api/course-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course._id,
          studentDetails,
          sessionCustomization,
          amount: totalPrice * 100,
          currency: currentCurrency.code,
          paymentPlan: selectedPaymentPlan,
        }),
      });

      const data = await response.json();
      
      if (data.checkoutUrl) {
        setState({ ...state, step: 'processing' });
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Payment initialization failed');
      }
    } catch (error) {
      setState({ 
        ...state, 
        step: 'error', 
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Preview Step
  if (state.step === 'preview') {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Course Image */}
        <div className="relative h-48 w-full">
          <Image 
            src={course.mainImage || '/digitall_partner.png'} 
            alt={course.title}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/digitall_partner.png';
            }}
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                Course Full
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Price & Availability */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              {(() => {
                // Show different pricing based on session options
                if (course.sessionOptions.fixedPrice) {
                  const basePrice = course.dollarPrice || course.price || 0;
                  const priceInfo = formatPriceWithDiscount(basePrice, { applyNigerianDiscount: true });
                  
                  if (priceInfo.hasDiscount) {
                    return (
                      <div className="space-y-1">
                        <span className="text-lg text-gray-500 line-through block">
                          {priceInfo.originalPrice}
                        </span>
                        <span className="text-3xl font-bold text-green-600">
                          {priceInfo.discountedPrice}
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <span className="text-3xl font-bold text-primary">
                        {priceInfo.discountedPrice}
                      </span>
                    );
                  }
                } else {
                  // Show flexible pricing options
                  return (
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-gray-900">Flexible Pricing</div>
                      {course.sessionOptions.perSession && course.sessionPricing?.perSessionPrice && (
                        <div className="text-sm text-gray-600">
                          {formatPrice(course.sessionPricing.perSessionPrice)} per session
                        </div>
                      )}
                      {course.sessionOptions.hourly && course.sessionPricing?.hourlyRate && (
                        <div className="text-sm text-gray-600">
                          {formatPrice(course.sessionPricing.hourlyRate)} per hour
                        </div>
                      )}
                    </div>
                  );
                }
              })()}
            </div>
            {spotsLeft && spotsLeft <= 5 && (
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                Only {spotsLeft} spots left
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Duration: {course.duration}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Level: {course.level}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              Instructor: {course.instructor}
            </div>
          </div>

          {/* Session Options Preview */}
          {(course.sessionOptions.perSession || course.sessionOptions.hourly) && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Learning Options:</h4>
              <div className="space-y-2">
                {course.sessionOptions.perSession && (
                  <div className="flex items-center text-sm text-blue-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Per-session booking available
                  </div>
                )}
                {course.sessionOptions.hourly && (
                  <div className="flex items-center text-sm text-blue-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Hourly rate option available
                  </div>
                )}
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Flexible scheduling
                </div>
              </div>
            </div>
          )}

          {/* What's Included */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
            <ul className="space-y-2">
              {course.includes.map((item, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleEnrollClick}
            disabled={!isAvailable}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              isAvailable
                ? 'bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAvailable ? (
              course.sessionOptions.perSession || course.sessionOptions.hourly 
                ? 'Customize & Enroll' 
                : 'Enroll Now'
            ) : 'Join Waitlist'}
          </button>

          {/* Money-back guarantee */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              30-day money-back guarantee
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Session Customization Step
  if (state.step === 'customize') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="mb-6">
          <button 
            onClick={() => setState({ ...state, step: 'preview' })}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </button>
          <h3 className="text-xl font-bold text-gray-900">Customize Your Learning Experience</h3>
          <p className="text-gray-600">Choose how you'd like to learn this course</p>
        </div>

        <div className="space-y-6">
          {/* Session Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Learning Format</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {course.sessionOptions.fixedPrice && (
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer ${
                    sessionCustomization.sessionType === 'fixed' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  onClick={() => setSessionCustomization({ ...sessionCustomization, sessionType: 'fixed' })}
                >
                  <h4 className="font-semibold text-gray-900">Fixed Price Course</h4>
                  <p className="text-sm text-gray-600">Complete course with structured curriculum</p>
                  <div className="mt-2 text-lg font-bold text-primary">
                    {formatPrice(course.dollarPrice || course.price || 0)}
                  </div>
                </div>
              )}
              
              {course.sessionOptions.perSession && course.sessionPricing?.perSessionPrice && (
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer ${
                    sessionCustomization.sessionType === 'per_session' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  onClick={() => setSessionCustomization({ ...sessionCustomization, sessionType: 'per_session' })}
                >
                  <h4 className="font-semibold text-gray-900">Per-Session</h4>
                  <p className="text-sm text-gray-600">Pay for individual sessions</p>
                  <div className="mt-2 text-lg font-bold text-primary">
                    {formatPrice(course.sessionPricing.perSessionPrice)} per session
                  </div>
                </div>
              )}
              
              {course.sessionOptions.hourly && course.sessionPricing?.hourlyRate && (
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer ${
                    sessionCustomization.sessionType === 'hourly' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  onClick={() => setSessionCustomization({ ...sessionCustomization, sessionType: 'hourly' })}
                >
                  <h4 className="font-semibold text-gray-900">Hourly Rate</h4>
                  <p className="text-sm text-gray-600">Pay by the hour for flexible learning</p>
                  <div className="mt-2 text-lg font-bold text-primary">
                    {formatPrice(course.sessionPricing.hourlyRate)} per hour
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Session/Hour Configuration */}
          {sessionCustomization.sessionType === 'per_session' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Sessions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={sessionCustomization.numberOfSessions}
                onChange={(e) => setSessionCustomization({ 
                  ...sessionCustomization, 
                  numberOfSessions: parseInt(e.target.value) || 1 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Total: {formatPrice((sessionCustomization.numberOfSessions || 0) * (course.sessionPricing?.perSessionPrice || 0))}
              </p>
            </div>
          )}

          {sessionCustomization.sessionType === 'hourly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
              <input
                type="number"
                min={course.sessionPricing?.minimumHours || 1}
                max="100"
                value={sessionCustomization.totalHours}
                onChange={(e) => setSessionCustomization({ 
                  ...sessionCustomization, 
                  totalHours: parseInt(e.target.value) || 1 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Total: {formatPrice((sessionCustomization.totalHours || 0) * (course.sessionPricing?.hourlyRate || 0))}
                {course.sessionPricing?.minimumHours && (
                  <span> (Minimum {course.sessionPricing.minimumHours} hours)</span>
                )}
              </p>
            </div>
          )}

          {/* Schedule Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Schedule Preference</label>
            <div className="grid grid-cols-3 gap-4">
              {['weekdays', 'weekends', 'flexible'].map((schedule) => (
                <div key={schedule}>
                  <input
                    type="radio"
                    id={schedule}
                    name="schedule"
                    value={schedule}
                    checked={sessionCustomization.schedule === schedule}
                    onChange={(e) => setSessionCustomization({ 
                      ...sessionCustomization, 
                      schedule: e.target.value as 'weekdays' | 'weekends' | 'flexible' 
                    })}
                    className="sr-only"
                  />
                  <label
                    htmlFor={schedule}
                    className={`block w-full p-3 text-center rounded-lg border-2 cursor-pointer ${
                      sessionCustomization.schedule === schedule 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {schedule.charAt(0).toUpperCase() + schedule.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Intensity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Learning Intensity</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'standard', label: 'Standard', desc: '2-3 hours/week' },
                { value: 'intensive', label: 'Intensive', desc: '5-8 hours/week' },
                { value: 'self_paced', label: 'Self-Paced', desc: 'Your own pace' }
              ].map((intensity) => (
                <div key={intensity.value}>
                  <input
                    type="radio"
                    id={intensity.value}
                    name="intensity"
                    value={intensity.value}
                    checked={sessionCustomization.intensity === intensity.value}
                    onChange={(e) => setSessionCustomization({ 
                      ...sessionCustomization, 
                      intensity: e.target.value as 'standard' | 'intensive' | 'self_paced'
                    })}
                    className="sr-only"
                  />
                  <label
                    htmlFor={intensity.value}
                    className={`block w-full p-3 text-center rounded-lg border-2 cursor-pointer ${
                      sessionCustomization.intensity === intensity.value 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="font-semibold">{intensity.label}</div>
                    <div className="text-xs text-gray-500">{intensity.desc}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Total Price Display */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Price:</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setState({ ...state, step: 'preview' })}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCustomizationNext}
              className="flex-1 py-3 px-6 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Student Details Step (enhanced)
  if (state.step === 'details') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="mb-6">
          <button 
            onClick={() => setState({ 
              ...state, 
              step: (course.sessionOptions.perSession || course.sessionOptions.hourly) ? 'customize' : 'preview' 
            })}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h3 className="text-xl font-bold text-gray-900">Student Information</h3>
          <p className="text-gray-600">Help us personalize your learning experience</p>
        </div>

        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={studentDetails.fullName}
                onChange={(e) => setStudentDetails({ ...studentDetails, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={studentDetails.email}
                onChange={(e) => setStudentDetails({ ...studentDetails, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={studentDetails.phone}
              onChange={(e) => setStudentDetails({ ...studentDetails, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                value={studentDetails.experience}
                onChange={(e) => setStudentDetails({ ...studentDetails, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Complete Beginner</option>
                <option value="some-experience">Some Experience</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Class Time
              </label>
              <select
                value={studentDetails.preferredTime}
                onChange={(e) => setStudentDetails({ ...studentDetails, preferredTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              >
                <option value="">Select preferred time</option>
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (1PM - 5PM)</option>
                <option value="evening">Evening (6PM - 9PM)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Learning Goals (Optional)
            </label>
            <textarea
              value={studentDetails.goals}
              onChange={(e) => setStudentDetails({ ...studentDetails, goals: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="What do you hope to achieve from this course?"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setState({ 
                ...state, 
                step: (course.sessionOptions.perSession || course.sessionOptions.hourly) ? 'customize' : 'preview' 
              })}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Payment Step (enhanced with session customization summary)
  if (state.step === 'payment') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="mb-6">
          <button 
            onClick={() => setState({ ...state, step: 'details' })}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Details
          </button>
          <h3 className="text-xl font-bold text-gray-900">Enrollment Summary</h3>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image src={course.mainImage || '/digitall_partner.png'} alt={course.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{course.title}</h4>
              <p className="text-sm text-gray-600">{course.instructor}</p>
              <div className="mt-2 text-lg font-bold text-primary">
                {formatPrice(totalPrice)}
              </div>
            </div>
          </div>
        </div>

        {/* Session Customization Summary */}
        {(course.sessionOptions.perSession || course.sessionOptions.hourly) && (
          <div className="border-t pt-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Learning Configuration</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Format:</span> {
                sessionCustomization.sessionType === 'fixed' ? 'Fixed Price Course' :
                sessionCustomization.sessionType === 'per_session' ? `${sessionCustomization.numberOfSessions} Sessions` :
                `${sessionCustomization.totalHours} Hours`
              }</p>
              <p><span className="text-gray-600">Schedule:</span> {sessionCustomization.schedule}</p>
              <p><span className="text-gray-600">Intensity:</span> {sessionCustomization.intensity.replace('_', ' ')}</p>
            </div>
          </div>
        )}

        {/* Student Info Summary */}
        <div className="border-t pt-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Student Information</h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-600">Name:</span> {studentDetails.fullName}</p>
            <p><span className="text-gray-600">Email:</span> {studentDetails.email}</p>
            <p><span className="text-gray-600">Phone:</span> {studentDetails.phone}</p>
            {studentDetails.experience && (
              <p><span className="text-gray-600">Experience:</span> {studentDetails.experience}</p>
            )}
            {studentDetails.preferredTime && (
              <p><span className="text-gray-600">Preferred Time:</span> {studentDetails.preferredTime}</p>
            )}
          </div>
        </div>

        {/* Payment Plan Selection - Only for courses above $200 */}
        {qualifiesForInstallments && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Choose Payment Plan</h4>
            <div className="space-y-3">
              {COURSE_PAYMENT_PLANS.map((plan) => {
                const downPaymentAmount = (totalPrice * plan.downPayment / 100) + plan.processingFee;
                const remainingPayments = plan.installments > 1 ? (totalPrice * (100 - plan.downPayment) / 100) / (plan.installments - 1) : 0;
                
                return (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedPaymentPlan.id === plan.id
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentPlan(plan)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{plan.name}</h5>
                      {plan.id === 'split_2' && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                    
                    {plan.installments > 1 && (
                      <div className="text-xs text-gray-500">
                        <div>Today: {formatPrice(downPaymentAmount)}</div>
                        {remainingPayments > 0 && (
                          <div>Then: {plan.installments - 1} × {formatPrice(remainingPayments)}</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">Payment Summary</h4>
          {qualifiesForInstallments && selectedPaymentPlan.installments > 1 ? (
            (() => {
              const downPaymentAmount = (totalPrice * selectedPaymentPlan.downPayment / 100) + selectedPaymentPlan.processingFee;
              const remainingPayments = (totalPrice * (100 - selectedPaymentPlan.downPayment) / 100) / (selectedPaymentPlan.installments - 1);
              
              return (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Price:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  {selectedPaymentPlan.processingFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Processing Fee:</span>
                      <span>{formatPrice(selectedPaymentPlan.processingFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatPrice(totalPrice + selectedPaymentPlan.processingFee)}</span>
                  </div>
                  <div className="bg-blue-100 rounded p-2 mt-3">
                    <div className="text-sm">
                      <div className="font-medium text-blue-800">Today's Payment:</div>
                      <div className="text-blue-700">
                        {formatPrice(downPaymentAmount)}
                      </div>
                      {selectedPaymentPlan.installments > 1 && (
                        <div className="text-xs text-blue-600 mt-1">
                          Remaining: {selectedPaymentPlan.installments - 1} payments of {formatPrice(remainingPayments)} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-lg font-bold text-blue-900">
              Total: {formatPrice(totalPrice)}
            </div>
          )}
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={state.loading}
          className="w-full py-4 px-6 bg-accent hover:bg-accent/90 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
        >
          {state.loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            (() => {
              if (qualifiesForInstallments && selectedPaymentPlan.installments > 1) {
                const downPaymentAmount = (totalPrice * selectedPaymentPlan.downPayment / 100) + selectedPaymentPlan.processingFee;
                return `Pay ${formatPrice(downPaymentAmount)} & Enroll`;
              } else {
                return `Pay ${formatPrice(totalPrice)} & Enroll`;
              }
            })()
          )}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Secure payment powered by Stripe • 30-day money-back guarantee</p>
        </div>
      </div>
    );
  }

  // Error Step
  if (state.step === 'error') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Enrollment Failed</h3>
          <p className="text-gray-600 mb-6">{state.error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setState({ ...state, step: 'payment', error: undefined })}
              className="flex-1 py-2 px-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium"
            >
              Try Again
            </button>
            <Link 
              href="/contact"
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}