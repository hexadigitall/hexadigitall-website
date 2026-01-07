#!/usr/bin/env node
// scripts/debugDynamicRouteResponses.cjs
// Fetches and logs HTTP status and response body for a sample of dynamic URLs

const fetch = require('node-fetch');

const urls = [
  'https://hexadigitall.com/courses/advanced-ansible-automation',
  'https://hexadigitall.com/school/school-of-cloud-and-devops',
  'https://hexadigitall.com/courses/category/web-mobile-development',
  'https://hexadigitall.com/services/business-plan-and-logo-design'
];

(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      console.log(`\nURL: ${url}`);
      console.log(`Status: ${res.status}`);
      console.log('--- Response Body (first 500 chars) ---');
      console.log(text.slice(0, 500));
      if (res.status !== 200) {
        console.log('--- Full Response Headers ---');
        console.log(res.headers.raw());
      }
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
    }
  }
})();
