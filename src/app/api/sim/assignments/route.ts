import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'

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
      if (user.role !== 'teacher' && user.role !== 'admin') return null
      return user
    }
    return decoded
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const engineUrl = process.env.SIM_ENGINE_URL || 'http://localhost:9000'
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const labDefId = searchParams.get('labDefinitionId')
    const status = searchParams.get('status')

    let url = `${engineUrl}/api/v1/assignments`
    const params = new URLSearchParams()
    if (studentId) params.set('student_id', studentId)
    if (labDefId) params.set('lab_definition_id', labDefId)
    if (status) params.set('status', status)
    const qs = params.toString()
    if (qs) url += `?${qs}`

    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Engine assignments error: ${res.status}`)
    }
    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to fetch assignments:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}
