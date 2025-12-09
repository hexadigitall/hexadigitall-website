import { defineField, defineType } from 'sanity'

/* eslint-disable @typescript-eslint/no-explicit-any */
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
      title: 'Service Packages (Legacy - kept for compatibility)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Simple list of package names. Use packageGroups for detailed tier-based packages.'
    }),
    defineField({
      name: 'packageGroups',
      title: 'Package Groups (Tiered Packages)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'key',
            title: 'Package Key',
            type: 'slug',
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'name',
            title: 'Package Name',
            type: 'string',
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'description',
            title: 'Package Description',
            type: 'text'
          },
          {
            name: 'tiers',
            title: 'Package Tiers',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Tier Name',
                  type: 'string',
                  validation: (Rule: any) => Rule.required()
                },
                {
                  name: 'tier',
                  title: 'Tier Level',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Basic', value: 'basic' },
                      { title: 'Standard', value: 'standard' },
                      { title: 'Premium', value: 'premium' }
                    ]
                  },
                  validation: (Rule: any) => Rule.required()
                },
                {
                  name: 'price',
                  title: 'Price',
                  type: 'number',
                  validation: (Rule: any) => Rule.required().min(0)
                },
                {
                  name: 'currency',
                  title: 'Currency',
                  type: 'string',
                  options: {
                    list: ['USD', 'NGN', 'EUR', 'GBP']
                  },
                  initialValue: 'USD'
                },
                {
                  name: 'billing',
                  title: 'Billing Type',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'One-time', value: 'one_time' },
                      { title: 'Monthly', value: 'monthly' },
                      { title: 'Hourly', value: 'hourly' }
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
                  of: [{ type: 'string' }]
                },
                {
                  name: 'popular',
                  title: 'Popular Tier',
                  type: 'boolean',
                  initialValue: false
                }
              ]
            }]
          }
        ]
      }],
      description: 'Define package groups with multiple tiers (Basic/Standard/Premium) for each package type'
    }),
    defineField({
      name: 'requirements',
      title: 'What Client Needs to Provide',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of things the client needs to provide for this service'
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
      of: [{ type: 'string' }],
      description: 'Third-party integrations available with this service'
    }),
    defineField({
      name: 'techStack',
      title: 'Technology Stack',
      type: 'array',
      of: [{ type: 'string' }],
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