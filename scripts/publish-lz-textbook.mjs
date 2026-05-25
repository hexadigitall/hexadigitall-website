import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function run() {
  const htmlPath = path.join(__dirname, '..', 'public', 'textbooks', 'kdp', 'architecting-landing-zones', 'architecting-landing-zones-textbook.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(html);

  const tableOfContents = [];
  let chapterIndex = 1;

  // Find all elements that look like chapter headings in the TOC section
  // Actually, we'll just extract the Weeks/Modules directly from the HTML
  $('h3').each((i, el) => {
    const text = $(el).text().trim();
    if (text.toLowerCase().includes('module') || text.toLowerCase().includes('week')) {
      tableOfContents.push({
        _type: 'object',
        _key: `chapter-${chapterIndex}`,
        chapter: chapterIndex,
        title: text.replace(/^Module \d+:\s*/i, '').replace(/^Week \d+:\s*/i, ''),
        pages: `${(chapterIndex * 15) - 14}-${chapterIndex * 15}`, // Mock page numbers for now
      });
      chapterIndex++;
    }
  });

  // If we couldn't parse it well, provide a fallback generic TOC based on the curriculum
  if (tableOfContents.length === 0) {
    const defaultTopics = [
      "Introduction to Cloud Architecture",
      "Foundations of Landing Zones",
      "Identity and Access Management",
      "Network Architecture & Design",
      "Security and Governance",
      "Resource Organization and Tagging",
      "Automation and Infrastructure as Code",
      "Cost Management and Optimization",
      "Operations, Monitoring, and Logging",
      "Advanced Landing Zone Patterns"
    ];
    defaultTopics.forEach((t, i) => {
      tableOfContents.push({
        _type: 'object',
        _key: `chapter-${i+1}`,
        chapter: i+1,
        title: t,
        pages: `${(i * 20) + 1}-${(i * 20) + 20}`
      });
    });
  }

  const doc = {
    _id: 'architecting-landing-zones-textbook',
    _type: 'book',
    title: 'Architecting Landing Zones',
    subtitle: 'The Complete Guide to Designing Scalable Cloud Solutions',
    slug: { _type: 'slug', current: 'architecting-landing-zones' },
    edition: '1st Edition',
    authors: ['Hexadigitall Technologies'],
    description: 'Master the design and implementation of enterprise-grade cloud landing zones across AWS, Azure, and GCP. A comprehensive, project-driven guide to cloud architecture.',
    longDescription: [
      {
        _type: 'block',
        _key: 'intro',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'intro-span',
            text: 'This comprehensive textbook covers the end-to-end process of designing, implementing, and securing cloud landing zones. Whether you are building in AWS, Azure, or Google Cloud, you will learn the foundational principles of identity management, network architecture, and security governance.',
          },
        ],
      },
    ],
    pageCount: 350,
    level: 'intermediate',
    status: 'coming_soon',
    publishedAt: '2026-06-15',
    tableOfContents,
    ogTitle: 'Architecting Landing Zones Textbook | Hexadigitall',
    ogDescription: 'The official comprehensive guide to designing and implementing enterprise cloud landing zones.',
  };

  // We need to fetch the existing drafts document to keep its image or just delete the draft
  const existingDraft = await client.fetch('*[_type == "book" && slug.current == "architecting-landing-zones"][0]');
  if (existingDraft && existingDraft.coverImage) {
    doc.coverImage = existingDraft.coverImage;
  }

  // Publish the document
  await client.createOrReplace(doc);
  console.log(`✅ Published: ${doc.title}`);

  // Delete the old draft if it existed and had a different ID
  if (existingDraft && existingDraft._id.startsWith('drafts.')) {
     await client.delete(existingDraft._id);
     console.log(`🗑️ Deleted draft: ${existingDraft._id}`);
  }
}

run().catch(console.error);
