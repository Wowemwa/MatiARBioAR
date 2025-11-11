// Activity logging utility for tracking changes in the admin panel

export interface ActivityLogEntry {
  id: string
  type: 'create' | 'update' | 'delete' | 'image_add' | 'site_add'
  entityType: 'species' | 'site' | 'image'
  entityId: string
  entityName: string
  timestamp: string // ISO string
  details?: string
  userId?: string
}

const STORAGE_KEY = 'mati-activity-log:v1'

export function getActivityLog(): ActivityLogEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error reading activity log:', error)
    return []
  }
}

export function addActivityLog(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>): void {
  try {
    const logs = getActivityLog()
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }
    logs.unshift(newEntry) // Add to beginning
    
    // Keep only last 500 entries to avoid storage issues
    const trimmedLogs = logs.slice(0, 500)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs))
  } catch (error) {
    console.error('Error adding activity log:', error)
  }
}

export function clearActivityLog(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing activity log:', error)
  }
}

export function filterActivityLog(
  logs: ActivityLogEntry[],
  timeframe: '7d' | '30d' | '90d' | 'all'
): ActivityLogEntry[] {
  if (timeframe === 'all') return logs

  const now = new Date()
  const cutoff = new Date()

  switch (timeframe) {
    case '7d':
      cutoff.setDate(now.getDate() - 7)
      break
    case '30d':
      cutoff.setDate(now.getDate() - 30)
      break
    case '90d':
      cutoff.setDate(now.getDate() - 90)
      break
  }

  return logs.filter(log => new Date(log.timestamp) >= cutoff)
}
