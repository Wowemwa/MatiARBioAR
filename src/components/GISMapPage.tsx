import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { getUnifiedSpecies } from '../data/adapters'
import DetailedGISMap from './DetailedGISMap'
import AnimatedText from './AnimatedText'
import { WaveIcon, MountainIcon, SpeciesIcon, MapIcon, InfoIcon, TargetIcon, ConservationIcon } from './Icons'

interface GISMapPageProps {
  className?: string
}

export default function GISMapPage({ className = '' }: GISMapPageProps) {
  const { hotspots, species, loading } = useData()
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'marine' | 'terrestrial'>('all')
  const [showInfo, setShowInfo] = useState(false)

  // Get unified species with endemic information
  const unifiedSpecies = useMemo(() => getUnifiedSpecies(), [])

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const marineSpots = hotspots.filter(s => s.type === 'marine')
    const terrestrialSpots = hotspots.filter(s => s.type === 'terrestrial')
    
    const endangeredSpecies = species.filter(s => ['CR', 'EN', 'VU'].includes(s.status))
    const endemicSpecies = unifiedSpecies.filter(s => s.endemic === true)
    
    const totalProtectedArea = hotspots.reduce((sum, site) => sum + (site.areaHectares || 0), 0)

    return {
      totalHotspots: hotspots.length,
      marineSpots: marineSpots.length,
      terrestrialSpots: terrestrialSpots.length,
      totalSpecies: species.length,
      endangeredSpecies: endangeredSpecies.length,
      endemicSpecies: endemicSpecies.length,
      protectedAreaHa: totalProtectedArea,
      protectedAreaKm: (totalProtectedArea / 100).toFixed(1)
    }
  }, [hotspots, species])

  const filteredStats = useMemo(() => {
    const filtered = selectedFilter === 'all' 
      ? hotspots 
      : hotspots.filter(s => s.type === selectedFilter)
    
    const filteredSpecies = unifiedSpecies.filter(sp => 
      sp.siteIds.some(siteId => 
        filtered.some(site => site.id === siteId)
      )
    )

    return {
      sites: filtered.length,
      species: filteredSpecies.length,
      area: filtered.reduce((sum, site) => sum + (site.areaHectares || 0), 0)
    }
  }, [hotspots, species, selectedFilter])

  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 -z-10" />
      <div className="fixed inset-0 opacity-20 -z-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230369a1' fill-opacity='0.03'%3E%3Cpath d='M30 30l15-15v30l-15-15zm0 0l-15-15h30l-15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="relative space-y-6 sm:space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <header className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/80 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-slate-900/80">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-emerald-500/5 to-teal-500/5" />
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl" />
          
          <div className="relative p-8 space-y-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-700/60 backdrop-blur-sm">
                <MapIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Interactive GIS Mapping System</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                <AnimatedText text="GIS Map Explorer" />
              </h1>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Explore Mati City&apos;s biodiversity hotspots and conservation areas through our comprehensive Geographic Information System
              </p>
            </div>

            {/* Statistics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 p-6 border border-white/60 dark:border-white/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-2">
                  <div className="flex items-center justify-between">
                    <MapIcon className="w-8 h-8 text-blue-500" />
                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.totalHotspots}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Conservation Sites</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Active biodiversity hotspots</div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 p-6 border border-white/60 dark:border-white/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-2">
                  <div className="flex items-center justify-between">
                    <SpeciesIcon className="w-8 h-8 text-emerald-500" />
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.totalSpecies}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Documented Species</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Flora & fauna catalogued</div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 p-6 border border-white/60 dark:border-white/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-2">
                  <div className="flex items-center justify-between">
                    <ConservationIcon className="w-8 h-8 text-amber-500" />
                    <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats.endangeredSpecies}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">At-Risk Species</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">CR, EN, VU status</div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 p-6 border border-white/60 dark:border-white/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-2">
                  <div className="flex items-center justify-between">
                    <TargetIcon className="w-8 h-8 text-purple-500" />
                    <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{stats.protectedAreaKm}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Protected Area</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Square kilometers</div>
                </div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  Filter by ecosystem:
                </span>
                
                {[
                  { key: 'all', label: 'All Ecosystems', icon: '🌍', color: 'gray' },
                  { key: 'marine', label: 'Marine', icon: '🌊', color: 'blue' },
                  { key: 'terrestrial', label: 'Terrestrial', icon: '🏔️', color: 'emerald' }
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => setSelectedFilter(option.key as any)}
                    className={`px-4 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300 font-medium hover:scale-105 flex items-center gap-2 ${
                      selectedFilter === option.key
                        ? `bg-gradient-to-r from-${option.color}-500 to-${option.color}-600 text-white border-transparent shadow-lg shadow-${option.color}-500/25`
                        : 'bg-white/80 dark:bg-slate-800/80 border-white/60 dark:border-white/20 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                    <span className="bg-white/20 dark:bg-black/20 px-2 py-0.5 rounded-full text-xs font-bold">
                      {option.key === 'all' ? stats.totalHotspots : 
                       option.key === 'marine' ? stats.marineSpots : 
                       stats.terrestrialSpots}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`px-4 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300 font-medium hover:scale-105 flex items-center gap-2 ${
                  showInfo
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg'
                    : 'bg-white/80 dark:bg-slate-800/80 border-white/60 dark:border-white/20 hover:border-indigo-400 text-gray-700 dark:text-gray-300'
                }`}
              >
                <InfoIcon className="w-4 h-4" />
                <span>Map Info</span>
              </button>
            </div>

            {/* Active Filter Stats */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Current Filter: {selectedFilter === 'all' ? 'All Ecosystems' : selectedFilter === 'marine' ? 'Marine Ecosystems' : 'Terrestrial Ecosystems'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredStats.sites} conservation sites • {filteredStats.species} species • {(filteredStats.area / 100).toFixed(1)} km² protected
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Marine Sites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Terrestrial Sites</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Info Panel */}
        {showInfo && (
          <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/20 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <div className="relative p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  <InfoIcon className="w-8 h-8 text-indigo-500" />
                  GIS Map Information
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Map Features</h4>
                  <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span><strong>Interactive Markers:</strong> Click on any marker to view detailed site information, species data, and conservation status</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span><strong>Layer Control:</strong> Switch between Street, Satellite, and Topographic map views using the layer control</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span><strong>Zoom & Scale:</strong> Use mouse wheel or controls to zoom. Scale bar shows distances accurately</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span><strong>Filtering:</strong> Use ecosystem filters above to focus on marine or terrestrial conservation sites</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Data Sources</h4>
                  <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span><strong>DENR-BMB:</strong> Department of Environment and Natural Resources - Biodiversity Management Bureau</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span><strong>UNESCO:</strong> World Heritage Site data for Mount Hamiguitan Range Wildlife Sanctuary</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span><strong>Local Research:</strong> Data from regional universities and conservation organizations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span><strong>OpenStreetMap:</strong> Base map data and geographic features from community contributors</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/30">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Navigation Tips</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border text-xs">Click</kbd>
                      <span className="text-gray-700 dark:text-gray-300">Select site for detailed info</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border text-xs">Scroll</kbd>
                      <span className="text-gray-700 dark:text-gray-300">Zoom in/out on map</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border text-xs">Drag</kbd>
                      <span className="text-gray-700 dark:text-gray-300">Pan around the map</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border text-xs">Layers</kbd>
                      <span className="text-gray-700 dark:text-gray-300">Switch map view styles</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Map Container */}
        <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5" />
          
          {/* Map Header */}
          <div className="relative border-b border-white/40 dark:border-white/20 p-6 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-slate-800/60 dark:to-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  <MapIcon className="w-6 h-6 text-blue-500" />
                  Mati City Conservation Map
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Interactive geographic visualization of biodiversity hotspots and protected areas
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link
                  to="/biodiversity"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <SpeciesIcon className="w-4 h-4" />
                  Browse Species
                </Link>
              </div>
            </div>
          </div>

          {/* Map Content */}
          <div className="relative min-h-[600px] lg:min-h-[700px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading GIS data...</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Preparing conservation site information</div>
                </div>
              </div>
            ) : (
              <DetailedGISMap />
            )}
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <WaveIcon className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Marine Ecosystems</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Coastal & marine protected areas</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Conservation sites:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.marineSpots}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Key locations:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">Pujada Bay, Dahican Beach</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <MountainIcon className="w-8 h-8 text-emerald-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Terrestrial Ecosystems</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Forest & mountain reserves</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Conservation sites:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.terrestrialSpots}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">UNESCO site:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">Mt. Hamiguitan Range</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <ConservationIcon className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Conservation Impact</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Protection & preservation metrics</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Endemic species:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.endemicSpecies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Protected area:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.protectedAreaKm} km²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}