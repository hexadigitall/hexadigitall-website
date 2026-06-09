import {defineField, defineType} from 'sanity'
export default defineType({
  name: 'school',
  title: 'School',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this school appears (lower numbers first)',
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name for this school (e.g. code, chart, settings, network, default)',
      initialValue: 'default',
      validation: Rule => Rule.required(),
    }),
      defineField({
        name: 'bannerBackgroundImage',
        title: 'Banner Background Image',
        type: 'image',
        options: { hotspot: true },
        description: 'Banner image for school detail page (recommended: 1920x600)'
      }),
      defineField({
        name: 'ogImage',
        title: 'Open Graph Image',
        type: 'image',
        options: { hotspot: true },
        description: 'Image for sharing this school (1200x630 recommended).'
      }),
      defineField({ name: 'ogTitle', title: 'Open Graph Title', type: 'string' }),
      defineField({ name: 'ogDescription', title: 'Open Graph Description', type: 'text' }),
  ],
})
