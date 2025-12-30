import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'serviceCategory',
  title: 'Service Category',
  type: 'document',
  fields: [
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
          { title: 'Consulting', value: 'consulting' },
          { title: 'Business', value: 'business' },
          { title: 'Profile', value: 'profile' },
          { title: 'General', value: 'general' }
        ]
      },
      initialValue: 'general'
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      initialValue: 'default'
    }),

    // Banner background image for hero/banner UI
    defineField({
      name: 'bannerBackgroundImage',
      title: 'Banner Background Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Large background image for the hero/banner area of this service category.'
    }),

    // Open Graph fields for sharing
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title',
      type: 'string',
      description: 'Title for social sharing (overrides default title in link previews)'
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'text',
      description: 'Description for social sharing (overrides default description in link previews)'
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Image used for social sharing and link previews (1200x630 recommended).'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Service',
      type: 'boolean',
      initialValue: false
    }),

    // 🚨 CRITICAL FIX: Redefining 'packages' to be the MAIN complex object array
    // This matches what your frontend (DynamicServicePage) is trying to read.
    defineField({
      name: 'packages',
      title: 'Service Packages',
      type: 'array',
      of: [{
        type: 'object',
        name: 'package',
        fields: [
          { name: 'name', type: 'string', title: 'Package Name' },
          { name: 'groupName', type: 'string', title: 'Group Name', description: 'Optional: Logical group for this package/tier (e.g. "Landing Page")' },
          {
            name: 'tier',
            type: 'string',
            title: 'Tier',
            options: { list: ['basic', 'standard', 'premium', 'enterprise'] }
          },
          { name: 'price', type: 'number', title: 'Price (USD)' },
          { name: 'currency', type: 'string', title: 'Currency', initialValue: 'USD' },
          {
            name: 'billing',
            type: 'string',
            title: 'Billing Type',
            options: { list: ['one_time', 'monthly', 'hourly', 'project'] }
          },
          { name: 'deliveryTime', type: 'string', title: 'Delivery Time' },
          { name: 'popular', type: 'boolean', title: 'Is Popular?' },
          {
            name: 'features',
            type: 'array',
            title: 'Features',
            of: [{ type: 'string' }]
          },
          // Add-ons for the modal flow
          {
            name: 'addOns',
            title: 'Available Add-ons',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'name', type: 'string', title: 'Name' },
                { name: 'price', type: 'number', title: 'Price' },
                { name: 'description', type: 'string', title: 'Description' }
              ]
            }]
          },
          // OG image for this tier/package
          {
            name: 'ogImage',
            title: 'Open Graph Image',
            type: 'image',
            options: { hotspot: true },
            description: 'Image for sharing this tier/package (1200x630 recommended).'
          },
          //OG Fields
          { name: 'ogTitle', type: 'string', title: 'Open Graph Title' },
          { name: 'ogDescription', type: 'text', title: 'Open Graph Description' }
        ]
      }]
    }),

    // Legacy fields (optional, kept just in case, but hidden)
    defineField({
      name: 'packageGroups',
      title: 'Package Groups (Legacy)',
      type: 'array',
      hidden: true,
      of: [{ type: 'object', fields: [{ name: 'name', type: 'string' }] }]
    }),

    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'faq',
      title: 'FAQs',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string' },
          { name: 'answer', type: 'text' }
        ]
      }]
    })
  ]
})