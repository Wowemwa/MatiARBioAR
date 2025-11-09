import { useEffect, useState } from 'react'

type FeedbackEntry = {
  id: string
  email: string | null
  message: string
  createdAt: string
}

const STORAGE_KEY = 'mati-feedback:v1'

export default function AdminFeedbacks() {
  const [items, setItems] = useState<FeedbackEntry[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as FeedbackEntry[]
      setItems(parsed)
    } catch (err) {
      console.warn('[AdminFeedbacks] failed to parse feedback storage', err)
    }
  }, [])

  const remove = (id: string) => {
    const next = items.filter(i => i.id !== id)
    setItems(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const clearAll = () => {
    if (!confirm('Clear all feedback? This cannot be undone.')) return
    setItems([])
    localStorage.removeItem(STORAGE_KEY)
  }

  if (!items.length) {
    return (
      <div className="p-6">
        <div className="text-sm text-slate-500">No feedback yet.</div>
      </div>
    )
  }

  return (
    <div className="p-4 overflow-y-auto max-h-[70vh]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">User Feedback</h3>
        <button onClick={clearAll} className="text-sm text-red-500">Clear all</button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.email ?? 'Anonymous'}</div>
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{item.message}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => remove(item.id)} className="text-sm text-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
