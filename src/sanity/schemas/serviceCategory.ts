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
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Package Name',
              type: 'string',
              validation: Rule => Rule.required()
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
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'price',
              title: 'Starting Price',
              type: 'number',
              validation: Rule => Rule.required().min(0)
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
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'features',
              title: 'Package Features',
              type: 'array',
              of: [{ type: 'string' }],
              validation: Rule => Rule.required().min(1)
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
              of: [
                {
                  type: 'object',
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
                }
              ]
            }
          ]
        }
      ],
      validation: Rule => Rule.required().min(1)
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
      of: [
        {
          type: 'object',
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
        }
      ]
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