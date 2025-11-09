import { createContext, ReactNode, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { MATI_HOTSPOTS as HOTSPOTS, MATI_SPECIES as SPECIES, Hotspot, SpeciesDetail } from '../data/mati-hotspots'

export interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  description: string
}

type DataContextValue = {
  hotspots: Hotspot[]
  species: SpeciesDetail[]
  unifiedSpecies: UnifiedSpecies[]
  teamMembers: TeamMember[]
  loading: boolean
  error?: string
  refresh: () => Promise<void>
  // Admin CRUD operations
  createSpecies: (species: SpeciesDetail) => void
  updateSpecies: (id: string, updates: Partial<SpeciesDetail>) => void
  deleteSpecies: (id: string) => void
  // Team members CRUD operations
  createTeamMember: (member: TeamMember) => void
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void
  deleteTeamMember: (id: string) => void
  resetToDefault: () => void
}

export interface UnifiedSpecies {
  id: string
  commonName: string
  scientificName: string
  status: SpeciesDetail['status']
  type: SpeciesDetail['category']
  description: string
  habitats: string[]
  siteIds: string[]
  endemic?: boolean
  media?: { type: 'image', url: string, caption?: string, credit?: string }[]
}

function buildUnifiedSpecies({ species }: { species: SpeciesDetail[] }): UnifiedSpecies[] {
  return species.map((record) => ({
    id: record.id,
    commonName: record.commonName,
    scientificName: record.scientificName,
    status: record.status,
    type: record.category,
    description: record.blurb,
    habitats: record.habitat ? [record.habitat] : [],
    siteIds: record.siteIds ?? [],
    endemic: undefined,
    media: record.images ? record.images.map(url => ({
      type: 'image' as const,
      url,
      caption: `${record.commonName} (${record.scientificName})`,
      credit: 'Wikimedia Commons'
    })) : undefined,
  }))
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

const SPECIES_STORAGE_KEY = 'mati-species-data:v1'
const TEAM_STORAGE_KEY = 'mati-team-data:v1'

// Default team members
const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Team Member 1',
    role: 'Lead Researcher',
    image: '/path/to/photo1.jpg',
    description: 'Leading biodiversity research and conservation efforts'
  },
  {
    id: '2',
    name: 'Team Member 2',
    role: 'Senior Developer',
    image: '/path/to/photo2.jpg',
    description: 'Building innovative AR solutions for conservation'
  },
  {
    id: '3',
    name: 'Team Member 3',
    role: 'Full Stack Developer',
    image: '/path/to/photo3.jpg',
    description: 'Developing web platform and data visualization tools'
  }
]

export function DataProvider({ children }: DataProviderProps) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [species, setSpecies] = useState<SpeciesDetail[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)

  // Load species from localStorage or use defaults
  const hydrate = useCallback(async () => {
    try {
      setLoading(true)
      setError(undefined)
      
      // Load hotspots (not editable for now)
      setHotspots(HOTSPOTS)
      
      // Try to load species from localStorage first
      const stored = localStorage.getItem(SPECIES_STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as SpeciesDetail[]
          setSpecies(parsed)
        } catch (parseErr) {
          console.warn('[DataProvider] Failed to parse stored species, using defaults', parseErr)
          setSpecies(SPECIES)
        }
      } else {
        setSpecies(SPECIES)
      }

      // Load team members from localStorage
      const storedTeam = localStorage.getItem(TEAM_STORAGE_KEY)
      if (storedTeam) {
        try {
          const parsed = JSON.parse(storedTeam) as TeamMember[]
          setTeamMembers(parsed)
        } catch (parseErr) {
          console.warn('[DataProvider] Failed to parse stored team members, using defaults', parseErr)
          setTeamMembers(DEFAULT_TEAM_MEMBERS)
        }
      } else {
        setTeamMembers(DEFAULT_TEAM_MEMBERS)
      }
    } catch (err) {
      console.error('[DataProvider] failed to hydrate data context', err)
      setError('Unable to load biodiversity data. Please try again later.')
      setSpecies(SPECIES) // Fallback to default
      setTeamMembers(DEFAULT_TEAM_MEMBERS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  // Save species to localStorage whenever it changes
  useEffect(() => {
    if (species.length > 0 && !loading) {
      try {
        localStorage.setItem(SPECIES_STORAGE_KEY, JSON.stringify(species))
        console.log('[DataContext] Saved species to localStorage:', species.length)
      } catch (err) {
        console.error('[DataContext] Failed to save to localStorage:', err)
      }
    }
  }, [species, loading])

  // Save team members to localStorage whenever it changes
  useEffect(() => {
    if (teamMembers.length > 0 && !loading) {
      try {
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamMembers))
        console.log('[DataContext] Saved team members to localStorage:', teamMembers.length)
      } catch (err) {
        console.error('[DataContext] Failed to save team members to localStorage:', err)
      }
    }
  }, [teamMembers, loading])

  // Admin CRUD operations
  const createSpecies = useCallback((newSpecies: SpeciesDetail) => {
    console.log('[DataContext] Creating species:', newSpecies.commonName)
    setSpecies(prev => {
      const updated = [...prev, newSpecies]
      console.log('[DataContext] New species count:', updated.length)
      return updated
    })
  }, [])

  const updateSpecies = useCallback((id: string, updates: Partial<SpeciesDetail>) => {
    console.log('[DataContext] Updating species:', id, updates)
    setSpecies(prev => {
      const updated = prev.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
      console.log('[DataContext] Species updated')
      return updated
    })
  }, [])

  const deleteSpecies = useCallback((id: string) => {
    setSpecies(prev => prev.filter(s => s.id !== id))
  }, [])

  // Team members CRUD operations
  const createTeamMember = useCallback((newMember: TeamMember) => {
    console.log('[DataContext] Creating team member:', newMember.name)
    setTeamMembers(prev => [...prev, newMember])
  }, [])

  const updateTeamMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    console.log('[DataContext] Updating team member:', id, updates)
    setTeamMembers(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ))
  }, [])

  const deleteTeamMember = useCallback((id: string) => {
    console.log('[DataContext] Deleting team member:', id)
    setTeamMembers(prev => prev.filter(m => m.id !== id))
  }, [])

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(SPECIES_STORAGE_KEY)
    localStorage.removeItem(TEAM_STORAGE_KEY)
    setSpecies(SPECIES)
    setTeamMembers(DEFAULT_TEAM_MEMBERS)
  }, [])

  const value = useMemo<DataContextValue>(() => ({
    hotspots,
    species,
    unifiedSpecies: buildUnifiedSpecies({ species }),
    teamMembers,
    loading,
    error,
    refresh: async () => hydrate(),
    createSpecies,
    updateSpecies,
    deleteSpecies,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    resetToDefault,
  }), [hotspots, species, teamMembers, loading, error, hydrate, createSpecies, updateSpecies, deleteSpecies, createTeamMember, updateTeamMember, deleteTeamMember, resetToDefault])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
