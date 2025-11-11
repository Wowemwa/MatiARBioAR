import { useState, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { getActivityLog, filterActivityLog, type ActivityLogEntry } from '../utils/activityLog'

export default function AdminAnalytics() {
  const { species } = useData()
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  // Get real activity log from localStorage
  const activityLog: ActivityLogEntry[] = useMemo(() => {
    const logs = getActivityLog()
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [])

  const filteredLogs = useMemo(() => {
    return filterActivityLog(activityLog, selectedTimeframe)
  }, [activityLog, selectedTimeframe])

  const stats = useMemo(() => {
    const createCount = filteredLogs.filter(log => log.type === 'create').length
    const updateCount = filteredLogs.filter(log => log.type === 'update').length
    const deleteCount = filteredLogs.filter(log => log.type === 'delete').length

    return {
      recentActivity: filteredLogs.length,
      createCount,
      updateCount,
      deleteCount
    }
  }, [filteredLogs])

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: ActivityLogEntry['type']) => {
    switch (type) {
      case 'create':
        return '➕'
      case 'update':
      case 'image_add':
        return '✏️'
      case 'delete':
        return '🗑️'
      case 'site_add':
        return '📍'
    }
  }

  const getActivityColor = (type: ActivityLogEntry['type']) => {
    switch (type) {
      case 'create':
      case 'site_add':
        return 'text-green-600 dark:text-green-400'
      case 'update':
      case 'image_add':
        return 'text-blue-600 dark:text-blue-400'
      case 'delete':
        return 'text-red-600 dark:text-red-400'
    }
  }

  return (
    <div className="p-8 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/20">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                Activity History
              </h3>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
              { value: 'all', label: 'All Time' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedTimeframe(value as any)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedTimeframe === value
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Recent Activity ({selectedTimeframe})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.createCount}</p>
              <p className="text-sm text-green-700 dark:text-green-300">Created</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.updateCount}</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Updated</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.deleteCount}</p>
              <p className="text-sm text-red-700 dark:text-red-300">Deleted</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.recentActivity}</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Total</p>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Activity History
          </h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No activity in the selected timeframe</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className={`p-2 rounded-lg ${getActivityColor(log.type)} bg-current/10`}>
                    <span className="text-lg">{getActivityIcon(log.type)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {log.entityName}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        log.type === 'create' || log.type === 'site_add' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        log.type === 'update' || log.type === 'image_add' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {log.type === 'site_add' ? 'site added' : log.type === 'image_add' ? 'image added' : log.type}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        {log.entityType}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {log.details}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(log.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}