import normalizeStatistics from '../../src/lib/normalizeStatistics'

describe('normalizeStatistics (scripts)', () => {
  test('returns empty object for falsy input', () => {
    expect(normalizeStatistics(undefined)).toEqual({})
    expect(normalizeStatistics(null)).toEqual({})
  })

  test('passes through metrics shape', () => {
    const input = { metrics: { projectsCompleted: 12, clientSatisfaction: 95, averageDeliveryTime: '7 days' } }
    expect(normalizeStatistics(input)).toEqual({ metrics: { projectsCompleted: 12, clientSatisfaction: 95, averageDeliveryTime: '7 days' } })
  })

  test('maps legacy flat fields into metrics', () => {
    const input = { projectsCompleted: 5, fundingSuccessRate: 88, averageDeliveryTime: '14 days' }
    expect(normalizeStatistics(input)).toEqual({ metrics: { projectsCompleted: 5, clientSatisfaction: 88, averageDeliveryTime: '14 days' } })
  })
})
