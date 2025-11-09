import { createContext, ReactNode, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { MATI_HOTSPOTS as HOTSPOTS, MATI_SPECIES as SPECIES, Hotspot, SpeciesDetail } from '../data/mati-hotspots'

type DataContextValue = {
  hotspots: Hotspot[]
  species: SpeciesDetail[]
  unifiedSpecies: UnifiedSpecies[]
  loading: boolean
  error?: string
  refresh: () => Promise<void>
  // Admin CRUD operations
  createSpecies: (species: SpeciesDetail) => void
  updateSpecies: (id: string, updates: Partial<SpeciesDetail>) => void
  deleteSpecies: (id: string) => void
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

export function DataProvider({ children }: DataProviderProps) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [species, setSpecies] = useState<SpeciesDetail[]>([])
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
    } catch (err) {
      console.error('[DataProvider] failed to hydrate data context', err)
      setError('Unable to load biodiversity data. Please try again later.')
      setSpecies(SPECIES) // Fallback to default
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

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(SPECIES_STORAGE_KEY)
    setSpecies(SPECIES)
  }, [])

  const value = useMemo<DataContextValue>(() => ({
    hotspots,
    species,
    unifiedSpecies: buildUnifiedSpecies({ species }),
    loading,
    error,
    refresh: async () => hydrate(),
    createSpecies,
    updateSpecies,
    deleteSpecies,
    resetToDefault,
  }), [hotspots, species, loading, error, hydrate, createSpecies, updateSpecies, deleteSpecies, resetToDefault])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
