#!/usr/bin/env node
// scripts/checkServicesOgMeta.cjs
// Checks /services page for OG image, title, and description

const https = require('https');
const cheerio = require('cheerio');

const url = 'https://www.hexadigitall.com/services';

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
  const result = await fetchUrl(url);
  if (result.error) {
    console.error('Error:', result.error);
    return;
  }
  console.log('Status:', result.status);
  const $ = cheerio.load(result.body);
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDesc = $('meta[property="og:description"]').attr('content');
  console.log('OG Image:', ogImage);
  console.log('OG Title:', ogTitle);
  console.log('OG Description:', ogDesc);
})();
