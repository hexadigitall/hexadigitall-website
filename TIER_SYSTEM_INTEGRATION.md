# Tier System Integration Guide

## Overview
The new tier system provides a hierarchical presentation of service packages:
- **ServiceGroupCard**: Displays "groups" (e.g., "Landing Page")
- **TierSelectionModal**: Shows 3 tiers (Basic/Standard/Premium) for each group
- **JourneyHeader**: Displays Idea ↔ Build ↔ Grow navigation

## Data Structure
All tier data is defined in `src/data/servicePackages.ts`:
- `WEB_DEV_PACKAGE_GROUPS`: 4 groups (Landing Page, Business Website, E-commerce, Custom Web App)
- `BUSINESS_PLAN_PACKAGE_GROUPS`: Business planning tiers
- `BRANDING_PACKAGE_GROUPS`: Logo and branding tiers
- `MARKETING_PACKAGE_GROUPS`: Marketing and social media tiers

## Integration Steps

### 1. Update Service Pages to Use Groups

**Example: Web Development Service Page**

```tsx
'use client'

import React, { useState } from 'react'
import ServiceGroupCard from '@/components/services/ServiceGroupCard'
import TierSelectionModal from '@/components/services/TierSelectionModal'
import JourneyHeader from '@/components/services/JourneyHeader'
import { WEB_DEV_PACKAGE_GROUPS } from '@/data/servicePackages'
import type { ServicePackageGroup, ServicePackageTier } from '@/types/service'

export default function WebDevelopmentPage() {
  const [selectedGroup, setSelectedGroup] = useState<ServicePackageGroup | null>(null)
  const [selectedTier, setSelectedTier] = useState<ServicePackageTier | null>(null)

  const handleTierSelect = (tier: ServicePackageTier) => {
    setSelectedTier(tier)
    // TODO: Pass to checkout or ServiceRequestFlow
    setSelectedGroup(null)
  }

  return (
    <main>
      {/* Journey navigation */}
      <JourneyHeader currentStage="build" />

      {/* Hero section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Web & Mobile Development</h1>
          <p className="text-xl text-gray-600">
            Custom websites and apps tailored to your business.
          </p>
        </div>
      </section>

      {/* Packages grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12">Choose Your Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WEB_DEV_PACKAGE_GROUPS.map((group) => (
              <ServiceGroupCard
                key={group.key?.current}
                group={group}
                onViewOptions={setSelectedGroup}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tier selection modal */}
      {selectedGroup && (
        <TierSelectionModal
          packageGroup={selectedGroup}
          onTierSelect={handleTierSelect}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </main>
  )
}
```

### 2. Connect to ServiceRequestFlow

After tier selection, pass the tier to `ServiceRequestFlow`:

```tsx
const [showRequestFlow, setShowRequestFlow] = useState(false)

const handleTierSelect = (tier: ServicePackageTier) => {
  setSelectedTier(tier)
  setSelectedGroup(null)
  setShowRequestFlow(true)
}

// In JSX:
{showRequestFlow && selectedTier && (
  <ServiceRequestFlow
    serviceCategory={{/* convert tier to service category */}}
    onClose={() => setShowRequestFlow(false)}
  />
)}
```

### 3. Journey Navigation

The `JourneyHeader` component shows the three stages:

```tsx
// On Business Plan page
<JourneyHeader currentStage="idea" />

// On Web Dev page
<JourneyHeader currentStage="build" />

// On Marketing page
<JourneyHeader currentStage="grow" />
```

## Feature Differentiation Strategy

Each tier follows this pattern:

### Basic Tier
- Essential features only
- Smallest scope/scale
- Shortest delivery time (5-7 days)
- Price anchor: lowest

### Standard Tier ⭐
- "Sweet spot" - most popular
- Everything in Basic + meaningful additions
- 2x price of Basic
- Gets the "Most Popular" badge
- Recommended option for most users

### Premium Tier
- Everything in Standard + advanced features
- 2-3x price of Standard
- Longest delivery time (may include support)
- Enterprise/advanced buyers

## Pricing Examples

**Landing Page:**
- Basic: $499 (5 features)
- Standard: $999 (10 features) ⭐
- Premium: $1,999 (15 features)

**Business Website:**
- Basic: $1,499 (5 features)
- Standard: $2,999 (10 features) ⭐
- Premium: $5,999 (15 features)

## Next Steps

1. **Update BusinessServicePage** to use `BUSINESS_PLAN_PACKAGE_GROUPS`
2. **Update WebMobileClient** to use `WEB_DEV_PACKAGE_GROUPS`
3. **Create StagesPage** showing all services with JourneyHeader
4. **Add Forward/Backward Flow** in ServicePaymentModal:
   - After successful Business Plan → suggest Web Dev
   - After successful Web Dev → suggest Marketing

## Currency Support

All components respect the `useCurrency()` hook:
- Automatically converts prices USD → NGN
- Displays correct currency symbol
- Updates when user toggles currency

Example:
```tsx
const { currentCurrency, convertPrice } = useCurrency()
const convertedPrice = convertPrice(999, 'NGN')
```

## Migration to Sanity (Phase 2)

Once the UI is finalized, migrate tier data to Sanity:
1. Create `packageGroup` document type
2. Create `packageTier` document type
3. Update queries in `src/lib/sanity-queries.ts`
4. Replace hardcoded data with Sanity fetch

For now, the hardcoded `src/data/servicePackages.ts` allows rapid iteration without CMS overhead.
