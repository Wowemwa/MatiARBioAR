import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon } from './Icons'
import { uploadImageToStorage } from '../utils/imageUpload'
import { useData } from '../context/DataContext'
import { Canvas } from '@react-three/fiber'
import PanoramaScene from './PanoramaScene'
import type { Panorama, PanoramaMarker, PanoramaLink } from '../types/panorama'

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
  const [selectedLink, setSelectedLink] = useState<Partial<PanoramaLink> | null>(null)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkCreationMode, setLinkCreationMode] = useState(false)

  const [uploadingModel, setUploadingModel] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [bulkUploadMode, setBulkUploadMode] = useState(false)
  const [bulkFiles, setBulkFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [tourMode, setTourMode] = useState(false) // Virtual tour creation mode
  const [tourPanoramas, setTourPanoramas] = useState<string[]>([]) // IDs of panoramas in current tour
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null) // Currently selected site
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set()) // Expanded site accordions

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
    fetchAllLinks()
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

  const fetchAllLinks = async () => {
    const { data } = await supabase
      .from('panorama_links')
      .select('*')
    setLinks(data || [])
  }

  const handleCreate = () => {
    if (!selectedSiteId) {
      alert('Please select a site first')
      return
    }
    const newPanorama: Partial<Panorama> = {
      title: 'New Panorama',
      description: '',
      image_url: '',
      is_active: true, // Automatically set as active (entry point)
      initial_view_h: 0,
      initial_view_v: 0,
      initial_fov: 75,
      floor_plan_x: 0,
      floor_plan_y: 0,
      site_id: selectedSiteId
    }
    setEditForm(newPanorama)
    setEditingId('new')
    setActiveTab('details')
    setSelectedMarker(null)
    setShowMarkerModal(false)
  }

  const handleCreateVirtualTour = () => {
    if (!selectedSiteId) {
      alert('Please select a site first')
      return
    }
    setTourMode(true)
    setTourPanoramas([])
    setBulkUploadMode(true)
    setEditingId(null)
  }

  const toggleSite = (siteId: string) => {
    const newExpanded = new Set(expandedSites)
    if (newExpanded.has(siteId)) {
      newExpanded.delete(siteId)
    } else {
      newExpanded.add(siteId)
    }
    setExpandedSites(newExpanded)
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
    setError(null)
    try {
      const publicUrl = await uploadImageToStorage(file, 'panoramas')
      if (publicUrl) {
        setEditForm(prev => ({ ...prev, image_url: publicUrl }))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Error uploading image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) return
    
    if (!selectedSiteId && !tourMode) {
      alert('Please select a site first')
      return
    }
    
    setError(null)
    const progress: Record<string, number> = {}
    const uploadedPanoramaIds: string[] = []
    
    for (let i = 0; i < bulkFiles.length; i++) {
      const file = bulkFiles[i]
      try {
        progress[file.name] = 0
        setUploadProgress({ ...progress })
        
        const publicUrl = await uploadImageToStorage(file, 'panoramas')
        
        if (publicUrl) {
          // Auto-create panorama entry
          const panoramaData = {
            site_id: selectedSiteId,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: tourMode 
              ? `Part ${i + 1} of ${bulkFiles.length} - Virtual Tour` 
              : `Uploaded on ${new Date().toLocaleDateString()}`,
            image_url: publicUrl,
            is_active: i === 0, // First panorama becomes entry point (for both tour and single uploads)
            initial_view_h: 0,
            initial_view_v: 0,
            initial_fov: 75,
            floor_plan_x: 0,
            floor_plan_y: 0
          }
          
          const { data, error } = await supabase
            .from('panoramas')
            .insert([panoramaData])
            .select()
            .single()
          
          if (error) throw error
          
          if (data) {
            uploadedPanoramaIds.push(data.id)
          }
          
          progress[file.name] = 100
          setUploadProgress({ ...progress })
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        progress[file.name] = -1 // Error state
        setUploadProgress({ ...progress })
      }
    }
    
    // If in tour mode, auto-link the panoramas in sequence
    if (tourMode && uploadedPanoramaIds.length > 1) {
      try {
        const links = []
        for (let i = 0; i < uploadedPanoramaIds.length - 1; i++) {
          links.push({
            from_panorama_id: uploadedPanoramaIds[i],
            to_panorama_id: uploadedPanoramaIds[i + 1],
            position_x: 0,
            position_y: 0,
            position_z: -10, // Forward position
            rotation_y: 0,
            label: `Next: ${bulkFiles[i + 1].name.replace(/\.[^/.]+$/, "")}`
          })
          
          // Also create reverse links
          links.push({
            from_panorama_id: uploadedPanoramaIds[i + 1],
            to_panorama_id: uploadedPanoramaIds[i],
            position_x: 0,
            position_y: 0,
            position_z: 10, // Backward position
            rotation_y: 180,
            label: `Back: ${bulkFiles[i].name.replace(/\.[^/.]+$/, "")}`
          })
        }
        
        await supabase.from('panorama_links').insert(links)
      } catch (error) {
        console.error('Error linking panoramas:', error)
      }
    }
    
    // Refresh list and close modal
    setTimeout(() => {
      fetchPanoramas()
      fetchAllLinks()
      setBulkUploadMode(false)
      setBulkFiles([])
      setUploadProgress({})
      setTourMode(false)
      
      if (tourMode) {
        alert(`✅ Virtual tour created successfully!\n\n${uploadedPanoramaIds.length} panoramas uploaded and linked in sequence.\n\nThe first panorama is set as the "Entry Point" - visitors will start there and can navigate through the tour using the navigation hotspots.`)
      }
    }, 1000)
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

  const handleSceneClick = (point: { x: number; y: number; z: number }) => {
    if (!editingId || editingId === 'new') {
      alert('Please save the panorama first before adding markers or links.')
      return
    }
    
    if (linkCreationMode) {
      // Create a new navigation link
      const newLink: Partial<PanoramaLink> = {
        from_panorama_id: editingId,
        position_x: point.x,
        position_y: point.y,
        position_z: point.z,
        rotation_y: 0,
        label: 'Navigate',
        created_at: new Date().toISOString()
      }
      setSelectedLink(newLink)
      setShowLinkModal(true)
      setLinkCreationMode(false)
    } else {
      // Create a new marker
      const newMarker: Partial<PanoramaMarker> = {
        panorama_id: editingId,
        type: 'info',
        position_x: point.x,
        position_y: point.y,
        position_z: point.z,
        title: 'New Marker',
        content: '',
        created_at: new Date().toISOString()
      }
      setSelectedMarker(newMarker)
      setShowMarkerModal(true)
    }
  }

  const handleMarkerClick = (marker: PanoramaMarker) => {
    setSelectedMarker(marker)
    setShowMarkerModal(true)
  }

  const handleLinkClick = (link: PanoramaLink) => {
    setSelectedLink(link)
    setShowLinkModal(true)
  }

  const handleSaveLink = async () => {
    if (!selectedLink || !selectedLink.to_panorama_id) {
      alert('Please select a destination panorama')
      return
    }

    const linkData = {
      from_panorama_id: selectedLink.from_panorama_id,
      to_panorama_id: selectedLink.to_panorama_id,
      position_x: selectedLink.position_x,
      position_y: selectedLink.position_y,
      position_z: selectedLink.position_z,
      rotation_y: selectedLink.rotation_y || 0,
      label: selectedLink.label
    }

    let error
    if (selectedLink.id) {
      const { error: updateError } = await supabase
        .from('panorama_links')
        .update(linkData)
        .eq('id', selectedLink.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('panorama_links')
        .insert([linkData])
      error = insertError
    }

    if (error) {
      console.error('Error saving link:', error)
      alert('Error saving navigation link')
    } else {
      if (editingId) fetchLinks(editingId)
      fetchAllLinks()
      setShowLinkModal(false)
      setSelectedLink(null)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Delete this navigation link?')) return
    
    const { error } = await supabase.from('panorama_links').delete().eq('id', id)
    
    if (error) {
      console.error('Error deleting link:', error)
    } else {
      if (editingId) fetchLinks(editingId)
      fetchAllLinks()
    }
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
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">360° Panoramas by Site</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Panoramas are organized by map location. Select a site to manage its panoramas.
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">Loading...</div>
          ) : hotspots.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No sites found. Create sites in Map Manager first.
            </div>
          ) : (
            hotspots.map(site => {
              const sitePanoramas = panoramas.filter(p => p.site_id === site.id)
              const isExpanded = expandedSites.has(site.id)
              const entryPointPanorama = sitePanoramas.find(p => p.is_active)
              
              return (
                <div key={site.id} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  {/* Site Header */}
                  <div
                    className={`p-3 cursor-pointer transition-all ${
                      selectedSiteId === site.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => {
                      setSelectedSiteId(site.id)
                      toggleSite(site.id)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <svg 
                            className={`w-4 h-4 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {site.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1 ml-6">
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {sitePanoramas.length} {sitePanoramas.length === 1 ? 'panorama' : 'panoramas'}
                          </span>
                          {entryPointPanorama && (
                            <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Entry Point Set
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Site Action Buttons - Show when selected */}
                  {selectedSiteId === site.id && (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCreate()
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          Single
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCreateVirtualTour()
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Tour
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Panoramas List - Show when expanded */}
                  {isExpanded && sitePanoramas.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      {sitePanoramas.map(panorama => {
                        const linkedFrom = panoramas.filter(p => 
                          links.some(l => l.from_panorama_id === p.id && l.to_panorama_id === panorama.id)
                        )
                        const linkedTo = panoramas.filter(p => 
                          links.some(l => l.from_panorama_id === panorama.id && l.to_panorama_id === p.id)
                        )
                        const totalLinks = linkedFrom.length + linkedTo.length
                        
                        return (
                          <div
                            key={panorama.id}
                            className={`p-3 mx-2 my-1 rounded-lg border cursor-pointer transition-all ${
                              editingId === panorama.id
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm'
                                : 'border-gray-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => handleEdit(panorama)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                  {panorama.title}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  {panorama.is_active && (
                                    <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                      </svg>
                                      Entry Point
                                    </span>
                                  )}
                                  {totalLinks > 0 && (
                                    <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                      </svg>
                                      {totalLinks} {totalLinks === 1 ? 'link' : 'links'}
                                    </span>
                                  )}
                                </div>
                                {panorama.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                    {panorama.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 flex justify-end space-x-2">
                              {!panorama.is_active && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleSetActive(panorama.id); }}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                  title="Set as entry point - this panorama will load first when visitors click the map marker"
                                >
                                  Set as Entry Point
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(panorama.id); }}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <DeleteIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  
                  {/* Empty State */}
                  {isExpanded && sitePanoramas.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900/30">
                      No panoramas yet. Click "Single" or "Tour" above to add.
                    </div>
                  )}
                </div>
              )
            })
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
                {editForm.image_url && (
                  <button
                    onClick={() => setPreviewMode(true)}
                    className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </button>
                )}
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
                  {/* Info Banner */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">About Entry Points & Tours</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {editForm.site_id && (
                            <>Site: <strong>{hotspots.find(h => h.id === editForm.site_id)?.name}</strong></>
                          )}
                        </p>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 mt-2">
                          <li>• <strong>Entry Point</strong>: The panorama that loads first when visitors click the map marker</li>
                          <li>• <strong>Linked Panoramas</strong>: Visitors can navigate between linked panoramas using navigation hotspots</li>
                          <li>• All panoramas in a tour are accessible once visitors enter the entry point</li>
                        </ul>
                      </div>
                    </div>
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
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2">Visual Editor</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                          {linkCreationMode 
                            ? '🎯 Click anywhere to place a navigation hotspot that visitors will use to travel to another panorama.' 
                            : 'Click to add info markers. Use the button below to add navigation links between panoramas.'}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLinkCreationMode(!linkCreationMode)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2 ${
                              linkCreationMode
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            {linkCreationMode ? 'Cancel Link Mode' : 'Add Navigation Link'}
                          </button>
                          {links.length > 0 && (
                            <span className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                              {links.length} {links.length === 1 ? 'link' : 'links'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-black min-h-[400px]">
                    {editForm.image_url ? (
                      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
                        <PanoramaScene 
                          imageUrl={editForm.image_url}
                          markers={markers}
                          links={links}
                          allPanoramas={panoramas}
                          onSceneClick={handleSceneClick}
                          onMarkerClick={handleMarkerClick}
                          onLinkClick={handleLinkClick}
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

      {/* Link Edit Modal */}
      {showLinkModal && selectedLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {selectedLink.id ? 'Edit Navigation Link' : 'New Navigation Link'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination Panorama</label>
                <select
                  value={selectedLink.to_panorama_id || ''}
                  onChange={e => setSelectedLink({ ...selectedLink, to_panorama_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">-- Select Destination --</option>
                  {panoramas
                    .filter(p => p.id !== editingId && p.site_id === editForm.site_id)
                    .map(panorama => (
                      <option key={panorama.id} value={panorama.id}>
                        {panorama.title}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Visitors will travel to this panorama when they click the navigation hotspot
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                <input
                  type="text"
                  value={selectedLink.label || ''}
                  onChange={e => setSelectedLink({ ...selectedLink, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Go to Entrance, Next Area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rotation (Y-axis degrees)</label>
                <input
                  type="number"
                  value={selectedLink.rotation_y || 0}
                  onChange={e => setSelectedLink({ ...selectedLink, rotation_y: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Optional: Rotate the arrow to point in a specific direction
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Position: ({selectedLink.position_x?.toFixed(2)}, {selectedLink.position_y?.toFixed(2)}, {selectedLink.position_z?.toFixed(2)})
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                {selectedLink.id && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this navigation link?')) {
                        handleDeleteLink(selectedLink.id!)
                        setShowLinkModal(false)
                      }
                    }}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mr-auto"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewMode && editForm.image_url && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => setPreviewMode(false)}
              className="px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close Preview
            </button>
          </div>
          
          <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <div className="font-medium">{editForm.title}</div>
            <div className="text-sm text-gray-300">Preview Mode</div>
          </div>

          <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
            <PanoramaScene 
              imageUrl={editForm.image_url}
              markers={markers}
              links={links}
              allPanoramas={panoramas}
              onMarkerClick={(m) => {
                setSelectedMarker(m)
                setShowMarkerModal(true)
              }}
              onLinkClick={handleLinkClick}
            />
          </Canvas>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {bulkUploadMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tourMode ? '🗺️ Create Virtual Tour' : '📸 Add Panoramas'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {tourMode 
                      ? 'Upload multiple 360° images to create a connected virtual tour' 
                      : 'Upload one or more panorama images'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setBulkUploadMode(false)
                    setBulkFiles([])
                    setUploadProgress({})
                    setTourMode(false)
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {bulkFiles.length === 0 ? (
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-16 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      setBulkFiles(files)
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                        {tourMode ? 'Drop your tour images here' : 'Drop panorama images here'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        or click to browse • Supports JPG, PNG • Multiple files
                      </p>
                    </div>
                    {tourMode && (
                      <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700 max-w-md">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                              How Virtual Tours Work:
                            </p>
                            <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                              <li>• Upload images in the order visitors will explore</li>
                              <li>• We'll automatically create navigation hotspots between them</li>
                              <li>• The <strong>first image</strong> becomes the "Entry Point" (loads when clicking map marker)</li>
                              <li>• Visitors can then navigate through ALL panoramas using the hotspots</li>
                              <li>• You can add custom markers and descriptions later</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {bulkFiles.length} {bulkFiles.length === 1 ? 'File' : 'Files'} Selected
                      </span>
                      {tourMode && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                          Will be linked in order
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setBulkFiles([])}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {bulkFiles.map((file, index) => {
                      const progress = uploadProgress[file.name]
                      const isUploading = progress !== undefined && progress >= 0 && progress < 100
                      const hasError = progress === -1
                      const isComplete = progress === 100

                      return (
                        <div 
                          key={index}
                          className="relative group flex gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                        >
                          {tourMode && (
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md z-10">
                              {index + 1}
                            </div>
                          )}
                          
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-600 flex-shrink-0 shadow-md">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            
                            {isUploading && (
                              <div className="mt-2">
                                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Uploading... {Math.round(progress)}%</p>
                              </div>
                            )}
                            
                            {isComplete && (
                              <div className="mt-2 flex items-center gap-1 text-green-600 dark:text-green-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs font-medium">Uploaded</span>
                              </div>
                            )}
                            
                            {hasError && (
                              <div className="mt-2 flex items-center gap-1 text-red-600 dark:text-red-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-medium">Failed</span>
                              </div>
                            )}
                          </div>
                          
                          {!isUploading && !isComplete && (
                            <button
                              onClick={() => setBulkFiles(files => files.filter((_, i) => i !== index))}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setBulkUploadMode(false)
                    setBulkFiles([])
                    setUploadProgress({})
                    setTourMode(false)
                  }}
                  className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                {bulkFiles.length > 0 && Object.keys(uploadProgress).length === 0 && (
                  <button
                    onClick={handleBulkUpload}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all flex items-center gap-2 font-semibold shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload {bulkFiles.length} {bulkFiles.length === 1 ? 'Panorama' : 'Panoramas'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
