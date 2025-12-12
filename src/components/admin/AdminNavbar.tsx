"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Submissions', href: '/admin/submissions' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Settings', href: '/admin/settings' },
  { label: 'Teacher', href: '/teacher/dashboard' },
  { label: 'Student', href: '/student/dashboard' },
]

export default function AdminNavbar() {
  const pathname = usePathname()
  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {links.map((l) => {
            const active = pathname?.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}