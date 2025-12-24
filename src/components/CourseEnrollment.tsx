"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useCurrency } from '@/contexts/CurrencyContext';
import CoursePaymentModal from '@/components/courses/CoursePaymentModal';
import { getWhatsAppLink } from '@/lib/whatsapp'; 

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

  // ⚡ WhatsApp Handler
  const handleWhatsApp = () => {
    const message = `Hi Hexadigitall! I'm interested in enrolling in the *${course.title}* course. Is there still a slot available?`;
    window.open(getWhatsAppLink(message), '_blank');
  };

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
              
              if (course.dollarPrice && course.dollarPrice > 0) {
                const priceInfo = formatPriceWithDiscount(course.dollarPrice, { applyNigerianDiscount: true })
                if (priceInfo.hasDiscount) {
                  return (
                    <div className="space-y-1">
                      <span className="text-lg text-gray-500 line-through block">{priceInfo.originalPrice}</span>
                      <span className="text-3xl font-bold text-green-600">{priceInfo.discountedPrice}</span>
                    </div>
                  )
                } else {
                  return <span className="text-3xl font-bold text-primary">{priceInfo.discountedPrice}</span>
                }
              } else if (course.nairaPrice || course.price) {
                const nairaAmount = course.nairaPrice || course.price || 0;
                const usdEquivalent = nairaAmount / 1650;
                const priceInfo = formatPriceWithDiscount(usdEquivalent, { applyNigerianDiscount: true })
                if (priceInfo.hasDiscount) {
                  return (
                    <div className="space-y-1">
                      <span className="text-lg text-gray-500 line-through block">{priceInfo.originalPrice}</span>
                      <span className="text-3xl font-bold text-green-600">{priceInfo.discountedPrice}</span>
                    </div>
                  )
                } else {
                  return <span className="text-3xl font-bold text-primary">{priceInfo.discountedPrice}</span>
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
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>
            Duration: {course.duration}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Level: {course.level}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" /></svg>
            Instructor: {course.instructor}
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">What&apos;s Included:</h4>
          <ul className="space-y-2">
            {(course.includes || []).map((item, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
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

          {/* ⚡ WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className="w-full py-3 px-6 rounded-lg font-semibold border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </button>
        </div>

        {/* Money-back guarantee */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            30-day money-back guarantee
          </div>
        </div>
      </div>

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