import { useState, useMemo } from 'react'
import AdminFeedbacks from './AdminFeedbacks'
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon, EyeIcon } from './Icons'
import { SpeciesDetail } from '../data/mati-hotspots'
import { useData } from '../context/DataContext'
import { supabase } from '../supabaseClient'

interface AdminPanelProps {
  isVisible: boolean
  onClose: () => void
}

interface SpeciesFormData {
  id: string
  category: 'flora' | 'fauna'
  commonName: string
  scientificName: string
  status: 'DD' | 'LC' | 'NT' | 'VU' | 'EN' | 'CR'
  habitat: string
  blurb: string
  siteIds: string[]
  highlights: string[]
  images: string[]
  arModelUrl?: string
}

const emptySpecies: SpeciesFormData = {
  id: '',
  category: 'flora',
  commonName: '',
  scientificName: '',
  status: 'LC',
  habitat: '',
  blurb: '',
  siteIds: [],
  highlights: [],
  images: [],
  arModelUrl: undefined
}

export default function AdminPanel({ isVisible, onClose }: AdminPanelProps) {
  const { species, createSpecies, updateSpecies, deleteSpecies } = useData()
  const [showFeedbacks, setShowFeedbacks] = useState(false)
  const [editingSpecies, setEditingSpecies] = useState<SpeciesFormData | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'flora' | 'fauna'>('all')
  const [previewImage, setPreviewImage] = useState<string>('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [speciesToDelete, setSpeciesToDelete] = useState<SpeciesDetail | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [imageModalUrl, setImageModalUrl] = useState('')
  const [imageModalFile, setImageModalFile] = useState<File | null>(null)
  const [arModelFile, setArModelFile] = useState<File | null>(null)
  const [uploadingArModel, setUploadingArModel] = useState(false)

  const filteredSpecies = useMemo(() => {
    return species.filter(s => {
      const matchesSearch = s.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [species, searchQuery, selectedCategory])

  const statusOptions = [
    { value: 'DD', label: 'Data Deficient', color: 'gray' },
    { value: 'LC', label: 'Least Concern', color: 'green' },
    { value: 'NT', label: 'Near Threatened', color: 'lime' },
    { value: 'VU', label: 'Vulnerable', color: 'yellow' },
    { value: 'EN', label: 'Endangered', color: 'orange' },
    { value: 'CR', label: 'Critically Endangered', color: 'red' }
  ]

  const siteOptions = [
    'mount-hamiguitan-sanctuary',
    'pujada-bay-protected-seascape',
    'dahican-beach-mayo-bay',
    'sleeping-dinosaur-island',
    'guang-guang-mangrove-reserve',
    'mati-protected-landscape'
  ]

  const handleCreate = () => {
    setIsCreating(true)
    setEditingSpecies({ ...emptySpecies })
  }

  const handleEdit = (speciesItem: SpeciesDetail) => {
    setIsCreating(false)
    setEditingSpecies({
      id: speciesItem.id,
      category: speciesItem.category,
      commonName: speciesItem.commonName,
      scientificName: speciesItem.scientificName,
      status: speciesItem.status as any,
      habitat: speciesItem.habitat,
      blurb: speciesItem.blurb,
      siteIds: speciesItem.siteIds || [],
      highlights: speciesItem.highlights || [],
      images: speciesItem.images || [],
      arModelUrl: speciesItem.arModelUrl
    })
  }

  const handleSave = async () => {
    if (!editingSpecies) return

    console.log('[AdminPanel] Saving species:', editingSpecies.commonName, 'Creating:', isCreating)

    if (isCreating) {
      // Add new species - generate ID if empty
      const newSpeciesData: SpeciesDetail = {
        ...editingSpecies,
        id: editingSpecies.id || `species-${Date.now()}`,
        highlights: editingSpecies.highlights.filter(h => h.trim())
      }
      console.log('[AdminPanel] Creating new species:', newSpeciesData)
      const ok = await createSpecies(newSpeciesData)
      if (ok) {
        setEditingSpecies(null)
        setIsCreating(false)
        alert('✅ Species saved successfully!')
      } else {
        alert('❌ Failed to save species. Check console for details.')
      }
    } else {
      // Update existing species
      const updates = {
        ...editingSpecies,
        highlights: editingSpecies.highlights.filter(h => h.trim())
      }
      console.log('[AdminPanel] Updating species:', editingSpecies.id)
      const ok = await updateSpecies(editingSpecies.id, updates)
      if (ok) {
        setEditingSpecies(null)
        setIsCreating(false)
        alert('✅ Species updated successfully!')
      } else {
        alert('❌ Failed to update species. Check console for details.')
      }
    }
  }

  const handleDelete = (species: SpeciesDetail) => {
    setSpeciesToDelete(species)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (speciesToDelete) {
      deleteSpecies(speciesToDelete.id)
      alert('✅ Species deleted successfully!')
      setShowDeleteConfirm(false)
      setSpeciesToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setSpeciesToDelete(null)
  }

  const handleCancel = () => {
    setEditingSpecies(null)
    setIsCreating(false)
  }

  const addHighlight = () => {
    if (editingSpecies) {
      setEditingSpecies({
        ...editingSpecies,
        highlights: [...editingSpecies.highlights, '']
      })
    }
  }

  const removeHighlight = (index: number) => {
    if (editingSpecies) {
      setEditingSpecies({
        ...editingSpecies,
        highlights: editingSpecies.highlights.filter((_, i) => i !== index)
      })
    }
  }

  const addImage = () => {
    setImageModalUrl('')
    setImageModalFile(null)
    setShowImageModal(true)
  }

  const handleImageModalConfirm = () => {
    if (!editingSpecies) return

    if (imageModalFile) {
      // Handle file upload
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          setEditingSpecies({
            ...editingSpecies,
            images: [...editingSpecies.images, result]
          })
        }
        setShowImageModal(false)
        setImageModalUrl('')
        setImageModalFile(null)
      }
      reader.onerror = () => {
        alert('Failed to read image file.')
      }
      reader.readAsDataURL(imageModalFile)
    } else if (imageModalUrl.trim()) {
      // Handle URL
      setEditingSpecies({
        ...editingSpecies,
        images: [...editingSpecies.images, imageModalUrl.trim()]
      })
      setShowImageModal(false)
      setImageModalUrl('')
      setImageModalFile(null)
    } else {
      alert('Please provide either a URL or select a file.')
    }
  }

  const handleImageModalCancel = () => {
    setShowImageModal(false)
    setImageModalUrl('')
    setImageModalFile(null)
  }

  const removeImage = (index: number) => {
    if (editingSpecies) {
      setEditingSpecies({
        ...editingSpecies,
        images: editingSpecies.images.filter((_, i) => i !== index)
      })
    }
  }

  const handleArModelUpload = async (file: File) => {
    if (!editingSpecies) return
    
    setUploadingArModel(true)
    try {
      // Validate file type
      const validExtensions = ['.gltf', '.glb']
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
      if (!validExtensions.includes(fileExtension)) {
        alert('Please upload a glTF (.gltf) or GLB (.glb) file.')
        setUploadingArModel(false)
        return
      }

      // Upload to Supabase Storage
      const fileName = `ar-models/${editingSpecies.id || 'temp'}-${Date.now()}${fileExtension}`
      const { data, error } = await supabase.storage
        .from('species-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('species-assets')
        .getPublicUrl(fileName)

      setEditingSpecies({
        ...editingSpecies,
        arModelUrl: urlData.publicUrl
      })
      alert('✅ AR model uploaded successfully!')
    } catch (error) {
      console.error('AR model upload error:', error)
      alert('❌ Failed to upload AR model. Check console for details.')
    } finally {
      setUploadingArModel(false)
      setArModelFile(null)
    }
  }

  const handleArModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArModelFile(file)
      handleArModelUpload(file)
    }
  }

  const removeArModel = () => {
    if (editingSpecies) {
      setEditingSpecies({
        ...editingSpecies,
        arModelUrl: undefined
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2">
      <div className="group relative rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-white/20 shadow-2xl w-full max-w-[92vw] h-[85vh] sm:h-[90vh] lg:h-[93vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Header */}
        <div className="relative z-10 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">🌿 Species Administration</h2>
              <p className="text-white/90 text-lg">Manage biodiversity data for Mati City&apos;s natural heritage</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Feedback toggle - only visible to admins since AdminPanel is admin-only */}
              <button
                type="button"
                onClick={() => setShowFeedbacks(s => !s)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold"
              >
                Feedback
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs">{(() => {
                  try { const raw = localStorage.getItem('mati-feedback:v1'); return raw ? JSON.parse(raw).length : 0 } catch { return 0 }
                })()}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="group relative overflow-hidden bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12"
              >
                <CancelIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 flex h-full">
          {/* Species List */}
          <div className="w-1/2 border-r border-white/20 dark:border-white/10 p-8 overflow-y-auto">
            {/* Controls */}
            <div className="space-y-6 mb-8">
              <button
                type="button"
                onClick={handleCreate}
                className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-3 justify-center">
                  <PlusIcon className="w-6 h-6" />
                  ✨ Add New Species
                </span>
              </button>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="🔍 Search species..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 text-lg font-medium"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 text-lg font-medium"
                >
                  <option value="all">🌍 All Types</option>
                  <option value="flora">🌱 Flora</option>
                  <option value="fauna">🦎 Fauna</option>
                </select>
              </div>
            </div>

            {/* Species Cards */}
            <div className="space-y-3">
              {filteredSpecies.map(speciesItem => (
                <div
                  key={speciesItem.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        {speciesItem.commonName}
                      </h3>
                      <p className="text-sm italic text-gray-600 dark:text-gray-400">
                        {speciesItem.scientificName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          speciesItem.category === 'flora' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                          {speciesItem.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          speciesItem.status === 'CR' ? 'bg-red-100 text-red-700' :
                          speciesItem.status === 'EN' ? 'bg-orange-100 text-orange-700' :
                          speciesItem.status === 'VU' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {speciesItem.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 relative z-10">
                      <button
                        type="button"
                        onClick={() => handleEdit(speciesItem)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={false}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(speciesItem)
                        }}
                        className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          <div className="w-1/2 p-8 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/20">
            {editingSpecies ? (
              <div className="space-y-6">
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {isCreating ? '✨ Create New Species' : '📝 Edit Species'}
                        </h3>
                        <p className="text-white/80 text-sm">Fill in the details below</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={addImage}
                        className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold backdrop-blur-sm transition-all duration-300 hover:scale-105"
                      >
                        <PlusIcon className="w-5 h-5" />
                        Display Image
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 text-emerald-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <SaveIcon className="w-5 h-5" />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold backdrop-blur-sm transition-all duration-300 hover:scale-105"
                      >
                        <CancelIcon className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields with Enhanced Styling */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg space-y-6 border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Species ID
                      </label>
                      <input
                        type="text"
                        value={editingSpecies.id}
                        onChange={(e) => setEditingSpecies({...editingSpecies, id: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all group-hover:border-purple-300 dark:group-hover:border-purple-700"
                        placeholder="unique-species-id"
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        Category
                      </label>
                      <select
                        value={editingSpecies.category}
                        onChange={(e) => setEditingSpecies({...editingSpecies, category: e.target.value as any})}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all group-hover:border-emerald-300 dark:group-hover:border-emerald-700 cursor-pointer"
                      >
                        <option value="flora">🌱 Flora (Plants)</option>
                        <option value="fauna">🦊 Fauna (Animals)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Common Name
                      </label>
                      <input
                        type="text"
                        value={editingSpecies.commonName}
                        onChange={(e) => setEditingSpecies({...editingSpecies, commonName: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group-hover:border-blue-300 dark:group-hover:border-blue-700"
                        placeholder="e.g., Philippine Eagle"
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Scientific Name
                      </label>
                      <input
                        type="text"
                        value={editingSpecies.scientificName}
                        onChange={(e) => setEditingSpecies({...editingSpecies, scientificName: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 italic transition-all group-hover:border-indigo-300 dark:group-hover:border-indigo-700"
                        placeholder="Genus species"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Conservation Status
                    </label>
                    <select
                      value={editingSpecies.status}
                      onChange={(e) => setEditingSpecies({...editingSpecies, status: e.target.value as any})}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all group-hover:border-amber-300 dark:group-hover:border-amber-700 cursor-pointer"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.value === 'CR' ? '🔴' : option.value === 'EN' ? '🟠' : option.value === 'VU' ? '🟡' : option.value === 'NT' ? '⚠️' : option.value === 'LC' ? '✅' : '❓'} {option.value} - {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Habitat
                    </label>
                    <input
                      type="text"
                      value={editingSpecies.habitat}
                      onChange={(e) => setEditingSpecies({...editingSpecies, habitat: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all group-hover:border-teal-300 dark:group-hover:border-teal-700"
                      placeholder="e.g., Tropical rainforests, mountainous regions"
                    />
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Description
                    </label>
                    <textarea
                      value={editingSpecies.blurb}
                      onChange={(e) => setEditingSpecies({...editingSpecies, blurb: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all group-hover:border-slate-300 dark:group-hover:border-slate-700 resize-none"
                      placeholder="Provide a detailed description..."
                    />
                  </div>
                </div>

                {/* Sites */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Sites Found
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {siteOptions.map(site => (
                      <label key={site} className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all hover:border-green-300 dark:hover:border-green-700">
                        <input
                          type="checkbox"
                          checked={editingSpecies.siteIds.includes(site)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingSpecies({
                                ...editingSpecies,
                                siteIds: [...editingSpecies.siteIds, site]
                              })
                            } else {
                              setEditingSpecies({
                                ...editingSpecies,
                                siteIds: editingSpecies.siteIds.filter(s => s !== site)
                              })
                            }
                          }}
                          className="rounded w-5 h-5 text-green-500 focus:ring-2 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {site.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Key Highlights
                    </label>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editingSpecies.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2 group">
                        <div className="flex-1 relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => {
                              const newHighlights = [...editingSpecies.highlights]
                              newHighlights[index] = e.target.value
                              setEditingSpecies({...editingSpecies, highlights: newHighlights})
                            }}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                            placeholder="Enter a key highlight..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all hover:scale-105 shadow-md"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AR Model */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                    AR 3D Model (.gltf / .glb)
                  </label>
                  
                  {editingSpecies.arModelUrl ? (
                    <div className="border-2 border-purple-200 dark:border-purple-600 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {editingSpecies.arModelUrl.split('/').pop()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            AR model uploaded
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeArModel}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all hover:scale-105"
                          title="Remove AR model"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept=".gltf,.glb"
                        onChange={handleArModelFileChange}
                        disabled={uploadingArModel}
                        className="w-full px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {uploadingArModel && (
                        <p className="text-sm text-purple-600 dark:text-purple-400 animate-pulse">
                          ⏳ Uploading AR model...
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Upload a 3D model in glTF or GLB format. This will be used for AR viewing.
                      </p>
                    </div>
                  )}
                </div>

                {/* Images */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Images ({editingSpecies.images.length})
                  </label>
                  <div className="space-y-3">
                    {editingSpecies.images.map((image, index) => (
                      <div key={index} className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-slate-700/50 dark:to-blue-900/10 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          {/* Image Preview Thumbnail */}
                          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                            {image ? (
                              <img 
                                src={image} 
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3E✕%3C/text%3E%3C/svg%3E'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* Image Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {image.startsWith('data:') ? '📁 Uploaded Image' : '🔗 ' + image}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {image.startsWith('data:') ? 'Base64 encoded' : 'External URL'}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {image && (
                              <button
                                type="button"
                                onClick={() => setPreviewImage(image)}
                                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-all hover:scale-105"
                                title="Preview image"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all hover:scale-105"
                              title="Remove image"
                            >
                              <DeleteIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              showFeedbacks ? (
                <AdminFeedbacks />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-12 max-w-md">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-3xl" />
                      <div className="relative bg-gradient-to-br from-gray-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/30 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                        <svg className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                      No Species Selected
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Select a species from the list to edit, or click the "Add New Species" button to create one
                    </p>
                    <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-500 justify-center">
                      <span>💡</span>
                      <span>Tip: Use the search bar to find species quickly</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4" onClick={() => setPreviewImage('')}>
          <div className="max-w-4xl max-h-full">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Add Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add Image
            </h3>
            
            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Paste Image URL
                </label>
                <input
                  type="url"
                  value={imageModalUrl}
                  onChange={(e) => {
                    setImageModalUrl(e.target.value)
                    setImageModalFile(null) // Clear file if URL is entered
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-semibold">OR</span>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Upload Local Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setImageModalFile(file)
                        setImageModalUrl('') // Clear URL if file is selected
                      }
                    }}
                    className="flex-1 text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-pink-500 file:to-purple-500 file:text-white hover:file:from-pink-600 hover:file:to-purple-600 file:shadow-md file:transition-all"
                  />
                </div>
                {imageModalFile && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ {imageModalFile.name} selected
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleImageModalConfirm}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Add Image
              </button>
              <button
                type="button"
                onClick={handleImageModalCancel}
                className="flex-1 px-5 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-bold transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && speciesToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <DeleteIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Delete Species
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>"{speciesToDelete.commonName}"</strong>?
                <br />
                <span className="text-sm text-red-600 dark:text-red-400">
                  This action cannot be undone.
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}