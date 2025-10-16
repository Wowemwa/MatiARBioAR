import { useEffect, useState, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useData } from '../context/DataContext'
import { WaveIcon, MountainIcon, SpeciesIcon } from './Icons'

// Fix for Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface DetailedGISMapProps {
  className?: string
}

export default function DetailedGISMap({ className = '' }: DetailedGISMapProps) {
  const { hotspots, species, loading } = useData()
  const [map, setMap] = useState<L.Map | null>(null)
  const [filter, setFilter] = useState<'all' | 'marine' | 'terrestrial'>('all')
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  // Filter hotspots based on current selection
  const filteredHotspots = useMemo(() => {
    return hotspots.filter(site => filter === 'all' || site.type === filter)
  }, [hotspots, filter])

  // Statistics for Mati City
  const stats = useMemo(() => ({
    total: hotspots.length,
    marine: hotspots.filter(s => s.type === 'marine').length,
    terrestrial: hotspots.filter(s => s.type === 'terrestrial').length,
    totalSpecies: species.length,
    protectedArea: hotspots.reduce((total, site) => total + (site.areaHectares || 0), 0)
  }), [hotspots, species])

  // Initialize map centered on Mati City
  useEffect(() => {
    if (!map) {
      const mapInstance = L.map('mati-gis-map', {
        center: [6.9483, 126.2272], // Mati City coordinates
        zoom: 11,
        zoomControl: true,
        attributionControl: true
      })

      // Add multiple tile layer options
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      })

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles © Esri'
      })

      const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap'
      })

      // Default to street layer
      streetLayer.addTo(mapInstance)

      // Layer control
      const baseMaps = {
        'Street Map': streetLayer,
        'Satellite': satelliteLayer,
        'Topographic': topoLayer
      }
      L.control.layers(baseMaps).addTo(mapInstance)

      // Scale control
      L.control.scale().addTo(mapInstance)

      setMap(mapInstance)
      setIsMapReady(true)

      return () => {
        mapInstance.remove()
      }
    }
  }, [])

  // Add markers for hotspots
  useEffect(() => {
    if (!map || !isMapReady || loading) return

    // Clear existing markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Add markers for filtered hotspots
    filteredHotspots.forEach(site => {
      // Custom icons based on site type
      const iconHtml = site.type === 'marine' 
        ? `<div style="
            width: 32px; 
            height: 32px; 
            background: linear-gradient(135deg, #0ea5e9, #0284c7); 
            border: 3px solid white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 16px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: pointer;
          ">🌊</div>`
        : `<div style="
            width: 32px; 
            height: 32px; 
            background: linear-gradient(135deg, #10b981, #059669); 
            border: 3px solid white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 16px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: pointer;
          ">🏔️</div>`

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      const marker = L.marker([site.lat, site.lng], { icon: customIcon })
        .addTo(map)

      // Enhanced popup with detailed information including species
      const siteSpecies = species.filter(sp => sp.siteIds.includes(site.id))
      const floraCount = siteSpecies.filter(sp => sp.category === 'flora').length
      const faunaCount = siteSpecies.filter(sp => sp.category === 'fauna').length
      
      const highlightSpecies = siteSpecies.filter(sp => site.highlightSpeciesIds.includes(sp.id))
      
      const popupContent = `
        <div style="min-width: 350px; max-width: 450px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="
            background: linear-gradient(135deg, ${site.type === 'marine' ? '#0ea5e9, #0284c7' : '#10b981, #059669'}); 
            color: white; 
            padding: 12px; 
            margin: -12px -12px 12px -12px; 
            border-radius: 8px 8px 0 0;
          ">
            <h3 style="margin: 0; font-size: 16px; font-weight: 700;">${site.name}</h3>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">${site.designation}</p>
          </div>
          
          <div style="padding: 0;">
            <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.4; color: #374151;">
              ${site.summary}
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin: 12px 0;">
              <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
                <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Area</div>
                <div style="font-size: 13px; font-weight: 700; color: #111827;">
                  ${site.areaHectares ? `${site.areaHectares.toLocaleString()} ha` : 'N/A'}
                </div>
              </div>
              <div style="background: #f0fdf4; padding: 8px; border-radius: 6px; border: 1px solid #bbf7d0;">
                <div style="font-size: 10px; color: #15803d; text-transform: uppercase; font-weight: 600;">Flora</div>
                <div style="font-size: 13px; font-weight: 700; color: #15803d;">
                  ${floraCount} species
                </div>
              </div>
              <div style="background: #fef3c7; padding: 8px; border-radius: 6px; border: 1px solid #fcd34d;">
                <div style="font-size: 10px; color: #92400e; text-transform: uppercase; font-weight: 600;">Fauna</div>
                <div style="font-size: 13px; font-weight: 700; color: #92400e;">
                  ${faunaCount} species
                </div>
              </div>
            </div>
            
            ${highlightSpecies.length > 0 ? `
              <div style="margin: 12px 0;">
                <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Flagship Species</div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  ${highlightSpecies.slice(0, 3).map(sp => `
                    <div style="background: ${sp.category === 'flora' ? '#f0fdf4' : '#fef3c7'}; border: 1px solid ${sp.category === 'flora' ? '#bbf7d0' : '#fcd34d'}; padding: 6px 8px; border-radius: 4px;">
                      <div style="font-size: 12px; font-weight: 600; color: #111827;">${sp.commonName}</div>
                      <div style="font-size: 10px; color: #6b7280; font-style: italic;">${sp.scientificName}</div>
                      <div style="font-size: 10px; margin-top: 2px;">
                        <span style="background: ${sp.status === 'CR' ? '#fecaca' : sp.status === 'EN' ? '#fed7aa' : sp.status === 'VU' ? '#fef3c7' : '#d1fae5'}; 
                                     color: ${sp.status === 'CR' ? '#991b1b' : sp.status === 'EN' ? '#9a3412' : sp.status === 'VU' ? '#92400e' : '#166534'}; 
                                     padding: 2px 6px; border-radius: 12px; font-weight: 600;">${sp.status}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
                ${siteSpecies.length > 3 ? `<div style="font-size: 11px; color: #6b7280; margin-top: 6px; text-align: center;">+${siteSpecies.length - 3} more species found here</div>` : ''}
              </div>
            ` : ''}
            
            <div style="margin: 12px 0;">
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Key Features</div>
              <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: #374151; line-height: 1.4;">
                ${site.features.slice(0, 3).map(feature => `<li>${feature}</li>`).join('')}
              </ul>
            </div>
            
            ${site.visitorNotes ? `
              <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 6px; padding: 8px; margin-top: 12px;">
                <div style="font-size: 11px; color: #1e40af; text-transform: uppercase; font-weight: 600; margin-bottom: 2px;">
                  Visitor Information
                </div>
                <div style="font-size: 11px; color: #1e40af; line-height: 1.4;">${site.visitorNotes}</div>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 12px;">
              <div style="font-size: 10px; color: #9ca3af;">Click site name above for detailed species list</div>
            </div>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 400,
        className: 'custom-popup'
      })

      // Highlight selected hotspot
      marker.on('click', () => {
        setSelectedHotspot(site.id)
      })
    })

    // Fit map to show all markers if there are hotspots
    if (filteredHotspots.length > 0) {
      const group = L.featureGroup(
        filteredHotspots.map(site => L.marker([site.lat, site.lng]))
      )
      map.fitBounds(group.getBounds().pad(0.1))
    }

  }, [map, filteredHotspots, loading, isMapReady])

  const filterButtons = [
    { key: 'all' as const, label: 'All Sites', icon: '🌐', count: stats.total },
    { key: 'marine' as const, label: 'Marine', icon: '🌊', count: stats.marine },
    { key: 'terrestrial' as const, label: 'Terrestrial', icon: '🏔️', count: stats.terrestrial }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mati City Biodiversity GIS Map
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore detailed biodiversity hotspots, protected areas, and species data for Mati City, Davao Oriental - 
          home to UNESCO World Heritage sites and world-renowned marine sanctuaries.
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <SpeciesIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Sites</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{stats.total}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <WaveIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Marine</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.marine}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <MountainIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Terrestrial</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.terrestrial}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              SP
            </div>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Species</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalSpecies}</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              HA
            </div>
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Protected</span>
          </div>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
            {(stats.protectedArea / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-white/15 shadow-lg">
          {filterButtons.map(btn => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === btn.key
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-slate-700/40'
              }`}
            >
              <span className="text-xl">{btn.icon}</span>
              <span>{btn.label}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                filter === btn.key 
                  ? 'bg-white/25 text-white' 
                  : 'bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
              }`}>
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
        {loading && (
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-emerald-50/90 to-blue-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading GIS data...</p>
            </div>
          </div>
        )}
        
        <div 
          id="mati-gis-map" 
          className="h-[70vh] w-full relative z-0"
        />
        
        {/* Map Legend */}
        <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/30 dark:border-slate-700/30">
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300">Marine Protected Areas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300">Terrestrial Sanctuaries</span>
            </div>
          </div>
        </div>

        {/* Data Info Panel */}
        <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/30 dark:border-slate-700/30">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1 mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-semibold">Real-time data from Mati City</span>
            </div>
            <div>Showing {filteredHotspots.length} biodiversity hotspot{filteredHotspots.length !== 1 ? 's' : ''}</div>
            <div className="text-[10px] mt-1 opacity-75">Click markers for detailed information</div>
          </div>
        </div>
      </div>

      {/* Site Information Cards */}
      {selectedHotspot && (
        <div className="mt-8">
          {hotspots.filter(site => site.id === selectedHotspot).map(site => (
            <div key={site.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-gray-200 dark:border-slate-600 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{site.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{site.designation}</p>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">{site.description}</p>
              
              <div className="space-y-6">
                {/* Species Information */}
                {(() => {
                  const siteSpecies = species.filter(sp => sp.siteIds.includes(site.id))
                  const floraSpecies = siteSpecies.filter(sp => sp.category === 'flora')
                  const faunaSpecies = siteSpecies.filter(sp => sp.category === 'fauna')
                  
                  return siteSpecies.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Biodiversity ({siteSpecies.length} species)</h4>
                        <div className="flex gap-2 text-sm">
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                            {floraSpecies.length} Flora
                          </span>
                          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">
                            {faunaSpecies.length} Fauna
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        {siteSpecies.map((sp) => (
                          <div key={sp.id} className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{sp.commonName}</h5>
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic">{sp.scientificName}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  sp.status === 'CR' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                  sp.status === 'EN' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                  sp.status === 'VU' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                }`}>
                                  {sp.status}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  sp.category === 'flora' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                                  'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                }`}>
                                  {sp.category === 'flora' ? '🌿 Flora' : '🐾 Fauna'}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{sp.habitat}</p>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{sp.blurb}</p>
                            
                            {sp.highlights && sp.highlights.length > 0 && (
                              <div className="mt-3">
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Key Facts:</div>
                                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                  {sp.highlights.slice(0, 2).map((highlight, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                      <span className="text-emerald-500 mt-0.5">•</span>
                                      <span>{highlight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No species data available for this location.</p>
                    </div>
                  )
                })()}
                
                {/* Key Features & Conservation */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {site.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Conservation Status</h4>
                    <div className="space-y-3">
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-700">
                        <div className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Stewardship</div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">{site.stewardship}</div>
                      </div>
                      
                      {site.visitorNotes && (
                        <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                          <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Visitor Information</div>
                          <div className="text-xs text-amber-600 dark:text-amber-300 mt-1">{site.visitorNotes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attribution */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p>
          GIS data sourced from DENR-BMB, UNESCO, and local research institutions. 
          Map data © OpenStreetMap contributors.
        </p>
      </div>
    </div>
  )
}