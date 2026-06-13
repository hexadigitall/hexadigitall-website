import { NextRequest, NextResponse } from 'next/server'
import { getInstance } from '@/lib/sim-engine'
import { evaluateGradingHints } from '@/lib/grading'
import { client } from '@/sanity/client'
import type { GradingHint, SimDeviceState } from '@/types/simulation'

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    const token = authHeader.substring(7)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const hoursSinceLogin = (Date.now() - decoded.timestamp) / (1000 * 60 * 60)
    if (hoursSinceLogin >= 24) return null
    if (decoded.userId) {
      const user = await client.fetch(
        `*[_type == "user" && _id == $id][0]{_id, username, role, status}`,
        { id: decoded.userId }
      )
      if (!user || user.status === 'suspended') return null
      return user
    }
    return decoded
  } catch {
    return null
  }
}

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, context: RouteContext) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await context.params

    // 1. Fetch instance from engine
    const instance = await getInstance(id)
    if (!instance) {
      return NextResponse.json({ success: false, message: 'Instance not found' }, { status: 404 })
    }

    // 2. Fetch lab definition from Sanity (with grading hints)
    let gradingHints: GradingHint[] = []
    try {
      const labDef = await client.fetch(
        `*[_type == "simLabDefinition" && _id == $id][0]{
          _id, title,
          "gradingHints": gradingHints[]{
            label, targetType, targetId, jsonPath, expectedValue, points
          }
        }`,
        { id: instance.labDefinitionId }
      )
      gradingHints = labDef?.gradingHints || []
    } catch {
      // Sanity fetch failed — grade with empty hints
    }

    if (gradingHints.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No grading hints defined for this lab definition',
      }, { status: 400 })
    }

    // 3. Fetch current device state from engine's in-memory tick
    //    We pull it from the engine's GET instance which includes tick
    //    but not full device state. Instead, get state from the WS endpoint.
    //    For BFF grading, we use a snapshot endpoint or direct engine call.
    const engineUrl = process.env.SIM_ENGINE_URL || 'http://localhost:9000'
    let devices: SimDeviceState[] = []
    try {
      const stateRes = await fetch(
        `${engineUrl}/api/v1/instances/${id}/state`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (stateRes.ok) {
        const stateData = await stateRes.json()
        devices = stateData.devices || []
      }
    } catch {
      // State fetch failed
    }

    if (devices.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No device state available for grading. Start the simulation first.',
      }, { status: 400 })
    }

    // 4. Evaluate
    const result = evaluateGradingHints(devices, gradingHints)

    // 5. Submit grade to engine DB
    const gradeRes = await fetch(`${engineUrl}/api/v1/instances/${id}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lab_definition_id: instance.labDefinitionId,
        earned_points: result.earnedPoints,
        total_points: result.totalPoints,
        passed_checks: result.passed,
        total_checks: result.total,
        details: result,
      }),
    })

    let storedGrade = null
    if (gradeRes.ok) {
      storedGrade = await gradeRes.json()
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        stored: !!storedGrade,
      },
    })
  } catch (error) {
    console.error('Failed to grade instance:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to grade simulation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const engineUrl = process.env.SIM_ENGINE_URL || 'http://localhost:9000'
    const res = await fetch(`${engineUrl}/api/v1/instances/${id}/grade`)

    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'Grade not found' }, { status: 404 })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to get grade:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to get grade' },
      { status: 500 }
    )
  }
}
