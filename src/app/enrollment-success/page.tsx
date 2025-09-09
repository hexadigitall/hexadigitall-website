// src/app/enrollment-success/page.tsx
import { client } from '@/sanity/client'
import { groq } from 'next-sanity';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  _id: string;
  title: string;
  instructor: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  duration: string;
  level: string;
}

interface Enrollment {
  _id: string;
  studentName: string;
  studentEmail: string;
  enrolledAt: string;
  course: Course;
}

export default async function EnrollmentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; course_id?: string }>;
}) {
  const { session_id, course_id } = await searchParams;

  if (!session_id || !course_id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Access</h1>
          <p className="text-gray-600 mb-6">This enrollment confirmation link is invalid or has expired.</p>
          <Link href="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  // Fetch enrollment details
  const enrollment: Enrollment | null = await client.fetch(
    groq`*[_type == "enrollment" && stripeSessionId == $sessionId][0] {
      _id,
      studentName,
      studentEmail,
      enrolledAt,
      "course": courseId-> {
        _id,
        title,
        instructor,
        mainImage {
          asset-> {
            url
          }
        },
        duration,
        level
      }
    }`,
    { sessionId: session_id }
  );

  if (!enrollment) {
    // Enrollment might still be pending, try to confirm it
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/course-enrollment?session_id=${session_id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        // Redirect to refresh the page with confirmed enrollment
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Processing Your Enrollment...</h1>
                <p className="text-gray-600">Please wait while we confirm your enrollment.</p>
              </div>
              <script dangerouslySetInnerHTML={{
                __html: `setTimeout(() => window.location.reload(), 3000);`
              }} />
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error('Error confirming enrollment:', error);
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Enrollment Processing</h1>
          <p className="text-gray-600 mb-6">Your enrollment is being processed. Please check your email for confirmation or contact support if you don&apos;t receive it within 24 hours.</p>
          <div className="space-y-3">
            <Link href="/courses" className="btn-primary w-full block text-center">
              Browse More Courses
            </Link>
            <Link href="/contact" className="btn-secondary w-full block text-center">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the Course! 🎉</h1>
            <p className="text-xl text-gray-600">Your enrollment was successful. Let&apos;s get you started!</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Course Details */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={enrollment.course.mainImage?.asset?.url || '/placeholder-course.jpg'}
                  alt={enrollment.course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{enrollment.course.title}</h2>
                <p className="text-gray-600 mb-4">Instructor: {enrollment.course.instructor}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Duration: {enrollment.course.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Level: {enrollment.course.level}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-green-800 mb-1">Enrollment Confirmed!</h3>
                      <p className="text-sm text-green-700">You now have lifetime access to this course and all future updates.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Check Your Email</h4>
                      <p className="text-gray-600 text-sm">We&apos;ve sent course access details to {enrollment.studentEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Join the Community</h4>
                      <p className="text-gray-600 text-sm">Connect with fellow students and get support</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Start Learning</h4>
                      <p className="text-gray-600 text-sm">Access your course materials and begin your journey</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-3 px-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors">
                    Access Course Materials
                  </button>
                  <Link
                    href="#community"
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors block text-center"
                  >
                    Join Student Community
                  </Link>
                  <Link
                    href="/courses"
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors block text-center"
                  >
                    Explore More Courses
                  </Link>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Our support team is here to help you succeed. Don&apos;t hesitate to reach out!
                    </p>
                    <Link 
                      href="/contact"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Contact Support
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof / Testimonials */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">You&apos;re in Great Company!</h3>
            <div className="text-center text-gray-600">
              <p className="text-lg">Join thousands of students who have transformed their careers with our courses.</p>
              <div className="mt-6 flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">2,500+</div>
                  <div className="text-sm text-gray-500">Students Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">4.8/5</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">95%</div>
                  <div className="text-sm text-gray-500">Completion Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
