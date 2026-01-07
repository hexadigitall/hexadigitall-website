"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getWhatsAppLink } from '@/lib/whatsapp' 

// 🛡️ FLEXIBLE INTERFACE: Matches what Sanity actually returns
export interface Course {
  _id: string
  title: string
  slug: { current: string }
  mainImage: string | null
  description?: string
  summary?: string
  duration: string
  level: string
  instructor: string
  courseType?: 'self-paced' | 'live' | string
  
  // Pricing
  nairaPrice?: number
  dollarPrice?: number
  price?: number
  
  // Live Pricing
  hourlyRateUSD?: number
  hourlyRateNGN?: number
  
  featured?: boolean
  
  // Allow other props to pass through without errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any 
}

export default function CourseCard({ 
  course, 
  onEnrollClick 
}: { 
  course: Course; 
  onEnrollClick?: (course: Course) => void 
}) {
  const fallbackImage = '/digitall_partner.png'
  const { convertPrice, currentCurrency, formatPriceWithDiscount } = useCurrency()
  
  if (!course) return null
  
  const safeTitle = course.title || 'Untitled Course'
  const safeSlug = course.slug?.current || '#'
  const safeImage = course.mainImage || fallbackImage
  const safeDescription = course.summary || course.description || 'Course description coming soon...'
  const isLiveCourse = course.courseType === 'live'
  
  // 🧠 Pricing Logic
  const getDisplayPrice = () => {
    // 1. Live Course Logic
    if (isLiveCourse && course.hourlyRateUSD && course.hourlyRateNGN && currentCurrency) {
      const defaultSessions = 1; 
      const defaultHours = 1; 
      const monthlyUsd = course.hourlyRateUSD * defaultSessions * defaultHours * 4 
      const monthlyNgn = course.hourlyRateNGN * defaultSessions * defaultHours * 4
      
      const currency = currentCurrency.code || 'USD'
      const monthlyPrice = currency === 'NGN' ? monthlyNgn : convertPrice(monthlyUsd, currency)

      return { price: monthlyPrice, isLive: true, currency }
    } 
    // 2. Standard Course Logic
    else if (course.dollarPrice || course.nairaPrice || course.price) {
      const nairaAmount = course.nairaPrice || course.price || 0;
      const usdEquivalent = course.dollarPrice || (nairaAmount / 1650);
      
      const priceInfo = formatPriceWithDiscount(usdEquivalent, { applyNigerianDiscount: true })
      return { priceInfo, isLive: false }
    }
    return null
  }

  const displayPrice = getDisplayPrice()
  
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const message = `Hello Hexadigitall! I'm interested in the *${safeTitle}* course. Can you give me more details about the curriculum?`;
    window.open(getWhatsAppLink(message), '_blank');
  }

  return (
    <article className="bg-white rounded-2xl overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 group relative border border-gray-100 flex flex-col h-full">
      {/* 🔗 1. CLICKABLE IMAGE */}
      <Link href={`/courses/${safeSlug}`} className="relative aspect-video overflow-hidden block cursor-pointer">
        <Image
          src={safeImage}
          alt={`${safeTitle} course preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {course.level || 'Course'}
        </div>
        {isLiveCourse && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            Live Sessions
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* 🔗 2. CLICKABLE TITLE */}
        <Link href={`/courses/${safeSlug}`} className="block group-hover:text-primary transition-colors cursor-pointer">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {safeTitle}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {safeDescription}
        </p>
        
        {/* DURATION */}
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{course.duration}</span>
          </div>
        </div>

        {/* PRICING */}
        <div className="mb-4 h-14 flex flex-col justify-center">
          {displayPrice?.isLive ? (
            <div className="space-y-0.5">
              <div className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                MONTHLY SUBSCRIPTION
              </div>
              <div className="text-primary font-bold text-xl">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: displayPrice.currency, maximumFractionDigits: 0 }).format(displayPrice.price ?? 0)}
                <span className="text-xs font-normal text-gray-500">/mo</span>
              </div>
            </div>
          ) : displayPrice?.priceInfo ? (
            <div className="space-y-0.5">
               {displayPrice.priceInfo.hasDiscount && (
                <span className="text-gray-400 line-through text-sm block">
                  {displayPrice.priceInfo.originalPrice}
                </span>
              )}
              <span className="text-primary font-bold text-2xl">
                {displayPrice.priceInfo.discountedPrice}
              </span>
            </div>
          ) : (
            <span className="text-green-600 font-bold text-2xl">Free</span>
          )}
        </div>
        
        {/* 🔘 3. BUTTONS ROW */}
        <div className="space-y-3 mt-auto">
          {/* Main Action: Enroll */}
          <button
            onClick={() => {
              if (onEnrollClick) {
                onEnrollClick(course);
              } else {
                // Fallback: Direct link to course with scroll to payment
                window.location.href = `/courses/${safeSlug}#payment`;
              }
            }}
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold shadow-sm"
          >
            {isLiveCourse ? 'Customize & Subscribe' : 'Enroll Now'}
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Learn More */}
            <Link
              href={`/courses/${safeSlug}`}
              className="inline-flex items-center justify-center w-full px-3 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
            >
              Learn More
            </Link>
            
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center w-full px-3 py-2 text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}