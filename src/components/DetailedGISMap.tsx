import { useEffect, useState, useMemo, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useData } from '../context/DataContext'
import { useAdmin } from '../context/AdminContext'
import { supabase } from '../supabaseClient'

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
  const { isAdmin } = useAdmin()
  const [map, setMap] = useState<L.Map | null>(null)
  const [filter, setFilter] = useState<'all' | 'marine' | 'terrestrial'>('all')
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMapReady, setIsMapReady] = useState(false)
  const [activeMarkers, setActiveMarkers] = useState<Map<string, L.Marker>>(new Map())
  const [currentLayer, setCurrentLayer] = useState<'street' | 'satellite' | 'topo'>('street')
  
  // Admin marker placement state
  const [adminMode, setAdminMode] = useState(false)
  const [markerType, setMarkerType] = useState<'marine' | 'terrestrial'>('marine')
  const [tempMarker, setTempMarker] = useState<L.Marker | null>(null)
  const [showMarkerForm, setShowMarkerForm] = useState(false)
  const [newHotspotData, setNewHotspotData] = useState({
    name: '',
    barangay: '',
    designation: '',
    description: '',
    areaHectares: 0,
    lat: 0,
    lng: 0,
    type: 'marine' as 'marine' | 'terrestrial',
    features: [] as string[],
    selectedSpeciesIds: [] as string[]
  })

  // Focus on Mati City only
  const cityHotspots = useMemo(() => (
    hotspots.filter(site => (site.city || '').toLowerCase().includes('mati'))
  ), [hotspots])

  // Filter hotspots based on current selection
  const filteredHotspots = useMemo(() => (
    cityHotspots.filter(site => filter === 'all' || site.type === filter)
  ), [cityHotspots, filter])

  // Statistics for Mati City
  const stats = useMemo(() => ({
    total: cityHotspots.length,
    marine: cityHotspots.filter(s => s.type === 'marine').length,
    terrestrial: cityHotspots.filter(s => s.type === 'terrestrial').length,
    totalSpecies: species.length,
    protectedArea: cityHotspots.reduce((total, site) => total + (site.areaHectares || 0), 0)
  }), [cityHotspots, species])

  // Initialize map centered on Mati City
  useEffect(() => {
    if (!map) {
      // Ensure container exists before initializing map
      const container = document.getElementById('mati-gis-map')
      if (!container) return

      const mapInstance = L.map('mati-gis-map', {
        center: [6.9483, 126.2272], // Mati City coordinates
        zoom: 11,
        zoomControl: false, // We'll add custom zoom controls
        attributionControl: true,
        minZoom: 10,
        maxZoom: 18
      })

      // Restrict view to Mati City bounds (approx)
      const bounds = L.latLngBounds([
        [6.70, 126.10], // SW
        [7.02, 126.32]  // NE
      ])
      mapInstance.setMaxBounds(bounds)
      mapInstance.on('drag', () => mapInstance.panInsideBounds(bounds, { animate: false }))

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

      // Store layer references
      ;(mapInstance as any).layers = { streetLayer, satelliteLayer, topoLayer }

      // Custom zoom controls with animation
      L.Control.extend({
        onAdd: function() {
          const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
          div.innerHTML = `
            <a href="#" class="leaflet-control-zoom-in" title="Zoom in" role="button" aria-label="Zoom in" style="width:34px;height:34px;line-height:34px;font-size:18px;font-weight:bold;background:white;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #ccc;transition:all 0.2s;">+</a>
            <a href="#" class="leaflet-control-zoom-out" title="Zoom out" role="button" aria-label="Zoom out" style="width:34px;height:34px;line-height:34px;font-size:18px;font-weight:bold;background:white;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">−</a>
          `
          div.onclick = (e) => {
            e.preventDefault()
            const target = e.target as HTMLElement
            if (target.classList.contains('leaflet-control-zoom-in')) {
              mapInstance.zoomIn()
            } else if (target.classList.contains('leaflet-control-zoom-out')) {
              mapInstance.zoomOut()
            }
          }
          return div
        }
      } as any)
      new (L.Control.extend({
        onAdd: function() {
          const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
          div.innerHTML = `
            <a href="#" class="leaflet-control-zoom-in" title="Zoom in" role="button" aria-label="Zoom in" style="width:34px;height:34px;line-height:34px;font-size:18px;font-weight:bold;background:white;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #ccc;transition:all 0.2s;">+</a>
            <a href="#" class="leaflet-control-zoom-out" title="Zoom out" role="button" aria-label="Zoom out" style="width:34px;height:34px;line-height:34px;font-size:18px;font-weight:bold;background:white;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">−</a>
          `
          div.onclick = (e) => {
            e.preventDefault()
            const target = e.target as HTMLElement
            if (target.classList.contains('leaflet-control-zoom-in')) {
              mapInstance.zoomIn()
            } else if (target.classList.contains('leaflet-control-zoom-out')) {
              mapInstance.zoomOut()
            }
          }
          return div
        }
      }) as any)({ position: 'topright' }).addTo(mapInstance)

      // Add locate control (find my location)
      new (L.Control.extend({
        onAdd: function() {
          const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
          div.innerHTML = `
            <a href="#" title="Find my location" role="button" aria-label="Find my location" style="width:34px;height:34px;line-height:34px;font-size:18px;background:white;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">📍</a>
          `
          div.onclick = (e) => {
            e.preventDefault()
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                mapInstance.flyTo([position.coords.latitude, position.coords.longitude], 13, {
                  duration: 1.5
                })
                L.circle([position.coords.latitude, position.coords.longitude], {
                  radius: 100,
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.2
                }).addTo(mapInstance)
              })
            }
          }
          return div
        }
      }) as any)({ position: 'topright' }).addTo(mapInstance)

      // Scale control
      L.control.scale({ position: 'bottomright' }).addTo(mapInstance)

      // Add map event listeners for interactivity
      mapInstance.on('zoomstart', () => {
        mapInstance.getContainer().style.cursor = 'zoom-in'
      })
      
      mapInstance.on('zoomend', () => {
        mapInstance.getContainer().style.cursor = ''
      })

      mapInstance.on('movestart', () => {
        mapInstance.getContainer().style.cursor = 'grabbing'
      })

      mapInstance.on('moveend', () => {
        mapInstance.getContainer().style.cursor = ''
      })

      setMap(mapInstance)
      setIsMapReady(true)

      return () => {
        mapInstance.remove()
      }
    }
  }, [])

  // Admin: Handle map clicks to place markers
  useEffect(() => {
    if (!map || !isMapReady || !adminMode) return

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      // Remove previous temp marker if exists
      if (tempMarker) {
        map.removeLayer(tempMarker)
      }

      // Create temp marker at clicked location
      const iconHtml = markerType === 'marine'
        ? `<div class="marker-pulse temp-marker" style="
            width: 40px; 
            height: 40px; 
            background: linear-gradient(135deg, #0ea5e9, #0284c7); 
            border: 3px solid white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 18px; 
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
            cursor: pointer;
            animation: bounce 0.5s ease;
          ">🌊</div>`
        : `<div class="marker-pulse temp-marker" style="
            width: 40px; 
            height: 40px; 
            background: linear-gradient(135deg, #10b981, #059669); 
            border: 3px solid white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 18px; 
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            cursor: pointer;
            animation: bounce 0.5s ease;
          ">🏔️</div>`

      const tempIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })

      const newTempMarker = L.marker([e.latlng.lat, e.latlng.lng], { 
        icon: tempIcon,
        draggable: true 
      }).addTo(map)

      // Update coordinates when marker is dragged
      newTempMarker.on('dragend', () => {
        const pos = newTempMarker.getLatLng()
        setNewHotspotData(prev => ({
          ...prev,
          lat: pos.lat,
          lng: pos.lng
        }))
      })

      setTempMarker(newTempMarker)
      setNewHotspotData(prev => ({
        ...prev,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: markerType
      }))
      setShowMarkerForm(true)
    }

    map.on('click', handleMapClick)

    return () => {
      map.off('click', handleMapClick)
    }
  }, [map, isMapReady, adminMode, markerType, tempMarker])

  // Add markers for hotspots
  useEffect(() => {
    if (!map || !isMapReady || loading) return

    // Additional safety check - ensure map container exists and map is properly initialized
    const mapContainer = document.getElementById('mati-gis-map')
    if (!mapContainer || !map.getContainer()) return

    // Clear existing markers
    activeMarkers.forEach(marker => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker)
      }
    })
    const newMarkers = new Map<string, L.Marker>()

  // Add markers for filtered hotspots
    try {
      filteredHotspots.forEach(site => {
        // Custom icons based on site type with pulse animation
        const iconHtml = site.type === 'marine' 
          ? `<div class="marker-pulse" style="
              width: 40px; 
              height: 40px; 
              background: linear-gradient(135deg, #0ea5e9, #0284c7); 
              border: 3px solid white; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 18px; 
              box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
              cursor: pointer;
              transition: all 0.3s ease;
            ">🌊</div>`
          : `<div class="marker-pulse" style="
              width: 40px; 
              height: 40px; 
              background: linear-gradient(135deg, #10b981, #059669); 
              border: 3px solid white; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 18px; 
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
              cursor: pointer;
              transition: all 0.3s ease;
            ">🏔️</div>`

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-div-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })

  const marker = L.marker([site.lat, site.lng], { 
    icon: customIcon,
    riseOnHover: true
  }).addTo(map)

        // Enhanced marker interactions
        marker.on('click', () => {
          setSelectedHotspot(site.id)
          setPanelOpen(true)
          setShowGallery(false)
          setSelectedSpeciesId(null)
          
          // Fly to marker with smooth animation
          map.flyTo([site.lat, site.lng], 13, {
            duration: 1.5,
            easeLinearity: 0.5
          })
          
          // Highlight the clicked marker
          newMarkers.forEach(m => {
            const el = m.getElement()
            if (el) el.style.filter = 'none'
          })
          const el = marker.getElement()
          if (el) {
            el.style.filter = 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))'
          }
        })

        // Hover effects with tooltip
        marker.on('mouseover', function(this: L.Marker) {
          const el = this.getElement()
          if (el) {
            const innerDiv = el.querySelector('.marker-pulse') as HTMLElement
            if (innerDiv) {
              innerDiv.style.transform = 'scale(1.2)'
              innerDiv.style.zIndex = '1000'
            }
          }
          
          // Show tooltip with site name
          this.bindTooltip(site.name, {
            permanent: false,
            direction: 'top',
            className: 'custom-tooltip',
            offset: [0, -20]
          }).openTooltip()
        })

        marker.on('mouseout', function(this: L.Marker) {
          const el = this.getElement()
          if (el && site.id !== selectedHotspot) {
            const innerDiv = el.querySelector('.marker-pulse') as HTMLElement
            if (innerDiv) {
              innerDiv.style.transform = 'scale(1)'
              innerDiv.style.zIndex = '600'
            }
          }
          this.closeTooltip()
        })

        newMarkers.set(site.id, marker)
      })
    } catch (error) {
      console.error('Error adding markers to map:', error)
      return
    }

    setActiveMarkers(newMarkers)

    // Fit map to show all markers if there are hotspots
    if (filteredHotspots.length > 0) {
      try {
        const group = L.featureGroup(
          filteredHotspots.map(site => L.marker([site.lat, site.lng]))
        )
        map.fitBounds(group.getBounds().pad(0.1), {
          animate: true,
          duration: 1
        })
      } catch (error) {
        console.error('Error fitting map bounds:', error)
      }
    }

  }, [map, filteredHotspots, loading, isMapReady, selectedHotspot])

  // Ensure map resizes correctly when the side panel opens/closes
  useEffect(() => {
    if (!map) return
    const id = setTimeout(() => map.invalidateSize(), 250)
    return () => clearTimeout(id)
  }, [map, panelOpen])

  const filterButtons = [
    { key: 'all' as const, label: 'All Sites', icon: '🌐', count: stats.total },
    { key: 'marine' as const, label: 'Marine', icon: '🌊', count: stats.marine },
    { key: 'terrestrial' as const, label: 'Terrestrial', icon: '🏔️', count: stats.terrestrial }
  ]

  const currentSite = useMemo(() => hotspots.find(h => h.id === selectedHotspot) || null, [hotspots, selectedHotspot])
  const currentSpecies = useMemo(() => currentSite ? species.filter(sp => sp.siteIds.includes(currentSite.id)) : [], [species, currentSite])
  const selectedSpeciesData = useMemo(() => currentSpecies.find(sp => sp.id === selectedSpeciesId) || null, [currentSpecies, selectedSpeciesId])
  const closePanel = useCallback(() => { setPanelOpen(false); setSelectedHotspot(null); setSelectedSpeciesId(null); setShowGallery(false) }, [])
  const toggleGallery = useCallback(() => setShowGallery(g => !g), [])
  
  // Admin: Toggle marker placement mode
  const toggleAdminMode = useCallback(() => {
    setAdminMode(prev => !prev)
    if (adminMode && tempMarker && map) {
      map.removeLayer(tempMarker)
      setTempMarker(null)
      setShowMarkerForm(false)
    }
  }, [adminMode, tempMarker, map])

  // Admin: Cancel marker placement
  const cancelMarkerPlacement = useCallback(() => {
    if (tempMarker && map) {
      map.removeLayer(tempMarker)
      setTempMarker(null)
    }
    setShowMarkerForm(false)
    setNewHotspotData({
      name: '',
      barangay: '',
      designation: '',
      description: '',
      areaHectares: 0,
      lat: 0,
      lng: 0,
      type: 'marine',
      features: [],
      selectedSpeciesIds: []
    })
  }, [tempMarker, map])

  // Admin: Save new hotspot
  const saveNewHotspot = useCallback(async () => {
    if (!newHotspotData.name || !newHotspotData.description) {
      alert('Please fill in at least the name and description')
      return
    }

    try {
      // Generate unique ID
      const siteId = `custom-${Date.now()}`
      
      // Prepare site data for database (correct table name is 'sites' not 'hotspots')
      const siteData = {
        id: siteId,
        name: newHotspotData.name,
        type: newHotspotData.type,
        barangay: newHotspotData.barangay || null,
        city: 'Mati City',
        province: 'Davao Oriental',
        designation: newHotspotData.designation || null,
        area_hectares: newHotspotData.areaHectares || null,
        lat: newHotspotData.lat,
        lng: newHotspotData.lng,
        summary: newHotspotData.description.substring(0, 100) + (newHotspotData.description.length > 100 ? '...' : ''),
        description: newHotspotData.description,
        features: newHotspotData.features.length > 0 ? newHotspotData.features : [],
        stewardship: 'To be determined',
        tags: [],
        image_url: null,
        visitor_notes: null
      }

      // Save site to database (table is called 'sites')
      const { data: savedSite, error: siteError } = await supabase
        .from('sites')
        .insert(siteData)
        .select()
        .single()

      if (siteError) {
        console.error('Error saving site:', siteError)
        alert(`Error saving site: ${siteError.message}`)
        return
      }

      console.log('Site saved successfully:', savedSite)

      // Save species relationships if any species were selected
      if (newHotspotData.selectedSpeciesIds.length > 0) {
        const speciesRelations = newHotspotData.selectedSpeciesIds.map(speciesId => ({
          species_id: speciesId,
          site_id: siteId,
          is_highlight: false
        }))

        // Table is called 'species_sites' not 'species_site_relations'
        const { error: relationsError } = await supabase
          .from('species_sites')
          .insert(speciesRelations)

        if (relationsError) {
          console.error('Error saving species relations:', relationsError)
          alert(`Site saved but error linking species: ${relationsError.message}`)
        } else {
          console.log('Species relations saved:', speciesRelations.length)
        }
      }

      alert(`✅ Site "${newHotspotData.name}" saved successfully!\n\n` +
            `Location: ${newHotspotData.lat.toFixed(5)}, ${newHotspotData.lng.toFixed(5)}\n` +
            `Type: ${newHotspotData.type}\n` +
            `Species linked: ${newHotspotData.selectedSpeciesIds.length}\n\n` +
            `Refreshing map...`)
      
      // Clean up
      if (tempMarker && map) {
        map.removeLayer(tempMarker)
        setTempMarker(null)
      }
      setShowMarkerForm(false)
      setAdminMode(false)
      setNewHotspotData({
        name: '',
        barangay: '',
        designation: '',
        description: '',
        areaHectares: 0,
        lat: 0,
        lng: 0,
        type: 'marine',
        features: [],
        selectedSpeciesIds: []
      })

      // Refresh the page to show the new site
      setTimeout(() => {
        window.location.reload()
      }, 1500)

    } catch (error) {
      console.error('Unexpected error saving site:', error)
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [newHotspotData, tempMarker, map, species])
  
  // Layer switcher function
  const switchLayer = useCallback((layerType: 'street' | 'satellite' | 'topo') => {
    if (!map) return
    const layers = (map as any).layers
    if (!layers) return
    
    // Remove all layers
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer)
      }
    })
    
    // Add the selected layer
    switch(layerType) {
      case 'satellite':
        layers.satelliteLayer.addTo(map)
        break
      case 'topo':
        layers.topoLayer.addTo(map)
        break
      default:
        layers.streetLayer.addTo(map)
    }
    
    setCurrentLayer(layerType)
  }, [map])

  return (
    <div className={`relative ${className}`}>
      {/* CSS for marker animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0; }
          50% { transform: scale(1.3); opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .marker-pulse {
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .marker-pulse::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 50%;
          border: 2px solid currentColor;
          opacity: 0;
          animation: pulse 2s ease-out infinite;
          pointer-events: none;
        }
        .temp-marker {
          animation: bounce 1s ease-in-out infinite;
        }
        .custom-tooltip {
          background: rgba(0, 0, 0, 0.85) !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        .custom-tooltip::before {
          border-top-color: rgba(0, 0, 0, 0.85) !important;
        }
      `}</style>
      {/* Left Sliding Info Panel - Mobile Optimized */}
      <div className={`fixed inset-y-0 left-0 z-[1100] w-full sm:max-w-md transform transition-transform duration-300 ease-out ${panelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{currentSite ? currentSite.name : 'Site Details'}</h2>
              {currentSite && <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentSite.designation}</p>}
            </div>
            <button onClick={closePanel} aria-label="Close panel" className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="overflow-y-auto flex-1 px-4 sm:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
            {!currentSite && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Click a marker on the map to view details.</p>}
            {currentSite && (
              <>
                {/* Site Hero Image */}
                {currentSite.image && (
                  <div className="relative -mx-4 sm:-mx-5 -mt-3 sm:-mt-4 mb-3 sm:mb-4">
                    <img 
                      src={currentSite.image} 
                      alt={currentSite.name}
                      className="w-full h-32 sm:h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 sm:bottom-3 left-4 sm:left-5 right-4 sm:right-5">
                      <div className="text-white font-bold text-sm sm:text-lg drop-shadow-lg">{currentSite.name}</div>
                      <div className="text-white/90 text-xs drop-shadow">{currentSite.barangay}</div>
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{currentSite.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-2">
                      <div className="font-semibold text-slate-700 dark:text-slate-200">Type</div>
                      <div className="text-slate-600 dark:text-slate-400 capitalize">{currentSite.type}</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-2">
                      <div className="font-semibold text-slate-700 dark:text-slate-200">Area</div>
                      <div className="text-slate-600 dark:text-slate-400">{currentSite.areaHectares ? `${currentSite.areaHectares.toLocaleString()} ha` : 'N/A'}</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-2 col-span-2">
                      <div className="font-semibold text-slate-700 dark:text-slate-200">Barangay</div>
                      <div className="text-slate-600 dark:text-slate-400 text-[10px] sm:text-[11px] leading-snug">{currentSite.barangay || '—'}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Key Features</h3>
                  <ul className="space-y-1">
                    {currentSite.features.slice(0, 6).map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"><span className="text-emerald-500 mt-0.5">•</span><span>{f}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Biodiversity ({currentSpecies.length})</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {currentSpecies.slice(0, 20).map(sp => (
                      <button
                        key={sp.id}
                        onClick={() => {
                          setSelectedSpeciesId(sp.id)
                          setShowGallery(true)
                        }}
                        className="text-left rounded-md border border-slate-200 dark:border-slate-700 p-2 sm:p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{sp.commonName}</div>
                            <div className="text-[9px] sm:text-[10px] italic text-slate-500 dark:text-slate-400 truncate">{sp.scientificName}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full font-medium ${sp.status === 'CR' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : sp.status === 'EN' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : sp.status === 'VU' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>{sp.status}</span>
                            <span className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full ${sp.category === 'flora' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'}`}>{sp.category === 'flora' ? 'Flora' : 'Fauna'}</span>
                          </div>
                        </div>
                        {sp.images && sp.images.length > 0 && (
                          <div className="mt-1 sm:mt-2 text-[9px] sm:text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            {sp.images.length} photo{sp.images.length > 1 ? 's' : ''} • Click to view
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {showGallery && selectedSpeciesData && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1200] flex items-center justify-center p-2 sm:p-4" onClick={() => { setShowGallery(false); setSelectedSpeciesId(null) }}>
                    <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">{selectedSpeciesData.commonName}</h3>
                          <p className="text-xs sm:text-sm italic text-slate-500 dark:text-slate-400 truncate">{selectedSpeciesData.scientificName}</p>
                        </div>
                        <button onClick={() => { setShowGallery(false); setSelectedSpeciesId(null) }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                      <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)] p-4 sm:p-6">
                        <div className="mb-4 sm:mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${selectedSpeciesData.status === 'CR' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : selectedSpeciesData.status === 'EN' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : selectedSpeciesData.status === 'VU' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>{selectedSpeciesData.status}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${selectedSpeciesData.category === 'flora' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'}`}>{selectedSpeciesData.category === 'flora' ? '🌿 Flora' : '🐾 Fauna'}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2">{selectedSpeciesData.habitat}</p>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">{selectedSpeciesData.blurb}</p>
                        </div>
                        {selectedSpeciesData.images && selectedSpeciesData.images.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {selectedSpeciesData.images.map((url, idx) => (
                              <div 
                                key={idx} 
                                className="relative group aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 shadow-md cursor-pointer"
                                onClick={() => {
                                  setSelectedImageUrl(url)
                                  setCurrentImageIndex(idx)
                                }}
                              >
                                <img src={url} alt={`${selectedSpeciesData.commonName} ${idx + 1}`} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                  {idx + 1}/{selectedSpeciesData.images.length}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 sm:py-12 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <p className="font-medium text-sm sm:text-base">No images available yet</p>
                            <p className="text-xs mt-1">Images can be added via admin panel</p>
                          </div>
                        )}
                        {selectedSpeciesData.highlights && selectedSpeciesData.highlights.length > 0 && (
                          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Key Facts</h4>
                            <ul className="space-y-1">
                              {selectedSpeciesData.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                                  <span className="text-emerald-500 mt-0.5">•</span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Modern Filter Bar with Layer Switcher */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none flex flex-col gap-2 items-center">
        {/* Layer Switcher */}
        <div className="inline-flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-lg pointer-events-auto">
          <button
            onClick={() => switchLayer('street')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentLayer === 'street'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🗺️ Street
          </button>
          <button
            onClick={() => switchLayer('satellite')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentLayer === 'satellite'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => switchLayer('topo')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentLayer === 'topo'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ⛰️ Topo
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-[999] bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading map data...</p>
          </div>
        </div>
      )}
      
      {/* Map Container */}
      <div 
        id="mati-gis-map" 
        className="h-[60vh] sm:h-[70vh] w-full relative z-0 rounded-2xl overflow-hidden"
      />
      
      {/* Combined Legend and Data Info Panel */}
      <div className="absolute bottom-8 right-2 sm:right-4 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg border border-slate-200/80 dark:border-slate-700/80">
        {/* Live Data Section */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-slate-100">Live Data</span>
        </div>
        <div className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 mb-3">
          <div className="font-semibold">{filteredHotspots.length} hotspot{filteredHotspots.length !== 1 ? 's' : ''} shown</div>
          <div className="opacity-75">Click markers for details</div>
        </div>
        
        {/* Legend Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 sm:pt-3">
          <h4 className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2 uppercase tracking-wider">Legend</h4>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></div>
              <span className="text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium">Marine</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></div>
              <span className="text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium">Terrestrial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Site information now presented in the left sliding panel */}

      {/* Attribution */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p>
          Interactive map data sourced from DENR-BMB, UNESCO, and local research institutions. 
          Map data © OpenStreetMap contributors.
        </p>
      </div>

      {/* Full-Screen Image Modal with Slideshow */}
      {selectedImageUrl && selectedSpeciesData && selectedSpeciesData.images && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[1300] flex items-center justify-center p-4"
          onClick={() => {
            setSelectedImageUrl(null)
            setCurrentImageIndex(0)
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setSelectedImageUrl(null)
              setCurrentImageIndex(0)
            }}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all z-10"
            aria-label="Close image"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {selectedSpeciesData.images.length > 1 && currentImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentImageIndex(prev => prev - 1)
                setSelectedImageUrl(selectedSpeciesData.images![currentImageIndex - 1])
              }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all z-10"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {selectedSpeciesData.images.length > 1 && currentImageIndex < selectedSpeciesData.images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentImageIndex(prev => prev + 1)
                setSelectedImageUrl(selectedSpeciesData.images![currentImageIndex + 1])
              }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all z-10"
              aria-label="Next image"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImageUrl}
              alt={`${selectedSpeciesData.commonName} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in duration-300"
            />
          </div>

          {/* Image Counter and Info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full">
              <span className="text-white font-semibold text-sm">
                {currentImageIndex + 1} / {selectedSpeciesData.images.length}
              </span>
            </div>
            <div className="text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
              {selectedSpeciesData.images.length > 1 ? 'Use arrow buttons or click outside to close' : 'Click anywhere to close'}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {selectedSpeciesData.images.length > 1 && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 backdrop-blur-md rounded-full max-w-[90vw] overflow-x-auto">
              {selectedSpeciesData.images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(idx)
                    setSelectedImageUrl(url)
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex 
                      ? 'border-white scale-110 shadow-lg' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}