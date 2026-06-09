export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function featureToText(feature: string | { title?: string; description?: string } | undefined | null): string {
  if (!feature) return ''
  if (typeof feature === 'string') return feature
  return feature.title || feature.description || ''
}