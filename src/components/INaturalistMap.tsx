import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getObservationsBySpecies, INaturalistObservation } from '../services/inaturalist'

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface INaturalistMapProps {
  scientificName: string
  commonName?: string
}

// Component to fit map bounds to markers
function FitBounds({ observations }: { observations: INaturalistObservation[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (observations.length > 0) {
      const bounds = L.latLngBounds(
        observations.map(obs => [obs.location[0], obs.location[1]] as [number, number])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
    }
  }, [observations, map])
  
  return null
}

export default function INaturalistMap({ scientificName, commonName }: INaturalistMapProps) {
  const [observations, setObservations] = useState<INaturalistObservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedObservation, setSelectedObservation] = useState<INaturalistObservation | null>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    loadObservations()
  }, [scientificName])

  const loadObservations = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Get observations focused on Mati City and surrounding Davao Oriental area
      const data = await getObservationsBySpecies(scientificName, {
        bounds: {
          swlat: 6.75, // South of Mati City
          swlng: 126.0, // West of Mati City
          nelat: 7.15, // North of Mati City
          nelng: 126.5 // East of Mati City (towards Pacific Ocean)
        },
        perPage: 200,
        qualityGrade: undefined // Get all quality grades
      })
      
      setObservations(data)
      
      if (data.length === 0) {
        setError('No observations found for this species in the Mati City area. Try viewing broader distribution on iNaturalist.org')
      }
    } catch (err) {
      console.error('Error loading iNaturalist observations:', err)
      setError('Failed to load observation data from iNaturalist.')
    } finally {
      setLoading(false)
      setMapReady(true)
    }
  }

  // Default center on Mati City, Davao Oriental
  const defaultCenter: [number, number] = [6.9549, 126.2185]
  const defaultZoom = 10

  // Custom marker colors based on quality grade
  const createCustomIcon = (qualityGrade: string) => {
    const color = 
      qualityGrade === 'research' ? '#10b981' : // green
      qualityGrade === 'needs_id' ? '#f59e0b' : // amber
      '#6b7280' // gray for casual

    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      className: 'custom-marker',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-white/40 dark:border-white/20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">Loading distribution data from iNaturalist...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Fetching observations for {commonName || scientificName}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-red-200/50 dark:border-red-700/30 p-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-700 dark:text-red-300 font-medium text-center">{error}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
          Try viewing this species on <a href={`https://www.inaturalist.org/taxa?q=${encodeURIComponent(scientificName)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">iNaturalist.org</a>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/30">
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{observations.length}</div>
          <div className="text-sm text-emerald-600 dark:text-emerald-400">Total Observations</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/30">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {observations.filter(o => o.quality_grade === 'research').length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Research Grade</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-700/30">
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {observations.filter(o => o.quality_grade === 'needs_id').length}
          </div>
          <div className="text-sm text-amber-600 dark:text-amber-400">Needs ID</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/30">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {new Set(observations.map(o => o.place_guess)).size}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Unique Locations</div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/40 dark:border-white/20 shadow-lg">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {observations.map((obs) => (
            <Marker
              key={obs.id}
              position={[obs.location[0], obs.location[1]]}
              icon={createCustomIcon(obs.quality_grade)}
              eventHandlers={{
                click: () => setSelectedObservation(obs)
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  {obs.photos.length > 0 && (
                    <img 
                      src={obs.photos[0].url} 
                      alt={obs.taxon.preferred_common_name || obs.taxon.name}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h3 className="font-bold text-gray-900">{obs.taxon.preferred_common_name || obs.taxon.name}</h3>
                  <p className="text-sm italic text-gray-600">{obs.taxon.name}</p>
                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    <p><strong>Location:</strong> {obs.place_guess}</p>
                    <p><strong>Observed:</strong> {new Date(obs.observed_on).toLocaleDateString()}</p>
                    <p><strong>Observer:</strong> {obs.user.name}</p>
                    <p>
                      <strong>Quality:</strong>{' '}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        obs.quality_grade === 'research' ? 'bg-green-100 text-green-700' :
                        obs.quality_grade === 'needs_id' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {obs.quality_grade === 'research' ? 'Research Grade' :
                         obs.quality_grade === 'needs_id' ? 'Needs ID' :
                         'Casual'}
                      </span>
                    </p>
                  </div>
                  <a
                    href={`https://www.inaturalist.org/observations/${obs.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View on iNaturalist →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {mapReady && observations.length > 0 && <FitBounds observations={observations} />}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-white/40 dark:border-white/20">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Map Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow"></div>
            <span className="text-gray-700 dark:text-gray-300">Research Grade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow"></div>
            <span className="text-gray-700 dark:text-gray-300">Needs ID</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 border-2 border-white shadow"></div>
            <span className="text-gray-700 dark:text-gray-300">Casual</span>
          </div>
        </div>
      </div>

      {/* iNaturalist Attribution */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/30">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Data Source: iNaturalist</h4>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              Distribution data shows observations from the Mati City area, sourced from citizen science observations on{' '}
              <a 
                href={`https://www.inaturalist.org/taxa?q=${encodeURIComponent(scientificName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 dark:text-green-400 hover:underline font-medium"
              >
                iNaturalist.org
              </a>
              . These observations are contributed by naturalists and researchers. Click any marker to view observation details or visit iNaturalist for broader distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Observations List */}
      {observations.length > 0 && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/40 dark:border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Observations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {observations.slice(0, 12).map((obs) => (
              <a
                key={obs.id}
                href={`https://www.inaturalist.org/observations/${obs.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-3 bg-gradient-to-br from-white to-gray-50 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-white/60 dark:border-white/20 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                {obs.photos.length > 0 && (
                  <img 
                    src={obs.photos[0].url} 
                    alt={obs.taxon.preferred_common_name || obs.taxon.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{obs.place_guess}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(obs.observed_on).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">by {obs.user.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
