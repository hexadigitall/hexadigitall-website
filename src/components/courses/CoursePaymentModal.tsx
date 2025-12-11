'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CheckIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import CoursePricingCalculator, { PricingConfiguration } from './CoursePricingCalculator'
import { MonthlyBillingCalculation, SessionCustomization } from '@/types/course'

// Enhanced Course interface for the modal
interface Course {
  _id: string
  title: string
  slug: { current: string }
  mainImage?: string | null
  description: string
  duration: string
  level: string
  instructor: string
  courseType?: 'self-paced' | 'live'
  // Legacy pricing (self-paced courses)
  nairaPrice?: number
  dollarPrice?: number
  price?: number
  // Live course pricing
  hourlyRateUSD?: number
  hourlyRateNGN?: number
  schedulingOptions?: {
    minHoursPerSession: number
    maxHoursPerSession: number
    minSessionsPerWeek: number
    maxSessionsPerWeek: number
    defaultHours: number
  }
  includes?: string[]
  curriculum?: {
    modules: number
    lessons: number
    duration: string
  }
  sessionFormats?: string[]
  timeZones?: string[]
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

interface CoursePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course
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

export function CoursePaymentModal({
  isOpen,
  onClose,
  course
}: CoursePaymentModalProps) {
  const { formatPrice, formatPriceWithDiscount, currentCurrency, getLocalDiscountMessage, convertPrice } = useCurrency()
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<PaymentPlan>(COURSE_PAYMENT_PLANS[0])
  const [pricingConfiguration, setPricingConfiguration] = useState<PricingConfiguration | null>(null)
  const [studentDetails, setStudentDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    goals: '',
    preferredSchedule: ''
  })

  const discountMessage = getLocalDiscountMessage()
  const isLiveCourse = course.courseType === 'live'
  
  // For legacy courses, determine the course price to use
  const legacyCoursePrice = (course.dollarPrice && course.dollarPrice > 0) ? course.dollarPrice : (course.nairaPrice || course.price || 0)
  const useLegacyDollarPrice = !!(course.dollarPrice && course.dollarPrice > 0)
  
  // Check if course qualifies for installments (above $200 or ₦150,000 threshold)
  const qualifiesForInstallments = useLegacyDollarPrice ? legacyCoursePrice >= 200 : legacyCoursePrice >= 150000

  const getCurrentPrice = () => {
    if (isLiveCourse && pricingConfiguration) {
      return pricingConfiguration.totalMonthlyPrice
    }
    return legacyCoursePrice
  }

  const handlePriceChange = (billingCalculation: MonthlyBillingCalculation, customization: SessionCustomization) => {
    // Convert to PricingConfiguration for compatibility
    const configuration: PricingConfiguration = {
      hoursPerWeek: billingCalculation.hoursPerWeek,
      weeksPerMonth: 4,
      totalHours: billingCalculation.hoursPerMonth,
      sessionFormat: customization.sessionFormat,
      currency: billingCalculation.currency,
      hourlyRate: billingCalculation.adjustedHourlyRate,
      totalMonthlyPrice: billingCalculation.monthlyTotal
    }
    setPricingConfiguration(configuration)
  }

