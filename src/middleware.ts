import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function decodeToken(token: string) {
  try {
    // Use atob for Edge runtime compatibility
    // Token is base64-encoded JSON
     
    const json = atob(token)
    return JSON.parse(json) as { userId?: string; username?: string; role?: string; timestamp?: number }
  } catch {
    return null
  }
}

function isExpired(timestamp?: number) {
  if (!timestamp) return true
  const age = Date.now() - timestamp
  return age > 24 * 60 * 60 * 1000
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login pages without auth
  if (
    pathname === '/admin/login' ||
    pathname === '/teacher/login' ||
    pathname === '/student/login'
  ) {
    return NextResponse.next()
  }

  // Only protect specific sections
  const isAdminRoute = pathname.startsWith('/admin')
  const isTeacherRoute = pathname.startsWith('/teacher')
  const isStudentRoute = pathname.startsWith('/student')

  if (!(isAdminRoute || isTeacherRoute || isStudentRoute)) {
    return NextResponse.next()
  }

  // Read token from cookie (set on login pages)
  const token = request.cookies.get('admin_token')?.value
  if (!token) {
    const loginPath = isAdminRoute ? '/admin/login' : isTeacherRoute ? '/teacher/login' : '/student/login'
    return NextResponse.redirect(new URL(loginPath, request.url))
  }

  const decoded = decodeToken(token)
  if (!decoded || isExpired(decoded.timestamp)) {
    const loginPath = isAdminRoute ? '/admin/login' : isTeacherRoute ? '/teacher/login' : '/student/login'
    // Clear bad/expired cookie
    const res = NextResponse.redirect(new URL(loginPath, request.url))
    res.cookies.set('admin_token', '', { path: '/', maxAge: 0 })
    return res
  }

  const role = decoded.role

  // Role-based gatekeeping
  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  if (isTeacherRoute && !(role === 'teacher' || role === 'admin')) {
    return NextResponse.redirect(new URL('/teacher/login', request.url))
  }
  if (isStudentRoute && !(role === 'student' || role === 'admin')) {
    return NextResponse.redirect(new URL('/student/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*', '/student/:path*'],
}