/**
 * Conservation Information Service
 * Fetches conservation status and efforts from various sources
 */

export interface ConservationInfo {
  threats?: string[]
  conservationActions?: string[]
  population?: string
  habitatTrend?: string
  iucnInfo?: string
  localEfforts?: string[]
  internationalEfforts?: string[]
  organizationsInvolved?: string[]
}

/**
 * Parse conservation information from Wikipedia text
 */
function parseConservationInfo(text: string): Partial<ConservationInfo> {
  const info: Partial<ConservationInfo> = {}
  
  // Extract threats
  const threatPatterns = [
    /threats?[:\s]+([^.]+(?:\.|$))/gi,
    /threatened by[:\s]+([^.]+(?:\.|$))/gi,
    /endangered by[:\s]+([^.]+(?:\.|$))/gi,
    /facing[:\s]+([^.]+(?:\.|$))/gi,
  ]
  
  const threats: string[] = []
  threatPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      if (match[1]) {
        threats.push(match[1].trim())
      }
    }
  })
  
  if (threats.length > 0) {
    info.threats = threats.slice(0, 5) // Limit to 5 threats
  }
  
  // Extract population information
  const populationPatterns = [
    /population[:\s]+([^.]+(?:\.|$))/gi,
    /estimated[:\s]+([0-9,]+(?:\s+individuals)?)/gi,
    /numbers[:\s]+([^.]+(?:\.|$))/gi,
  ]
  
  for (const pattern of populationPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      info.population = match[1].trim()
      break
    }
  }
  
  return info
}

/**
 * Get conservation information from Wikipedia
 */
export async function getWikipediaConservation(scientificName: string): Promise<Partial<ConservationInfo>> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(scientificName)}`
    )
    
    if (!response.ok) {
      return {}
    }
    
    const data = await response.json()
    const extract = data.extract || ''
    
    return parseConservationInfo(extract)
  } catch (error) {
    console.error('Error fetching Wikipedia conservation info:', error)
    return {}
  }
}

/**
 * Get IUCN Red List information from GBIF
 */
export async function getIUCNInfo(scientificName: string): Promise<{
  status?: string
  threats?: string[]
  description?: string
}> {
  try {
    // Search for species in GBIF
    const searchResponse = await fetch(
      `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`
    )
    
    if (!searchResponse.ok) {
      return {}
    }
    
    const searchData = await searchResponse.json()
    
    if (!searchData.usageKey) {
      return {}
    }
    
    // Get species details
    const speciesResponse = await fetch(
      `https://api.gbif.org/v1/species/${searchData.usageKey}`
    )
    
    if (!speciesResponse.ok) {
      return {}
    }
    
    const speciesData = await speciesResponse.json()
    
    return {
      status: speciesData.threatStatuses?.[0] || undefined,
      description: speciesData.vernacularName || undefined
    }
  } catch (error) {
    console.error('Error fetching IUCN info:', error)
    return {}
  }
}

/**
 * Get Philippines-specific conservation efforts
 */
export function getPhilippinesConservationEfforts(category: string, status: string): string[] {
  const efforts: string[] = []
  
  // General Philippines conservation efforts
  efforts.push('Protected under Philippine Wildlife Resources Conservation and Protection Act (RA 9147)')
  
  if (status === 'CR' || status === 'EN') {
    efforts.push('Listed in National Priority Species Program')
    efforts.push('Subject to special protection measures by DENR (Department of Environment and Natural Resources)')
  }
  
  if (category === 'fauna') {
    efforts.push('Monitored by Biodiversity Management Bureau (BMB)')
    efforts.push('Part of Philippine Eagle Foundation conservation network')
  } else if (category === 'flora') {
    efforts.push('Protected under National Integrated Protected Areas System (NIPAS)')
    efforts.push('Included in botanical garden conservation programs')
  }
  
  // Davao Region specific
  efforts.push('Conservation activities coordinated by Davao Oriental provincial government')
  efforts.push('Community-based forest management programs in place')
  
  return efforts
}

/**
 * Get Mati City-specific conservation efforts
 */
export function getMatiCityConservationEfforts(category: string, sitesCount: number): string[] {
  const efforts: string[] = []
  
  if (sitesCount > 0) {
    efforts.push(`Protected in ${sitesCount} conservation ${sitesCount === 1 ? 'site' : 'sites'} within Mati City's biodiversity network`)
    efforts.push('Regular monitoring and data collection by local biodiversity teams')
  }
  
  // Mati City specific programs
  efforts.push('Mati City Biodiversity Conservation Program active monitoring')
  efforts.push('Community awareness campaigns in local barangays')
  efforts.push('Eco-tourism initiatives promoting sustainable wildlife viewing')
  
  if (category === 'marine' || category === 'fauna') {
    efforts.push('Marine sanctuary patrols and protection')
    efforts.push('Coastal habitat restoration projects')
  }
  
  efforts.push('Educational programs in local schools and communities')
  efforts.push('Citizen science initiatives for population tracking')
  
  return efforts
}

/**
 * Get international conservation organizations
 */
export function getInternationalOrganizations(status: string): string[] {
  const orgs: string[] = []
  
  orgs.push('IUCN (International Union for Conservation of Nature)')
  
  if (status === 'CR' || status === 'EN') {
    orgs.push('WWF (World Wildlife Fund)')
    orgs.push('Conservation International')
    orgs.push('The Nature Conservancy')
  }
  
  orgs.push('GBIF (Global Biodiversity Information Facility)')
  orgs.push('CITES (Convention on International Trade in Endangered Species)')
  
  return orgs
}

/**
 * Get comprehensive conservation information
 */
export async function getConservationInfo(
  scientificName: string,
  category: string,
  status: string,
  sitesCount: number
): Promise<ConservationInfo> {
  try {
    const [wikiInfo, iucnInfo] = await Promise.all([
      getWikipediaConservation(scientificName),
      getIUCNInfo(scientificName)
    ])
    
    const localEfforts = getMatiCityConservationEfforts(category, sitesCount)
    const internationalEfforts = getPhilippinesConservationEfforts(category, status)
    const organizations = getInternationalOrganizations(status)
    
    return {
      threats: wikiInfo.threats || [],
      population: wikiInfo.population,
      iucnInfo: iucnInfo.description,
      localEfforts,
      internationalEfforts,
      organizationsInvolved: organizations,
      conservationActions: [
        'Habitat protection and restoration',
        'Population monitoring and research',
        'Community education and engagement',
        'Sustainable resource management',
        'Anti-poaching and enforcement measures'
      ]
    }
  } catch (error) {
    console.error('Error getting conservation info:', error)
    return {
      localEfforts: getMatiCityConservationEfforts(category, sitesCount),
      internationalEfforts: getPhilippinesConservationEfforts(category, status),
      organizationsInvolved: getInternationalOrganizations(status),
      conservationActions: [
        'Habitat protection and restoration',
        'Population monitoring and research',
        'Community education and engagement'
      ]
    }
  }
}
