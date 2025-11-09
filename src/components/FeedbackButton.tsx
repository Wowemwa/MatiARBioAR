import React, { useState } from 'react'
import { SoftCard, Button } from './UI'

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission (you can replace this with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Feedback submitted:', { feedback, email })
    
    setSubmitted(true)
    setIsSubmitting(false)
    
    // Reset after showing success message
    setTimeout(() => {
      setIsOpen(false)
      setFeedback('')
      setEmail('')
      setSubmitted(false)
    }, 2000)
  }

  return (
    <>
      {/* Floating Button - Positioned in hero, always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-6 top-32 z-[99999] w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        aria-label="Send Feedback"
        style={{ 
          position: 'fixed',
          right: '1.5rem',
          top: '8rem',
          zIndex: 99999
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transition-transform group-hover:rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Feedback Panel - Fixed near button */}
      {isOpen && (
        <div 
          className="fixed right-6 top-48 z-[99999] w-80 md:w-96 animate-in fade-in slide-in-from-right-5 duration-300" 
          style={{ 
            position: 'fixed',
            right: '1.5rem',
            top: '12rem',
            zIndex: 99999 
          }}
        >
          <SoftCard className="p-6 border border-emerald-200/40 bg-white/95 dark:border-emerald-800/40 dark:bg-slate-800/95 backdrop-blur-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">💬</span>
                Share Your Feedback
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="feedback"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    rows={4}
                    placeholder="Tell us what you think about this website..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Email (optional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Feedback'
                  )}
                </Button>
              </form>
            ) : (
              <div className="py-8 text-center">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                  Thank you for your feedback!
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  We appreciate your input.
                </p>
              </div>
            )}
          </SoftCard>
        </div>
      )}
    </>
  )
}
