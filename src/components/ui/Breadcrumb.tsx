'use client'

import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
      <Link
        href="/"
        className="text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-cyan-300 transition-colors flex items-center"
        aria-label="Home"
      >
        <HomeIcon className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-slate-500" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-cyan-300 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-gray-900 dark:text-slate-100 font-medium' : 'text-gray-500 dark:text-slate-400'}>
                {item.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
