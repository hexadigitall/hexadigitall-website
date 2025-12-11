// src/components/CourseEnrollment.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useCurrency } from '@/contexts/CurrencyContext';
import CoursePaymentModal from '@/components/courses/CoursePaymentModal';

// Enhanced course interface
export interface CourseEnrollmentData {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  nairaPrice?: number;
  dollarPrice?: number;
  courseType?: 'live' | 'self-paced';
  hourlyRateUSD?: number;
  hourlyRateNGN?: number;
  duration: string;
  level: string;
  prerequisites?: string[];
  maxStudents?: number;
  currentEnrollments?: number;
  startDate?: string;
  instructor: string;
  description: string;
  mainImage?: string | null;
  curriculum?: {
    modules: number;
    lessons: number;
    duration: string;
  };
  includes?: string[];
  certificate?: boolean;
  schedulingOptions?: {
    minHoursPerSession: number;
    maxHoursPerSession: number;
    minSessionsPerWeek: number;
    maxSessionsPerWeek: number;
    defaultHours: number;
  };
  sessionFormats?: string[];
  timeZones?: string[];
}

export default function CourseEnrollment({ course }: { course: CourseEnrollmentData }) {
  const { formatPriceWithDiscount, convertPrice, currentCurrency } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check course availability
  const isAvailable = !course.maxStudents || 
    (course.currentEnrollments || 0) < course.maxStudents;

  const spotsLeft = course.maxStudents ? 
    course.maxStudents - (course.currentEnrollments || 0) : null;

  // Check if this is a live course with PPP pricing
  const isLiveCourse = course.courseType === 'live' && course.hourlyRateUSD && course.hourlyRateNGN;

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
              // Check if it's a live course with PPP pricing
              if (isLiveCourse) {
                const defaultSessions = 1;
                const defaultHours = 1;
                const monthlyUsd = course.hourlyRateUSD! * defaultSessions * defaultHours * 4;
                const monthlyNgn = course.hourlyRateNGN! * defaultSessions * defaultHours * 4;
                const currency = currentCurrency.code;

                const monthlyPrice = currency === 'NGN'
                  ? monthlyNgn
                  : convertPrice(monthlyUsd, currency);

                return (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">Starting from</div>
                    <span className="text-3xl font-bold text-primary">
                      {new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency,
                        minimumFractionDigits: currency === 'NGN' ? 0 : 2,
                        maximumFractionDigits: currency === 'NGN' ? 0 : 2
                      }).format(monthlyPrice)}
                    </span>
                    <div className="text-sm text-gray-600">/month</div>
                    <div className="text-xs text-blue-600 mt-1">💡 Monthly Subscription • Flexible Scheduling</div>
                  </div>
                );
              }
              
              // Legacy pricing for self-paced courses
              if (course.dollarPrice && course.dollarPrice > 0) {
                const priceInfo = formatPriceWithDiscount(course.dollarPrice, { applyNigerianDiscount: true })
                
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
                  )
                } else {
                  return (
                    <span className="text-3xl font-bold text-primary">
                      {priceInfo.discountedPrice}
                    </span>
                  )
                }
              } else if (course.nairaPrice || course.price) {
                const nairaAmount = course.nairaPrice || course.price || 0;
                const usdEquivalent = nairaAmount / 1650;
                const priceInfo = formatPriceWithDiscount(usdEquivalent, { applyNigerianDiscount: true })
                
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
                  )
                } else {
                  return (
                    <span className="text-3xl font-bold text-primary">
                      {priceInfo.discountedPrice}
                    </span>
                  )
                }
              } else {
                return <span className="text-3xl font-bold text-green-600">Free</span>
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

        {/* What's Included */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">What&apos;s Included:</h4>
          <ul className="space-y-2">
            {(course.includes || []).map((item, index) => (
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
          onClick={() => setIsModalOpen(true)}
          disabled={!isAvailable}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            isAvailable
              ? 'bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'Enroll Now' : 'Join Waitlist'}
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

      {/* Enrollment Modal */}
      <CoursePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={{
          _id: course._id,
          title: course.title,
          slug: course.slug,
          mainImage: course.mainImage,
          description: course.description,
          duration: course.duration,
          level: course.level,
          instructor: course.instructor,
          courseType: course.courseType,
          nairaPrice: course.nairaPrice,
          dollarPrice: course.dollarPrice,
          price: course.price,
          hourlyRateUSD: course.hourlyRateUSD,
          hourlyRateNGN: course.hourlyRateNGN,
          schedulingOptions: course.schedulingOptions,
          includes: course.includes,
          curriculum: course.curriculum,
          sessionFormats: course.sessionFormats,
          timeZones: course.timeZones,
        }}
      />
    </div>
  );
}
