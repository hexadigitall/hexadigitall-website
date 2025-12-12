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
              <Link href={item.href} className="text-gray-600 hover:text-gray-900">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}