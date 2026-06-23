'use client'

import type { WidgetItem } from '@/contexts/HomepageContext'
import { TrackedCoursesWidget } from './TrackedCoursesWidget'
import { ServicesWidget } from './ServicesWidget'
import { MentorshipsWidget } from './MentorshipsWidget'
import { TextbooksWidget } from './TextbooksWidget'
import { CustomBuildWidget } from './CustomBuildWidget'
import { PaymentsWidget } from './PaymentsWidget'
import { EnrollmentsWidget } from './EnrollmentsWidget'
import { RecentActivityWidget } from './RecentActivityWidget'
import { QuickActionsWidget } from './QuickActionsWidget'
import { LabsWidget } from './LabsWidget'
import { PortfolioWidget } from './PortfolioWidget'
import { BlogWidget } from './BlogWidget'
import { PlansProposalsWidget } from './PlansProposalsWidget'

export function WidgetRenderer({ widget }: { widget: WidgetItem }) {
  switch (widget.type) {
    case 'tracked-courses':
      return <TrackedCoursesWidget widget={widget} />
    case 'services':
      return <ServicesWidget widget={widget} />
    case 'mentorships':
      return <MentorshipsWidget widget={widget} />
    case 'textbooks':
      return <TextbooksWidget widget={widget} />
    case 'custom-build':
      return <CustomBuildWidget widget={widget} />
    case 'payments':
      return <PaymentsWidget widget={widget} />
    case 'enrollments':
      return <EnrollmentsWidget widget={widget} />
    case 'recent-activity':
      return <RecentActivityWidget widget={widget} />
    case 'quick-actions':
      return <QuickActionsWidget widget={widget} />
    case 'labs':
      return <LabsWidget widget={widget} />
    case 'portfolio':
      return <PortfolioWidget widget={widget} />
    case 'blog':
      return <BlogWidget widget={widget} />
    case 'plans-proposals':
      return <PlansProposalsWidget widget={widget} />
    default:
      return (
        <div className="p-5 text-sm text-gray-400 dark:text-slate-500">
          Unknown widget type: {widget.type}
        </div>
      )
  }
}
