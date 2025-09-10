import { NextResponse } from 'next/server'

export async function GET() {
  const timestamp = new Date().toISOString()
  const commitInfo = {
    deploymentTime: timestamp,
    nodeEnv: process.env.NODE_ENV,
    buildId: 'be8f115-critical-fix',
    status: 'active'
  }

  return NextResponse.json({
    message: 'Hexadigitall API Test - Latest Deployment',
    deployment: commitInfo,
    sanityConfig: {
      hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.substring(0, 3) + '***',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    }
  })
}
