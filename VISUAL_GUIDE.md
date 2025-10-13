# Visual Guide - Userflow Implementation

This document describes the visual appearance and layout of the new components and features.

---

## 🏠 Homepage - Hero Section

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│              [Background Image with Overlay]                 │
│                                                               │
│              TRANSFORMING IDEAS INTO                         │
│              DIGITAL REALITIES                               │
│                                                               │
│         Web & Mobile Development • IT Consulting             │
│                                                               │
│         [Primary CTA Button: Explore Our Services]           │
│                                                               │
│         ┌───────────┐  ┌───────────┐  ┌───────────┐        │
│         │    🌐     │  │    📚     │  │    🤝     │        │
│         │  Explore  │  │  Explore  │  │    Join   │        │
│         │    Our    │  │    Our    │  │    Our    │        │
│         │ Services  │  │  Courses  │  │ Community │        │
│         └───────────┘  └───────────┘  └───────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Features
- 3 glass-morphic cards with hover effects
- Each card has icon, title, and description
- Cards scale up on hover (transform: scale(1.05))
- Only visible on first hero slide

---

## 🔍 Services Page - Top Section

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Home > Services                                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                    OUR SERVICES                               │
│         Transform your ideas into digital realities           │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🔍 Search services...              [Category ▼]        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│     [🧙‍♂️ Service Wizard]  [💰 Quick Quote]                   │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Quick Quote Calculator (Collapsible)                    │ │
│  │  Service Type: [Web ▼]   Complexity: [Standard ▼]     │ │
│  │  Add-ons: ☐ SEO ☐ Analytics ☐ Maintenance            │ │
│  │  Estimated Cost: $1,000                                │ │
│  │  [Get Detailed Quote]                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Interaction Flow
1. User types in search → Results filter in real-time
2. User selects category → Results filter by category
3. User clicks "Quick Quote" → Calculator expands
4. User fills calculator → Clicks "Get Detailed Quote" → Opens Wizard
5. User clicks "Service Wizard" → Opens full 6-step wizard modal

---

## 🧙‍♂️ Enhanced Service Wizard

### Step 1: Service Type Selection
```
┌─────────────────────────────────────────────────────────────┐
│  Service Configuration Wizard                           [✕]  │
├─────────────────────────────────────────────────────────────┤
│  ●──●──○──○──○──○  (Progress indicators)                    │
│  1  2  3  4  5  6                                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Select Your Service Type                                    │
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │   🌐    │  │   📱    │  │   🛒    │                     │
│  │ Website │  │  Mobile │  │E-commerce│                     │
│  │   Dev   │  │   App   │  │          │                     │
│  │From $500│  │From $1000│ │From $800 │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │   📢    │  │   🎨    │  │   💼    │                     │
│  │ Digital │  │Branding │  │Business │                     │
│  │Marketing│  │ Design  │  │Consulting│                     │
│  │From $300│  │From $200│  │From $150│                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  [Previous]                                [Next]            │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Requirements
```
┌─────────────────────────────────────────────────────────────┐
│  Service Configuration Wizard                           [✕]  │
├─────────────────────────────────────────────────────────────┤
│  ●──●──○──○──○──○                                           │
│  1  2  3  4  5  6                                            │
├─────────────────────────────────────────────────────────────┤
│  Select Your Requirements                                    │
│                                                               │
│  ☑ Responsive Design              [essential]               │
│  ☐ Content Management System      [optional]                │
│  ☑ SEO Optimization               [optional]                │
│  ☐ Analytics Integration          [optional]                │
│  ☑ Advanced Forms                 [optional]                │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  [Previous]                                [Next]            │
└─────────────────────────────────────────────────────────────┘
```

### Step 6: Final Quotation
```
┌─────────────────────────────────────────────────────────────┐
│  Service Configuration Wizard                           [✕]  │
├─────────────────────────────────────────────────────────────┤
│  ●──●──●──●──●──●                                           │
│  1  2  3  4  5  6                                            │
├─────────────────────────────────────────────────────────────┤
│  Your Custom Quotation                                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Estimated Project Cost                   │  │
│  │                                                        │  │
│  │                   $1,500                              │  │
│  │                                                        │  │
│  │            [Request This Quote]                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  [Previous]                                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Package Comparison Component

