import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

type FeedbackEntry = {
  id: string
  name: string | null
  email: string | null
  message: string
  rating: number | null
  url: string | null
  user_agent: string | null
  created_at: string
  is_read: boolean
}

export default function AdminFeedbacks() {
  const [items, setItems] = useState<FeedbackEntry[]>([])
  const [loading, setLoading] = useState(true)

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating}/5)</span>
      </div>
    )
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.warn('[AdminFeedbacks] failed to fetch feedback', err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ is_read: true })
        .eq('id', id)

      if (error) throw error

      setItems(items.map(item =>
        item.id === id ? { ...item, is_read: true } : item
      ))
    } catch (err) {
      console.warn('[AdminFeedbacks] failed to mark as read', err)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this feedback? This cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItems(items.filter(item => item.id !== id))
    } catch (err) {
      console.warn('[AdminFeedbacks] failed to delete feedback', err)
    }
  }

  const clearAll = async () => {
    if (!confirm('Delete ALL feedback? This cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (error) throw error

      setItems([])
    } catch (err) {
      console.warn('[AdminFeedbacks] failed to clear feedback', err)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-sm text-slate-500">Loading feedback...</div>
      </div>
    )
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
        <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700">
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className={`p-4 rounded-lg border ${item.is_read ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.name || item.email || 'Anonymous'}
                  </span>
                  {!item.is_read && (
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {item.message}
                </p>
                {item.rating && (
                  <div className="mb-2">
                    {renderStars(item.rating)}
                  </div>
                )}
                {item.url && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    From: {item.url}
                  </p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {!item.is_read && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="text-xs px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-700"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => remove(item.id)}
                  className="text-xs px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
