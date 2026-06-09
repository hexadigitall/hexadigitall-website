// src/sanity/schemas/pageOgAssets.ts

export default {
  name: 'pageOgAssets',
  title: 'Page OG Assets',
  type: 'document',
  fields: [
    {
      name: 'page',
      title: 'Page',
      type: 'string',
      description: 'The route or name of the page (e.g. about, blog, faq, services, home)'
    },
    {
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Open Graph image for social sharing (minimum 1200x630px recommended)'
    },
    {
      name: 'ogTitle',
      title: 'OG Title',
      type: 'string',
      description: 'Open Graph title for the page'
    },
    {
      name: 'ogDescription',
      title: 'OG Description',
      type: 'text',
      description: 'Open Graph description for the page'
    }
  ]
};