### Grid View (Default)
```
┌───────────────────────────────────────────────────────────────┐
│  Choose Your Package              [Compare Packages →]        │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│  │  Basic   │    │ Standard │    │ Premium  │               │
│  │          │    │⭐POPULAR │    │          │               │
│  │  $500    │    │  $1,000  │    │  $2,000  │               │
│  │          │    │          │    │          │               │
│  │ ✓ Feature│    │ ✓ Feature│    │ ✓ Feature│               │
│  │ ✓ Feature│    │ ✓ Feature│    │ ✓ Feature│               │
│  │ ✓ Feature│    │ ✓ Feature│    │ ✓ Feature│               │
│  │          │    │ ✓ Feature│    │ ✓ Feature│               │
│  │          │    │          │    │ ✓ Feature│               │
│  │          │    │          │    │ ✓ Feature│               │
│  │          │    │          │    │          │               │
│  │ [Select] │    │ [Select] │    │ [Select] │               │
│  └──────────┘    └──────────┘    └──────────┘               │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

### Comparison Mode
```
┌───────────────────────────────────────────────────────────────┐
│  Choose Your Package              [Exit Compare Mode]         │
├───────────────────────────────────────────────────────────────┤
│  Select up to 3 packages to compare (2/3 selected)            │
│  [✓ Basic]  [✓ Standard]  [ Premium ]                        │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  Feature            │  Basic     │  Standard  │               │
│ ─────────────────────────────────────────────────────────────│
│  Price              │  $500      │  $1,000    │               │
│  Responsive Design  │     ✓      │     ✓      │               │
│  CMS Integration    │     ✗      │     ✓      │               │
│  SEO Optimization   │     ✗      │     ✓      │               │
│  Analytics          │     ✗      │     ✓      │               │
│  Support Duration   │  30 days   │  90 days   │               │
│ ─────────────────────────────────────────────────────────────│
│  Select Package     │  [Select]  │  [Select]  │               │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

---

## 📝 Conditional Contact Form

### Form Type Selector
```
┌───────────────────────────────────────────────────────────────┐
│  Get in Touch                                                  │
├───────────────────────────────────────────────────────────────┤
│  [Get Quote] [Start Project] [Request Callback] [General]     │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  Full Name *                     Email *                       │
│  [________________]              [________________]            │
│                                                                 │
│  Phone *                         Company                       │
│  [________________]              [________________]            │
│                                                                 │
│  Project Type *                                                │
│  [Select a service ▼]                                         │
│                                                                 │
│  Budget Range                    Timeline                      │
│  [Select budget ▼]              [Select timeline ▼]           │
│                                                                 │
│  Project Details *                                             │
│  [________________________________]                           │
│  [________________________________]                           │
│  [________________________________]                           │
│                                                                 │
│  Attachments (Optional)                                        │
│  ┌────────────────────────────────────┐                      │
│  │  📎 Click to upload files          │                      │
│  │  PDF, DOC, JPG, PNG (max 10MB)    │                      │
│  └────────────────────────────────────┘                      │
│                                                                 │
│  [Cancel]                      [Request Quote]                │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

---

## ✅ Success Modal

```
┌───────────────────────────────────────────────────────────────┐
│                                                            [✕] │
│                                                                 │
│                       ┌─────────┐                             │
│                       │   ✓     │                             │
│                       └─────────┘                             │
│                                                                 │
│                Quote Request Submitted!                        │
│                                                                 │
│     Thank you for your interest. Our team will review          │
│     your requirements and get back to you within 24            │
│     hours with a detailed quote.                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Reference Number: QT-2025-001                             ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ What happens next?                                      │  │
│  │ ✓ You'll receive an email confirmation                 │  │
│  │ ✓ Our team will review your requirements               │  │
│  │ ✓ We'll send you a detailed quote within 24 hours      │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                 │
│                   [View Similar Projects]                      │
│                        [Close]                                 │
│              💬 Have questions? Contact us                     │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Breadcrumb Navigation

