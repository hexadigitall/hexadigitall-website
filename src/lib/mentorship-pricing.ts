export const MENTORSHIP_RATE_MULTIPLIER = 0.8

type RateInput = {
  courseType?: 'self-paced' | 'live' | string
  hourlyRateUSD?: number
  hourlyRateNGN?: number
  mentorshipHourlyRateUSD?: number
  mentorshipHourlyRateNGN?: number
}

export function resolveMentorshipRates(course: RateInput) {
  if (course.courseType !== 'live') {
    return {
      hourlyRateUSD: undefined,
      hourlyRateNGN: undefined,
      source: 'missing' as const
    }
  }

  if (course.mentorshipHourlyRateUSD && course.mentorshipHourlyRateNGN) {
    return {
      hourlyRateUSD: course.mentorshipHourlyRateUSD,
      hourlyRateNGN: course.mentorshipHourlyRateNGN,
      source: 'override' as const
    }
  }

  if (course.hourlyRateUSD && course.hourlyRateNGN) {
    const discountedUsd = Math.round(course.hourlyRateUSD * MENTORSHIP_RATE_MULTIPLIER * 100) / 100
    const discountedNgn = Math.round(course.hourlyRateNGN * MENTORSHIP_RATE_MULTIPLIER)
    return {
      hourlyRateUSD: discountedUsd,
      hourlyRateNGN: discountedNgn,
      source: 'discount' as const
    }
  }

  return {
    hourlyRateUSD: undefined,
    hourlyRateNGN: undefined,
    source: 'missing' as const
  }
}

/**
 * Global pricing logic for Textbooks and Imprints
 * Rules:
 * 1. Base price is ALWAYS calculated in USD first.
 * 2. Student Edition = Monthly Mentorship Price (Hourly USD Rate * 4)
 * 3. Teacher Edition = Student Price + 15%
 * 4. Specific USD overrides for certain titles.
 * 5. Companion assets = $9.99 USD.
 * 6. Convert to NGN using site exchange logic (or specific NGN mentorship rate if available).
 */
export function resolveBookPrice(book: { 
  slug: string; 
  _type: string; 
  variant?: 'student' | 'teacher' | 'single';
  relatedCourse?: RateInput;
  pricing?: { usd?: number; ngn?: number };
}) {
    // BASE DEFAULT - Should rarely be used if data is complete
    let priceUSD = 40; 

    const isAsset = book._type === 'asset' || book.slug.startsWith('companion-');
    
    // 1. Check for specific USD overrides FIRST
    if (book.slug === 'dunce-to-midjourney-pro') {
        priceUSD = 54.99;
    } else if (book.slug === 'mother-of-two') {
        priceUSD = 47.99;
    } else if (book.slug === 'love-is-nothing') {
        priceUSD = 85.99;
    } else if (isAsset) {
        priceUSD = 9.99;
    } 
    // 2. Textbooks tied to courses use Mentorship Pricing (Hourly USD * 4)
    else if (book.relatedCourse) {
        // We use resolveMentorshipRates to find the professional hourly rate for the course
        const rates = resolveMentorshipRates(book.relatedCourse);
        
        if (rates.hourlyRateUSD) {
            // Textbook price is strictly 4x the mentorship hourly rate (Monthly cost)
            priceUSD = rates.hourlyRateUSD * 4;
        } else if (book.pricing?.usd) {
            priceUSD = book.pricing.usd;
        }
    }
    // 3. Fallback to Sanity pricing fields
    else if (book.pricing?.usd) {
        priceUSD = book.pricing.usd;
    }

    // Apply Teacher Markup (15%)
    if (book.variant === 'teacher') {
        priceUSD *= 1.15;
    }

    return {
        usd: priceUSD,
        ngn: priceUSD * 1650 // Legacy fallback, UI should format via CurrencyContext
    };
}

// Internal imports for the utility if needed (checking if EXCHANGE_RATES is available)
const EXCHANGE_RATES: Record<string, number> = { NGN: 1650 }; // Minimal local fallback
