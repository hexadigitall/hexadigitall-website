import { client } from '@/sanity/client'

export interface SessionUser {
  _id: string
  username: string
  name?: string
  email?: string
  role: 'admin' | 'teacher' | 'student'
  status?: 'active' | 'pending' | 'suspended'
}

export async function getSessionUserFromToken(token: string): Promise<SessionUser | null> {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const timestamp = typeof decoded.timestamp === 'number' ? decoded.timestamp : 0
    const hoursSinceLogin = (Date.now() - timestamp) / (1000 * 60 * 60)
    if (hoursSinceLogin >= 24) return null

    if (decoded.userId) {
      const user = await client.fetch<SessionUser | null>(
        `*[_type == "user" && _id == $id][0]{
          _id,
          username,
          name,
          email,
          role,
          status
        }`,
        { id: decoded.userId },
      )
      if (!user || user.status === 'suspended') return null
      return user
    }

    if (!decoded.role || !decoded.username) return null
    return {
      _id: '',
      username: decoded.username,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
      status: 'active',
    }
  } catch {
    return null
  }
}

export async function getSessionUserFromAuthHeader(authHeader: string | null): Promise<SessionUser | null> {
  if (!authHeader?.startsWith('Bearer ')) return null
  return getSessionUserFromToken(authHeader.substring(7))
}
