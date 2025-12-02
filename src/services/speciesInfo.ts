/**
 * Species Information Service
 * Fetches ecological and taxonomic data from Wikipedia and other web sources
 */

export interface EcologicalInfo {
  habitat?: string
  diet?: string
  behavior?: string
  reproduction?: string
  lifespan?: string
  threats?: string[]
  conservationStatus?: string
  conservationEfforts?: string[]
  ecologicalRole?: string
  nativeRange?: string
  physicalDescription?: string
  taxonomy?: {
    kingdom?: string
    phylum?: string
    class?: string
    order?: string
    family?: string
    genus?: string
    species?: string
  }
}

const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

/**
 * Fetch species summary from Wikipedia
 */
export async function getWikipediaSummary(scientificName: string): Promise<{
  title: string
  extract: string
  thumbnail?: { source: string }
  content_urls?: { desktop: { page: string } }
} | null> {
  try {
    const response = await fetch(
      `${WIKIPEDIA_API}${encodeURIComponent(scientificName)}`
    )
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching Wikipedia summary:', error)
    return null
  }
}

/**
 * Parse ecological information from Wikipedia extract
 */
export function parseEcologicalInfo(extract: string): Partial<EcologicalInfo> {
  const info: Partial<EcologicalInfo> = {}
  
  // Extract habitat information
  const habitatPatterns = [
    /(?:found|occurs|lives|inhabits|native to) (?:in|on|at) ([^.]+?)(?:\.|,)/i,
    /habitat[s]? (?:include[s]?|is|are) ([^.]+?)(?:\.|,)/i
  ]
  
  for (const pattern of habitatPatterns) {
    const match = extract.match(pattern)
    if (match && match[1]) {
      info.habitat = match[1].trim()
      break
    }
  }
  
  // Extract diet information
  const dietPatterns = [
    /(?:feeds? on|eats?|diet consists? of|consumes?) ([^.]+?)(?:\.|,)/i,
    /(herbivore|carnivore|omnivore|frugivore|insectivore|nectarivore)/i
  ]
  
  for (const pattern of dietPatterns) {
    const match = extract.match(pattern)
    if (match) {
      info.diet = match[0].trim()
      break
    }
  }
  
  // Extract conservation status
  const statusPatterns = [
    /(critically endangered|endangered|vulnerable|near threatened|least concern|data deficient)/i,
    /conservation status[:\s]+([^.]+?)(?:\.|,)/i
  ]
  
  for (const pattern of statusPatterns) {
    const match = extract.match(pattern)
    if (match) {
      info.conservationStatus = match[1] || match[0]
      break
    }
  }
  
  // Extract native range
  const rangePatterns = [
    /(?:native|endemic|indigenous) to ([^.]+?)(?:\.|,)/i,
    /found in ([^.]+?)(?:\.|,)/i,
    /distributed (?:in|across|throughout) ([^.]+?)(?:\.|,)/i
  ]
  
  for (const pattern of rangePatterns) {
    const match = extract.match(pattern)
    if (match && match[1]) {
      info.nativeRange = match[1].trim()
      break
    }
  }
  
  // Extract physical description (first sentence often contains this)
  const sentences = extract.split('.')
  if (sentences.length > 0) {
    info.physicalDescription = sentences[0].trim() + '.'
  }
  
  return info
}

/**
 * Get comprehensive species information from Wikipedia
 */
export async function getSpeciesEcologicalInfo(
  scientificName: string,
  commonName?: string
): Promise<EcologicalInfo | null> {
  try {
    // Try scientific name first
    let summary = await getWikipediaSummary(scientificName)
    
    // If not found, try common name
    if (!summary && commonName) {
      summary = await getWikipediaSummary(commonName)
    }
    
    if (!summary) {
      return null
    }
    
    // Parse the extract for ecological information
    const parsedInfo = parseEcologicalInfo(summary.extract)
    
    return {
      ...parsedInfo,
      physicalDescription: summary.extract
    }
  } catch (error) {
    console.error('Error fetching species ecological info:', error)
    return null
  }
}

/**
 * Search for taxon information from GBIF (Global Biodiversity Information Facility)
 */
export async function getGBIFTaxonomy(scientificName: string): Promise<{
  kingdom?: string
  phylum?: string
  class?: string
  order?: string
  family?: string
  genus?: string
  species?: string
  canonicalName?: string
} | null> {
  try {
    const response = await fetch(
      `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`
    )
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    return {
      kingdom: data.kingdom,
      phylum: data.phylum,
      class: data.class,
      order: data.order,
      family: data.family,
      genus: data.genus,
      species: data.species,
      canonicalName: data.canonicalName
    }
  } catch (error) {
    console.error('Error fetching GBIF taxonomy:', error)
    return null
  }
}
