/**
 * iNaturalist API Integration Service
 * Fetches species observation data from iNaturalist
 */

export interface INaturalistObservation {
  id: number
  observed_on: string
  location: [number, number] // [lat, lng]
  place_guess: string
  quality_grade: 'research' | 'needs_id' | 'casual'
  user: {
    login: string
    name: string
  }
  photos: Array<{
    url: string
    attribution: string
  }>
  taxon: {
    name: string
    preferred_common_name: string
    rank: string
    iconic_taxon_name: string
  }
}

export interface INaturalistTaxon {
  id: number
  name: string
  preferred_common_name: string
  rank: string
  observations_count: number
  wikipedia_url?: string
  default_photo?: {
    medium_url: string
    attribution: string
  }
}

const INATURALIST_API_BASE = 'https://api.inaturalist.org/v1'

/**
 * Search for a taxon by scientific name
 */
export async function searchTaxon(scientificName: string): Promise<INaturalistTaxon | null> {
  try {
    const response = await fetch(
      `${INATURALIST_API_BASE}/taxa?q=${encodeURIComponent(scientificName)}&rank=species&per_page=1`
    )
    
    if (!response.ok) {
      throw new Error('Failed to search taxon')
    }
    
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      return data.results[0]
    }
    
    return null
  } catch (error) {
    console.error('Error searching iNaturalist taxon:', error)
    return null
  }
}

/**
 * Get observations for a species by scientific name
 * Defaults to showing observations from the Philippines
 */
export async function getObservationsBySpecies(
  scientificName: string,
  options?: {
    placeId?: number // iNaturalist place ID (e.g., 6776 for Philippines)
    bounds?: { swlat: number; swlng: number; nelat: number; nelng: number } // Bounding box
    perPage?: number
    page?: number
    qualityGrade?: 'research' | 'needs_id' | 'casual'
  }
): Promise<INaturalistObservation[]> {
  try {
    // First, search for the taxon to get the taxon ID
    const taxon = await searchTaxon(scientificName)
    
    if (!taxon) {
      console.warn(`No taxon found for "${scientificName}"`)
      return []
    }
    
    // Build query parameters
    const params = new URLSearchParams({
      taxon_id: taxon.id.toString(),
      per_page: (options?.perPage || 200).toString(),
      page: (options?.page || 1).toString(),
      order_by: 'created_at',
      order: 'desc',
      has: 'photos,geo', // Only observations with photos and location
    })
    
    // Add Philippines as default place if no place or bounds specified
    if (!options?.bounds && !options?.placeId) {
      params.append('place_id', '6776') // Philippines
    }
    
    if (options?.placeId) {
      params.append('place_id', options.placeId.toString())
    }
    
    if (options?.bounds) {
      params.append('swlat', options.bounds.swlat.toString())
      params.append('swlng', options.bounds.swlng.toString())
      params.append('nelat', options.bounds.nelat.toString())
      params.append('nelng', options.bounds.nelng.toString())
    }
    
    if (options?.qualityGrade) {
      params.append('quality_grade', options.qualityGrade)
    }
    
    const response = await fetch(`${INATURALIST_API_BASE}/observations?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch observations')
    }
    
    const data = await response.json()
    
    return data.results.map((obs: any) => ({
      id: obs.id,
      observed_on: obs.observed_on,
      location: [obs.location?.split(',')[0], obs.location?.split(',')[1]].map(Number) as [number, number],
      place_guess: obs.place_guess || 'Unknown location',
      quality_grade: obs.quality_grade,
      user: {
        login: obs.user.login,
        name: obs.user.name || obs.user.login
      },
      photos: obs.photos.map((photo: any) => ({
        url: photo.url.replace('square', 'medium'),
        attribution: photo.attribution
      })),
      taxon: {
        name: obs.taxon.name,
        preferred_common_name: obs.taxon.preferred_common_name,
        rank: obs.taxon.rank,
        iconic_taxon_name: obs.taxon.iconic_taxon_name
      }
    }))
  } catch (error) {
    console.error('Error fetching iNaturalist observations:', error)
    return []
  }
}

/**
 * Get observation statistics for a species
 */
export async function getObservationStats(scientificName: string): Promise<{
  totalObservations: number
  researchGrade: number
  placesCounted: number
} | null> {
  try {
    const taxon = await searchTaxon(scientificName)
    
    if (!taxon) {
      return null
    }
    
    const response = await fetch(
      `${INATURALIST_API_BASE}/observations/histogram?taxon_id=${taxon.id}&date_field=observed&interval=month_of_year`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch observation stats')
    }
    
    const data = await response.json()
    
    return {
      totalObservations: taxon.observations_count,
      researchGrade: 0, // Would need another API call
      placesCounted: 0 // Would need another API call
    }
  } catch (error) {
    console.error('Error fetching observation stats:', error)
    return null
  }
}
