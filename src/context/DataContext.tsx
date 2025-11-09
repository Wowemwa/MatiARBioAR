import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { MATI_HOTSPOTS as HOTSPOTS, MATI_SPECIES as SPECIES, Hotspot, SpeciesDetail } from '../data/mati-hotspots'

type DataContextValue = {
  hotspots: Hotspot[]
  species: SpeciesDetail[]
  unifiedSpecies: UnifiedSpecies[]
  loading: boolean
  error?: string
  refresh: () => Promise<void>
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
  }))
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [species, setSpecies] = useState<SpeciesDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)

  const hydrate = async () => {
    try {
      setLoading(true)
      setError(undefined)
      // TODO: Replace with remote fetch when backend is ready
      setHotspots(HOTSPOTS)
      setSpecies(SPECIES)
    } catch (err) {
      console.error('[DataProvider] failed to hydrate data context', err)
      setError('Unable to load biodiversity data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void hydrate()
  }, [])

  const value = useMemo<DataContextValue>(() => ({
    hotspots,
    species,
    unifiedSpecies: buildUnifiedSpecies({ species }),
    loading,
    error,
    refresh: async () => hydrate(),
  }), [hotspots, species, loading, error])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
