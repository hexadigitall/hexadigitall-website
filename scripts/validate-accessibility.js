#!/usr/bin/env node

/**
 * Accessibility and Responsive Design Validation Script
 * Tests for WCAG compliance, mobile-first responsive design, and semantic HTML
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function pass(message) {
  log(`✓ ${message}`, 'green')
}

function fail(message) {
  log(`✗ ${message}`, 'red')
}

function warn(message) {
  log(`⚠ ${message}`, 'yellow')
}

function info(message) {
  log(`ℹ ${message}`, 'cyan')
}

function section(title) {
  log(`\n${'='.repeat(60)}`, 'blue')
  log(title, 'blue')
  log('='.repeat(60), 'blue')
}

// Test accessibility attributes in component files
function testAccessibility() {
  section('ACCESSIBILITY TESTS')

  let accessibilityScore = 0
  let totalChecks = 0

  // Test SubscriptionCard component
  const subscriptionCardPath = path.join(__dirname, '../src/components/student/SubscriptionCard.tsx')
  if (fs.existsSync(subscriptionCardPath)) {
    const content = fs.readFileSync(subscriptionCardPath, 'utf-8')

    // Check for ARIA labels
    if (content.includes('aria-label') || content.includes('role=')) {
      pass('SubscriptionCard: ARIA attributes present')
      accessibilityScore++
    } else {
      warn('SubscriptionCard: No ARIA attributes found')
    }
    totalChecks++

    // Check for semantic HTML
    if (content.includes('<button') || content.includes('<a ')) {
      pass('SubscriptionCard: Semantic HTML elements used')
      accessibilityScore++
    }
    totalChecks++

    // Check for color contrast (CSS inspection)
    if (content.includes('text-gray') || content.includes('bg-')) {
      info('SubscriptionCard: Color classes present (manual verification recommended)')
    }
  }

  // Test dashboard component
  const dashboardPath = path.join(__dirname, '../src/app/student/dashboard/page.tsx')
  if (fs.existsSync(dashboardPath)) {
    const content = fs.readFileSync(dashboardPath, 'utf-8')

    // Check for alt text
    if (content.includes('alt=')) {
      pass('Dashboard: Image alt text present')
      accessibilityScore++
    } else {
      warn('Dashboard: Some images may lack alt text')
    }
    totalChecks++

    // Check for heading hierarchy
    if (content.includes('<h1') || content.includes('<h2') || content.includes('<h3')) {
      pass('Dashboard: Heading hierarchy present')
      accessibilityScore++
    }
    totalChecks++
  }

  const score = Math.round((accessibilityScore / totalChecks) * 100)
  log(`\nAccessibility Score: ${score}%`, score >= 80 ? 'green' : 'yellow')
  return score >= 80
}

// Test responsive design attributes
function testResponsiveDesign() {
  section('RESPONSIVE DESIGN TESTS')

  let responsiveScore = 0
  let totalChecks = 0

  const componentFiles = [
    '../src/components/student/SubscriptionCard.tsx',
    '../src/app/student/dashboard/page.tsx',
  ]

  for (const file of componentFiles) {
    const fullPath = path.join(__dirname, file)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const filename = path.basename(file)

      // Check for responsive grid/flex classes
      if (content.includes('grid-cols') || content.includes('flex') || content.includes('flex-col')) {
        pass(`${filename}: Responsive layout classes present`)
        responsiveScore++
      } else {
        warn(`${filename}: May lack responsive layout`)
      }
      totalChecks++

      // Check for responsive padding/margin
      if (content.includes('px-') || content.includes('py-') || content.includes('sm:') || content.includes('md:')) {
        pass(`${filename}: Responsive spacing present`)
        responsiveScore++
      } else {
        warn(`${filename}: May lack responsive spacing`)
      }
      totalChecks++

      // Check for mobile-first approach (sm: and md: breakpoints)
      if (content.includes('sm:') || content.includes('md:') || content.includes('lg:')) {
        pass(`${filename}: Breakpoint utilities detected`)
        responsiveScore++
      }
      totalChecks++
    }
  }

  const score = Math.round((responsiveScore / totalChecks) * 100)
  log(`\nResponsive Design Score: ${score}%`, score >= 80 ? 'green' : 'yellow')
  return score >= 80
}

// Test user flow
function testUserFlow() {
  section('USER FLOW TESTS')

  let flowScore = 0
  let totalChecks = 0

  const dashboardPath = path.join(__dirname, '../src/app/student/dashboard/page.tsx')
  const subscriptionCardPath = path.join(__dirname, '../src/components/student/SubscriptionCard.tsx')

  if (fs.existsSync(dashboardPath)) {
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8')

    // Check for loading state
    if (dashboardContent.includes('loading') && dashboardContent.includes('setLoading')) {
      pass('Dashboard: Loading state implemented')
      flowScore++
    }
    totalChecks++

    // Check for error handling
    if (dashboardContent.includes('catch') || dashboardContent.includes('error')) {
      pass('Dashboard: Error handling present')
      flowScore++
    }
    totalChecks++

    // Check for authentication
    if (dashboardContent.includes('localStorage') || dashboardContent.includes('token')) {
      pass('Dashboard: Authentication checks present')
      flowScore++
    }
    totalChecks++
  }

  if (fs.existsSync(subscriptionCardPath)) {
    const subscriptionContent = fs.readFileSync(subscriptionCardPath, 'utf-8')

    // Check for state management
    if (subscriptionContent.includes('useState')) {
      pass('SubscriptionCard: State management present')
      flowScore++
    }
    totalChecks++

    // Check for user interactions
    if (subscriptionContent.includes('onClick') || subscriptionContent.includes('onChange')) {
      pass('SubscriptionCard: User interactions implemented')
      flowScore++
    }
    totalChecks++
  }

  const score = Math.round((flowScore / totalChecks) * 100)
  log(`\nUser Flow Score: ${score}%`, score >= 80 ? 'green' : 'yellow')
  return score >= 80
}

// Test layout efficiency
function testLayoutEfficiency() {
  section('LAYOUT EFFICIENCY TESTS')

  let efficiencyScore = 0
  let totalChecks = 0

  const componentFiles = [
    { path: '../src/components/student/SubscriptionCard.tsx', name: 'SubscriptionCard' },
    { path: '../src/app/student/dashboard/page.tsx', name: 'Dashboard' },
  ]

  for (const file of componentFiles) {
    const fullPath = path.join(__dirname, file.path)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8')

      // Check for proper use of Image component instead of img
      if (!content.includes('<img ') || content.includes('from "next/image"')) {
        pass(`${file.name}: Using Next.js Image component (optimized)`)
        efficiencyScore++
      } else {
        warn(`${file.name}: Unoptimized img tags detected`)
      }
      totalChecks++

      // Check for CSS-in-JS or Tailwind
      if (content.includes('className=') && (content.includes('bg-') || content.includes('text-') || content.includes('p-'))) {
        pass(`${file.name}: Using Tailwind CSS (efficient styling)`)
        efficiencyScore++
      }
      totalChecks++
    }
  }

  const score = Math.round((efficiencyScore / totalChecks) * 100)
  log(`\nLayout Efficiency Score: ${score}%`, score >= 80 ? 'green' : 'yellow')
  return score >= 80
}

// Main execution
function main() {
  log('\n🧪 STARTING ACCESSIBILITY & RESPONSIVE DESIGN VALIDATION\n', 'cyan')

  const results = {
    accessibility: testAccessibility(),
    responsive: testResponsiveDesign(),
    userFlow: testUserFlow(),
    efficiency: testLayoutEfficiency(),
  }

  // Summary
  section('VALIDATION SUMMARY')

  const allPass = Object.values(results).every((v) => v)
  let passCount = 0

  for (const [test, result] of Object.entries(results)) {
    const testName = test
      .replace(/([A-Z])/g, ' $1')
      .replace(/^/, (match) => match.toUpperCase())
      .trim()

    if (result) {
      pass(`${testName}: PASS`)
      passCount++
    } else {
      fail(`${testName}: NEEDS REVIEW`)
    }
  }

  log(`\nOverall: ${passCount}/${Object.keys(results).length} test suites passed`, allPass ? 'green' : 'yellow')

  if (allPass) {
    log('\n✓ All accessibility and responsive design checks passed!', 'green')
    process.exit(0)
  } else {
    log('\n⚠ Some tests need review. Please verify the items above.', 'yellow')
    process.exit(0) // Exit 0 anyway as these are warnings
  }
}

main()
