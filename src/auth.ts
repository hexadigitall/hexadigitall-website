import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import { cookies } from 'next/headers'
import { client, writeClient } from '@/sanity/client'

const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || ''
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || ''
const githubClientId = process.env.AUTH_GITHUB_ID || process.env.GITHUB_CLIENT_ID || ''
const githubClientSecret = process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || ''

type ExistingUser = {
  _id: string
  username: string
  role: 'admin' | 'teacher' | 'student'
  status?: 'active' | 'pending' | 'suspended'
  emailVerified?: boolean
}

function sanitizeUsername(source: string): string {
  const base = source
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')

  if (!base) return 'student'
  return base.slice(0, 24)
}

async function getUniqueUsername(seed: string): Promise<string> {
  const normalized = sanitizeUsername(seed)

  for (let i = 0; i < 100; i += 1) {
    const candidate = i === 0 ? normalized : `${normalized}_${Math.floor(100 + Math.random() * 900)}`
    const exists = await client.fetch(`count(*[_type == "user" && username == $username])`, { username: candidate })
    if (!exists) return candidate
  }

  return `${normalized}_${Date.now().toString().slice(-6)}`
}

export const { handlers, auth } = NextAuth({
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),
    ...(githubClientId && githubClientSecret
      ? [
          GitHub({
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          }),
        ]
      : []),
  ],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/student/login',
    error: '/student/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      const email = user.email.trim().toLowerCase()
      const cookieStore = await cookies()
      const teacherOauthIntent = cookieStore.get('teacher_oauth_intent')?.value
      const isTeacherSignup = teacherOauthIntent === 'signup'
      const isTeacherSignin = teacherOauthIntent === 'signin'
      const existing = await client.fetch<ExistingUser | null>(
        `*[_type == "user" && email == $email][0]{ _id, username, role, status, emailVerified }`,
        { email }
      )

      if (existing) {
        if (existing.status === 'suspended') {
          if (isTeacherSignup || isTeacherSignin) {
            return `/teacher/oauth-success?intent=${isTeacherSignup ? 'signup' : 'signin'}&error=suspended`
          }
          return false
        }

        if (isTeacherSignup) {
          if (existing.role === 'teacher') {
            if (existing.status === 'pending') {
              return '/teacher/oauth-success?intent=signup&status=pending'
            }
            return '/teacher/oauth-success?intent=signup&error=teacher-exists'
          }

          return '/teacher/oauth-success?intent=signup&error=account-exists'
        }

        if (isTeacherSignin && existing.role !== 'teacher') {
          return '/teacher/oauth-success?intent=signin&error=not-teacher'
        }

        const patch: Record<string, unknown> = {
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString(),
        }

        if (account?.provider) {
          patch.oauthProvider = account.provider
        }
        if (account?.providerAccountId) {
          patch.oauthProviderId = account.providerAccountId
        }
        if (user.image) {
          patch.profilePhotoUrl = user.image
        }

        await writeClient.patch(existing._id).set(patch).unset(['emailVerificationTokenHash', 'emailVerificationExpiresAt']).commit()
        return true
      }

      const fallbackName = user.name || email.split('@')[0] || 'Student'
      const username = await getUniqueUsername(email.split('@')[0] || fallbackName)

      if (isTeacherSignin) {
        return '/teacher/oauth-success?intent=signin&error=no-account'
      }

      if (isTeacherSignup) {
        await writeClient.create({
          _type: 'user',
          name: fallbackName,
          username,
          email,
          role: 'teacher',
          status: 'pending',
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString(),
          oauthProvider: account?.provider,
          oauthProviderId: account?.providerAccountId,
          ...(user.image ? { profilePhotoUrl: user.image } : {}),
          createdAt: new Date().toISOString(),
        })

        return true
      }

      await writeClient.create({
        _type: 'user',
        name: fallbackName,
        username,
        email,
        role: 'student',
        status: 'active',
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
        oauthProvider: account?.provider,
        oauthProviderId: account?.providerAccountId,
        ...(user.image ? { profilePhotoUrl: user.image } : {}),
        createdAt: new Date().toISOString(),
      })

      return true
    },
    async redirect({ url, baseUrl }) {
      // Preserve callback query params (e.g., intent=signup) for OAuth flows.
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      if (url.startsWith(baseUrl)) {
        return url
      }
      return `${baseUrl}/student/oauth-success`
    },
  },
})
