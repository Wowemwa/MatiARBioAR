import { useState, useEffect } from 'react'
import { CancelIcon, DeleteIcon } from './Icons'
import { supabase } from '../supabaseClient'

interface Feedback {
  id: string
  name: string
  email: string | null
  message: string
  rating: number
  created_at: string
  is_read: boolean
}

interface AdminFeedbacksViewerProps {
  isVisible: boolean
  onClose: () => void
}

export default function AdminFeedbacksViewer({ isVisible, onClose }: AdminFeedbacksViewerProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  useEffect(() => {
    if (isVisible) {
      loadFeedbacks()
    }
  }, [isVisible])

  useEffect(() => {
    let filtered = feedbacks

    if (searchQuery) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.email && f.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        f.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterRating !== 'all') {
      filtered = filtered.filter(f => f.rating === filterRating)
    }

    setFilteredFeedbacks(filtered)
  }, [feedbacks, searchQuery, filterRating])

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setFeedbacks(data || [])
      setFilteredFeedbacks(data || [])
    } catch (error) {
      console.error('Error loading feedbacks:', error)
      alert('Failed to load feedbacks from database')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id)

      if (error) throw error

      setFeedbacks(prev => prev.filter(f => f.id !== id))
      setSelectedFeedback(null)
      alert('✅ Feedback deleted successfully!')
    } catch (error) {
      console.error('Error deleting feedback:', error)
      alert('❌ Failed to delete feedback')
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL feedbacks?\n\nThis action cannot be undone!')) return

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

      if (error) throw error

      setFeedbacks([])
      setFilteredFeedbacks([])
      setSelectedFeedback(null)
      alert('✅ All feedbacks deleted!')
    } catch (error) {
      console.error('Error deleting all feedbacks:', error)
      alert('❌ Failed to delete feedbacks')
    }
  }

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(feedbacks, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `feedbacks-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      alert('✅ Feedbacks exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      alert('❌ Failed to export feedbacks')
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400'
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-white/20 shadow-2xl w-full max-w-[95vw] h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">💬 User Feedbacks</h2>
              <p className="text-white/90">View and manage user feedback submissions</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all"
            >
              <CancelIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100%-100px)]">
          {/* Sidebar - Feedback List */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            {/* Controls */}
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="🔍 Search feedbacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
              />

              <div className="flex gap-3">
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                  <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                  <option value="3">⭐⭐⭐ (3 stars)</option>
                  <option value="2">⭐⭐ (2 stars)</option>
                  <option value="1">⭐ (1 star)</option>
                </select>

                <button
                  onClick={handleExport}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold"
                >
                  📥 Export
                </button>

                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
                >
                  🗑️ Clear All
                </button>
              </div>

              <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{feedbacks.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{feedbacks.filter(f => f.rating >= 4).length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Positive</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : '0'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Cards */}
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-4xl mb-4">📭</p>
                <p className="text-lg font-semibold">No feedbacks found</p>
                <p className="text-sm">User feedback will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFeedbacks.map(feedback => (
                  <div
                    key={feedback.id}
                    onClick={() => setSelectedFeedback(feedback)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedFeedback?.id === feedback.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{feedback.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{feedback.email}</p>
                      </div>
                      <span className={`text-lg ${getRatingColor(feedback.rating)}`}>
                        {getRatingStars(feedback.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                      {feedback.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(feedback.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail View */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedFeedback ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedFeedback.name}
                      </h2>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        {selectedFeedback.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl mb-1 ${getRatingColor(selectedFeedback.rating)}`}>
                        {getRatingStars(selectedFeedback.rating)}
                      </div>
                      <div className={`text-sm font-semibold ${getRatingColor(selectedFeedback.rating)}`}>
                        {selectedFeedback.rating}/5 Rating
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Message</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedFeedback.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <strong>Submitted:</strong> {new Date(selectedFeedback.created_at).toLocaleString()}
                    </div>
                    <div>
                      <strong>ID:</strong> {selectedFeedback.id.substring(0, 8)}...
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(selectedFeedback.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <DeleteIcon className="w-5 h-5" />
                  Delete This Feedback
                </button>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    💡 <strong>Note:</strong> Feedbacks are stored in the Supabase database. 
                    Use the Export button to download a JSON backup for your records.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="text-center">
                  <p className="text-6xl mb-4">👈</p>
                  <p className="text-xl font-semibold">Select a feedback to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
