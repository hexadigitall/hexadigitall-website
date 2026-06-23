'use client'

import Link from 'next/link'
import type { WidgetItem } from '@/contexts/HomepageContext'

const PROPOSAL_ROUTES = [
  { href: '/proposals/divas-kloset', label: 'Divas Kloset Proposal', desc: 'Social media marketing for fashion' },
  { href: '/proposals/jhema-wears', label: 'Jhema Wears Proposal', desc: 'E-commerce launch for fashion brand' },
]

export function PlansProposalsWidget({ widget }: { widget: WidgetItem }) {
  return (
    <div className="p-5">
      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">
        {widget.title || 'Plans & Proposals'}
      </h3>
      <div className="space-y-2">
        {PROPOSAL_ROUTES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors group"
          >
            <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
              {p.label}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
