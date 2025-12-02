/**
 * Location Autofill Service
 * Fetches location information from the internet (Wikipedia, OpenStreetMap)
 */

export interface LocationInfo {
  name: string
  barangay: string
  description: string
  type: 'marine' | 'terrestrial'
  areaHectares: number
  features: string[]
  coordinates: {
    lat: number
    lng: number
  }
}

/**
 * Fetch location information from Wikipedia and other sources
 */
export async function fetchLocationInfo(locationName: string, coordinates: { lat: number; lng: number }): Promise<Partial<LocationInfo>> {
  try {
    // Search Wikipedia for the location
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(locationName + ' Mati City Philippines')}&limit=1&namespace=0&format=json&origin=*`
    )
    const searchData = await searchResponse.json()
    
    let description = ''
    let features: string[] = []
    
    if (searchData[1] && searchData[1].length > 0) {
      const pageTitle = searchData[1][0]
      
      // Get page summary
      const summaryResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
      )
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        description = summaryData.extract || ''
        
        // Extract features from description
        const text = description.toLowerCase()
        if (text.includes('reef') || text.includes('coral')) features.push('Coral Reefs')
        if (text.includes('mangrove')) features.push('Mangrove Forests')
        if (text.includes('beach') || text.includes('shore')) features.push('Sandy Beaches')
        if (text.includes('rock') || text.includes('cliff')) features.push('Rock Formations')
        if (text.includes('forest')) features.push('Forest Areas')
        if (text.includes('mountain') || text.includes('highland')) features.push('Mountain Terrain')
        if (text.includes('biodiversity') || text.includes('wildlife')) features.push('Rich Biodiversity')
        if (text.includes('watershed') || text.includes('water')) features.push('Watershed')
      }
    }
    
    // If no Wikipedia info, create a basic description
    if (!description) {
      description = `${locationName} is a conservation site located in Mati City, Davao Oriental, Philippines.`
    }
    
    // Determine type based on coordinates and name
    const isNearCoast = await checkIfNearCoast(coordinates.lat, coordinates.lng)
    const type: 'marine' | 'terrestrial' = 
      locationName.toLowerCase().includes('beach') ||
      locationName.toLowerCase().includes('island') ||
      locationName.toLowerCase().includes('bay') ||
      locationName.toLowerCase().includes('reef') ||
      isNearCoast ? 'marine' : 'terrestrial'
    
    return {
      description: description.slice(0, 500), // Limit description length
      type,
      features: features.length > 0 ? features : ['Natural Habitat']
    }
  } catch (error) {
    console.error('Error fetching location info:', error)
    return {
      description: `${locationName} is a conservation site in Mati City, Davao Oriental.`,
      features: ['Natural Habitat']
    }
  }
}

/**
 * Check if coordinates are near the coast using OpenStreetMap
 */
async function checkIfNearCoast(lat: number, lng: number): Promise<boolean> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'MatiARBioAR/1.0'
        }
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      const address = data.address || {}
      
      // Check if location mentions water/coast in the address
      return !!(
        address.water ||
        address.bay ||
        address.beach ||
        data.type === 'bay' ||
        data.type === 'beach' ||
        data.type === 'coastline'
      )
    }
  } catch (error) {
    console.error('Error checking coast proximity:', error)
  }
  
  return false
}

/**
 * Estimate area in hectares based on location type and features
 */
export function estimateArea(name: string, type: 'marine' | 'terrestrial'): number {
  const nameLower = name.toLowerCase()
  
  // Rough estimates based on typical sizes
  if (nameLower.includes('island') && nameLower.includes('small')) return 5
  if (nameLower.includes('island')) return 15
  if (nameLower.includes('bay')) return 400
  if (nameLower.includes('beach')) return 10
  if (nameLower.includes('reef')) return 50
  if (nameLower.includes('mountain') || nameLower.includes('range')) return 5000
  if (nameLower.includes('forest') && nameLower.includes('reserve')) return 250
  if (nameLower.includes('forest')) return 100
  if (nameLower.includes('mangrove')) return 40
  if (nameLower.includes('watershed')) return 500
  if (nameLower.includes('park')) return 25
  
  // Default estimates
  return type === 'marine' ? 50 : 100
}
