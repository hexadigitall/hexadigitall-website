'use client'

import { CheckCircleIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  type?: 'quote' | 'project' | 'payment' | 'contact'
  orderNumber?: string
  showActions?: boolean
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'contact',
  orderNumber,
  showActions = true
}: SuccessModalProps) {
  if (!isOpen) return null

  const getDefaultContent = () => {
    switch (type) {
      case 'quote':
        return {
          title: 'Quote Request Submitted!',
          message: 'Thank you for your interest. Our team will review your requirements and get back to you within 24 hours with a detailed quote.'
        }
      case 'project':
        return {
          title: 'Project Initiated Successfully!',
          message: 'Your project has been created. Our team will contact you shortly to discuss the next steps and begin the onboarding process.'
        }
      case 'payment':
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully. You will receive a confirmation email shortly.'
        }
      default:
        return {
          title: 'Message Sent Successfully!',
          message: 'Thank you for contacting us. We will get back to you as soon as possible.'
        }
    }
  }

  const content = {
    title: title || getDefaultContent().title,
    message: message || getDefaultContent().message
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {content.title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {content.message}
        </p>

        {/* Order Number (if applicable) */}
        {orderNumber && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Reference Number</p>
            <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
          </div>
        )}

        {/* What's Next Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {type === 'quote' && (
              <>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>You&apos;ll receive an email confirmation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Our team will review your requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>We&apos;ll send you a detailed quote within 24 hours</span>
                </li>
              </>
            )}
            {type === 'project' && (
              <>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Project manager will contact you within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>We&apos;ll schedule a kickoff meeting</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>You&apos;ll get access to our project dashboard</span>
                </li>
              </>
            )}
            {type === 'payment' && (
              <>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Confirmation email sent to your inbox</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Our team will begin work immediately</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Regular updates throughout development</span>
                </li>
              </>
            )}
            {type === 'contact' && (
              <>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Your message has been received</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>We typically respond within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Check your email for our reply</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-3">
            {type === 'project' && (
              <Link
                href="/portfolio"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                View Similar Projects
              </Link>
            )}
            
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Close
            </button>

            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center px-4 py-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Have questions? Contact us
            </Link>
          </div>
        )}

        {!showActions && (
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  )
}
