// src/lib/fallback-data.ts
// Fallback data for when Sanity is unavailable

export const fallbackCourses = [
  {
    _id: 'fallback-1',
    title: 'Business & Entrepreneurship',
    description: 'Learn essential business and entrepreneurship skills.',
    courses: [
      {
        _id: 'course-1',
        title: 'Digital Marketing for Small Businesses',
        slug: { current: 'digital-marketing-small-business' },
        summary: 'Learn how to effectively market your small business online',
        mainImage: null,
        description: 'Master digital marketing strategies specifically designed for small businesses.',
        duration: '8 weeks',
        level: 'Beginner',
        instructor: 'Expert Instructor',
        nairaPrice: 75000,
        dollarPrice: 0, // Match actual data structure
        price: 75000,
        featured: false
      },
      {
        _id: 'course-2',
        title: 'Project Management Fundamentals',
        slug: { current: 'project-management-fundamentals' },
        summary: 'Learn the basics of project management',
        mainImage: null,
        description: 'Essential project management skills for modern professionals.',
        duration: '6 weeks',
        level: 'Beginner',
        instructor: 'Expert Instructor',
        nairaPrice: 75000,
        dollarPrice: 60,
        price: 75000,
        featured: true
      },
      {
        _id: 'course-lean-startup',
        title: 'The Lean Startup: Build Your MVP',
        slug: { current: 'lean-startup-mvp' },
        summary: 'Learn how to build and validate your minimum viable product',
        mainImage: null,
        description: 'Master the lean startup methodology and build products people want.',
        duration: '8 weeks',
        level: 'Intermediate',
        instructor: 'Expert Instructor',
        nairaPrice: 95000,
        dollarPrice: 80,
        price: 95000,
        featured: true
      }
    ]
  },
  {
    _id: 'fallback-2',
    title: 'Web & Mobile Development',
    description: 'Learn modern web and mobile development technologies.',
    courses: [
      {
        _id: 'course-3',
        title: 'Web Development Bootcamp: From Zero to Hero',
        slug: { current: 'web-development-bootcamp' },
        summary: 'Complete web development from zero to hero',
        mainImage: null,
        description: 'Learn HTML, CSS, JavaScript, React, and more in this comprehensive bootcamp.',
        duration: '12 weeks',
        level: 'Intermediate',
        instructor: 'Expert Instructor',
        nairaPrice: 150000,
        dollarPrice: 120,
        price: 150000,
        featured: true
      },
      {
        _id: 'course-react-native',
        title: 'React Native: Build Mobile Apps for iOS & Android',
        slug: { current: 'react-native-mobile-apps' },
        summary: 'Build cross-platform mobile apps with React Native',
        mainImage: null,
        description: 'Create native mobile apps for both iOS and Android using React Native.',
        duration: '10 weeks',
        level: 'Advanced',
        instructor: 'Expert Instructor',
        nairaPrice: 180000,
        dollarPrice: 150,
        price: 180000,
        featured: true
      }
    ]
  },
  {
    _id: 'fallback-3',
    title: 'Data & Analytics',
    description: 'Master data analysis and analytics skills.',
    courses: [
      {
        _id: 'course-ga4',
        title: 'Google Analytics 4: From Beginner to Expert',
        slug: { current: 'google-analytics-4-expert' },
        summary: 'Master Google Analytics 4 from basics to advanced features',
        mainImage: null,
        description: 'Complete guide to Google Analytics 4 with hands-on practice.',
        duration: '6 weeks',
        level: 'Beginner',
        instructor: 'Expert Instructor',
        nairaPrice: 75000,
        dollarPrice: 0,
        price: 75000,
        featured: true
      },
      {
        _id: 'course-python-data',
        title: 'Data Analysis with Python',
        slug: { current: 'python-data-analysis' },
        summary: 'Learn data analysis and visualization with Python',
        mainImage: null,
        description: 'Master Python for data analysis, pandas, NumPy, and visualization.',
        duration: '10 weeks',
        level: 'Intermediate',
        instructor: 'Expert Instructor',
        nairaPrice: 150000,
        dollarPrice: 0,
        price: 150000,
        featured: true
      }
    ]
  }
];

// Function to simulate the same structure as Sanity data
export const getFallbackCourseCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('🔄 [FALLBACK] Using fallback course data');
      resolve(fallbackCourses);
    }, 1000);
  });
};