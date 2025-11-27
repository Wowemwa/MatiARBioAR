import { memo } from 'react'
import FeedbackFloating from './FeedbackFloating'

interface FeedbackModalProps {
  show: boolean
  onClose: () => void
}

const FeedbackModal = memo(function FeedbackModal({ show, onClose }: FeedbackModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Support</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Feedback Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              💬
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Share Your Feedback</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Help us improve the Mati ARBio platform. Your feedback is valuable to our conservation efforts.
            </p>
          </div>

          {/* Embed the FeedbackFloating component */}
          <div className="relative">
            <FeedbackFloating />
          </div>
        </div>
      </div>
    </div>
  )
})

export default FeedbackModal