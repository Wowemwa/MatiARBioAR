import { useState } from 'react'
import { X, MessageCircle, Star } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useAdmin } from '../context/AdminContext'

export default function FeedbackFloating() {
  const { isAdmin } = useAdmin()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Hide feedback button when user is admin
  if (isAdmin) return null

  const sendFeedback = async () => {
    if (!message.trim()) {
      alert('Please enter a message')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            name: name.trim() || null,
            email: email.trim() || null,
            message: message.trim(),
            rating: rating,
            url: window.location.pathname,
            user_agent: navigator.userAgent,
          }
        ])

      if (error) throw error

      setSubmitStatus('success')
      setName('')
      setEmail('')
      setMessage('')
      setRating(5)

      // Close after success
      setTimeout(() => {
        setOpen(false)
        setSubmitStatus('idle')
      }, 2000)

    } catch (error) {
      console.error('Failed to submit feedback:', error)
      setSubmitStatus('error')
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div aria-live="polite">
      {/* Floating button */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
        <div>

        </div>

        <div className="relative">
          {/* animated glow behind the button */}
          <div className="absolute left-0 top-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-emerald-300 opacity-30 blur-xl animate-pulse" aria-hidden="true" />
          <button
            aria-label={open ? 'Close feedback' : 'Open feedback'}
            onClick={() => setOpen((s) => !s)}
            className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 text-white shadow-2xl hover:scale-105 transform-gpu transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300/50"
          >
            {open ? <X className="w-6 h-6 animate-[rotate_400ms_linear]" /> : <MessageCircle className="w-6 h-6" />}
          </button>

          {/* small label removed per request */}
        </div>

          {/* Panel with animation */}
        {open && (
          <div className="mt-3 w-80 sm:w-96 rounded-xl bg-white/95 dark:bg-slate-900/95 shadow-2xl p-4 backdrop-blur-md animate-slideUp origin-bottom">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-300 to-blue-400 flex items-center justify-center text-white shadow-md">💬</div>
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Share your thoughts</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Help us improve — we read every message</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 text-sm text-slate-700 dark:text-slate-300">Quick prompts</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Loved the AR view', 'Missing species info', 'Map not accurate', 'Site photos', 'Other...'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setMessage((m) => (m ? m + '\n' + p : p))}
                  className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-105 transition"
                >
                  {p}
                </button>
              ))}
            </div>

            <label className="block mt-3 text-xs text-slate-500">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane (optional)"
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />

            <label className="block mt-3 text-xs text-slate-500">Email (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />

            <label className="block mt-3 text-xs text-slate-500">How was your experience?</label>
            <div
              className="mt-1 flex gap-2 items-center"
              role="radiogroup"
              aria-label="Rating"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  setRating((r) => Math.max(1, r - 1))
                } else if (e.key === 'ArrowRight') {
                  setRating((r) => Math.min(5, r + 1))
                } else if (e.key === 'Home') {
                  setRating(1)
                } else if (e.key === 'End') {
                  setRating(5)
                }
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = (hoverRating ?? rating) >= star
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    aria-checked={isActive}
                    role="radio"
                    title={`${star} / 5`}
                    className={`p-1 rounded transition-transform focus:outline-none focus:ring-2 focus:ring-blue-300/50 ${isActive ? 'scale-110' : ''}`}
                  >
                    <Star className={`${isActive ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} w-5 h-5`} />
                  </button>
                )
              })}
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 self-center">{rating}/5</span>
            </div>

            <label className="block mt-3 text-xs text-slate-500">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did you enjoy? Any issues or ideas? Be specific — it helps us a lot."
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 resize-none"
            />

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-500">Thank you — your feedback powers our conservation work 🌱</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { 
                    setOpen(false)
                    setName('')
                    setEmail('')
                    setMessage('')
                    setRating(5)
                    setSubmitStatus('idle')
                  }}
                  className="px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={sendFeedback}
                  disabled={!message.trim() || isSubmitting}
                  className="px-3 py-2 text-sm rounded-md bg-gradient-to-r from-blue-500 to-emerald-400 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Thanks!' : 'Send feedback'}
                </button>
              </div>
            </div>

            {submitStatus === 'error' && (
              <div className="mt-2 text-xs text-red-600 dark:text-red-400">Failed to send feedback. Please try again.</div>
            )}

            {submitStatus === 'success' && (
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">✅ Feedback sent successfully — we appreciate your help!</div>
            )}
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
