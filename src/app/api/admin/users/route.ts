import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client, writeClient } from '@/sanity/client'
import { requireAdmin } from '@/lib/adminAuth'

const allowedRoles = new Set(['admin', 'teacher', 'student'])

function hashWithSalt(password: string, salt: string) {
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  try {
    const users = await client.fetch<Array<{ _id: string; username: string; email: string; name?: string; role: string; status: string; createdAt?: string }>>(
      '*[_type == "user"] | order(createdAt desc) { _id, username, email, name, role, status, createdAt }'
    )

    const courses = await client.fetch<Array<{ assignedTeachers?: Array<{ _ref?: string }> }>>(
      '*[_type == "course"] { assignedTeachers }'
    )

    const teacherCourseCountById = new Map<string, number>()
    for (const course of courses) {
      for (const teacherRef of course.assignedTeachers || []) {
        if (!teacherRef?._ref) continue
        teacherCourseCountById.set(
          teacherRef._ref,
          (teacherCourseCountById.get(teacherRef._ref) || 0) + 1
        )
      }
    }

    const enrollments = await client.fetch<
      Array<{ courseId?: { _ref?: string }; studentId?: { _ref?: string }; studentEmail?: string }>
    >(
      '*[_type == "enrollment" && courseAccessGranted == true] { courseId, studentId, studentEmail }'
    )

    const studentCourseIdsByUserId = new Map<string, Set<string>>()
    const studentCourseIdsByEmail = new Map<string, Set<string>>()

    for (const enrollment of enrollments) {
      const courseId = enrollment.courseId?._ref
      if (!courseId) continue

      const studentId = enrollment.studentId?._ref
      if (studentId) {
        if (!studentCourseIdsByUserId.has(studentId)) {
          studentCourseIdsByUserId.set(studentId, new Set())
        }
        studentCourseIdsByUserId.get(studentId)?.add(courseId)
      }

      const email = enrollment.studentEmail?.toLowerCase().trim()
      if (email) {
        if (!studentCourseIdsByEmail.has(email)) {
          studentCourseIdsByEmail.set(email, new Set())
        }
        studentCourseIdsByEmail.get(email)?.add(courseId)
      }
    }

    const usersWithCounts = users.map((user) => {
      if (user.role === 'teacher') {
        return {
          ...user,
          assignedCourseCount: teacherCourseCountById.get(user._id) || 0,
        }
      }

      if (user.role === 'student') {
        const byId = studentCourseIdsByUserId.get(user._id) || new Set<string>()
        const byEmail = studentCourseIdsByEmail.get(user.email.toLowerCase().trim()) || new Set<string>()
        const mergedCourseIds = new Set<string>([...Array.from(byId), ...Array.from(byEmail)])

        return {
          ...user,
          assignedCourseCount: mergedCourseIds.size,
        }
      }

      return {
        ...user,
        assignedCourseCount: 0,
      }
    })

    return NextResponse.json({ success: true, users: usersWithCounts })
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  try {
    const { username, email, name, role, password, status } = await request.json()

    if (!username || !email || !role || !password) {
      return NextResponse.json(
        { success: false, message: 'Username, email, role and password are required' },
        { status: 400 }
      )
    }

    if (!allowedRoles.has(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const existing = await client.fetch(
      '*[_type == "user" && (username == $username || email == $email)][0]{ _id }',
      { username, email }
    )

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      )
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const passwordHash = hashWithSalt(password, salt)
    const now = new Date().toISOString()

    const created = await writeClient.create({
      _type: 'user',
      username,
      email,
      name: name || username,
      role,
      status: status === 'suspended' ? 'suspended' : 'active',
      salt,
      passwordHash,
      createdAt: now,
    })

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: created._id,
          username,
          email,
          name: name || username,
          role,
          status: status === 'suspended' ? 'suspended' : 'active',
          createdAt: now,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    )
  }
}
