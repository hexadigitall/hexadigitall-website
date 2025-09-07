// Quick test service creation
// Run this in your browser console at http://localhost:3000/studio

// Basic Web Development Service
const testService = {
  _type: 'serviceCategory',
  title: 'Web Development',
  slug: { _type: 'slug', current: 'web-development' },
  description: 'Professional web applications built with modern technologies. From simple websites to complex web platforms.',
  icon: 'code',
  featured: true,
  order: 1,
  packages: [
    {
      _key: 'basic-web-' + Math.random().toString(36).substr(2, 9),
      name: 'Basic Website',
      tier: 'basic',
      price: 800000,
      currency: 'NGN',
      billing: 'one_time',
      deliveryTime: '7-10 business days',
      popular: false,
      features: [
        'Up to 5 responsive pages',
        'Mobile-first design',
        'Basic SEO optimization',
        'Contact form integration',
        'Google Analytics setup',
        '30 days support',
        'SSL certificate setup'
      ]
    },
    {
      _key: 'standard-web-' + Math.random().toString(36).substr(2, 9),
      name: 'Business Website',
      tier: 'standard',
      price: 1800000,
      currency: 'NGN',
      billing: 'one_time',
      deliveryTime: '2-3 weeks',
      popular: true,
      features: [
        'Up to 15 responsive pages',
        'Custom design & branding',
        'Advanced SEO optimization',
        'Blog/News system',
        'Social media integration',
        'Performance optimization',
        '60 days support',
        'Training included'
      ]
    }
  ]
};

console.log('Test service data ready. Go to Studio and manually create this service.');
console.log(JSON.stringify(testService, null, 2));
