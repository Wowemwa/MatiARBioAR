import { useState, useMemo } from 'react'
import AdminFeedbacks from './AdminFeedbacks'
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon, EyeIcon } from './Icons'
import { SpeciesDetail } from '../data/mati-hotspots'
import { useData } from '../context/DataContext'

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
  images: []
}

export default function AdminPanel({ isVisible, onClose }: AdminPanelProps) {
  const { species, createSpecies, updateSpecies, deleteSpecies } = useData()
  const [showFeedbacks, setShowFeedbacks] = useState(false)
  const [editingSpecies, setEditingSpecies] = useState<SpeciesFormData | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'flora' | 'fauna'>('all')
  const [previewImage, setPreviewImage] = useState<string>('')

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
      images: speciesItem.images || []
    })
  }

  const handleSave = () => {
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
      createSpecies(newSpeciesData)
    } else {
      // Update existing species
      const updates = {
        ...editingSpecies,
        highlights: editingSpecies.highlights.filter(h => h.trim())
      }
      console.log('[AdminPanel] Updating species:', editingSpecies.id)
      updateSpecies(editingSpecies.id, updates)
    }

    setEditingSpecies(null)
    setIsCreating(false)
    alert('✅ Species saved successfully!')
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this species? This action cannot be undone.')) {
      console.log('[AdminPanel] Deleting species:', id)
      deleteSpecies(id)
      alert('✅ Species deleted successfully!')
    }
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
    if (editingSpecies) {
      setEditingSpecies({
        ...editingSpecies,
        images: [...editingSpecies.images, '']
      })
    }
  }

  const removeImage = (index: number) => {
    if (editingSpecies) {
      setEditingSpecies({
        ...editingSpecies,
        images: editingSpecies.images.filter((_, i) => i !== index)
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="group relative rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-white/20 shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden">
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
                onClick={() => setShowFeedbacks(s => !s)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold"
              >
                Feedback
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs">{(() => {
                  try { const raw = localStorage.getItem('mati-feedback:v1'); return raw ? JSON.parse(raw).length : 0 } catch { return 0 }
                })()}</span>
              </button>

              <button
                onClick={onClose}
                className="group relative overflow-hidden bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12"
              >
                <CancelIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex h-full">
          {/* Species List */}
          <div className="w-1/2 border-r border-white/20 dark:border-white/10 p-8 overflow-y-auto">
            {/* Controls */}
            <div className="space-y-6 mb-8">
              <button
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(speciesItem)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(speciesItem.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
          <div className="w-1/2 p-6 overflow-y-auto">
            {editingSpecies ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {isCreating ? 'Create New Species' : 'Edit Species'}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                      <SaveIcon className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                    >
                      <CancelIcon className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Species ID
                    </label>
                    <input
                      type="text"
                      value={editingSpecies.id}
                      onChange={(e) => setEditingSpecies({...editingSpecies, id: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                      placeholder="unique-species-id"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={editingSpecies.category}
                      onChange={(e) => setEditingSpecies({...editingSpecies, category: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="flora">Flora</option>
                      <option value="fauna">Fauna</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Common Name
                    </label>
                    <input
                      type="text"
                      value={editingSpecies.commonName}
                      onChange={(e) => setEditingSpecies({...editingSpecies, commonName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Scientific Name
                    </label>
                    <input
                      type="text"
                      value={editingSpecies.scientificName}
                      onChange={(e) => setEditingSpecies({...editingSpecies, scientificName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                      placeholder="Genus species"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Conservation Status
                  </label>
                  <select
                    value={editingSpecies.status}
                    onChange={(e) => setEditingSpecies({...editingSpecies, status: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.value} - {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Habitat
                  </label>
                  <input
                    type="text"
                    value={editingSpecies.habitat}
                    onChange={(e) => setEditingSpecies({...editingSpecies, habitat: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingSpecies.blurb}
                    onChange={(e) => setEditingSpecies({...editingSpecies, blurb: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Sites */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Sites Found
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {siteOptions.map(site => (
                      <label key={site} className="flex items-center gap-2">
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
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {site.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Key Highlights
                    </label>
                    <button
                      onClick={addHighlight}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingSpecies.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => {
                            const newHighlights = [...editingSpecies.highlights]
                            newHighlights[index] = e.target.value
                            setEditingSpecies({...editingSpecies, highlights: newHighlights})
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onClick={() => removeHighlight(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Images
                    </label>
                    <button
                      onClick={addImage}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Add Image
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingSpecies.images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => {
                            const newImages = [...editingSpecies.images]
                            newImages[index] = e.target.value
                            setEditingSpecies({...editingSpecies, images: newImages})
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                          placeholder="https://example.com/image.jpg"
                        />
                        {image && (
                          <button
                            onClick={() => setPreviewImage(image)}
                            className="px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeImage(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              showFeedbacks ? (
                <AdminFeedbacks />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <EditIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a species to edit or create a new one</p>
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
    </div>
  )
}