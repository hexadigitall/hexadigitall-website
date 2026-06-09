import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/sanity/client'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.substring(7)
  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    if (!decoded.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    userId = decoded.userId
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const user = await client.fetch(
    `*[_type == "user" && _id == $id][0]{_id, status}`,
    { id: userId }
  )
  if (!user || user.status === 'suspended') {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('photo') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' },
      { status: 400 }
    )
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: `profile-${userId}.${ext}`,
    contentType: file.type,
  })

  const photoUrl = asset.url
  await writeClient.patch(userId).set({ profilePhotoUrl: photoUrl }).commit()

  return NextResponse.json({ success: true, url: photoUrl })
}
