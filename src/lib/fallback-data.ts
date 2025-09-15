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
        dollarPrice: 50,
        price: 75000,
        featured: true
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
        nairaPrice: 90000,
        dollarPrice: 60,
        price: 90000,
        featured: true
      }
    ]
  },
  {
    _id: 'fallback-2',
    title: 'Web Development',
    description: 'Learn modern web development technologies.',
    courses: [
      {
        _id: 'course-3',
        title: 'Web Development Bootcamp',
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