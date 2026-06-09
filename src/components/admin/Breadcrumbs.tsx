"use client"

import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="text-gray-600 dark:text-slate-400 dark:text-slate-400 dark:text-slate-400 hover:text-gray-900 dark:text-slate-100 dark:text-slate-100 dark:text-slate-100">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-slate-100 dark:text-slate-100 dark:text-slate-100 font-medium">{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <span className="mx-2 text-gray-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-500">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}