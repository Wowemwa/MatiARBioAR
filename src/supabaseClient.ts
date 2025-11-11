import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (generated from schema)
export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          role: string
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sites: {
        Row: {
          id: string
          name: string
          type: string
          barangay: string | null
          city: string
          province: string
          designation: string
          area_hectares: number | null
          lat: number
          lng: number
          elevation_range_meters: unknown | null
          summary: string
          description: string
          features: string[]
          stewardship: string
          image_url: string | null
          tags: string[]
          visitor_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          type: string
          barangay?: string | null
          city: string
          province: string
          designation: string
          area_hectares?: number | null
          lat: number
          lng: number
          elevation_range_meters?: unknown | null
          summary: string
          description: string
          features: string[]
          stewardship: string
          image_url?: string | null
          tags: string[]
          visitor_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          barangay?: string | null
          city?: string
          province?: string
          designation?: string
          area_hectares?: number | null
          lat?: number
          lng?: number
          elevation_range_meters?: unknown | null
          summary?: string
          description?: string
          features?: string[]
          stewardship?: string
          image_url?: string | null
          tags?: string[]
          visitor_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      species: {
        Row: {
          id: string
          category: string
          common_name: string
          scientific_name: string
          kingdom: string | null
          phylum: string | null
          class: string | null
          taxonomic_order: string | null
          family: string | null
          genus: string | null
          species: string | null
          authorship: string | null
          synonyms: string[] | null
          conservation_status: string | null
          endemic: boolean
          invasive: boolean
          description: string
          key_facts: string[] | null
          habitat: string | null
          diet: string | null
          behavior: string | null
          reproduction: string | null
          ecosystem_services: string[] | null
          phenology: string | null
          interactions: string[] | null
          growth_form: string | null
          leaf_type: string | null
          flowering_period: string | null
          ethnobotanical_uses: string[] | null
          mobility: string | null
          activity_pattern: string | null
          size: string | null
          weight: string | null
          lifespan: string | null
          population_trend: string | null
          threats: string[] | null
          conservation_actions: string[] | null
          legal_protection: string[] | null
          reference_sources: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          category: string
          common_name: string
          scientific_name: string
          kingdom?: string | null
          phylum?: string | null
          class?: string | null
          taxonomic_order?: string | null
          family?: string | null
          genus?: string | null
          species?: string | null
          authorship?: string | null
          synonyms?: string[] | null
          conservation_status?: string | null
          endemic?: boolean
          invasive?: boolean
          description: string
          key_facts?: string[] | null
          habitat?: string | null
          diet?: string | null
          behavior?: string | null
          reproduction?: string | null
          ecosystem_services?: string[] | null
          phenology?: string | null
          interactions?: string[] | null
          growth_form?: string | null
          leaf_type?: string | null
          flowering_period?: string | null
          ethnobotanical_uses?: string[] | null
          mobility?: string | null
          activity_pattern?: string | null
          size?: string | null
          weight?: string | null
          lifespan?: string | null
          population_trend?: string | null
          threats?: string[] | null
          conservation_actions?: string[] | null
          legal_protection?: string[] | null
          reference_sources?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          common_name?: string
          scientific_name?: string
          kingdom?: string | null
          phylum?: string | null
          class?: string | null
          taxonomic_order?: string | null
          family?: string | null
          genus?: string | null
          species?: string | null
          authorship?: string | null
          synonyms?: string[] | null
          conservation_status?: string | null
          endemic?: boolean
          invasive?: boolean
          description?: string
          key_facts?: string[] | null
          habitat?: string | null
          diet?: string | null
          behavior?: string | null
          reproduction?: string | null
          ecosystem_services?: string[] | null
          phenology?: string | null
          interactions?: string[] | null
          growth_form?: string | null
          leaf_type?: string | null
          flowering_period?: string | null
          ethnobotanical_uses?: string[] | null
          mobility?: string | null
          activity_pattern?: string | null
          size?: string | null
          weight?: string | null
          lifespan?: string | null
          population_trend?: string | null
          threats?: string | null
          conservation_actions?: string[] | null
          legal_protection?: string[] | null
          reference_sources?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string | null
          email: string | null
          message: string
          user_agent: string | null
          url: string | null
          ip_address: unknown | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email?: string | null
          message: string
          user_agent?: string | null
          url?: string | null
          ip_address?: unknown | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string | null
          message?: string
          user_agent?: string | null
          url?: string | null
          ip_address?: unknown | null
          is_read?: boolean
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          event_type: string
          event_data: unknown | null
          user_id: string | null
          session_id: string | null
          url: string | null
          user_agent: string | null
          ip_address: unknown | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          event_data?: unknown | null
          user_id?: string | null
          session_id?: string | null
          url?: string | null
          user_agent?: string | null
          ip_address?: unknown | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type: string
          event_data?: unknown | null
          user_id?: string | null
          session_id?: string | null
          url?: string | null
          user_agent?: string | null
          ip_address?: unknown | null
          created_at?: string
        }
      }
      performance_metrics: {
        Row: {
          id: string
          metric_type: string
          value: number
          metadata: unknown | null
          url: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          metric_type: string
          value: number
          metadata?: unknown | null
          url?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          metric_type: string
          value?: number
          metadata?: unknown | null
          url?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          bio: string | null
          email: string | null
          avatar_url: string | null
          social_links: unknown | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          bio?: string | null
          email?: string | null
          avatar_url?: string | null
          social_links?: unknown | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          bio?: string | null
          email?: string | null
          avatar_url?: string | null
          social_links?: unknown | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}