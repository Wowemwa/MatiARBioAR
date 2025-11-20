import { useState, useEffect, useCallback, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useData } from '../context/DataContext'
import { supabase } from '../supabaseClient'
import { CancelIcon, SaveIcon, DeleteIcon } from './Icons'

interface AdminGISManagerProps {
  isVisible: boolean
  onClose: () => void
}

interface NewHotspotData {
  name: string
  barangay: string
  designation: string
  description: string
  areaHectares: number
  lat: number
  lng: number
  type: 'marine' | 'terrestrial'
  features: string[]
  selectedSpeciesIds: string[]
  imageUrl: string
}

export default function AdminGISManager({ isVisible, onClose }: AdminGISManagerProps) {
  const { hotspots, species, refresh } = useData()
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [markerType, setMarkerType] = useState<'marine' | 'terrestrial'>('marine')
  const [tempMarker, setTempMarker] = useState<L.Marker | null>(null)
  const [showMarkerForm, setShowMarkerForm] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newHotspotData, setNewHotspotData] = useState<NewHotspotData>({
    name: '',
    barangay: '',
    designation: '',
    description: '',
    areaHectares: 0,
    lat: 0,
    lng: 0,
    type: 'marine',
    features: [],
    selectedSpeciesIds: [],
    imageUrl: ''
  })

  // Initialize map
  useEffect(() => {
    if (!isVisible || !mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [6.9483, 126.2272],
      zoom: 11,
      zoomControl: false
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map)

    mapRef.current = map

    // Click handler for adding markers
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (tempMarker) {
        map.removeLayer(tempMarker)
      }

      const newMarker = L.marker(e.latlng, {
        icon: L.divIcon({
          html: `
            <div class="marker-pulse ${markerType === 'marine' ? 'bg-blue-500' : 'bg-green-500'} animate-bounce">
              <span class="text-2xl">${markerType === 'marine' ? '🌊' : '🏔️'}</span>
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        }),
        draggable: true
      })

      newMarker.addTo(map)
      setTempMarker(newMarker)
      setNewHotspotData(prev => ({
        ...prev,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: markerType
      }))
      setShowMarkerForm(true)

      // Update position on drag
      newMarker.on('dragend', () => {
        const pos = newMarker.getLatLng()
        setNewHotspotData(prev => ({
          ...prev,
          lat: pos.lat,
          lng: pos.lng
        }))
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [isVisible, markerType])

  // Render existing hotspots
  useEffect(() => {
    if (!mapRef.current || !isVisible) return

    const map = mapRef.current
    const markers: L.Marker[] = []

    hotspots.forEach(hotspot => {
      const marker = L.marker([hotspot.lat, hotspot.lng], {
        icon: L.divIcon({
          html: `
            <div class="marker-pulse ${hotspot.type === 'marine' ? 'bg-blue-500' : 'bg-green-500'}">
              <span class="text-2xl">${hotspot.type === 'marine' ? '🌊' : '🏔️'}</span>
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        })
      })

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${hotspot.name}</h3>
          <p class="text-sm text-gray-600">${hotspot.type}</p>
        </div>
      `)

      marker.on('click', () => {
        setSelectedHotspot(hotspot.id)
      })

      marker.addTo(map)
      markers.push(marker)
    })

    return () => {
      markers.forEach(m => map.removeLayer(m))
    }
  }, [hotspots, isVisible])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploadingImage(true)
    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setNewHotspotData(prev => ({ ...prev, imageUrl: base64String }))
        setUploadingImage(false)
      }
      reader.onerror = () => {
        alert('Failed to read image file')
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
      setUploadingImage(false)
    }
  }, [])

  const handleSave = useCallback(async () => {
    if (!newHotspotData.name || !newHotspotData.description) {
      alert('Please fill in at least the name and description')
      return
    }

    try {
      const siteId = `custom-${Date.now()}`
      
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
        image_url: newHotspotData.imageUrl || null,
        visitor_notes: null
      }

      const { error: siteError } = await supabase
        .from('sites')
        .insert(siteData)
        .select()
        .single()

      if (siteError) {
        console.error('Error saving site:', siteError)
        alert(`Error saving site: ${siteError.message}`)
        return
      }

      if (newHotspotData.selectedSpeciesIds.length > 0) {
        const speciesRelations = newHotspotData.selectedSpeciesIds.map(speciesId => ({
          species_id: speciesId,
          site_id: siteId,
          is_highlight: false
        }))

        const { error: relationsError } = await supabase
          .from('species_sites')
          .insert(speciesRelations)

        if (relationsError) {
          console.error('Error saving species relations:', relationsError)
          alert(`Site saved but error linking species: ${relationsError.message}`)
        }
      }

      alert(`✅ Site "${newHotspotData.name}" saved successfully!`)
      
      if (tempMarker && mapRef.current) {
        mapRef.current.removeLayer(tempMarker)
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
        selectedSpeciesIds: [],
        imageUrl: ''
      })

      // Refresh the data instead of reloading the page
      refresh()
    } catch (error) {
      console.error('Unexpected error saving site:', error)
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [newHotspotData, tempMarker])

  const handleDelete = useCallback(async () => {
    if (!selectedHotspot) return

    const hotspot = hotspots.find(h => h.id === selectedHotspot)
    if (!hotspot) return

    if (!confirm(`Are you sure you want to delete "${hotspot.name}"?`)) return

    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', selectedHotspot)

      if (error) {
        alert(`Error deleting site: ${error.message}`)
        return
      }

      alert('✅ Site deleted successfully!')
      setSelectedHotspot(null)
      // Refresh the data instead of reloading the page
      refresh()
    } catch (error) {
      console.error('Error deleting site:', error)
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [selectedHotspot, hotspots])

  const cancelMarkerPlacement = () => {
    if (tempMarker && mapRef.current) {
      mapRef.current.removeLayer(tempMarker)
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
      selectedSpeciesIds: [],
      imageUrl: ''
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-white/20 shadow-2xl w-full max-w-[95vw] h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">🗺️ GIS Map Manager</h2>
              <p className="text-white/90">Add or remove markers on the conservation map</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all"
            >
              <CancelIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100%-100px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto bg-white dark:bg-slate-800">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-3">Marker Type</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMarkerType('marine')}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                      markerType === 'marine'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    🌊 Marine
                  </button>
                  <button
                    onClick={() => setMarkerType('terrestrial')}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                      markerType === 'terrestrial'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    🏔️ Terrestrial
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 <strong>Tip:</strong> Click anywhere on the map to place a new marker. Drag to adjust position.
                </p>
              </div>

              {selectedHotspot && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
                  <h4 className="font-bold mb-2">Selected Marker</h4>
                  <p className="text-sm mb-3">{hotspots.find(h => h.id === selectedHotspot)?.name}</p>
                  <button
                    onClick={handleDelete}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <DeleteIcon className="w-4 h-4" />
                    Delete Marker
                  </button>
                </div>
              )}

              <div>
                <h4 className="font-bold mb-2">Existing Markers</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {hotspots.map(hotspot => (
                    <div
                      key={hotspot.id}
                      onClick={() => {
                        setSelectedHotspot(hotspot.id)
                        mapRef.current?.flyTo([hotspot.lat, hotspot.lng], 14)
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedHotspot === hotspot.id
                          ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500'
                          : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{hotspot.type === 'marine' ? '🌊' : '🏔️'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{hotspot.name}</p>
                          <p className="text-xs text-gray-500">{hotspot.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>

        {/* Marker Form Modal */}
        {showMarkerForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[2000]">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold">📍 New Marker Details</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Site Name *</label>
                  <input
                    type="text"
                    value={newHotspotData.name}
                    onChange={(e) => setNewHotspotData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700"
                    placeholder="Enter site name"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Description *</label>
                  <textarea
                    value={newHotspotData.description}
                    onChange={(e) => setNewHotspotData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 h-24"
                    placeholder="Describe the site"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Barangay</label>
                    <input
                      type="text"
                      value={newHotspotData.barangay}
                      onChange={(e) => setNewHotspotData(prev => ({ ...prev, barangay: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Designation</label>
                    <input
                      type="text"
                      value={newHotspotData.designation}
                      onChange={(e) => setNewHotspotData(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Area (hectares)</label>
                  <input
                    type="number"
                    value={newHotspotData.areaHectares}
                    onChange={(e) => setNewHotspotData(prev => ({ ...prev, areaHectares: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Site Image</label>
                  <div className="space-y-2">
                    {newHotspotData.imageUrl && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                        <img 
                          src={newHotspotData.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setNewHotspotData(prev => ({ ...prev, imageUrl: '' }))}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadingImage && (
                      <p className="text-sm text-blue-600">Uploading image...</p>
                    )}
                    <p className="text-xs text-gray-500">Max 5MB. This image will be displayed when users view this site on the map.</p>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Assign Species (optional)</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-2">
                    {species.map(sp => (
                      <label key={sp.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newHotspotData.selectedSpeciesIds.includes(sp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewHotspotData(prev => ({
                                ...prev,
                                selectedSpeciesIds: [...prev.selectedSpeciesIds, sp.id]
                              }))
                            } else {
                              setNewHotspotData(prev => ({
                                ...prev,
                                selectedSpeciesIds: prev.selectedSpeciesIds.filter(id => id !== sp.id)
                              }))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{sp.commonName} ({sp.scientificName})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <SaveIcon className="w-5 h-5" />
                    Save Marker
                  </button>
                  <button
                    onClick={cancelMarkerPlacement}
                    className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .marker-pulse {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
      `}</style>
    </div>
  )
}
