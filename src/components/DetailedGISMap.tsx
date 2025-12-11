import { useEffect, useState, useMemo, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useData } from '../context/DataContext'
import { useAdmin } from '../context/AdminContext'
import { supabase } from '../supabaseClient'
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber'
import { TextureLoader, BackSide, Euler, Quaternion } from 'three'
import { PanoramaControls } from 'three-panorama-controls/react'

// Panorama Scene Component using React Three Fiber
const PanoramaScene = ({ imageUrl, onDebugUpdate, calibrationOffsets, shouldRecalibrate, onRecalibrateDone, setCalibrationOffsets, gyroEnabled, onLoadComplete }: { 
  imageUrl: string, 
  onDebugUpdate: (data: any) => void,
  calibrationOffsets: { alpha: number, beta: number, gamma: number },
  shouldRecalibrate: boolean,
  onRecalibrateDone: () => void,
  setCalibrationOffsets: (offsets: { alpha: number, beta: number, gamma: number }) => void,
  gyroEnabled: boolean,
  onLoadComplete: () => void
}) => {
  const texture = useLoader(TextureLoader, imageUrl)
  const { camera } = useThree()
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false)
  const [isTextureLoaded, setIsTextureLoaded] = useState(false)

  // Mark texture as loaded and trigger callback
  useEffect(() => {
    if (texture) {
      setIsTextureLoaded(true)
      onLoadComplete()
    }
  }, [texture, onLoadComplete])
  const [deviceOrientation, setDeviceOrientation] = useState<{ alpha: number | null, beta: number | null, gamma: number | null }>({
    alpha: null,
    beta: null,
    gamma: null
  })

  // Recalibrate gyroscope
  const recalibrateGyroscope = () => {
    if (deviceOrientation.alpha !== null && deviceOrientation.beta !== null && deviceOrientation.gamma !== null) {
      setCalibrationOffsets({
        alpha: deviceOrientation.alpha,
        beta: deviceOrientation.beta,
        gamma: deviceOrientation.gamma
      })
    }
  }

  // Handle recalibration trigger
  useEffect(() => {
    if (shouldRecalibrate) {
      recalibrateGyroscope()
      onRecalibrateDone()
    }
  }, [shouldRecalibrate, deviceOrientation, setCalibrationOffsets, onRecalibrateDone])

  // Request gyroscope permission when component mounts
  useEffect(() => {
    const requestGyroscopePermission = async () => {
      console.log('🔍 Requesting gyroscope permission...')

      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          console.log('📱 Gyroscope permission result:', permission)

          if (permission === 'granted') {
            setGyroscopeEnabled(true)
            console.log('✅ Gyroscope permission granted!')
          } else {
            console.log('❌ Gyroscope permission denied')
          }
        } catch (error) {
          console.error('❌ Error requesting gyroscope permission:', error)
        }
      } else {
        // Android or desktop - assume permission granted
        setGyroscopeEnabled(true)
        console.log('✅ No permission API needed (Android/Desktop)')
      }
    }

    requestGyroscopePermission()
  }, [])

  // Auto-calibrate on first device orientation reading
  const [hasAutoCalibrated, setHasAutoCalibrated] = useState(false)
  useEffect(() => {
    if (!hasAutoCalibrated && gyroscopeEnabled && deviceOrientation.alpha !== null && deviceOrientation.beta !== null && deviceOrientation.gamma !== null) {
      setCalibrationOffsets({
        alpha: deviceOrientation.alpha,
        beta: deviceOrientation.beta,
        gamma: deviceOrientation.gamma
      })
      setHasAutoCalibrated(true)
      console.log('✅ Auto-calibrated gyroscope on load')
    }
  }, [gyroscopeEnabled, deviceOrientation, hasAutoCalibrated, setCalibrationOffsets])

  // Handle device orientation changes
  useEffect(() => {
    if (!gyroscopeEnabled) {
      onDebugUpdate({ gyroscopeEnabled: false, deviceOrientation: null })
      return
    }

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const orientation = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      }
      setDeviceOrientation(orientation)
      onDebugUpdate({ gyroscopeEnabled: true, deviceOrientation: orientation })
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation)

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [gyroscopeEnabled, onDebugUpdate])

  // Apply device orientation to camera with smooth blending to allow touch controls
  useFrame(() => {
    if (!gyroEnabled || !gyroscopeEnabled || !deviceOrientation.alpha || !deviceOrientation.beta || !deviceOrientation.gamma) return

    // Convert device orientation to camera rotation
    // Alpha = compass direction (Z rotation)
    // Beta = front/back tilt (X rotation)
    // Gamma = left/right tilt (Y rotation)

    const alpha = ((deviceOrientation.alpha - calibrationOffsets.alpha) * Math.PI) / 180 // Convert to radians
    const beta = ((deviceOrientation.beta - calibrationOffsets.beta) * Math.PI) / 180
    const gamma = ((deviceOrientation.gamma - calibrationOffsets.gamma) * Math.PI) / 180

    // Create quaternion from device orientation
    const euler = new Euler(beta, alpha, -gamma, 'YXZ')
    const quaternion = new Quaternion()
    quaternion.setFromEuler(euler)

    // Apply to camera (full gyro control)
    camera.quaternion.copy(quaternion)
  })

  // Debug gyroscope availability
  useEffect(() => {
    console.log('🔍 Checking device sensors...')

    // Check for DeviceOrientationEvent
    if (typeof DeviceOrientationEvent !== 'undefined') {
      console.log('✅ DeviceOrientationEvent available')

      // Check for permission API
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        console.log('✅ Permission API available - iOS device detected')
      } else {
        console.log('ℹ️ No permission API - Android or desktop device')
      }
    } else {
      console.log('❌ DeviceOrientationEvent not available')
    }

    // Check for DeviceMotionEvent (accelerometer)
    if (typeof DeviceMotionEvent !== 'undefined') {
      console.log('✅ DeviceMotionEvent available (accelerometer)')
    } else {
      console.log('❌ DeviceMotionEvent not available')
    }
  }, [])

  return (
    <>
      {/* Panorama sphere with inverted geometry */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[10, 60, 20]} />
        <meshBasicMaterial map={texture} side={BackSide} />
      </mesh>

      {/* Modern Three.js panorama controls - enabled with gyroscope */}
      <PanoramaControls
        makeDefault={true}
        enabled={true}
        zoomable
        minFov={10}
        maxFov={90}
        zoomSpeed={0.05}
        panSpeed={0.1}
      />
    </>
  )
}

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
  const [legendCollapsed, setLegendCollapsed] = useState(false)
  const [showPanoramic, setShowPanoramic] = useState(false)
  const [panoramaDebugData, setPanoramaDebugData] = useState<{
    gyroscopeEnabled: boolean;
    deviceOrientation: { alpha: number | null; beta: number | null; gamma: number | null } | null;
  }>({ gyroscopeEnabled: false, deviceOrientation: null })
  const [calibrationOffsets, setCalibrationOffsets] = useState({ alpha: 0, beta: 0, gamma: 0 })
  const [shouldRecalibrate, setShouldRecalibrate] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPanoramaLoading, setIsPanoramaLoading] = useState(false)
  const [showCalibratePanel, setShowCalibratePanel] = useState(false)
  const [controlMode, setControlMode] = useState<'swipe' | 'gyro'>('gyro')

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  // Toggle fullscreen for panoramic viewer
  const toggleFullScreen = async () => {
    const panoramaContainer = document.getElementById('panorama-viewer-container')
    if (!panoramaContainer) return

    if (!document.fullscreenElement) {
      try {
        await panoramaContainer.requestFullscreen()
      } catch (err) {
        console.error('Error entering fullscreen:', err)
      }
    } else {
      try {
        await document.exitFullscreen()
      } catch (err) {
        console.error('Error exiting fullscreen:', err)
      }
    }
  }
  
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
      {/* Left Sliding Info Panel - Enhanced Design */}
      <div className={`fixed inset-y-0 left-0 z-[1100] w-full sm:max-w-lg transform transition-all duration-500 ease-out ${panelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-r-2 border-emerald-200/50 dark:border-emerald-900/50 shadow-[0_0_80px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_80px_-10px_rgba(0,0,0,0.8)]">
          {/* Enhanced Header with Gradient Background */}
          <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBvcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
            <div className="relative flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent truncate">
                  {currentSite ? currentSite.name : 'Site Details'}
                </h2>
                {currentSite && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate mt-1 font-medium flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {currentSite.designation}
                  </p>
                )}
              </div>
              <button 
                onClick={closePanel} 
                aria-label="Close panel" 
                className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-red-50 dark:hover:bg-red-900/30 hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-600 transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl group"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-7">
            {!currentSite && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 flex items-center justify-center">
                  <svg className="w-10 h-10 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">Click a marker on the map to explore biodiversity hotspots</p>
              </div>
            )}
            {currentSite && (
              <>
                {/* Enhanced Site Hero Image */}
                {currentSite.image && (
                  <div className="relative -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-4 sm:mb-5 group overflow-hidden">
                    <img 
                      src={currentSite.image} 
                      alt={currentSite.name}
                      className="w-full h-40 sm:h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20" />
                    <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 right-4 sm:right-6">
                      <div className="text-white font-bold text-base sm:text-xl drop-shadow-2xl mb-1">
                        {currentSite.name}
                      </div>
                      <div className="text-white/95 text-xs sm:text-sm drop-shadow-lg font-medium flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {currentSite.barangay}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Panoramic View Button */}
                {currentSite?.panoramicImage && (
                  <div className="relative -mx-4 sm:-mx-6 mb-4 sm:mb-5">
                    <button
                      onClick={() => {
                        setShowPanoramic(true)
                        setIsPanoramaLoading(true)
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      View 360° Panoramic
                    </button>
                  </div>
                )}
                
                {/* Enhanced Description and Stats */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl p-4 sm:p-5 border-2 border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{currentSite.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-950/30 rounded-xl p-3 sm:p-4 border-2 border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="relative">
                        <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-1 text-xs uppercase tracking-wide">Type</div>
                        <div className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base capitalize">{currentSite.type}</div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-950/30 rounded-xl p-3 sm:p-4 border-2 border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="relative">
                        <div className="font-bold text-blue-700 dark:text-blue-300 mb-1 text-xs uppercase tracking-wide">Area</div>
                        <div className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">{currentSite.areaHectares ? `${currentSite.areaHectares.toLocaleString()} ha` : 'N/A'}</div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-950/30 rounded-xl p-3 sm:p-4 border-2 border-purple-200/50 dark:border-purple-800/50 col-span-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="relative">
                        <div className="font-bold text-purple-700 dark:text-purple-300 mb-1 text-xs uppercase tracking-wide">Barangay</div>
                        <div className="text-slate-800 dark:text-slate-200 font-bold text-sm leading-snug">{currentSite.barangay || '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Key Features Section */}
                <div className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800/30 dark:to-slate-900/30 rounded-2xl p-4 sm:p-5 border-2 border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                  <h3 className="text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {currentSite.features.slice(0, 6).map((f, idx) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 group">
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md group-hover:scale-110 transition-transform">
                          {idx + 1}
                        </span>
                        <span className="flex-1 leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Enhanced Biodiversity Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-2xl p-4 sm:p-5 border-2 border-emerald-200/50 dark:border-emerald-800/50 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Biodiversity
                    </h3>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold shadow-lg">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {currentSpecies.length} Species
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                    {currentSpecies.slice(0, 20).map(sp => (
                      <button
                        key={sp.id}
                        onClick={() => {
                          setSelectedSpeciesId(sp.id)
                          setShowGallery(true)
                        }}
                        className="group text-left rounded-xl border-2 border-slate-200/70 dark:border-slate-700/70 p-3 sm:p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Animated gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-emerald-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
                        
                        <div className="relative flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {sp.commonName}
                            </div>
                            <div className="text-[10px] sm:text-xs italic text-slate-500 dark:text-slate-400 truncate">
                              {sp.scientificName}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span className={`text-[9px] sm:text-[10px] px-2 py-1 rounded-full font-bold shadow-sm ${
                              sp.status === 'CR' 
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                                : sp.status === 'EN' 
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                                : sp.status === 'VU' 
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' 
                                : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            }`}>
                              {sp.status}
                            </span>
                            <span className={`text-[9px] sm:text-[10px] px-2 py-1 rounded-full font-medium shadow-sm ${
                              sp.category === 'flora' 
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-300' 
                                : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/40 dark:to-orange-900/40 dark:text-amber-300'
                            }`}>
                              {sp.category === 'flora' ? 'Flora' : 'Fauna'}
                            </span>
                          </div>
                        </div>
                        {sp.images && sp.images.length > 0 && (
                          <div className="relative mt-2.5 sm:mt-3 text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            {sp.images.length} photo{sp.images.length > 1 ? 's' : ''} • Click to explore
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
                                  {idx + 1}/{selectedSpeciesData.images?.length || 0}
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
      
      {/* Collapsible Combined Legend and Data Info Panel */}
      <div className="absolute bottom-8 right-2 sm:right-4 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300">
        {/* Header with Toggle Button */}
        <div 
          className="flex items-center justify-between gap-2 p-2 sm:p-3 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          onClick={() => setLegendCollapsed(!legendCollapsed)}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-slate-100">MatiArbio Interactive map</span>
          </div>
          <button 
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
            aria-label={legendCollapsed ? "Expand legend" : "Collapse legend"}
          >
            <svg 
              className={`w-3 h-3 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400 transition-transform duration-300 ${legendCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* Collapsible Content */}
        <div className={`overflow-hidden transition-all duration-300 ${legendCollapsed ? 'max-h-0' : 'max-h-96'}`}>
          <div className="px-2 sm:px-3 pb-2 sm:pb-3">
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

      {/* Panoramic Viewer Modal */}
      {showPanoramic && currentSite?.panoramicImage && (
        <div className="fixed inset-0 z-[1200] bg-black">
          <div id="panorama-viewer-container" className="relative w-full h-full bg-black overflow-hidden">
            <button
              onClick={() => setShowPanoramic(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <button
              onClick={toggleFullScreen}
              className="absolute top-4 right-16 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
              title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFullScreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5"/>
                )}
              </svg>
            </button>

            {/* Modern Three.js Panoramic Viewer */}
            <Canvas
              camera={{ position: [0, 0, 5], fov: 75 }}
              style={{ width: '100%', height: '100%' }}
            >
              <PanoramaScene 
                imageUrl={currentSite.panoramicImage} 
                onDebugUpdate={setPanoramaDebugData}
                calibrationOffsets={calibrationOffsets}
                shouldRecalibrate={shouldRecalibrate}
                onRecalibrateDone={() => setShouldRecalibrate(false)}
                setCalibrationOffsets={setCalibrationOffsets}
                gyroEnabled={controlMode === 'gyro'}
                onLoadComplete={() => setIsPanoramaLoading(false)}
              />
            </Canvas>

            {/* Control Instructions - hidden */}
            {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 backdrop-blur-md rounded-xl p-3">
              <div className="text-white text-sm text-center">
                <div className="font-medium mb-1">360° Panorama Controls</div>
                <div className="text-gray-300 text-xs">
                  • Drag to look around • Pinch to zoom • Device sensors for gyroscope
                </div>
                <button
                  onClick={() => setShouldRecalibrate(true)}
                  className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                >
                  Recalibrate Gyroscope
                </button>
              </div>
            </div> */}

            {/* Loading Animation */}
            {isPanoramaLoading && (
              <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white text-lg font-medium">Loading Panorama...</p>
                  <p className="text-gray-400 text-sm mt-2">Calibrating sensors</p>
                </div>
              </div>
            )}

            {/* Control Mode Toggle - Lower Left */}
            <div className="absolute bottom-4 left-4 z-10">
              <button
                onClick={() => setControlMode(prev => prev === 'swipe' ? 'gyro' : 'swipe')}
                className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2"
              >
                {controlMode === 'gyro' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span className="text-sm font-medium">Gyro Only</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/>
                    </svg>
                    <span className="text-sm font-medium">Swipe Only</span>
                  </>
                )}
              </button>
            </div>

            {/* Calibrate Button - Lower Right */}
            {!showCalibratePanel ? (
              <button
                onClick={() => setShowCalibratePanel(true)}
                className="absolute bottom-4 right-4 z-10 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200"
                title="Calibrate Gyroscope"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                </svg>
              </button>
            ) : (
              <div className="absolute bottom-4 right-4 z-10 bg-black/70 backdrop-blur-md rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium text-sm">Gyroscope Calibration</h3>
                  <button
                    onClick={() => setShowCalibratePanel(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <p className="text-gray-300 text-xs mb-3">Hold device at desired neutral position</p>
                <button
                  onClick={() => {
                    setShouldRecalibrate(true)
                    setTimeout(() => setShowCalibratePanel(false), 1000)
                  }}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
                >
                  Calibrate Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}