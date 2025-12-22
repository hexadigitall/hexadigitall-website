"use client"

import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { getFallbackCourseCategories } from '@/lib/fallback-data'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import CoursePaymentModal from '@/components/courses/CoursePaymentModal';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { getWhatsAppLink, getCourseInquiryMessage } from '@/lib/whatsapp'; 

// Define types for our data
interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  mainImage: string | null;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  courseType?: 'live' | 'self-paced';
  // PPP Pricing (for live courses)
  hourlyRateUSD?: number;
  hourlyRateNGN?: number;
  // Legacy pricing (for self-paced courses)
  nairaPrice?: number;
  dollarPrice?: number;
  price?: number;
  featured: boolean;
  durationWeeks?: number;
  hoursPerWeek?: number;
  modules?: number;
  lessons?: number;
  includes?: string[];
  certificate?: boolean;
  maxStudents?: number;
  currentEnrollments?: number;
}

interface School {
  _id: string;
  title: string;
  description: string;
  courses: Course[];
}

interface CoursesPageContentProps {
  initialData?: School[];
}

function CoursesPageContentEnhanced({ initialData }: CoursesPageContentProps = {}) {
  const [schools, setSchools] = useState<School[]>(
    (initialData || []).filter(school => school.courses && school.courses.length > 0)
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  
  // ✅ Get Currency Context
  const { formatPriceWithDiscount, convertPrice, currentCurrency } = useCurrency();

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const filtered = initialData.filter(school => school.courses && school.courses.length > 0);
      setSchools(filtered);
      return;
    }
    
    let isMounted = true;
    async function fetchSchools() {
      try {
        setLoading(true);
        const schoolsQuery = groq`*[_type == "school"] | order(order asc) {
          _id,
          title,
          description,
          "courses": *[_type == "course" && references(^._id)] | order(order asc) {
            _id,
            title,
            slug,
            summary,
            description,
            "mainImage": mainImage.asset->url,
            duration,
            level,
            instructor,
            courseType,
            hourlyRateUSD,
            hourlyRateNGN,
            nairaPrice,
            dollarPrice,
            price,
            featured
          }
        }`;
        const data: School[] = await client.fetch(schoolsQuery);
        if (!isMounted) return;
        setSchools((data || []).filter(school => school.courses && school.courses.length > 0));
      } catch (err) {
        console.error('Error fetching schools:', err);
        setError('Failed to load courses.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSchools();
    return () => { isMounted = false; };
  }, [initialData]);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setShowEnrollmentModal(true);
  };

  const handleCloseModal = () => {
    setShowEnrollmentModal(false);
    setSelectedCourse(null);
  };

  // ⚡ WhatsApp Logic
  const handleWhatsAppClick = (course: Course, priceDisplay: string) => {
    const message = getCourseInquiryMessage(course.title, priceDisplay);
    const link = getWhatsAppLink(message);
    window.open(link, '_blank');
  };

  if (loading) return <div className="py-20 text-center">Loading courses...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Courses' }]} />
        </div>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Enhanced Courses</h1>
          <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
            Choose from flexible learning options: fixed-price courses, per-session booking, or hourly rates.
          </p>
        </div>

        {schools.length === 0 ? (
          <div className="text-center py-16">
             <p className="text-xl text-darkText mb-4">No courses are currently available.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {schools.filter(school => school.courses && school.courses.length > 0).map((school) => (
              <div key={school._id}>
                <h2 className="text-3xl font-bold font-heading border-b-2 border-primary pb-2 mb-8">{school.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {school.courses.map((course) => {
                    
                    // 💰 DYNAMIC MULTI-CURRENCY PRICING LOGIC 💰
                    const currencyCode = currentCurrency?.code || 'USD';
                    let displayPrice = "";
                    let displayLabel = "One-Time Payment";
                    
                    // CASE 1: Live Courses (Monthly Subscription)
                    if (course.courseType === 'live' && course.hourlyRateUSD && course.hourlyRateNGN) {
                      displayLabel = "Monthly Mentorship";
                      
                      const monthlyUSD = course.hourlyRateUSD * 4;
                      const monthlyNGN = course.hourlyRateNGN * 4;
                      let finalValue = monthlyUSD;

                      // PPP Check: Use local NGN rate if strictly NGN, otherwise convert USD to target
                      if (currencyCode === 'NGN') {
                         finalValue = monthlyNGN;
                      } else {
                         finalValue = convertPrice(monthlyUSD, currencyCode);
                      }
                      
                      // Format with correct symbol ($, €, £, ₦) automatically
                      displayPrice = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currencyCode,
                        maximumFractionDigits: 0
                      }).format(finalValue) + '/mo';

                    } 
                    // CASE 2: Self-Paced (One-time)
                    else {
                      if (course.dollarPrice) {
                        // formatPriceWithDiscount handles conversion and symbols automatically
                        const formatted = formatPriceWithDiscount(course.dollarPrice, { applyNigerianDiscount: false });
                        displayPrice = formatted.discountedPrice;
                      } else if (course.nairaPrice) {
                        // Fallback logic for legacy NGN-only courses
                        if (currencyCode === 'NGN') {
                           displayPrice = `₦${course.nairaPrice.toLocaleString()}`;
                        } else {
                           // Approximate conversion if we only have NGN price
                           const approxUSD = course.nairaPrice / 1650;
                           const converted = convertPrice(approxUSD, currencyCode);
                           displayPrice = new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: currencyCode,
                              maximumFractionDigits: 0
                           }).format(converted);
                        }
                      } else {
                        displayPrice = "Free";
                      }
                    }

                    return (
                    <article 
                      key={course._id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden">
                        {course.mainImage ? (
                          <Image src={course.mainImage} alt={course.title} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          {course.level || 'Course'}
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                          {course.description || course.summary || 'Course description coming soon...'}
                        </p>
                        
                        {/* Meta */}
                        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                           <div className="flex items-center">⏱️ {course.duration}</div>
                           {course.courseType === 'live' && <div className="text-blue-600 font-medium">🔴 Live</div>}
                        </div>
                        
                        {/* Pricing Display */}
                        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className={`text-xs font-bold uppercase mb-1 ${course.courseType === 'live' ? 'text-blue-600' : 'text-green-600'}`}>
                              {displayLabel}
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {displayPrice}
                            </div>
                          </div>
                        </div>
                        
                        {/* ⚡ BUTTONS ⚡ */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <button
                            onClick={() => handleWhatsAppClick(course, displayPrice)}
                            className="flex items-center justify-center px-4 py-3 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-bold text-sm"
                          >
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Chat
                          </button>
                          <button
                            onClick={() => handleEnrollClick(course)}
                            className="flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm"
                          >
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    </article>
                  )})}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedCourse && (
          <CoursePaymentModal
            isOpen={showEnrollmentModal}
            onClose={handleCloseModal}
            course={selectedCourse}
          />
        )}
      </div>
    </section>
  );
}

export default CoursesPageContentEnhanced;