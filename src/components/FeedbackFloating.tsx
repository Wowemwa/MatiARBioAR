import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function FeedbackFloating() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const sendFeedback = async () => {
    if (!message.trim()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          {
            message: message.trim(),
            email: email.trim() || null,
            url: window.location.pathname,
            user_agent: navigator.userAgent,
          }
        ])

      if (error) throw error

      setSubmitStatus('success')
      setMessage('')
      setEmail('')

      // Also send email as fallback
      const subject = encodeURIComponent('Mati Platform Feedback')
      const body = encodeURIComponent(`From: ${email || 'anonymous'}\n\n${message}`)
      window.location.href = `mailto:hello@mati.city?subject=${subject}&body=${body}`

      // Close after success
      setTimeout(() => {
        setOpen(false)
        setSubmitStatus('idle')
      }, 2000)

    } catch (error) {
      console.error('Failed to submit feedback:', error)
      setSubmitStatus('error')

      // Fallback to email only
      const subject = encodeURIComponent('Mati Platform Feedback')
      const body = encodeURIComponent(`From: ${email || 'anonymous'}\n\n${message}`)
      window.location.href = `mailto:hello@mati.city?subject=${subject}&body=${body}`
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div aria-live="polite">
      {/* Floating button */}
      <div className="fixed right-6 bottom-6 z-50">
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

        {/* Panel */}
        {open && (
          <div className="mt-3 w-80 sm:w-96 rounded-xl bg-white/95 dark:bg-slate-900/95 shadow-2xl p-4 backdrop-blur-md">
            <div className="flex items-start justify-between">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Send feedback</div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="block mt-3 text-xs text-slate-500">Email (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />

            <label className="block mt-3 text-xs text-slate-500">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you liked or what could be improved..."
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 resize-none"
            />

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => { setOpen(false); setMessage(''); setEmail(''); setSubmitStatus('idle') }}
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
                {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Sent!' : 'Send'}
              </button>
            </div>

            {submitStatus === 'error' && (
              <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                Failed to send feedback. Email client will open as fallback.
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                Feedback sent successfully! Thank you.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
