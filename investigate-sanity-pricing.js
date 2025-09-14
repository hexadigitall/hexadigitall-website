#!/usr/bin/env node

/**
 * Sanity Pricing Investigation Script
 * 
 * This script fetches pricing data directly from Sanity CMS to verify:
 * 1. Actual price values stored in the database
 * 2. Currency information or metadata
 * 3. Service categories and their pricing tiers
 * 4. Any inconsistencies between stored data and displayed prices
 */

import { createClient } from 'next-sanity';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

console.log('🔍 Sanity Pricing Investigation');
console.log('================================');
console.log(`Project ID: ${projectId}`);
console.log(`Dataset: ${dataset}`);
console.log(`Has Token: ${!!token}`);
console.log('');

if (!projectId || !dataset) {
  console.error('❌ Missing required Sanity configuration');
  process.exit(1);
}

// Create Sanity client
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: token,
});

async function investigatePricingData() {
  try {
    console.log('📊 Fetching all service-related documents...');
    
    // Query for all documents that might contain pricing information
    const allDocs = await client.fetch(`
      *[_type match "*service*" || _type match "*price*" || _type match "*tier*" || _type match "*plan*"] {
        _id,
        _type,
        title,
        name,
        "priceFields": *[_type == ^._type][0] {
          price,
          basePrice,
          cost,
          pricing,
          amount,
          value,
          currency,
          usdPrice,
          ngnPrice,
          tiers,
          plans
        }
      }
    `);

    console.log(`\n🔍 Found ${allDocs.length} service-related documents:`);
    console.log('===============================================');

    if (allDocs.length === 0) {
      console.log('❌ No service documents found. Let\'s check for any pricing-related content...');
      
      // Broader search for any documents with pricing fields
      const pricingDocs = await client.fetch(`
        *[defined(price) || defined(basePrice) || defined(cost) || defined(pricing) || defined(amount)] {
          _id,
          _type,
          title,
          name,
          price,
          basePrice,
          cost,
          pricing,
          amount,
          currency
        }
      `);
      
      console.log(`\n💰 Found ${pricingDocs.length} documents with pricing fields:`);
      pricingDocs.forEach((doc, index) => {
        console.log(`\n${index + 1}. ${doc._type} (${doc._id})`);
        console.log(`   Title/Name: ${doc.title || doc.name || 'N/A'}`);
        console.log(`   Price: ${doc.price || 'N/A'}`);
        console.log(`   Base Price: ${doc.basePrice || 'N/A'}`);
        console.log(`   Cost: ${doc.cost || 'N/A'}`);
        console.log(`   Pricing: ${doc.pricing || 'N/A'}`);
        console.log(`   Amount: ${doc.amount || 'N/A'}`);
        console.log(`   Currency: ${doc.currency || 'N/A'}`);
      });
    } else {
      allDocs.forEach((doc, index) => {
        console.log(`\n${index + 1}. ${doc._type} (${doc._id})`);
        console.log(`   Title/Name: ${doc.title || doc.name || 'N/A'}`);
        console.log(`   Price Fields:`, JSON.stringify(doc.priceFields, null, 2));
      });
    }

    // Also check for any schema types that might contain pricing
    console.log('\n\n🏗️ Investigating document types in the dataset...');
    const types = await client.fetch(`
      array::unique(*[]._type)
    `);
    
    console.log(`\n📋 All document types in dataset (${types.length}):`);
    console.log('=====================================');
    types.forEach((type, index) => {
      console.log(`${index + 1}. ${type}`);
    });

    // Check for specific service types
    console.log('\n\n🔍 Looking for specific service types...');
    const serviceTypes = types.filter(type => 
      type.includes('service') || 
      type.includes('plan') || 
      type.includes('tier') || 
      type.includes('price')
    );

    if (serviceTypes.length > 0) {
      console.log(`\n🎯 Found ${serviceTypes.length} pricing-related document types:`);
      
      for (const type of serviceTypes) {
        console.log(`\n📄 Analyzing document type: ${type}`);
        console.log('='.repeat(50));
        
        const typeDocs = await client.fetch(`
          *[_type == $type] {
            _id,
            title,
            name,
            ...
          }
        `, { type });
        
        console.log(`   Found ${typeDocs.length} documents of type '${type}'`);
        
        if (typeDocs.length > 0) {
          console.log(`   Sample document:`, JSON.stringify(typeDocs[0], null, 2));
        }
      }
    }

    // Final fallback - show a sample of ALL documents
    console.log('\n\n📋 Sample of all documents in the dataset:');
    console.log('==========================================');
    
    const sampleDocs = await client.fetch(`
      *[0...5] {
        _id,
        _type,
        title,
        name
      }
    `);
    
    sampleDocs.forEach((doc, index) => {
      console.log(`${index + 1}. Type: ${doc._type} | Title: ${doc.title || doc.name || 'N/A'}`);
    });

  } catch (error) {
    console.error('❌ Error fetching data from Sanity:', error.message);
    console.error('Stack:', error.stack);
  }
}

async function main() {
  try {
    await investigatePricingData();
    
    console.log('\n\n✅ Investigation complete!');
    console.log('\n📊 Summary:');
    console.log('===========');
    console.log('1. Check the output above for any pricing data found in Sanity');
    console.log('2. If no pricing data is found, the site is likely using static pricing from code');
    console.log('3. Look for currency fields or metadata that might indicate pricing currency');
    console.log('4. Compare any found values with what\'s displayed on the website');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the investigation
main();