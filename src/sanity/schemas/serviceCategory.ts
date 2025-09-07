import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'serviceCategory',
  title: 'Service Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Category Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
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
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name (e.g., "code", "server", "monitor")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true
      }
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
              title: 'Tier Level',
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
              description: 'e.g., "3-5 business days", "2 weeks", "1 month"'
            },
            {
              name: 'features',
              title: 'Package Features',
              type: 'array',
              of: [{ type: 'string' }],
              validation: Rule => Rule.required().min(3)
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
                      title: 'Additional Price',
                      type: 'number'
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text'
                    }
                  ]
                }
              ]
            },
            {
              name: 'popular',
              title: 'Most Popular',
              type: 'boolean',
              initialValue: false
            }
          ]
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'requirements',
      title: 'General Requirements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What clients need to provide for this service'
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
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0
    })
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
})
