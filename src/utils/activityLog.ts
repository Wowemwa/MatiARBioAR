// Activity logging utility for tracking changes in the admin panel
import { supabase } from '../supabaseClient'

export interface ActivityLogEntry {
  id: string
  type: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'admin_action'
  entityType: 'species' | 'site' | 'team_member' | 'admin' | 'user'
  entityId?: string
  entityName?: string
  timestamp: string // ISO string
  details?: string
  userId?: string
  ipAddress?: string
  userAgent?: string
}

const STORAGE_KEY = 'mati-activity-log:v1'

// Fallback localStorage functions for when database is unavailable
function getLocalActivityLog(): ActivityLogEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error reading local activity log:', error)
    return []
  }
}

function addLocalActivityLog(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>): void {
  try {
    const logs = getLocalActivityLog()
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }
    logs.unshift(newEntry) // Add to beginning

    // Keep only last 100 entries locally as fallback
    const trimmedLogs = logs.slice(0, 100)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs))
  } catch (error) {
    console.error('Error adding local activity log:', error)
  }
}

// Database-based activity logging
export async function getActivityLog(): Promise<ActivityLogEntry[]> {
  try {
    // Try to get logs from database first
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      console.warn('Database activity log fetch failed, using localStorage:', error)
      return getLocalActivityLog()
    }

    // Transform database records to ActivityLogEntry format
    return data.map((record: any) => ({
      id: record.id.toString(),
      type: record.action_type,
      entityType: record.entity_type,
      entityId: record.entity_id,
      entityName: record.action_details?.entity_name,
      timestamp: record.created_at,
      details: record.action_details?.details,
      userId: record.admin_id || undefined,
      ipAddress: record.ip_address,
      userAgent: record.action_details?.user_agent
    }))
  } catch (error) {
    console.error('Error fetching activity logs from database:', error)
    // Fallback to localStorage
    return getLocalActivityLog()
  }
}

export async function addActivityLog(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>): Promise<void> {
  try {
    // Try to log to database first
    const { error } = await supabase
      .from('activity_log')
      .insert({
        action_type: entry.type,
        entity_type: entry.entityType,
        entity_id: entry.entityId,
        action_details: {
          entity_name: entry.entityName,
          details: entry.details,
          user_agent: entry.userAgent,
          ip_address: entry.ipAddress
        }
      })

    if (error) {
      console.warn('Database activity logging failed, using localStorage:', error)
      // Fallback to localStorage
      addLocalActivityLog(entry)
    }
  } catch (error) {
    console.error('Error adding activity log to database:', error)
    // Fallback to localStorage
    addLocalActivityLog(entry)
  }
}

// Admin login/logout logging functions
export async function logAdminLogin(): Promise<void> {
  const userAgent = navigator.userAgent

  await addActivityLog({
    type: 'login',
    entityType: 'admin',
    entityName: 'Admin User',
    details: 'Admin logged into the system',
    userAgent
  })
}

export async function logAdminLogout(): Promise<void> {
  await addActivityLog({
    type: 'logout',
    entityType: 'admin',
    entityName: 'Admin User',
    details: 'Admin logged out of the system'
  })
}

export function clearActivityLog(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing local activity log:', error)
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
