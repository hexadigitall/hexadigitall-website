/**
 * Run sequence command: node .build-scripts/seed-fvmmd-publications.js
 * Required environment variables: SANITY_SECRET_MIGRATION_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const migrationWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-25',
  token: process.env.SANITY_API_UPDATE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function runSeedingMigrationLifecycle() {
  console.log('--- Initializing Publication Infrastructure Matrix Seeding Pipeline ---');
  
  try {
    const authorModelNode = {
      _id: 'author-fvmmd-identity',
      _type: 'author',
      name: 'FVMMD',
      slug: { _type: 'slug', current: 'fvmmd' },
      biography: 'Imprint lead tactical architectural intelligence manager across operational publishing workflows.',
    };

    console.log('Writing author profile structure...');
    await migrationWriteClient.createOrReplace(authorModelNode);

    const sectionCMatrixItems = [
      {
        _id: 'matrix-infrastructure-self-roadmap',
        _type: 'resourceMatrix',
        title: 'The Infrastructure of the Self Series (Multi-Volume Roadmap Manual)',
        matrixId: 'FVMMD-LIN-M3',
        resourceType: 'roadmap',
        secureAssetUrl: 'https://hexadigitall.com/vault/assets/fvmmd-lin-m3-infrastructure-roadmap.pdf',
        requiresVerification: true,
      },
      {
        _id: 'matrix-cohort-workshop-roundtable-canvas',
        _type: 'resourceMatrix',
        title: 'Live Architecture Roundtable Tracking Canvas & Workshops',
        matrixId: 'FVMMD-LIN-M4',
        resourceType: 'template',
        secureAssetUrl: 'https://hexadigitall.com/vault/assets/fvmmd-lin-m4-live-tracking-canvas.xlsx',
        requiresVerification: true,
      }
    ];

    console.log('Writing Section C Matrix components...');
    const collectedReferenceIds = [];
    for (const asset of sectionCMatrixItems) {
      const standardCommittedNode = await migrationWriteClient.createOrReplace(asset);
      collectedReferenceIds.push(standardCommittedNode._id);
      console.log(` -> Registered Resource Matrix Node: [${asset.matrixId}]`);
    }

    const primaryBookPublicationNode = {
      _id: 'publication-love-is-nothing-manuscript',
      _type: 'publication',
      title: 'Love Is Nothing. Love Comes From Everything Long Lasting.',
      slug: { _type: 'slug', current: 'love-is-nothing-love-comes-from-everything-long-lasting' },
      author: {
        _type: 'reference',
        _ref: authorModelNode._id,
      },
      isbn: '978-HEXADIGITALL-LIN',
      description: 'A structural overview detailing personal clarity, deep architectural self-governance frameworks, and systematic lifestyle configuration paradigms.',
      price: 15000, 
      embeddedResources: collectedReferenceIds.map((id) => ({
        _type: 'reference',
        _ref: id,
        _key: `relational-matrix-edgekey-${id}`,
      })),
    };

    console.log('Binding publication entity tree to manuscript schema references...');
    const committedPublicationNode = await migrationWriteClient.createOrReplace(primaryBookPublicationNode);
    console.log(`\nSuccess: System seeding execution finalized. Root Publication Node ID: ${committedPublicationNode._id}`);

  } catch (criticalSystemFault) {
    console.error('Migration execution pipeline terminated due to critical exception:', criticalSystemFault);
    process.exit(1);
  }
}

runSeedingMigrationLifecycle();