'use client'

import Link from 'next/link'
import type { WidgetItem } from '@/contexts/HomepageContext'
import { useHomepage } from '@/contexts/HomepageContext'

const SERVICE_LINKS = [
  { href: '/services#web', label: 'Web Development', icon: '🌐', desc: 'Sites, apps, e-commerce' },
  { href: '/services#marketing', label: 'Digital Marketing', icon: '📈', desc: 'Social media, SEO, ads' },
  { href: '/services#business', label: 'Business Planning', icon: '📋', desc: 'Plans, strategy, consulting' },
  { href: '/services#design', label: 'Design & Branding', icon: '🎨', desc: 'Logo, brand kits, portfolio' },
  { href: '/services#mentoring', label: 'Mentoring & Coaching', icon: '🧭', desc: 'Career, business coaching' },
  { href: '/services/custom-build', label: 'Custom Build', icon: '🛠️', desc: 'Configure your platform' },
]

export function ServicesWidget({ widget }: { widget: WidgetItem }) {
  const { userRole } = useHomepage()

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {widget.title || 'Services'}
        </h3>
        <Link href="/services" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SERVICE_LINKS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 border border-gray-100 dark:border-slate-700 transition-colors group"
          >
            <span className="text-lg block mb-1">{s.icon}</span>
            <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
              {s.label}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
