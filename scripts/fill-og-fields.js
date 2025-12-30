// scripts/fill-og-fields.js
// Script to fill ogTitle and ogDescription for all projects in Sanity
// Usage: node scripts/fill-og-fields.js

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  apiVersion: '2023-12-30',
})

async function main() {
  const projects = await client.fetch('*[_type == "project"]{_id, title, description}')
  for (const project of projects) {
    const ogTitle = project.title ? `Case Study: ${project.title} | Hexadigitall` : 'Case Study | Hexadigitall'
    const ogDescription = project.description || 'Explore this project by Hexadigitall. See how we deliver results for our clients.'
    await client.patch(project._id)
      .set({ ogTitle, ogDescription })
      .commit()
    console.log(`Updated ${project.title}`)
  }
  console.log('All projects updated with ogTitle and ogDescription.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