### Standard (Light Background)
```
🏠 Home > Services > Web Development
```

### Styled (Dark Background)
```
🏠 Home > Courses > Web Development Bootcamp
(White text on dark blue/primary background)
```

### Interactive States
- Current page: Bold, not clickable
- Previous pages: Links with hover effect (blue → darker blue)
- Home icon: Always links to homepage

---

## 💼 Portfolio Detail Page CTA

```
┌───────────────────────────────────────────────────────────────┐
│                                                                 │
│        Want Similar Results for Your Business?                 │
│                                                                 │
│     Let's discuss how we can help you achieve your goals       │
│              with a customized solution.                        │
│                                                                 │
│  [Request Similar Project]    [View Our Services]             │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

**Styling**:
- Gradient background (primary/10 to accent/10)
- Rounded corners (2xl)
- Center-aligned text
- Two prominent CTAs with different styles

---

## 🎨 Color Palette

### Primary Colors
- **Primary**: #3b82f6 (Blue)
- **Accent**: Cyan/Teal shade
- **Success**: Green (#10b981)
- **White**: #ffffff
- **Gray**: Various shades (50-900)

### Component-Specific Colors
- **Cards**: White background, gray-200 border
- **Hover States**: Primary color with reduced opacity
- **Selected Items**: Primary background with white text
- **Disabled States**: Gray-400 with reduced opacity
- **Error States**: Red (#ef4444)

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)
- Single column layouts
- Stacked cards
- Full-width buttons
- Collapsible filters
- Smaller font sizes
- Simplified navigation

### Tablet (768px - 1023px)
- 2-column grids
- Larger touch targets
- Side-by-side CTAs
- Expanded filters

### Desktop (≥ 1024px)
- 3-column grids
- Full comparison tables
- Inline filters
- Hover effects
- Larger spacing

---

## ✨ Animation & Transitions

### Hover Effects
- **Cards**: scale(1.05) + shadow increase
- **Buttons**: Background color change
- **Links**: Color transition (200ms)

### Modal Animations
- **Enter**: Fade in + scale from 0.95 to 1
- **Exit**: Fade out + scale from 1 to 0.95
- **Duration**: 300ms ease-in-out

### Wizard Progress
- **Step Complete**: Green checkmark animation
- **Step Active**: Blue pulse effect
- **Step Pending**: Gray neutral state

---

## 🎯 Interactive Elements

### Buttons
- **Primary**: Blue background, white text
- **Secondary**: White background, blue border
- **Hover**: Darker shade + shadow
- **Disabled**: Gray background, reduced opacity

### Form Fields
- **Default**: Gray border
- **Focus**: Blue border + ring
- **Error**: Red border + error message
- **Success**: Green checkmark icon

### Cards
- **Default**: White background, subtle shadow
- **Hover**: Increased shadow, slight scale
- **Selected**: Blue border, blue background tint
- **Disabled**: Reduced opacity, no hover

---

## 📏 Spacing & Layout

### Container
- Max width: 1280px
- Padding: 24px (mobile), 48px (desktop)

### Card Spacing
- Gap between cards: 32px
- Internal padding: 24px
- Border radius: 12px (lg) or 16px (xl)

### Typography
- **H1**: 2.5rem (mobile), 3rem (desktop)
- **H2**: 2rem (mobile), 2.5rem (desktop)
- **H3**: 1.5rem (mobile), 2rem (desktop)
- **Body**: 1rem (mobile), 1.125rem (desktop)
- **Small**: 0.875rem

---

This visual guide provides a text-based representation of the implemented components and their layouts. For actual screenshots, run the development server and navigate through the features.
