import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'serviceCategory',
  title: 'Service Category',
  type: 'document',
  fields: [
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Main banner or background image for this service category.'
    }),
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 100
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          { title: 'Web Development', value: 'web' },
          { title: 'Mobile Development', value: 'mobile' },
          { title: 'Digital Marketing', value: 'marketing' },
          { title: 'Cloud Services', value: 'cloud' },
          { title: 'IT Consulting', value: 'consulting' },
          { title: 'Software Development', value: 'software' },
          { title: 'Branding & Design', value: 'branding' },
          { title: 'Profile & Portfolio', value: 'profile' },
          { title: 'Business Planning', value: 'business' },
          { title: 'General', value: 'general' }
        ]
      },
      initialValue: 'general'
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Code', value: 'code' },
          { title: 'Server', value: 'server' },
          { title: 'Monitor', value: 'monitor' },
          { title: 'Mobile', value: 'mobile' },
          { title: 'Chart', value: 'chart' },
          { title: 'Settings', value: 'settings' },
          { title: 'Network', value: 'network' },
          { title: 'Default', value: 'default' }
        ]
      },
      initialValue: 'default'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Service',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'packages',
      title: 'Service Packages',
      type: 'array',
      of: [{
        type: 'object',
        name: 'package',
        fields: [
          {
            name: 'name',
            title: 'Package Name',
            type: 'string'
          },
          {
            name: 'tier',
            title: 'Package Tier',
            type: 'string',
            options: {
              list: [
                { title: 'Basic', value: 'basic' },
                { title: 'Standard', value: 'standard' },
                { title: 'Premium', value: 'premium' },
                { title: 'Enterprise', value: 'enterprise' }
              ]
            }
          },
          {
            name: 'price',
            title: 'Starting Price',
            type: 'number',
            validation: (Rule: any) => Rule.min(0)
          },
          {
            name: 'currency',
            title: 'Currency',
            type: 'string',
            initialValue: 'USD',
            options: {
              list: [
                { title: 'USD', value: 'USD' },
                { title: 'NGN', value: 'NGN' },
                { title: 'EUR', value: 'EUR' },
                { title: 'GBP', value: 'GBP' }
              ]
            }
          },
          {
            name: 'billing',
            title: 'Billing Type',
            type: 'string',
            options: {
              list: [
                { title: 'One-time', value: 'one_time' },
                { title: 'Monthly', value: 'monthly' },
                { title: 'Per Hour', value: 'hourly' },
                { title: 'Per Project', value: 'project' }
              ]
            },
            initialValue: 'one_time'
          },
          {
            name: 'deliveryTime',
            title: 'Delivery Time',
            type: 'string'
          },
          {
            name: 'features',
            title: 'Package Features',
            type: 'array',
            of: [{ type: 'string' }],
            validation: (Rule: any) => Rule.min(1)
          },
          {
            name: 'popular',
            title: 'Popular Package',
            type: 'boolean',
            initialValue: false
          },
          {
            name: 'addOns',
            title: 'Available Add-ons',
            type: 'array',
            of: [{
              type: 'object',
              name: 'addOn',
              fields: [
                {
                  name: 'name',
                  title: 'Add-on Name',
                  type: 'string'
                },
                {
                  name: 'price',
                  title: 'Add-on Price',
                  type: 'number'
                },
                {
                  name: 'description',
                  title: 'Add-on Description',
                  type: 'text'
                }
              ]
            }]
          }
        ]
      }],
      validation: (Rule: any) => Rule.required().min(1)
    }),
    // New: Package Groups with per-package tiers (flavors)
    // This complements the legacy "packages" field and enables a scoped modal experience per package.
    defineField({
      name: 'packageGroups',
      title: 'Package Groups (with Tiers)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'packageGroup',
        fields: [
          {
            name: 'key',
            title: 'Group Key',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'name',
            title: 'Group Name',
            type: 'string',
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'description',
            title: 'Group Description',
            type: 'text'
          },
          {
            name: 'tiers',
            title: 'Tiers',
            type: 'array',
            of: [{
              type: 'object',
              name: 'tier',
              fields: [
                {
                  name: 'name',
                  title: 'Tier Name',
                  type: 'string'
                },
                {
                  name: 'tier',
                  title: 'Tier Level',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Basic', value: 'basic' },
                      { title: 'Standard', value: 'standard' },
                      { title: 'Premium', value: 'premium' },
                      { title: 'Enterprise', value: 'enterprise' }
                    ]
                  }
                },
                {
                  name: 'price',
                  title: 'Price',
                  type: 'number',
                  validation: (Rule: any) => Rule.min(0)
                },
                {
                  name: 'currency',
                  title: 'Currency',
                  type: 'string',
                  initialValue: 'USD',
                  options: {
                    list: [
                      { title: 'USD', value: 'USD' },
                      { title: 'NGN', value: 'NGN' },
                      { title: 'EUR', value: 'EUR' },
                      { title: 'GBP', value: 'GBP' }
                    ]
                  }
                },
                {
                  name: 'billing',
                  title: 'Billing',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'One-time', value: 'one_time' },
                      { title: 'Monthly', value: 'monthly' },
                      { title: 'Per Hour', value: 'hourly' },
                      { title: 'Per Project', value: 'project' }
                    ]
                  },
                  initialValue: 'one_time'
                },
                {
                  name: 'deliveryTime',
                  title: 'Delivery Time',
                  type: 'string'
                },
                {
                  name: 'features',
                  title: 'Features',
                  type: 'array',
                  of: [
                    { type: 'string' },
                    {
                      type: 'object',
                      name: 'featureObject',
                      fields: [
                        { name: 'title', title: 'Title', type: 'string' },
                        { name: 'description', title: 'Description', type: 'text' }
                      ]
                    }
                  ]
                },
                {
                  name: 'popular',
                  title: 'Popular',
                  type: 'boolean',
                  initialValue: false
                },
                {
                  name: 'addOns',
                  title: 'Add-ons',
                  type: 'array',
                  of: [{
                    type: 'object',
                    name: 'addOn',
                    fields: [
                      { name: 'name', title: 'Add-on Name', type: 'string' },
                      { name: 'price', title: 'Add-on Price', type: 'number' },
                      { name: 'description', title: 'Description', type: 'text' }
                    ]
                  }]
                }
              ]
            }]
          }
        ]
      }],
      description: 'Group related packages and define their Basic/Standard/Premium tiers for a scoped selection experience.',
      validation: (Rule: any) => Rule.min(0)
    }),
    defineField({
      name: 'requirements',
      title: 'What Client Needs to Provide',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of things the client needs to provide for this service'
    }),
    defineField({
      name: 'faq',
      title: 'Frequently Asked Questions',
      type: 'array',
      of: [{
        type: 'object',
        name: 'faqItem',
        fields: [
          {
            name: 'question',
            title: 'Question',
            type: 'string'
          },
          {
            name: 'answer',
            title: 'Answer',
            type: 'text'
          }
        ]
      }]
    }),
    defineField({
      name: 'statistics',
      title: 'Service Statistics',
      type: 'reference',
      to: [{ type: 'serviceStatistics' }],
      description: 'Performance metrics and statistics for this service category'
    }),
    defineField({
      name: 'testimonials',
      title: 'Featured Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'serviceTestimonial' }] }],
      description: 'Hand-picked testimonials to feature for this service'
    }),
    defineField({
      name: 'caseStudies',
      title: 'Case Studies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'serviceCaseStudy' }] }],
      description: 'Related case studies demonstrating service success'
    }),
    defineField({
      name: 'integrations',
      title: 'Available Integrations',
      type: 'array',
      of: [{
        type: 'object',
        name: 'integration',
        fields: [
          { name: 'name', title: 'Integration Name', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'icon', title: 'Icon', type: 'image' },
          { name: 'type', title: 'Integration Type', type: 'string' }
        ]
      }],
      description: 'Third-party integrations available with this service'
    }),
    defineField({
      name: 'techStack',
      title: 'Technology Stack',
      type: 'array',
      of: [{
        type: 'object',
        name: 'technology',
        fields: [
          { name: 'name', title: 'Technology Name', type: 'string' },
          { name: 'category', title: 'Category', type: 'string' },
          { name: 'icon', title: 'Icon', type: 'image' },
          { name: 'expertise', title: 'Expertise Level', type: 'number' }
        ]
      }],
      description: 'Technologies and tools used in this service'
    })
  ],
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'title', direction: 'asc' }
      ]
    }
  ]
})