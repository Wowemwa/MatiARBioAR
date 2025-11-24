import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { User } from '@supabase/supabase-js'
import { logAdminLogin, logAdminLogout } from '../utils/activityLog'

type AdminContextValue = {
  isAdmin: boolean
  isAdminPanelOpen: boolean
  user: User | null
  login: (credentials: { email: string; password: string }) => Promise<boolean>
  logout: () => Promise<void>
  openAdminPanel: () => void
  closeAdminPanel: () => void
  lastLoginAt?: string
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined)

interface AdminProviderProps {
  children: ReactNode
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [lastLoginAt, setLastLoginAt] = useState<string | undefined>(undefined)

  // Check if current user is admin
  const checkAdminStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false)
      setLastLoginAt(undefined)
      return
    }

    try {
      // Use optimized admin check function
      const { data: adminData, error } = await supabase
        .rpc('get_admin_info', { user_uuid: user.id })

      if (error || !adminData || adminData.length === 0) {
        setIsAdmin(false)
        setLastLoginAt(undefined)
        return
      }

      setIsAdmin(true)
      setLastLoginAt(adminData[0].last_login_at)
    } catch (error) {
      console.warn('[AdminProvider] Failed to check admin status', error)
      setIsAdmin(false)
      setLastLoginAt(undefined)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      checkAdminStatus(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        await checkAdminStatus(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login: AdminContextValue['login'] = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        return false
      }

      if (data.user) {
        // Use optimized admin authentication function
        const { data: adminData, error: adminError } = await supabase
          .rpc('authenticate_admin', { user_uuid: data.user.id })

        if (adminError) {
          console.error('Admin check error:', adminError)
          // Not an admin, sign out
          await supabase.auth.signOut()
          return false
        }

        if (adminData && adminData.length > 0 && adminData[0].is_admin) {
          // User is admin - login time already updated by the function
          setLastLoginAt(new Date().toISOString())
          // Log admin login activity
          await logAdminLogin()
          return true
        } else {
          // Not an admin, sign out
          await supabase.auth.signOut()
          return false
        }
      }

      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout: AdminContextValue['logout'] = async () => {
    try {
      // Log admin logout activity before signing out
      await logAdminLogout()
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
      setLastLoginAt(undefined)
      setIsAdminPanelOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const openAdminPanel = () => setIsAdminPanelOpen(true)
  const closeAdminPanel = () => setIsAdminPanelOpen(false)

  const value = useMemo(() => ({
    isAdmin,
    isAdminPanelOpen,
    user,
    login,
    logout,
    openAdminPanel,
    closeAdminPanel,
    lastLoginAt,
  }), [isAdmin, isAdminPanelOpen, user, lastLoginAt])

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
