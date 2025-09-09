// src/components/CourseEnrollment.tsx
"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

// Enhanced course interface
export interface CourseEnrollmentData {
  _id: string;
  title: string;
  price: number;
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
}

interface EnrollmentState {
  step: 'preview' | 'details' | 'payment' | 'processing' | 'success' | 'error';
  loading: boolean;
  error?: string;
}

interface StudentDetails {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  goals: string;
}

export default function CourseEnrollment({ course }: { course: CourseEnrollmentData }) {
  const [state, setState] = useState<EnrollmentState>({ step: 'preview', loading: false });
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    goals: ''
  });

  // Check course availability
  const isAvailable = !course.maxStudents || 
    (course.currentEnrollments || 0) < course.maxStudents;

  const spotsLeft = course.maxStudents ? 
    course.maxStudents - (course.currentEnrollments || 0) : null;

  const handleEnrollClick = () => {
    if (!isAvailable) {
      toast.error('This course is currently full. Join the waitlist instead.');
      return;
    }
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
          amount: course.price * 100, // Convert to kobo
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

  // Preview Step (Default)
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
            <div className="text-3xl font-bold text-gray-900">
              ₦{course.price.toLocaleString()}
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
      </div>
    );
  }

  // Student Details Step
  if (state.step === 'details') {
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
              onClick={() => setState({ ...state, step: 'preview' })}
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

  // Payment Step
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
              <Image src={course.mainImage} alt={course.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{course.title}</h4>
              <p className="text-sm text-gray-600">{course.instructor}</p>
              <p className="text-lg font-bold text-gray-900 mt-2">₦{course.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

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
          </div>
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
            `Pay ₦${course.price.toLocaleString()} & Enroll`
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
