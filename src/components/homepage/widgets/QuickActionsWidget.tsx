'use client'

import Link from 'next/link'
import type { WidgetItem } from '@/contexts/HomepageContext'
import { useHomepage } from '@/contexts/HomepageContext'

const ANON_ACTIONS = [
  { href: '/courses', label: 'Browse Courses', icon: '🎓' },
  { href: '/services', label: 'View Services', icon: '🛠️' },
  { href: '/store', label: 'Visit Store', icon: '📚' },
  { href: '/mentorships', label: 'Find a Mentor', icon: '🧭' },
  { href: '/contact', label: 'Contact Us', icon: '✉️' },
]

const STUDENT_ACTIONS = [
  { href: '/student/dashboard', label: 'My Dashboard', icon: '📊' },
  { href: '/courses', label: 'Browse Courses', icon: '🎓' },
  { href: '/store', label: 'Visit Store', icon: '📚' },
  { href: '/student/labs', label: 'My Labs', icon: '🔬' },
  { href: '/contact', label: 'Get Help', icon: '✉️' },
]

const TEACHER_ACTIONS = [
  { href: '/teacher/dashboard', label: 'My Dashboard', icon: '📊' },
  { href: '/courses', label: 'Browse Courses', icon: '🎓' },
  { href: '/teacher/labs', label: 'My Labs', icon: '🔬' },
  { href: '/services', label: 'Services', icon: '🛠️' },
  { href: '/contact', label: 'Get Help', icon: '✉️' },
]

const ADMIN_ACTIONS = [
  { href: '/admin/dashboard', label: 'Admin Panel', icon: '⚙️' },
  { href: '/admin/users', label: 'Manage Users', icon: '👥' },
  { href: '/admin/enrollments', label: 'Enrollments', icon: '📋' },
  { href: '/studio', label: 'Sanity Studio', icon: '📝' },
  { href: '/courses', label: 'Browse Courses', icon: '🎓' },
]

export function QuickActionsWidget({ widget }: { widget: WidgetItem }) {
  const { userRole } = useHomepage()

  const actions =
    userRole === 'admin' ? ADMIN_ACTIONS
    : userRole === 'teacher' ? TEACHER_ACTIONS
    : userRole === 'student' ? STUDENT_ACTIONS
    : ANON_ACTIONS

  return (
    <div className="p-5">
      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">
        {widget.title || 'Quick Actions'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 border border-gray-100 dark:border-slate-700 transition-colors group"
          >
            <span className="text-base">{action.icon}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors truncate">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
