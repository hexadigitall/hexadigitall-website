#!/usr/bin/env node
// scripts/debugDynamicRouteResponses-https.cjs
// Uses https module to fetch and log HTTP status and response body for sample dynamic URLs

const https = require('https');

const urls = [
  'https://hexadigitall.com/courses/advanced-ansible-automation',
  'https://hexadigitall.com/school/school-of-cloud-and-devops',
  'https://hexadigitall.com/courses/category/web-mobile-development',
  'https://hexadigitall.com/services/business-plan-and-logo-design'
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          body: data.slice(0, 500)
        });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

(async () => {
  for (const url of urls) {
    const result = await fetchUrl(url);
    console.log(`\nURL: ${result.url}`);
    if (result.error) {
      console.log('Error:', result.error);
    } else {
      console.log('Status:', result.status);
      console.log('--- Response Body (first 500 chars) ---');
      console.log(result.body);
      if (result.status !== 200) {
        console.log('--- Full Response Headers ---');
        console.log(result.headers);
      }
    }
  }
})();
