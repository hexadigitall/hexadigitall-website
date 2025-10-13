'use client'

import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed?: boolean
  estimatedTime?: string
}

interface QuickStartChecklistProps {
  serviceType: string
  className?: string
}

const getChecklistForService = (serviceType: string): ChecklistItem[] => {
  const checklists: Record<string, ChecklistItem[]> = {
    web: [
      {
        id: '1',
        title: 'Define Your Goals',
        description: 'Clarify what you want to achieve with your website',
        estimatedTime: '15 mins'
      },
      {
        id: '2',
        title: 'Gather Content',
        description: 'Collect text, images, and branding materials',
        estimatedTime: '1-2 hours'
      },
      {
        id: '3',
        title: 'Choose a Package',
        description: 'Select the package that fits your needs',
        estimatedTime: '10 mins'
      },
      {
        id: '4',
        title: 'Submit Requirements',
        description: 'Share your specific requirements with our team',
        estimatedTime: '20 mins'
      },
      {
        id: '5',
        title: 'Review & Approve',
        description: 'Review designs and provide feedback',
        estimatedTime: '30 mins'
      }
    ],
    mobile: [
      {
        id: '1',
        title: 'Define App Purpose',
        description: 'Clarify the main problem your app solves',
        estimatedTime: '20 mins'
      },
      {
        id: '2',
        title: 'List Features',
        description: 'Document must-have and nice-to-have features',
        estimatedTime: '1 hour'
      },
      {
        id: '3',
        title: 'Design Assets',
        description: 'Prepare logos, brand colors, and design preferences',
        estimatedTime: '1-2 hours'
      },
      {
        id: '4',
        title: 'Select Platform',
        description: 'Choose iOS, Android, or both platforms',
        estimatedTime: '5 mins'
      },
      {
        id: '5',
        title: 'Get Started',
        description: 'Submit your project and start development',
        estimatedTime: '15 mins'
      }
    ],
    marketing: [
      {
        id: '1',
        title: 'Identify Target Audience',
        description: 'Define who you want to reach',
        estimatedTime: '30 mins'
      },
      {
        id: '2',
        title: 'Set Campaign Goals',
        description: 'Determine what success looks like',
        estimatedTime: '20 mins'
      },
      {
        id: '3',
        title: 'Budget Planning',
        description: 'Decide on your marketing budget',
        estimatedTime: '15 mins'
      },
      {
        id: '4',
        title: 'Content Preparation',
        description: 'Gather images, videos, and ad copy',
        estimatedTime: '2-3 hours'
      },
      {
        id: '5',
        title: 'Launch Campaign',
        description: 'Review and launch your campaign',
        estimatedTime: '30 mins'
      }
    ],
    branding: [
      {
        id: '1',
        title: 'Brand Vision',
        description: 'Define your brand personality and values',
        estimatedTime: '30 mins'
      },
      {
        id: '2',
        title: 'Research Competitors',
        description: 'Analyze competitor branding for inspiration',
        estimatedTime: '1 hour'
      },
      {
        id: '3',
        title: 'Style Preferences',
        description: 'Share colors, styles, and design preferences',
        estimatedTime: '20 mins'
      },
      {
        id: '4',
        title: 'Review Concepts',
        description: 'Provide feedback on initial designs',
        estimatedTime: '30 mins'
      },
      {
        id: '5',
        title: 'Finalize & Deliver',
        description: 'Approve final designs and receive files',
        estimatedTime: '15 mins'
      }
    ],
    default: [
      {
        id: '1',
        title: 'Initial Consultation',
        description: 'Discuss your project requirements',
        estimatedTime: '30 mins'
      },
      {
        id: '2',
        title: 'Gather Requirements',
        description: 'Document detailed project specifications',
        estimatedTime: '1 hour'
      },
      {
        id: '3',
        title: 'Choose Service Package',
        description: 'Select the right package for your needs',
        estimatedTime: '15 mins'
      },
      {
        id: '4',
        title: 'Project Kickoff',
        description: 'Start your project with our team',
        estimatedTime: '1 hour'
      },
      {
        id: '5',
        title: 'Review & Launch',
        description: 'Final review and project delivery',
        estimatedTime: '30 mins'
      }
    ]
  }

  return checklists[serviceType] || checklists.default
}

export default function QuickStartChecklist({ serviceType, className = '' }: QuickStartChecklistProps) {
  const checklist = getChecklistForService(serviceType)

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Start Guide</h3>
      <p className="text-gray-600 mb-6">Follow these steps to get your project started smoothly</p>
      
      <div className="space-y-4">
        {checklist.map((item, index) => (
          <div key={item.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">{index + 1}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              {item.estimatedTime && (
                <div className="flex items-center text-xs text-gray-500">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>{item.estimatedTime}</span>
                </div>
              )}
            </div>
            {item.completed && (
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-600 text-center">
          Need help getting started? <a href="/contact" className="text-primary hover:underline font-medium">Contact our team</a>
        </p>
      </div>
    </div>
  )
}
