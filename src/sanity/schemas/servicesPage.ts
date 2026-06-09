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
      description: 'The main H1 title of the /services page (e.g., "Our Services")',
      initialValue: 'Our Services'
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      description: 'The subtitle/description appearing below the title.',
      initialValue: 'Comprehensive digital solutions tailored to your business growth.'
    }),
    defineField({
      name: 'bannerBackgroundImage',
      title: 'Banner Background Image',
      type: 'image',
      description: 'The large hero background image.',
      options: {
        hotspot: true,
      },
    }),
    // ✅ ADDED OG FIELDS
    defineField({
      name: 'ogTitle',
      title: 'Social Share Title',
      type: 'string',
      description: 'Title used for social media previews (e.g. WhatsApp, LinkedIn). Defaults to Page Title if left empty.',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Social Share Description',
      type: 'text',
      description: 'Description used for social media previews. Defaults to Page Description if left empty.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image used when sharing this page on social media (1200x630px).',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'bannerBackgroundImage'
    },
    prepare({ title, media }) {
      return {
        title: title || 'Services Page',
        subtitle: 'Main Configuration',
        media
      }
    }
  }
})