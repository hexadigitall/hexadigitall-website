#!/usr/bin/env node
// scripts/checkSchoolsOgMeta.cjs
// Checks OG image, title, and description for all school pages

const https = require('https');
const cheerio = require('cheerio');

const urls = [
  'https://www.hexadigitall.com/school/school-of-cloud-and-devops',
  'https://www.hexadigitall.com/school/school-of-coding-and-development',
  'https://www.hexadigitall.com/school/school-of-cybersecurity',
  'https://www.hexadigitall.com/school/school-of-data-and-ai',
  'https://www.hexadigitall.com/school/school-of-design',
  'https://www.hexadigitall.com/school/school-of-executive-management',
  'https://www.hexadigitall.com/school/school-of-fundamentals',
  'https://www.hexadigitall.com/school/school-of-growth-and-marketing',
  'https://www.hexadigitall.com/school/school-of-infrastructure',
  'https://www.hexadigitall.com/school/school-of-software-mastery'
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

(async () => {
  for (const url of urls) {
    const result = await fetchUrl(url);
    if (result.error) {
      console.error(`Error fetching ${url}:`, result.error);
      continue;
    }
    const $ = cheerio.load(result.body);
    const ogImage = $('meta[property="og:image"]').attr('content');
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDesc = $('meta[property="og:description"]').attr('content');
    console.log(`\nURL: ${url}`);
    console.log('OG Image:', ogImage);
    console.log('OG Title:', ogTitle);
    console.log('OG Description:', ogDesc);
  }
})();
