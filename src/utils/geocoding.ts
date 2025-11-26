// Utility for reverse geocoding and location-based auto-fill
// For Mati City, Philippines - maps coordinates to barangay information
// Based on official Mati City barangay data from Wikipedia and geographic analysis

export interface LocationInfo {
  barangay: string
  city: string
  province: string
  region?: string
}

// Mati City barangay boundaries (approximate coordinate ranges based on geographic analysis)
// Mati City spans approximately 6.13°N to 7.08°N latitude and 126.09°E to 126.49°E longitude
// Barangays are organized by geographic zones for better accuracy
const MATI_BARANGAYS = [
  // Central/City Proper barangays (around the city center)
  { name: 'Central', bounds: { lat: [6.94, 6.97], lng: [126.20, 126.23] } },
  { name: 'Poblacion', bounds: { lat: [6.94, 6.97], lng: [126.20, 126.23] } },
  { name: 'Matiao', bounds: { lat: [6.87, 6.93], lng: [126.18, 126.22] } },
  { name: 'Culian', bounds: { lat: [6.93, 6.96], lng: [126.19, 126.22] } },

  // Coastal barangays (western side, along Pujada Bay and Mayo Bay)
  { name: 'Dahican', bounds: { lat: [6.91, 6.93], lng: [126.26, 126.28] } },
  { name: 'Mayo', bounds: { lat: [6.91, 6.93], lng: [126.25, 126.27] } },
  { name: 'Libudon', bounds: { lat: [6.88, 6.92], lng: [126.18, 126.22] } },
  { name: 'Bobon', bounds: { lat: [6.85, 6.89], lng: [126.15, 126.19] } },
  { name: 'Cabuaya', bounds: { lat: [6.92, 6.95], lng: [126.22, 126.25] } },
  { name: 'Tagbinonga', bounds: { lat: [6.89, 6.92], lng: [126.23, 126.26] } },
  { name: 'Taguibo', bounds: { lat: [6.86, 6.89], lng: [126.20, 126.23] } },

  // Northern barangays
  { name: 'Macambol', bounds: { lat: [6.98, 7.02], lng: [126.18, 126.22] } },
  { name: 'Tagabakid', bounds: { lat: [7.00, 7.04], lng: [126.15, 126.19] } },
  { name: 'Don Enrique Lopez', bounds: { lat: [6.95, 6.99], lng: [126.16, 126.20] } },
  { name: 'Don Salvador Lopez, Sr.', bounds: { lat: [6.96, 7.00], lng: [126.17, 126.21] } },
  { name: 'Don Martin Marundan', bounds: { lat: [6.97, 7.01], lng: [126.18, 126.22] } },

  // Eastern/Mountain barangays (near Mount Hamiguitan)
  { name: 'Buso', bounds: { lat: [6.72, 6.76], lng: [126.16, 126.20] } },
  { name: 'Lawigan', bounds: { lat: [6.68, 6.72], lng: [126.12, 126.16] } },
  { name: 'Sanghay', bounds: { lat: [6.64, 6.68], lng: [126.08, 126.12] } },
  { name: 'Badas', bounds: { lat: [6.76, 6.80], lng: [126.18, 126.22] } },
  { name: 'Luban', bounds: { lat: [6.70, 6.74], lng: [126.14, 126.18] } },

  // Southern barangays
  { name: 'Tagpolara', bounds: { lat: [6.78, 6.82], lng: [126.22, 126.26] } },
  { name: 'Tagcawa', bounds: { lat: [6.74, 6.78], lng: [126.26, 126.30] } },
  { name: 'Sainz', bounds: { lat: [6.82, 6.86], lng: [126.20, 126.24] } },
  { name: 'Mamali', bounds: { lat: [6.80, 6.84], lng: [126.18, 126.22] } },

  // Additional barangays
  { name: 'Danao', bounds: { lat: [6.84, 6.88], lng: [126.16, 126.20] } },
  { name: 'Langka', bounds: { lat: [6.86, 6.90], lng: [126.14, 126.18] } },
  { name: 'Dawan', bounds: { lat: [6.88, 6.92], lng: [126.20, 126.24] } }
]

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Find the closest barangay to given coordinates
export function getBarangayFromCoordinates(lat: number, lng: number): string {
  let closestBarangay = 'Unknown'
  let minDistance = Infinity

  for (const barangay of MATI_BARANGAYS) {
    // Check if coordinates are within barangay bounds
    if (lat >= barangay.bounds.lat[0] && lat <= barangay.bounds.lat[1] &&
        lng >= barangay.bounds.lng[0] && lng <= barangay.bounds.lng[1]) {
      return barangay.name
    }

    // If not within bounds, find the closest one
    const centerLat = (barangay.bounds.lat[0] + barangay.bounds.lat[1]) / 2
    const centerLng = (barangay.bounds.lng[0] + barangay.bounds.lng[1]) / 2
    const distance = calculateDistance(lat, lng, centerLat, centerLng)

    if (distance < minDistance) {
      minDistance = distance
      closestBarangay = barangay.name
    }
  }

  return closestBarangay
}

// Get complete location information from coordinates
export function getLocationInfoFromCoordinates(lat: number, lng: number): LocationInfo {
  const barangay = getBarangayFromCoordinates(lat, lng)

  return {
    barangay,
    city: 'Mati City',
    province: 'Davao Oriental',
    region: 'Region XI (Davao Region)'
  }
}

