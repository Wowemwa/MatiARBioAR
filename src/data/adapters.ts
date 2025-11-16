import type { SpeciesRecord, SiteRecord, BiodiversityDataset } from './schema'

export interface UnifiedSpecies {
  id: string
  commonName: string
  scientificName: string
  status: string
  endemic?: boolean
  type: 'flora' | 'fauna'
  taxonomy: SpeciesRecord['taxonomy']
  description: string
  habitats: string[]
  siteIds: string[]
  media?: { type: 'image', url: string, caption?: string, credit?: string }[]
}

// Convert Mati hotspots to SiteRecord format
export function getSites(): SiteRecord[] {
  // Return empty array since data is now loaded from Supabase via DataContext
  return []
}

// Convert to legacy format for compatibility
export function getDataset(): BiodiversityDataset {
  return {
    metadata: {
      region: "Davao Oriental",
      city: "Mati City",
      lastUpdated: new Date().toISOString(),
      sources: ["Supabase Database"],
      notes: "Data now loaded from Supabase database instead of sample data"
    },
    sites: getSites(),
    flora: [],
    fauna: []
  }
}

// Convert Mati species to UnifiedSpecies format
export function getUnifiedSpecies(): UnifiedSpecies[] {
  // Return empty array since data is now loaded from Supabase via DataContext
  return []
}

export function findSpeciesById(id: string): any {
  // Return null since data is now loaded from Supabase via DataContext
  return null
}

export function findSiteById(id: string): SiteRecord | undefined {
  // Return undefined since data is now loaded from Supabase via DataContext
  return undefined
}