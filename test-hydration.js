#!/usr/bin/env node

/**
 * Hydration Test Script
 * 
 * This script tests if our hydration fixes resolved the React warnings
 */

import puppeteer from 'puppeteer';

async function testHydration() {
  console.log('🧪 Testing React Hydration Fixes');
  console.log('=================================');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push({
        type: msg.type(),
        text: text
      });
    });
    
    // Capture page errors
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    
    console.log('🌐 Navigating to localhost:3000...');
    
    // Navigate to the homepage
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait a bit for any hydration to complete
    await page.waitForTimeout(3000);
    
    console.log('\n📊 Test Results:');
    console.log('================');
    
    // Check for hydration-specific errors
    const hydrationErrors = consoleMessages.filter(msg => 
      msg.text.toLowerCase().includes('hydration') ||
      msg.text.toLowerCase().includes('mismatch') ||
      msg.text.toLowerCase().includes('server') && msg.text.toLowerCase().includes('client')
    );
    
    const reactErrors = consoleMessages.filter(msg => 
      msg.type === 'error' && (
        msg.text.includes('React') ||
        msg.text.includes('Warning:')
      )
    );
    
    console.log(`✅ Page loaded successfully`);
    console.log(`📝 Total console messages: ${consoleMessages.length}`);
    console.log(`⚠️  Hydration-related messages: ${hydrationErrors.length}`);
    console.log(`❌ React errors: ${reactErrors.length}`);
    console.log(`💥 Page errors: ${pageErrors.length}`);
    
    if (hydrationErrors.length > 0) {
      console.log('\n🔍 Hydration Issues Found:');
      hydrationErrors.forEach((msg, i) => {
        console.log(`${i + 1}. [${msg.type}] ${msg.text}`);
      });
    }
    
    if (reactErrors.length > 0) {
      console.log('\n🔍 React Errors Found:');
      reactErrors.forEach((msg, i) => {
        console.log(`${i + 1}. [${msg.type}] ${msg.text}`);
      });
    }
    
    if (pageErrors.length > 0) {
      console.log('\n🔍 Page Errors Found:');
      pageErrors.forEach((error, i) => {
        console.log(`${i + 1}. ${error}`);
      });
    }
    
    // Test currency functionality
    console.log('\n💰 Testing Currency Features:');
    
    // Check if pricing is displayed
    const pricingElements = await page.$$('[data-testid="price"], .font-semibold');
    console.log(`💵 Found ${pricingElements.length} potential pricing elements`);
    
    // Check if currency context is working
    const currencyElements = await page.$$('[data-currency], .currency');
    console.log(`🌍 Found ${currencyElements.length} currency-related elements`);
    
    // Overall assessment
    console.log('\n🎯 Overall Assessment:');
    console.log('=====================');
    
    if (hydrationErrors.length === 0 && reactErrors.length === 0 && pageErrors.length === 0) {
      console.log('✅ SUCCESS: No hydration errors detected!');
      console.log('✅ The Hero component fixes appear to be working correctly.');
    } else {
      console.log('❌ ISSUES DETECTED: Some problems still exist.');
      console.log('🔧 Review the errors above and apply additional fixes if needed.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testHydration().catch(console.error);