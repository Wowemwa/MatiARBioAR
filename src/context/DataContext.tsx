import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { MATI_HOTSPOTS as HOTSPOTS, MATI_SPECIES as SPECIES, Hotspot, SpeciesDetail } from '../data/mati-hotspots'
import { storageService } from '../services/storage'

type DataContextValue = {
  hotspots: Hotspot[]
  species: SpeciesDetail[]
  unifiedSpecies: UnifiedSpecies[]
  loading: boolean
  error?: string
  refresh: () => Promise<void>
  saveHotspot: (hotspot: Hotspot) => Promise<void>
  saveSpecies: (species: SpeciesDetail) => Promise<void>
  deleteHotspot: (id: string) => Promise<void>
  deleteSpecies: (id: string) => Promise<void>
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
      
      // Load from localStorage
      const storageHotspots = await storageService.getHotspots()
      const storageSpecies = await storageService.getSpecies()
      
      // 🔥 MERGE localStorage data with static data
      // Create a map of localStorage items by ID for quick lookup
      const storageHotspotsMap = new Map(storageHotspots.map((h: any) => [h.id, h]))
      const storageSpeciesMap = new Map(storageSpecies.map((s: any) => [s.id, s]))
      
      // Merge: Use localStorage version if it exists, otherwise use static
      const mergedHotspots = HOTSPOTS.map(h => storageHotspotsMap.get(h.id) || h)
      const mergedSpecies = SPECIES.map(s => storageSpeciesMap.get(s.id) || s)
      
      // Add any NEW items from localStorage that aren't in static data
      const newHotspots = storageHotspots.filter((h: any) => !HOTSPOTS.find(staticH => staticH.id === h.id))
      const newSpecies = storageSpecies.filter((s: any) => !SPECIES.find(staticS => staticS.id === s.id))
      
      const finalHotspots = [...mergedHotspots, ...newHotspots]
      const finalSpecies = [...mergedSpecies, ...newSpecies]
      
      setHotspots(finalHotspots)
      setSpecies(finalSpecies)
      
      console.log('� Data loaded:', {
        hotspots: finalHotspots.length,
        species: finalSpecies.length,
        newFromMongoDB: { hotspots: newHotspots.length, species: newSpecies.length }
      })
    } catch (err) {
      console.error('[DataProvider] failed to hydrate data context', err)
      // Fallback to static data on error
      setHotspots(HOTSPOTS)
      setSpecies(SPECIES)
      setError('Using offline data. Database connection may be unavailable.')
    } finally {
      setLoading(false)
    }
  }

  const saveHotspot = async (hotspot: Hotspot) => {
    try {
      await storageService.saveHotspot(hotspot)
      // Refresh data after save
      await hydrate()
      console.log('✅ Hotspot saved successfully')
    } catch (error) {
      console.error('❌ Failed to save hotspot:', error)
      throw error
    }
  }

  const saveSpecies = async (species: SpeciesDetail) => {
    try {
      await storageService.saveSpecies(species)
      // Refresh data after save
      await hydrate()
      console.log('✅ Species saved successfully')
    } catch (error) {
      console.error('❌ Failed to save species:', error)
      throw error
    }
  }

  const deleteHotspot = async (id: string) => {
    try {
      await storageService.deleteHotspot(id)
      // Refresh data after delete
      await hydrate()
      console.log('✅ Hotspot deleted successfully')
    } catch (error) {
      console.error('❌ Failed to delete hotspot:', error)
      throw error
    }
  }

  const deleteSpecies = async (id: string) => {
    try {
      await storageService.deleteSpecies(id)
      // Refresh data after delete
      await hydrate()
      console.log('✅ Species deleted successfully')
    } catch (error) {
      console.error('❌ Failed to delete species:', error)
      throw error
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
    saveHotspot,
    saveSpecies,
    deleteHotspot,
    deleteSpecies,
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