  const handleEnrollment = async () => {
    try {
      const currentPrice = getCurrentPrice()
      
      // CRITICAL: Paystack only accepts NGN for Nigerian transactions
      // We must convert ALL currencies to NGN before sending to Paystack
      let amountInNGN: number;
      
      if (isLiveCourse && pricingConfiguration) {
        // For live courses with custom pricing
        const displayCurrency = pricingConfiguration.currency;
        const displayAmount = pricingConfiguration.totalMonthlyPrice;
        
        if (displayCurrency === 'NGN') {
          // Already in NGN
          amountInNGN = displayAmount;
        } else {
          // Convert from display currency to NGN
          // Use convertPrice to get the amount in NGN
          amountInNGN = convertPrice(displayCurrency === 'USD' ? displayAmount : displayAmount, 'NGN');
        }
      } else {
        // Legacy self-paced courses
        if (useLegacyDollarPrice) {
          // Convert USD to NGN
          amountInNGN = convertPrice(currentPrice, 'NGN');
        } else {
          // Already in NGN
          amountInNGN = currentPrice;
        }
      }
      
      console.log('💳 [ENROLLMENT] Display:', currentPrice, currentCurrency.code, '→ Paystack:', amountInNGN, 'NGN');
      
      const enrollmentData = {
        courseId: course._id,
        courseType: course.courseType || 'self-paced',
        studentDetails,
        paymentPlan: selectedPaymentPlan,
        amount: amountInNGN, // Always send NGN amount
        currency: 'NGN', // Always NGN for Paystack
        displayCurrency: currentCurrency.code, // Track what user saw
        displayAmount: currentPrice, // Track what user saw
        pricingConfiguration: isLiveCourse ? pricingConfiguration : null
      }

      const response = await fetch('/api/course-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollmentData)
      })

      const data = await response.json()
      
      if (data.useSubscription && data.subscriptionData) {
        // Handle subscription flow for live courses
        await handleSubscriptionEnrollment(data.subscriptionData)
      } else if (data.checkoutUrl) {
        // Handle one-time payment flow
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Enrollment failed')
      }
    } catch (error) {
      console.error('Enrollment error:', error)
      alert('Enrollment failed. Please try again or contact support.')
    }
  }
  
  const handleSubscriptionEnrollment = async (subscriptionData: Record<string, unknown>) => {
    try {
      console.log('🔄 [SUBSCRIPTION] Creating subscription for live course:', subscriptionData)
      
      // Create subscription plan
      const typedData = subscriptionData as {
        courseId: string;
        courseName: string;
        billingCalculation: { currency: string; [key: string]: unknown };
        sessionCustomization: { preferredDays?: string[]; [key: string]: unknown };
        studentDetails: Record<string, unknown>;
      };
      
      const subscriptionPlan = {
        id: `plan_${course._id}_${Date.now()}`,
        courseId: typedData.courseId,
        courseName: typedData.courseName,
        billingCalculation: typedData.billingCalculation,
        sessionCustomization: typedData.sessionCustomization,
        currency: typedData.billingCalculation.currency,
        interval: 'month' as const,
      }
      
      // Create subscription request
      const subscriptionRequest = {
        courseId: typedData.courseId,
        studentDetails: typedData.studentDetails,
        plan: subscriptionPlan,
        trialPeriodDays: 7, // 7-day trial for live courses
        preferredSchedule: {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          daysOfWeek: typedData.sessionCustomization.preferredDays || ['monday', 'wednesday', 'friday'],
          preferredTimes: ['morning', 'afternoon']
        }
      }
      
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionRequest)
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Subscription created successfully
        alert('Subscription created successfully! Your 7-day trial has begun.')
        window.location.href = `/enrollment-success?subscription_id=${result.subscription.id}&course_id=${course._id}&type=subscription`
      } else if (result.requiresAction && result.clientSecret) {
        // Payment method setup required - integrate with Stripe Elements for 3D Secure verification
        alert('Payment method setup required. Please complete the payment setup to activate your subscription.')
        // Redirect to payment setup page or handle inline with Stripe Payment Element
        console.log('Payment setup required:', result.clientSecret)
      } else {
        throw new Error(result.error || 'Subscription creation failed')
      }
    } catch (error) {
      console.error('Subscription enrollment error:', error)
      alert('Subscription enrollment failed. Please try again or contact support.')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enroll in ${course.title}`}
      size="xl"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Nigerian discount banner */}
        {discountMessage && !isLiveCourse && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <span>🇳🇬</span>
              <span className="font-medium">Nigerian Launch Special: 50% OFF!</span>
              <span>🔥</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Special pricing for Nigerian clients - limited time offer!
            </p>
          </div>
        )}

        {/* Live Course Info Banner */}
        {isLiveCourse && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <span>🎓</span>
              <span className="font-medium">Live Mentoring Course</span>
              <span>✨</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Personalized live sessions with flexible scheduling and monthly billing.
            </p>
          </div>
        )}

        {/* Course Overview */}
        <div className="flex gap-4">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            {course.mainImage ? (
              <Image 
                src={course.mainImage} 
                alt={`${course.title} course image`}
                fill
                className="object-cover"
                sizes="96px"
                quality={75}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-2">
              <span><span className="sr-only">Instructor: </span>👨‍🏫 {course.instructor}</span>
              <span><span className="sr-only">Duration: </span>⏱️ {course.duration}</span>
              <span><span className="sr-only">Level: </span>📊 {course.level}</span>
              {isLiveCourse && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Live Sessions</span>}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
          </div>
        </div>

        {/* Live Course Pricing Calculator */}
        {isLiveCourse && course.hourlyRateUSD && course.hourlyRateNGN && (
          <>
            {console.log('🎓 [MODAL] Live course pricing:', { hourlyRateUSD: course.hourlyRateUSD, hourlyRateNGN: course.hourlyRateNGN, courseTitle: course.title })}
            <CoursePricingCalculator
              hourlyRateUSD={course.hourlyRateUSD}
              hourlyRateNGN={course.hourlyRateNGN}
              schedulingOptions={course.schedulingOptions}
              onPriceChange={handlePriceChange}
            />
          </>
        )}

        {/* Course Details */}
        {course.curriculum && (
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Course Structure</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>{course.curriculum.modules} Modules</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>{course.curriculum.lessons} Lessons</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Certificate Included</span>
              </div>
            </div>
          </div>
        )}

        {/* What's Included */}
        {course.includes && course.includes.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">What&apos;s Included</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {course.includes.map((item, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Student Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={studentDetails.fullName}
                onChange={(e) => setStudentDetails({ ...studentDetails, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="your.email@example.com"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                value={studentDetails.experience}
                onChange={(e) => setStudentDetails({ ...studentDetails, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select your level</option>
                <option value="beginner">Complete Beginner</option>
                <option value="some-experience">Some Experience</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            {isLiveCourse && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Schedule (Optional)
                </label>
                <textarea
                  value={studentDetails.preferredSchedule}
                  onChange={(e) => setStudentDetails({ ...studentDetails, preferredSchedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={2}
                  placeholder="e.g., Weekdays after 6 PM WAT, Weekends preferred"
                />
              </div>
            )}
          </div>
        </div>

        {/* Payment Plan Selection - Only for legacy courses above threshold */}
        {!isLiveCourse && qualifiesForInstallments && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Choose Payment Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {COURSE_PAYMENT_PLANS.map((plan) => (
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
                    <h5 className="font-semibold text-gray-900 text-sm">{plan.name}</h5>
                    {plan.id === 'split_2' && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{plan.description}</p>
                  
                  {plan.installments > 1 && (
                    <div className="text-xs text-gray-500">
                      <div>Today: {useLegacyDollarPrice 
                        ? formatPrice((legacyCoursePrice * plan.downPayment / 100) + plan.processingFee, { applyNigerianDiscount: true })
                        : `₦${((legacyCoursePrice * plan.downPayment / 100) + (plan.processingFee * 1650)).toLocaleString()}`
                      }</div>
                      {plan.installments > 1 && (
                        <div>Then: {plan.installments - 1} × {useLegacyDollarPrice
                          ? formatPrice((legacyCoursePrice * (100 - plan.downPayment) / 100) / (plan.installments - 1), { applyNigerianDiscount: true })
                          : `₦${((legacyCoursePrice * (100 - plan.downPayment) / 100) / (plan.installments - 1)).toLocaleString()}`
                        }</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <h5 className="font-medium text-gray-900">{course.title}</h5>
              <p className="text-sm text-gray-600">
                {isLiveCourse ? 'Live Mentoring Course (Monthly)' : 'Course Enrollment'}
              </p>
            </div>
            <div className="text-right">
              {isLiveCourse && pricingConfiguration ? (
                <div className="text-lg font-bold text-green-600">
                  {new Intl.NumberFormat(pricingConfiguration.currency === 'NGN' ? 'en-NG' : 'en-US', {
                    style: 'currency',
                    currency: pricingConfiguration.currency,
                    minimumFractionDigits: 0
                  }).format(pricingConfiguration.totalMonthlyPrice)}
                  <span className="text-sm font-normal text-gray-600">/month</span>
                </div>
              ) : course.dollarPrice && course.dollarPrice > 0 ? (
                <div>
                  {(() => {
                    const priceInfo = formatPriceWithDiscount(course.dollarPrice, { applyNigerianDiscount: true })
                    
                    if (priceInfo.hasDiscount) {
                      return (
                        <div>
                          <div className="text-sm text-gray-500 line-through">
                            {priceInfo.originalPrice}
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {priceInfo.discountedPrice}
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div className="text-lg font-bold text-primary">
                          {priceInfo.discountedPrice}
                        </div>
                      )
                    }
                  })()
                }
                </div>
              ) : (course.nairaPrice || course.price) ? (
                <div>
                  {(() => {
                    // Convert NGN to USD first, then format in selected currency
                    const nairaAmount = course.nairaPrice || course.price || 0;
                    const usdEquivalent = nairaAmount / 1650;
                    const priceInfo = formatPriceWithDiscount(usdEquivalent, { applyNigerianDiscount: true })
                    
                    if (priceInfo.hasDiscount) {
                      return (
                        <div>
                          <div className="text-sm text-gray-500 line-through">
                            {priceInfo.originalPrice}
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {priceInfo.discountedPrice}
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div className="text-lg font-bold text-primary">
                          {priceInfo.discountedPrice}
                        </div>
                      )
                    }
                  })()
                }
                </div>
              ) : (
                <div className="text-lg font-bold text-green-600">
                  Free
                </div>
              )}
            </div>
          </div>

          {!isLiveCourse && qualifiesForInstallments && selectedPaymentPlan.installments > 1 && (
            <div className="border-t pt-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Payment Plan:</span>
                  <span className="text-sm text-blue-700">{selectedPaymentPlan.name}</span>
                </div>
                
                <div className="bg-blue-100 rounded p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 font-medium">Today&apos;s Payment:</span>
                    <span className="text-sm font-bold text-green-600">
                      {useLegacyDollarPrice 
                        ? formatPrice((legacyCoursePrice * selectedPaymentPlan.downPayment / 100) + selectedPaymentPlan.processingFee, { applyNigerianDiscount: true })
                        : `₦${((legacyCoursePrice * selectedPaymentPlan.downPayment / 100) + (selectedPaymentPlan.processingFee * 1650)).toLocaleString()}`
                      }
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Includes {selectedPaymentPlan.downPayment}% of course + processing fee
                  </div>
                </div>
                
                {selectedPaymentPlan.installments > 1 && (
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-blue-700">
                      Remaining {selectedPaymentPlan.installments - 1} payments:
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {useLegacyDollarPrice
                        ? formatPrice((legacyCoursePrice * (100 - selectedPaymentPlan.downPayment) / 100) / (selectedPaymentPlan.installments - 1), { applyNigerianDiscount: true })
                        : `₦${((legacyCoursePrice * (100 - selectedPaymentPlan.downPayment) / 100) / (selectedPaymentPlan.installments - 1)).toLocaleString()}`
                      } each
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {discountMessage && useLegacyDollarPrice && !isLiveCourse && (
            <div className="text-sm text-green-600 text-right mt-2">
              You save {formatPrice(legacyCoursePrice * 0.5)}!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleEnrollment}
            disabled={!studentDetails.fullName || !studentDetails.email || !studentDetails.phone || (isLiveCourse && !pricingConfiguration)}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLiveCourse 
              ? 'Start Live Sessions'
              : (!isLiveCourse && qualifiesForInstallments && selectedPaymentPlan.installments > 1
                ? `Pay ${useLegacyDollarPrice 
                    ? formatPrice((legacyCoursePrice * selectedPaymentPlan.downPayment / 100) + selectedPaymentPlan.processingFee, { applyNigerianDiscount: true })
                    : `₦${((legacyCoursePrice * selectedPaymentPlan.downPayment / 100) + (selectedPaymentPlan.processingFee * 1650)).toLocaleString()}`
                  } & Enroll`
                : 'Enroll Now'
              )
            }
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckIcon className="h-3 w-3 text-white" />
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What happens after enrollment?</p>
              <ul className="space-y-1 text-blue-700">
                {isLiveCourse ? (
                  <>
                    <li>• We&apos;ll contact you within 24 hours to schedule your first session</li>
                    <li>• Flexible scheduling based on your preferences</li>
                    <li>• Access to course materials and resources</li>
                    <li>• Monthly billing for ongoing sessions</li>
                    <li>• Cancel or pause anytime with 1-week notice</li>
                  </>
                ) : (
                  <>
                    <li>• You&apos;ll receive immediate access to course materials</li>
                    <li>• Welcome email with login credentials and course roadmap</li>
                    <li>• Access to our private student community</li>
                    <li>• 30-day money-back guarantee</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CoursePaymentModal
