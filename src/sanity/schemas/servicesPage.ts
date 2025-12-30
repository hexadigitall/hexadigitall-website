import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Main Services Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Our Services'
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      initialValue: 'Explore all our services, packages, and solutions.'
    }),
    defineField({
      name: 'bannerBackgroundImage',
      title: 'Banner Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Large background image for the hero/banner area of the main services page.'
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Image used for social sharing and link previews (1200x630 recommended).'
    })
  ]
})