// Determine site type based on coordinates and proximity to known sites
export function suggestSiteType(lat: number, lng: number): 'marine' | 'terrestrial' {
  // Check proximity to known marine sites in Mati City
  const marineSites = [
    { lat: 6.8913, lng: 126.2272, name: 'Pujada Bay' }, // Pujada Bay Protected Landscape and Seascape
    { lat: 6.922, lng: 126.273, name: 'Dahican Beach' }, // Dahican Beach and Mayo Bay
    { lat: 6.883, lng: 126.25, name: 'Sleeping Dinosaur Island' }, // Sleeping Dinosaur Island
    { lat: 6.918, lng: 126.265, name: 'Guang-guang Mangrove' }, // Guang-guang Mangrove Nature Reserve
    { lat: 6.91, lng: 126.26, name: 'Mayo Bay' } // Mayo Bay area
  ]

  // Check proximity to coastal barangays (within 3km of coast)
  const coastalBarangays = ['Dahican', 'Mayo', 'Libudon', 'Bobon', 'Cabuaya', 'Tagbinonga', 'Taguibo', 'Tagpolara', 'Tagcawa']
  const barangay = getBarangayFromCoordinates(lat, lng)

  if (coastalBarangays.includes(barangay)) {
    return 'marine'
  }

  // Check proximity to known marine sites (within 5km)
  for (const site of marineSites) {
    const distance = calculateDistance(lat, lng, site.lat, site.lng)
    if (distance < 5) {
      return 'marine'
    }
  }

  // Check if in Pujada Bay area (broader marine zone)
  const pujadaDistance = calculateDistance(lat, lng, 6.8913, 126.2272)
  if (pujadaDistance < 8) {
    return 'marine'
  }

  // Default to terrestrial for inland areas
  return 'terrestrial'
}

// Suggest designation based on location and type
export function suggestDesignation(lat: number, lng: number, type: 'marine' | 'terrestrial'): string {
  const barangay = getBarangayFromCoordinates(lat, lng)

  if (type === 'marine') {
    // Check proximity to specific marine protected areas
    const pujadaDistance = calculateDistance(lat, lng, 6.8913, 126.2272)
    if (pujadaDistance < 8) {
      return 'Part of Pujada Bay Protected Landscape and Seascape'
    }

    const dahicanDistance = calculateDistance(lat, lng, 6.922, 126.273)
    if (dahicanDistance < 3) {
      return 'Community-managed marine turtle nesting beach'
    }

    const mangroveDistance = calculateDistance(lat, lng, 6.918, 126.265)
    if (mangroveDistance < 2) {
      return 'Community-managed mangrove nature reserve'
    }

    // General coastal designations based on barangay
    if (['Dahican', 'Mayo'].includes(barangay)) {
      return 'Community-managed coastal conservation area'
    }

    return 'Community-managed marine conservation area'
  } else {
    // Check proximity to Mount Hamiguitan
    const hamiguitanDistance = calculateDistance(lat, lng, 6.740667, 126.182222)
    if (hamiguitanDistance < 15) {
      return 'Buffer zone of Mount Hamiguitan Range Wildlife Sanctuary'
    }

    // Check proximity to Mati Protected Landscape
    const protectedLandscapeDistance = calculateDistance(lat, lng, 6.85, 126.15)
    if (protectedLandscapeDistance < 10) {
      return 'Part of Mati Protected Landscape'
    }

    // General terrestrial designations
    if (['Buso', 'Lawigan', 'Sanghay', 'Badas', 'Luban'].includes(barangay)) {
      return 'Mountain forest conservation area'
    }

    return 'Community-managed terrestrial conservation area'
  }
}

// External geocoding service integration
export async function getPreciseBarangayFromCoordinates(lat: number, lng: number): Promise<string> {
  try {
    // Try OpenStreetMap Nominatim API for more precise location data
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'MatiARBioAR/1.0'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()

      // Extract barangay information from OSM response
      if (data && data.address) {
        const address = data.address

        // Check for various barangay field names in OSM data
        const barangayNames = [
          address.suburb,
          address.neighbourhood,
          address.village,
          address.hamlet,
          address.locality
        ].filter(Boolean)

        // Look for Mati City barangays in the response
        for (const osmBarangay of barangayNames) {
          const matchedBarangay = MATI_BARANGAYS.find(barangay =>
            osmBarangay.toLowerCase().includes(barangay.name.toLowerCase()) ||
            barangay.name.toLowerCase().includes(osmBarangay.toLowerCase())
          )
          if (matchedBarangay) {
            return matchedBarangay.name
          }
        }
      }
    }
  } catch (error) {
    console.warn('External geocoding service failed:', error)
  }

  // Fallback to local coordinate-based mapping
  return getBarangayFromCoordinates(lat, lng)
}

// Enhanced location info with external service integration
export async function getEnhancedLocationInfo(lat: number, lng: number): Promise<LocationInfo> {
  const barangay = await getPreciseBarangayFromCoordinates(lat, lng)

  return {
    barangay,
    city: 'Mati City',
    province: 'Davao Oriental',
    region: 'Region XI (Davao Region)'
  }
}