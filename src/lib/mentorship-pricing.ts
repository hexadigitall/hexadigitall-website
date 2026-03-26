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
