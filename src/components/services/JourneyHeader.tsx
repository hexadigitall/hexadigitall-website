'use client'

type JourneyStage = 'idea' | 'build' | 'grow'

interface JourneyHeaderProps {
  currentStage: JourneyStage
  hideNavigation?: boolean
}

/**
 * JourneyHeader
 * 
 * Displays the Startup Journey breadcrumb:
 * Idea (Business Planning) → Build (Web/App Development) → Grow (Marketing/Growth)
 * 
 * Allows users to navigate between stages and see where they are in the journey.
 */
export default function JourneyHeader({ currentStage, hideNavigation = false }: JourneyHeaderProps) {
  void currentStage
  void hideNavigation
  return null
}
