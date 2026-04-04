import fs from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'

export interface CurriculumAsset {
  htmlFile: string
  htmlPath: string
  normalizedStem: string
  tokens: string[]
}

export interface CurriculumMatch {
  score: number
  asset: CurriculumAsset
  reason: 'exact' | 'contains' | 'token-overlap'
}

const CURRICULUM_DIR = path.join(process.cwd(), 'public', 'curriculums')

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/^curriculum-/, '')
    .replace(/\.html?$/, '')
    .replace(/\.pdf$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function tokenize(value: string): string[] {
  return normalizeSlug(value).split('-').filter(Boolean)
}

function toSet(values: string[]): Set<string> {
  return new Set(values)
}

function tokenOverlapScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0
  const aSet = toSet(a)
  const bSet = toSet(b)

  let intersection = 0
  for (const token of aSet) {
    if (bSet.has(token)) intersection += 1
  }

  const union = new Set([...aSet, ...bSet]).size
  if (union === 0) return 0

  const jaccard = intersection / union
  return Math.round(jaccard * 100)
}

const readCurriculumAssets = cache(async (): Promise<CurriculumAsset[]> => {
  const entries = await fs.readdir(CURRICULUM_DIR, { withFileTypes: true })

  const htmlFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name)

  return htmlFiles.map((file) => {
    const normalizedStem = normalizeSlug(file)
    const tokens = tokenize(file)

    return {
      htmlFile: file,
      htmlPath: `/curriculums/${file}`,
      normalizedStem,
      tokens,
    }
  })
})

export async function getCurriculumAssets(): Promise<CurriculumAsset[]> {
  return readCurriculumAssets()
}

export async function findCurriculumForCourseSlug(courseSlug: string): Promise<CurriculumMatch | null> {
  const assets = await readCurriculumAssets()
  if (assets.length === 0) return null

  const target = normalizeSlug(courseSlug)
  const targetTokens = tokenize(target)

  let best: CurriculumMatch | null = null

  for (const asset of assets) {
    let score = 0
    let reason: CurriculumMatch['reason'] = 'token-overlap'

    if (asset.normalizedStem === target) {
      score = 100
      reason = 'exact'
    } else if (asset.normalizedStem.includes(target) || target.includes(asset.normalizedStem)) {
      const lengthPenalty = Math.min(20, Math.abs(asset.normalizedStem.length - target.length))
      score = 90 - lengthPenalty
      reason = 'contains'
    } else {
      const overlap = tokenOverlapScore(targetTokens, asset.tokens)
      const targetSet = toSet(targetTokens)
      const candidateSet = toSet(asset.tokens)

      const targetSubset = [...targetSet].every((token) => candidateSet.has(token))
      const firstTokenMatch = targetTokens[0] && asset.tokens[0] && targetTokens[0] === asset.tokens[0]

      score = overlap
      if (targetSubset) score += 10
      if (firstTokenMatch) score += 5
      reason = 'token-overlap'
    }

    if (!best || score > best.score) {
      best = { score, asset, reason }
    }
  }

  if (!best) return null
  return best.score >= 45 ? best : null
}
