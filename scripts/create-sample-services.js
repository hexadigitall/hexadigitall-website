// scripts/create-sample-services.js
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_READ_TOKEN, // Using read token - you may need a write token
  useCdn: false,
  apiVersion: '2024-01-01'
})

const sampleServices = [
  {
    _type: 'serviceCategory',
    title: 'Web Development',
    slug: { _type: 'slug', current: 'web-development' },
    description: 'Professional web applications built with modern technologies. From simple websites to complex web platforms.',
    icon: 'code',
    featured: true,
    order: 1,
    packages: [
      {
        _key: 'basic-web',
        name: 'Basic Website',
        tier: 'basic',
        price: 1500,
        currency: 'USD',
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
        ],
        addOns: [
          {
            _key: 'cms-addon',
            name: 'Content Management System',
            price: 500,
            description: 'Easy-to-use CMS for updating content'
          },
          {
            _key: 'ecommerce-basic',
            name: 'Basic E-commerce',
            price: 800,
            description: 'Add shopping cart and payment processing'
          }
        ]
      },
      {
        _key: 'standard-web',
        name: 'Business Website',
        tier: 'standard',
        price: 3500,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '2-3 weeks',
        popular: true,
        features: [
          'Up to 15 responsive pages',
          'Custom design & branding',
          'Advanced SEO optimization',
          'Blog/News system',
          'Social media integration',
          'Advanced forms & automation',
          'Performance optimization',
          '60 days support',
          'Training included'
        ],
        addOns: [
          {
            _key: 'multi-lang',
            name: 'Multi-language Support',
            price: 1200,
            description: 'Support for multiple languages'
          },
          {
            _key: 'advanced-seo',
            name: 'Advanced SEO Package',
            price: 800,
            description: 'Comprehensive SEO audit and optimization'
          }
        ]
      },
      {
        _key: 'premium-web',
        name: 'Enterprise Web Platform',
        tier: 'premium',
        price: 8500,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '4-6 weeks',
        popular: false,
        features: [
          'Unlimited pages',
          'Custom web application',
          'User authentication system',
          'Admin dashboard',
          'API development',
          'Database design & optimization',
          'Advanced security features',
          'Performance monitoring',
          '90 days support',
          'Documentation & training'
        ],
        addOns: [
          {
            _key: 'mobile-app',
            name: 'Companion Mobile App',
            price: 5000,
            description: 'iOS/Android app with API integration'
          },
          {
            _key: 'maintenance',
            name: 'Monthly Maintenance',
            price: 500,
            description: 'Ongoing updates and support'
          }
        ]
      }
    ],
    requirements: [
      'Detailed project brief and goals',
      'Brand guidelines or style preferences',
      'Content and images for the website',
      'Domain name and hosting preferences',
      'List of required integrations'
    ],
    faq: [
      {
        _key: 'faq1',
        question: 'What technologies do you use for web development?',
        answer: 'We use modern technologies like React, Next.js, Node.js, and cloud platforms like Vercel and AWS for scalable, fast websites.'
      },
      {
        _key: 'faq2',
        question: 'Do you provide hosting services?',
        answer: 'We can recommend and help set up hosting, or work with your preferred hosting provider. We also offer managed hosting solutions.'
      },
      {
        _key: 'faq3',
        question: 'Will my website be mobile-friendly?',
        answer: 'Absolutely! All our websites are built with a mobile-first approach and are fully responsive across all devices.'
      }
    ]
  },
  
  {
    _type: 'serviceCategory',
    title: 'Mobile App Development',
    slug: { _type: 'slug', current: 'mobile-app-development' },
    description: 'Native and cross-platform mobile applications for iOS and Android. From concept to App Store deployment.',
    icon: 'mobile',
    featured: false,
    order: 2,
    packages: [
      {
        _key: 'basic-mobile',
        name: 'Simple Mobile App',
        tier: 'basic',
        price: 5000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '4-6 weeks',
        popular: false,
        features: [
          'Cross-platform development (iOS & Android)',
          'Up to 8 screens',
          'Basic user interface',
          'Local data storage',
          'Push notifications',
          'App store submission',
          '30 days support'
        ],
        addOns: [
          {
            _key: 'backend-api',
            name: 'Backend API',
            price: 2500,
            description: 'Custom backend with user management'
          },
          {
            _key: 'app-analytics',
            name: 'Analytics Integration',
            price: 500,
            description: 'User behavior tracking and analytics'
          }
        ]
      },
      {
        _key: 'standard-mobile',
        name: 'Business Mobile App',
        tier: 'standard',
        price: 12000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '8-10 weeks',
        popular: true,
        features: [
          'Native development for both platforms',
          'Unlimited screens',
          'Custom UI/UX design',
          'User authentication',
          'Cloud backend integration',
          'Payment processing',
          'Offline functionality',
          'Push notifications & in-app messaging',
          '60 days support',
          'App store optimization'
        ],
        addOns: [
          {
            _key: 'admin-panel',
            name: 'Admin Panel',
            price: 3000,
            description: 'Web-based admin panel for content management'
          },
          {
            _key: 'third-party-apis',
            name: 'Third-party Integrations',
            price: 1500,
            description: 'Integration with external APIs and services'
          }
        ]
      },
      {
        _key: 'enterprise-mobile',
        name: 'Enterprise Mobile Solution',
        tier: 'enterprise',
        price: 25000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '12-16 weeks',
        popular: false,
        features: [
          'Native development with advanced features',
          'Complex business logic',
          'Enterprise security features',
          'Multi-tenant architecture',
          'Advanced analytics & reporting',
          'Custom integrations',
          'Scalable cloud infrastructure',
          'DevOps & CI/CD setup',
          '120 days support',
          'Team training & documentation'
        ],
        addOns: [
          {
            _key: 'white-label',
            name: 'White-label Solution',
            price: 8000,
            description: 'Customizable solution for multiple clients'
          },
          {
            _key: 'maintenance-plan',
            name: 'Annual Maintenance',
            price: 5000,
            description: '12 months of updates and support'
          }
        ]
      }
    ],
    requirements: [
      'Detailed app requirements and user stories',
      'Target audience and platform preferences',
      'Design mockups or wireframes (if available)',
      'App store developer accounts',
      'Integration requirements with existing systems'
    ],
    faq: [
      {
        _key: 'faq1',
        question: 'Do you develop for both iOS and Android?',
        answer: 'Yes, we can develop native apps for both platforms or use cross-platform frameworks like React Native for cost-effective solutions.'
      },
      {
        _key: 'faq2',
        question: 'How long does app store approval take?',
        answer: 'Apple App Store typically takes 1-7 days for review, while Google Play Store usually approves within 2-3 hours. We handle the entire submission process.'
      }
    ]
  },

  {
    _type: 'serviceCategory',
    title: 'Cloud Infrastructure & DevOps',
    slug: { _type: 'slug', current: 'cloud-devops' },
    description: 'Scalable cloud infrastructure, automated deployments, and DevOps best practices. AWS, Azure, and Google Cloud expertise.',
    icon: 'server',
    featured: false,
    order: 3,
    packages: [
      {
        _key: 'basic-cloud',
        name: 'Cloud Migration',
        tier: 'basic',
        price: 2500,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '1-2 weeks',
        popular: false,
        features: [
          'Application assessment',
          'Cloud platform recommendation',
          'Basic migration strategy',
          'Single application migration',
          'Basic monitoring setup',
          'Documentation',
          '30 days support'
        ],
        addOns: [
          {
            _key: 'backup-setup',
            name: 'Automated Backups',
            price: 500,
            description: 'Automated backup and disaster recovery setup'
          },
          {
            _key: 'ssl-setup',
            name: 'SSL/Security Setup',
            price: 300,
            description: 'SSL certificates and basic security hardening'
          }
        ]
      },
      {
        _key: 'standard-cloud',
        name: 'DevOps Pipeline',
        tier: 'standard',
        price: 6000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-4 weeks',
        popular: true,
        features: [
          'Multi-environment setup (dev, staging, prod)',
          'CI/CD pipeline configuration',
          'Automated testing integration',
          'Container orchestration (Docker/Kubernetes)',
          'Infrastructure as Code',
          'Monitoring and alerting',
          'Security best practices',
          '60 days support'
        ],
        addOns: [
          {
            _key: 'auto-scaling',
            name: 'Auto-scaling Setup',
            price: 1500,
            description: 'Automatic resource scaling based on demand'
          },
          {
            _key: 'database-optimization',
            name: 'Database Optimization',
            price: 1200,
            description: 'Database performance tuning and optimization'
          }
        ]
      },
      {
        _key: 'enterprise-cloud',
        name: 'Enterprise Cloud Architecture',
        tier: 'enterprise',
        price: 15000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '6-8 weeks',
        popular: false,
        features: [
          'Multi-region cloud architecture',
          'Microservices architecture design',
          'Advanced security implementation',
          'Disaster recovery planning',
          'Performance optimization',
          'Cost optimization strategies',
          'Team training and knowledge transfer',
          'Compliance setup (SOC2, HIPAA, etc.)',
          '90 days support'
        ],
        addOns: [
          {
            _key: 'managed-services',
            name: 'Managed Cloud Services',
            price: 3000,
            description: 'Monthly managed cloud infrastructure support'
          },
          {
            _key: 'security-audit',
            name: 'Security Audit',
            price: 2500,
            description: 'Comprehensive security assessment and recommendations'
          }
        ]
      }
    ],
    requirements: [
      'Current infrastructure documentation',
      'Application architecture overview',
      'Performance and scalability requirements',
      'Security and compliance requirements',
      'Budget and timeline constraints'
    ],
    faq: [
      {
        _key: 'faq1',
        question: 'Which cloud providers do you work with?',
        answer: 'We have expertise with AWS, Microsoft Azure, Google Cloud Platform, and DigitalOcean. We can recommend the best fit for your needs.'
      },
      {
        _key: 'faq2',
        question: 'Do you provide ongoing cloud management?',
        answer: 'Yes, we offer managed cloud services including monitoring, maintenance, security updates, and optimization as an ongoing service.'
      }
    ]
  },

  {
    _type: 'serviceCategory',
    title: 'IT Support & System Administration',
    slug: { _type: 'slug', current: 'it-support' },
    description: 'Comprehensive IT support, system administration, and maintenance services. Keep your systems running smoothly.',
    icon: 'settings',
    featured: false,
    order: 4,
    packages: [
      {
        _key: 'basic-support',
        name: 'Basic IT Support',
        tier: 'basic',
        price: 150,
        currency: 'USD',
        billing: 'hourly',
        deliveryTime: '24-48 hours response',
        popular: false,
        features: [
          'Remote technical support',
          'Software troubleshooting',
          'Basic system maintenance',
          'Email and productivity support',
          'Documentation of issues',
          'Business hours support (9-5 EST)',
          'Monthly system health reports'
        ],
        addOns: [
          {
            _key: 'after-hours',
            name: 'After Hours Support',
            price: 200,
            description: 'Support outside business hours at premium rate'
          },
          {
            _key: 'on-site-visit',
            name: 'On-site Visit',
            price: 300,
            description: 'Physical on-site support visit'
          }
        ]
      },
      {
        _key: 'managed-it',
        name: 'Managed IT Services',
        tier: 'standard',
        price: 2500,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Ongoing service',
        popular: true,
        features: [
          'Proactive system monitoring',
          'Automated patch management',
          'Security monitoring and updates',
          'Backup management and testing',
          'Network administration',
          'User account management',
          'Priority support (4-hour response)',
          'Monthly strategy consultations'
        ],
        addOns: [
          {
            _key: 'cybersecurity-package',
            name: 'Enhanced Cybersecurity',
            price: 800,
            description: 'Advanced threat detection and prevention'
          },
          {
            _key: 'compliance-monitoring',
            name: 'Compliance Monitoring',
            price: 600,
            description: 'Ongoing compliance monitoring and reporting'
          }
        ]
      },
      {
        _key: 'enterprise-it',
        name: 'Enterprise IT Management',
        tier: 'enterprise',
        price: 8000,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Ongoing service',
        popular: false,
        features: [
          'Dedicated IT team assignment',
          '24/7 monitoring and support',
          'Strategic IT planning',
          'Advanced security management',
          'Disaster recovery planning',
          'Technology roadmap development',
          'Staff augmentation available',
          'Executive reporting and KPIs'
        ],
        addOns: [
          {
            _key: 'digital-transformation',
            name: 'Digital Transformation Consulting',
            price: 5000,
            description: 'Strategic technology modernization planning'
          },
          {
            _key: 'training-programs',
            name: 'Staff Training Programs',
            price: 2000,
            description: 'Custom technology training for your team'
          }
        ]
      }
    ],
    requirements: [
      'Current IT infrastructure inventory',
      'List of software and systems in use',
      'Network diagram and documentation',
      'Security and compliance requirements',
      'Business hours and support expectations'
    ],
    faq: [
      {
        _key: 'faq1',
        question: 'What is your response time for support requests?',
        answer: 'Response times vary by service level: Basic (24-48 hours), Managed (4 hours), Enterprise (1 hour). Emergency issues receive immediate attention.'
      },
      {
        _key: 'faq2',
        question: 'Do you work with Mac and PC environments?',
        answer: 'Yes, we support mixed environments including Windows, macOS, Linux, and various mobile platforms.'
      }
    ]
  },

  {
    _type: 'serviceCategory',
    title: 'Network Setup & Security',
    slug: { _type: 'slug', current: 'network-security' },
    description: 'Professional network design, implementation, and security solutions. Secure and reliable network infrastructure.',
    icon: 'network',
    featured: true,
    order: 5,
    packages: [
      {
        _key: 'basic-network',
        name: 'Small Office Network',
        tier: 'basic',
        price: 1200,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-5 business days',
        popular: false,
        features: [
          'Network design for up to 20 devices',
          'Router and switch configuration',
          'WiFi setup with guest network',
          'Basic firewall configuration',
          'Network documentation',
          'Staff training on network basics',
          '30 days support'
        ],
        addOns: [
          {
            _key: 'vpn-setup',
            name: 'VPN Setup',
            price: 400,
            description: 'Secure remote access VPN configuration'
          },
          {
            _key: 'network-monitoring',
            name: 'Network Monitoring',
            price: 300,
            description: 'Basic network monitoring and alerting'
          }
        ]
      },
      {
        _key: 'business-network',
        name: 'Business Network Solution',
        tier: 'standard',
        price: 3500,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '1-2 weeks',
        popular: true,
        features: [
          'Scalable network design (up to 100 devices)',
          'Advanced firewall with intrusion detection',
          'Managed switches and access points',
          'VLAN segmentation',
          'Network access control',
          'Backup internet connection setup',
          'Network monitoring and management',
          '60 days support'
        ],
        addOns: [
          {
            _key: 'security-cameras',
            name: 'IP Security Cameras',
            price: 2000,
            description: 'Network-based security camera system'
          },
          {
            _key: 'bandwidth-management',
            name: 'Bandwidth Management',
            price: 800,
            description: 'QoS and bandwidth control implementation'
          }
        ]
      },
      {
        _key: 'enterprise-network',
        name: 'Enterprise Network Infrastructure',
        tier: 'enterprise',
        price: 12000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '4-6 weeks',
        popular: false,
        features: [
          'Multi-site network architecture',
          'Enterprise-grade security suite',
          'Redundant network design',
          'Advanced threat protection',
          'Network automation and orchestration',
          'Compliance implementation',
          '24/7 network monitoring',
          'Disaster recovery planning',
          '90 days support'
        ],
        addOns: [
          {
            _key: 'penetration-testing',
            name: 'Penetration Testing',
            price: 3000,
            description: 'Professional security assessment and testing'
          },
          {
            _key: 'managed-security',
            name: 'Managed Security Services',
            price: 2000,
            description: 'Monthly managed security monitoring and response'
          }
        ]
      }
    ],
    requirements: [
      'Office layout and floor plans',
      'Number of users and devices',
      'Internet bandwidth requirements',
      'Security and compliance needs',
      'Budget for hardware and ongoing costs'
    ],
    faq: [
      {
        _key: 'faq1',
        question: 'Do you provide the network hardware?',
        answer: 'We can procure and configure all necessary hardware, or work with equipment you already have. We recommend enterprise-grade equipment for reliability.'
      },
      {
        _key: 'faq2',
        question: 'How do you ensure network security?',
        answer: 'We implement multiple security layers including firewalls, intrusion detection, access controls, and regular security updates following industry best practices.'
      }
    ]
  },

  {
    _type: 'serviceCategory',
    title: 'Data Analytics & Business Intelligence',
    slug: { _type: 'slug', current: 'data-analytics' },
    description: 'Transform your data into actionable insights. Custom dashboards, reporting, and data visualization solutions.',
    icon: 'chart',
    featured: false,
    order: 6,
    packages: [
      {
        _key: 'basic-analytics',
        name: 'Basic Analytics Setup',
        tier: 'basic',
        price: 2000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '2-3 weeks',
        popular: false,
        features: [
          'Data source integration (up to 3 sources)',
          'Basic dashboard creation',
          'Standard KPI tracking',
          'Automated reporting setup',
          'Data visualization training',
          'Documentation and guides',
          '30 days support'
        ],
        addOns: [
          {
            _key: 'additional-dashboards',
            name: 'Additional Dashboards',
            price: 500,
            description: 'Extra custom dashboards for specific teams'
          },
          {
            _key: 'mobile-reports',
            name: 'Mobile Reporting',
            price: 800,
            description: 'Mobile-optimized reports and notifications'
          }
        ]
      },
      {
        _key: 'business-intelligence',
        name: 'Business Intelligence Platform',
        tier: 'standard',
        price: 6000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '4-6 weeks',
        popular: true,
        features: [
          'Multi-source data integration',
          'Custom dashboard development',
          'Advanced analytics and insights',
          'Automated alert system',
          'Data warehouse setup',
          'User role management',
          'Training for key stakeholders',
          '60 days support'
        ],
        addOns: [
          {
            _key: 'predictive-analytics',
            name: 'Predictive Analytics',
            price: 2500,
            description: 'Machine learning models for forecasting'
          },
          {
            _key: 'api-development',
            name: 'Analytics API',
            price: 1500,
            description: 'Custom API for data access and integration'
          }
        ]
      },
      {
        _key: 'enterprise-analytics',
        name: 'Enterprise Analytics Solution',
        tier: 'enterprise',
        price: 15000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '8-12 weeks',
        popular: false,
        features: [
          'Enterprise data lake architecture',
          'Real-time analytics processing',
          'Advanced machine learning integration',
          'Self-service analytics platform',
          'Data governance implementation',
          'Scalable cloud infrastructure',
          'Executive dashboard suite',
          'Comprehensive training program',
          '120 days support'
        ],
        addOns: [
          {
            _key: 'ai-insights',
            name: 'AI-Powered Insights',
            price: 5000,
            description: 'Advanced AI models for automated insights'
          },
          {
            _key: 'data-science-consulting',
            name: 'Data Science Consulting',
            price: 3000,
            description: 'Monthly data science consultation and optimization'
          }
        ]
      }
    ],
    requirements: [
      'Data sources and current analytics tools',
      'Key performance indicators (KPIs)',
      'Reporting requirements and frequency',
      'User roles and access requirements',
      'Integration with existing systems'
    ],
    faq: [
      {
        _key: 'faq1',
        question: 'What data sources can you integrate?',
        answer: 'We can integrate virtually any data source including databases, APIs, spreadsheets, cloud services, and third-party platforms like Salesforce, Google Analytics, etc.'
      },
      {
        _key: 'faq2',
        question: 'How do you ensure data security and privacy?',
        answer: 'We implement industry-standard security measures including encryption, access controls, audit trails, and compliance with regulations like GDPR and CCPA.'
      }
    ]
  }
]

async function createSampleServices() {
  console.log('Starting to create sample services...')
  
  try {
    // Create services one by one to handle any potential conflicts
    for (const service of sampleServices) {
      console.log(`Creating service: ${service.title}`)
      
      const result = await client.create(service)
      console.log(`✅ Created service: ${service.title} (${result._id})`)
    }
    
    console.log('\n🎉 Successfully created all sample services!')
    console.log('\nSample services created:')
    sampleServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title} - ${service.packages.length} packages`)
    })
    
  } catch (error) {
    console.error('❌ Error creating sample services:', error)
  }
}

// Run the script
createSampleServices()
