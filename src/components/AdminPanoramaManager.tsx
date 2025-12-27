import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon } from './Icons'
import { uploadImageToStorage } from '../utils/imageUpload'
import { useData } from '../context/DataContext'
import { Canvas } from '@react-three/fiber'
import PanoramaScene from './PanoramaScene'
import { Vector3 } from 'three'

interface Panorama {
  id: string
  site_id?: string
  title: string
  description: string
  image_url: string
  thumbnail_url: string
  is_active: boolean
  initial_view_h: number
  initial_view_v: number
  initial_fov: number
  location_lat: number
  location_lng: number
  floor_plan_x: number
  floor_plan_y: number
}

interface PanoramaMarker {
  id: string
  panorama_id: string
  type: 'info' | 'image' | 'video'
  position_x: number
  position_y: number
  position_z: number
  title: string
  content: string
  icon_url: string
  model_url?: string
}

interface PanoramaLink {
  id: string
  from_panorama_id: string
  to_panorama_id: string
  position_x: number
  position_y: number
  position_z: number
  rotation_y: number
  label: string
}

export default function AdminPanoramaManager() {
  const { hotspots } = useData()
  const [panoramas, setPanoramas] = useState<Panorama[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Panorama>>({})
  const [markers, setMarkers] = useState<PanoramaMarker[]>([])
  const [links, setLinks] = useState<PanoramaLink[]>([])
  const [activeTab, setActiveTab] = useState<'details' | 'editor'>('details')
  const [uploading, setUploading] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<Partial<PanoramaMarker> | null>(null)
  const [showMarkerModal, setShowMarkerModal] = useState(false)

  const [uploadingModel, setUploadingModel] = useState(false)

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('Please upload a .glb file')
      return
    }

    setUploadingModel(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('models_3d')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('models_3d')
        .getPublicUrl(filePath)

      setSelectedMarker(prev => ({ ...prev, model_url: publicUrl }))
    } catch (error) {
      console.error('Error uploading model:', error)
      alert('Error uploading model')
    } finally {
      setUploadingModel(false)
    }
  }

  useEffect(() => {
    fetchPanoramas()
  }, [])

  useEffect(() => {
    if (editingId && editingId !== 'new') {
      fetchMarkers(editingId)
      fetchLinks(editingId)
    } else {
      setMarkers([])
      setLinks([])
    }
  }, [editingId])

  const fetchPanoramas = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('panoramas')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching panoramas:', error)
    } else {
      setPanoramas(data || [])
    }
    setLoading(false)
  }

  const fetchMarkers = async (panoramaId: string) => {
    const { data } = await supabase
      .from('panorama_markers')
      .select('*')
      .eq('panorama_id', panoramaId)
    setMarkers(data || [])
  }

  const fetchLinks = async (panoramaId: string) => {
    const { data } = await supabase
      .from('panorama_links')
      .select('*')
      .eq('from_panorama_id', panoramaId)
    setLinks(data || [])
  }

  const handleCreate = () => {
    const newPanorama: Partial<Panorama> = {
      title: 'New Panorama',
      description: '',
      image_url: '',
      is_active: false,
      initial_view_h: 0,
      initial_view_v: 0,
      initial_fov: 75,
      floor_plan_x: 0,
      floor_plan_y: 0
    }
    setEditForm(newPanorama)
    setEditingId('new')
    setActiveTab('details')
    setSelectedMarker(null)
    setShowMarkerModal(false)
  }

  const handleEdit = (panorama: Panorama) => {
    setEditForm(panorama)
    setEditingId(panorama.id)
    setActiveTab('details')
    setSelectedMarker(null)
    setShowMarkerModal(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this panorama?')) return

    const { error } = await supabase
      .from('panoramas')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting panorama')
    } else {
      fetchPanoramas()
      if (editingId === id) {
        setEditingId(null)
        setEditForm({})
      }
    }
  }

  const handleSave = async () => {
    if (!editForm.title || !editForm.image_url) {
      alert('Title and Image URL are required')
      return
    }

    const panoramaData = {
      site_id: editForm.site_id,
      title: editForm.title,
      description: editForm.description,
      image_url: editForm.image_url,
      thumbnail_url: editForm.thumbnail_url,
      is_active: editForm.is_active,
      initial_view_h: editForm.initial_view_h,
      initial_view_v: editForm.initial_view_v,
      initial_fov: editForm.initial_fov,
      location_lat: editForm.location_lat,
      location_lng: editForm.location_lng,
      floor_plan_x: editForm.floor_plan_x,
      floor_plan_y: editForm.floor_plan_y
    }

    let error
    if (editingId === 'new') {
      const { error: insertError } = await supabase
        .from('panoramas')
        .insert([panoramaData])
      error = insertError
    } else {
      const { error: updateError } = await supabase
        .from('panoramas')
        .update(panoramaData)
        .eq('id', editingId)
      error = updateError
    }

    if (error) {
      console.error('Error saving panorama:', error)
      alert('Error saving panorama')
    } else {
      fetchPanoramas()
      setEditingId(null)
      setEditForm({})
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const publicUrl = await uploadImageToStorage(file, 'panoramas')
      if (publicUrl) {
        setEditForm(prev => ({ ...prev, image_url: publicUrl }))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleSetActive = async (id: string) => {
    const panorama = panoramas.find(p => p.id === id)
    if (!panorama) return

    if (!panorama.site_id) {
      alert('Please link this panorama to a site first.')
      return
    }

    // First set all panoramas for this site to inactive
    await supabase
      .from('panoramas')
      .update({ is_active: false })
      .eq('site_id', panorama.site_id)
    
    // Then set the selected one to active
    const { error } = await supabase
      .from('panoramas')
      .update({ is_active: true })
      .eq('id', id)
    
    if (error) {
      console.error('Error setting active panorama:', error)
    } else {
      fetchPanoramas()
    }
  }

  const handleAddMarker = async () => {
    if (!editingId || editingId === 'new') return
    
    const newMarker = {
      panorama_id: editingId,
      type: 'info',
      position_x: 10,
      position_y: 0,
      position_z: 0,
      title: 'New Marker',
      content: 'Description'
    }
    
    const { error } = await supabase.from('panorama_markers').insert([newMarker])
    
    if (error) {
      console.error('Error adding marker:', error)
      alert('Error adding marker')
    } else {
      fetchMarkers(editingId)
    }
  }

  const handleDeleteMarker = async (id: string) => {
    if (!confirm('Delete this marker?')) return
    
    const { error } = await supabase.from('panorama_markers').delete().eq('id', id)
    
    if (error) {
      console.error('Error deleting marker:', error)
    } else {
      if (editingId) fetchMarkers(editingId)
    }
  }

  const handleUpdateMarker = async (id: string, updates: Partial<PanoramaMarker>) => {
    const { error } = await supabase.from('panorama_markers').update(updates).eq('id', id)
    if (error) {
      console.error('Error updating marker:', error)
    } else {
      if (editingId) fetchMarkers(editingId)
    }
  }

  const handleSceneClick = (point: Vector3) => {
    if (!editingId || editingId === 'new') {
      alert('Please save the panorama first before adding markers.')
      return
    }
    
    const newMarker: Partial<PanoramaMarker> = {
      panorama_id: editingId,
      type: 'info',
      position_x: point.x,
      position_y: point.y,
      position_z: point.z,
      title: 'New Marker',
      content: ''
    }
    setSelectedMarker(newMarker)
    setShowMarkerModal(true)
  }

  const handleMarkerClick = (marker: PanoramaMarker) => {
    setSelectedMarker(marker)
    setShowMarkerModal(true)
  }

  const handleSaveMarker = async () => {
    if (!selectedMarker || !selectedMarker.title) {
      alert('Title is required')
      return
    }

    const markerData = {
      panorama_id: selectedMarker.panorama_id,
      type: selectedMarker.type,
      position_x: selectedMarker.position_x,
      position_y: selectedMarker.position_y,
      position_z: selectedMarker.position_z,
      title: selectedMarker.title,
      content: selectedMarker.content,
      icon_url: selectedMarker.icon_url,
      model_url: selectedMarker.model_url
    }

    let error
    if (selectedMarker.id) {
      const { error: updateError } = await supabase
        .from('panorama_markers')
        .update(markerData)
        .eq('id', selectedMarker.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('panorama_markers')
        .insert([markerData])
      error = insertError
    }

    if (error) {
      console.error('Error saving marker:', error)
      alert('Error saving marker')
    } else {
      if (editingId) fetchMarkers(editingId)
      setShowMarkerModal(false)
      setSelectedMarker(null)
    }
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-slate-900">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Panoramas</h2>
          <button
            onClick={handleCreate}
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">Loading...</div>
          ) : panoramas.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">No panoramas found</div>
          ) : (
            panoramas.map(panorama => (
              <div
                key={panorama.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  editingId === panorama.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm'
                    : 'border-gray-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => handleEdit(panorama)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{panorama.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {panorama.site_id ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {hotspots.find(h => h.id === panorama.site_id)?.name || 'Unknown Site'}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                          No Site Linked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{panorama.description || 'No description'}</p>
                  </div>
                  {panorama.is_active && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSetActive(panorama.id); }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    title="Set as Active Public Panorama"
                  >
                    Set Active
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(panorama.id); }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-slate-900">
        {editingId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editingId === 'new' ? 'Create Panorama' : 'Edit Panorama'}
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => { setEditingId(null); setEditForm({}); }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg flex items-center transition-colors"
                >
                  <CancelIcon className="w-5 h-5 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors"
                >
                  <SaveIcon className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <button
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-green-600 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'editor'
                    ? 'border-green-600 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('editor')}
                disabled={editingId === 'new'}
              >
                Visual Editor
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'details' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Linked Site (Hotspot)</label>
                    <select
                      value={editForm.site_id || ''}
                      onChange={e => setEditForm({ ...editForm, site_id: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">-- Select a Site --</option>
                      {hotspots.map(hotspot => (
                        <option key={hotspot.id} value={hotspot.id}>
                          {hotspot.name} ({hotspot.type})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Link this panorama to a map marker to display it on the interactive map.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Main Entrance"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Panorama Image</label>
                    
                    <div className="space-y-4">
                      {/* Image Preview Area */}
                      {editForm.image_url ? (
                        <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600 group">
                          <img
                            src={editForm.image_url}
                            alt="Panorama Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => setEditForm(prev => ({ ...prev, image_url: '' }))}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Upload Area */
                        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors bg-gray-50 dark:bg-slate-800/50">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-base font-medium text-gray-700 dark:text-gray-200">
                                Click or drag to upload 360° Image
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Supports JPG, PNG (Max 10MB)
                              </p>
                            </div>
                            {uploading && (
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                Uploading...
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* URL Fallback */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-2 bg-white dark:bg-slate-800 text-sm text-gray-500 dark:text-gray-400">or use URL</span>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={editForm.image_url || ''}
                        onChange={e => setEditForm({ ...editForm, image_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Horizontal Angle</label>
                      <input
                        type="number"
                        value={editForm.initial_view_h || 0}
                        onChange={e => setEditForm({ ...editForm, initial_view_h: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Vertical Angle</label>
                      <input
                        type="number"
                        value={editForm.initial_view_v || 0}
                        onChange={e => setEditForm({ ...editForm, initial_view_v: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'editor' && (
                <div className="h-full flex flex-col min-h-[500px]">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
                    <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2">Visual Editor</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Click anywhere on the panorama to add a marker. Click existing markers to edit them.
                    </p>
                  </div>
                  
                  <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-black min-h-[400px]">
                    {editForm.image_url ? (
                      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
                        <PanoramaScene 
                          imageUrl={editForm.image_url}
                          markers={markers}
                          onSceneClick={handleSceneClick}
                          onMarkerClick={handleMarkerClick}
                        />
                      </Canvas>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        Please upload an image in the Details tab first.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a panorama to edit or create a new one
          </div>
        )}
      </div>

      {/* Marker Edit Modal */}
      {showMarkerModal && selectedMarker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedMarker.id ? 'Edit Marker' : 'New Marker'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={selectedMarker.title || ''}
                  onChange={e => setSelectedMarker({ ...selectedMarker, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Marker Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select
                  value={selectedMarker.type || 'info'}
                  onChange={e => setSelectedMarker({ ...selectedMarker, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="info">Info</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                <textarea
                  value={selectedMarker.content || ''}
                  onChange={e => setSelectedMarker({ ...selectedMarker, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Description or content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">3D Model (.glb)</label>
                {selectedMarker.model_url ? (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
                      {selectedMarker.model_url.split('/').pop()}
                    </span>
                    <button
                      onClick={() => setSelectedMarker({ ...selectedMarker, model_url: undefined })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept=".glb"
                      onChange={handleModelUpload}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100
                        dark:file:bg-green-900/30 dark:file:text-green-400"
                    />
                    {uploadingModel && (
                      <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Upload a .glb file to display a 3D model when this marker is clicked.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                {selectedMarker.id && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this marker?')) {
                        handleDeleteMarker(selectedMarker.id!)
                        setShowMarkerModal(false)
                      }
                    }}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mr-auto"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setShowMarkerModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMarker}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Marker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
