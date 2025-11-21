import { createContext, ReactNode, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { Hotspot, SpeciesDetail } from '../data/mati-hotspots'
import { addActivityLog } from '../utils/activityLog'

export interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  description: string
}

type DataContextValue = {
  hotspots: Hotspot[]
  species: SpeciesDetail[]
  unifiedSpecies: UnifiedSpecies[]
  teamMembers: TeamMember[]
  loading: boolean
  error?: string
  refresh: () => Promise<void>
  // Admin CRUD operations
  createSpecies: (species: SpeciesDetail) => Promise<boolean>
  updateSpecies: (id: string, updates: Partial<SpeciesDetail>) => Promise<boolean>
  deleteSpecies: (id: string) => void
  // Team members CRUD operations
  createTeamMember: (member: TeamMember) => void
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void
  deleteTeamMember: (id: string) => void
  resetToDefault: () => void
}

export interface UnifiedSpecies {
  id: string
  commonName: string
  scientificName: string
  status: SpeciesDetail['status']
  type: SpeciesDetail['category']
  description: string
  habitats: string[]
  siteIds: string[]
  endemic?: boolean
  media?: { type: 'image', url: string, caption?: string, credit?: string }[]
}

function buildUnifiedSpecies({ species }: { species: SpeciesDetail[] }): UnifiedSpecies[] {
  return species.map((record) => ({
    id: record.id,
    commonName: record.commonName,
    scientificName: record.scientificName,
    status: record.status,
    type: record.category,
    description: record.blurb,
    habitats: record.habitat ? [record.habitat] : [],
    siteIds: record.siteIds ?? [],
    endemic: undefined,
    media: record.images ? record.images.map(url => ({
      type: 'image' as const,
      url,
      caption: `${record.commonName} (${record.scientificName})`,
      credit: 'Wikimedia Commons'
    })) : undefined,
  }))
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

const SPECIES_STORAGE_KEY = 'mati-species-data:v1'
const TEAM_STORAGE_KEY = 'mati-team-data:v1'

// Default team members
const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Team Member 1',
    role: 'Lead Researcher',
    image: '/path/to/photo1.jpg',
    description: 'Leading biodiversity research and conservation efforts'
  },
  {
    id: '2',
    name: 'Team Member 2',
    role: 'Senior Developer',
    image: '/path/to/photo2.jpg',
    description: 'Building innovative AR solutions for conservation'
  },
  {
    id: '3',
    name: 'Team Member 3',
    role: 'Full Stack Developer',
    image: '/path/to/photo3.jpg',
    description: 'Developing web platform and data visualization tools'
  }
]

export function DataProvider({ children }: DataProviderProps) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [species, setSpecies] = useState<SpeciesDetail[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Load data from Supabase
  const hydrate = useCallback(async (force = false) => {
    // Skip loading if data is already loaded and not forced
    if (dataLoaded && !force) {
      return
    }

    try {
      setLoading(true)
      setError(undefined)

      // Load all data in parallel for better performance with timeout
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout after 10 seconds')), 10000)
      )

      const dataPromise = Promise.all([
        supabase.from('sites').select('*').order('name'),
        supabase.from('species').select('*').order('common_name'),
        supabase.from('species_sites').select('*'),
        supabase.from('team_members').select('*').order('sort_order')
      ])

      const results = await Promise.race([dataPromise, timeout])
      
      if (!Array.isArray(results)) {
        throw new Error('Database query timeout')
      }

      const [sitesResult, speciesResult, speciesSitesResult, teamResult] = results

      // Check for errors
      if (sitesResult.error) throw sitesResult.error
      if (speciesResult.error) throw speciesResult.error
      if (speciesSitesResult.error) throw speciesSitesResult.error
      if (teamResult.error) throw teamResult.error

      const sitesData = sitesResult.data || []
      const speciesData = speciesResult.data || []
      const speciesSitesData = speciesSitesResult.data || []
      const teamData = teamResult.data || []

      // Transform sites data to match Hotspot interface
      const transformedSites: Hotspot[] = sitesData.map((site: any) => ({
        id: site.id,
        name: site.name,
        type: (site.type === 'freshwater' || site.type === 'mixed' ? 'marine' : site.type) as 'marine' | 'terrestrial', // Map unsupported types to marine
        barangay: site.barangay,
        city: site.city,
        province: site.province,
        designation: site.designation,
        areaHectares: site.area_hectares,
        lat: site.lat,
        lng: site.lng,
        elevationRangeMeters: site.elevation_range_meters,
        summary: site.summary,
        description: site.description,
        features: site.features || [],
        stewardship: site.stewardship,
        image: site.image_url,
        tags: site.tags || [],
        visitorNotes: site.visitor_notes,
        // Map species relationships
        highlightSpeciesIds: [], // Will be populated below
        floraIds: [],
        faunaIds: []
      }))

      // Transform species data to match SpeciesDetail interface
      const transformedSpecies: SpeciesDetail[] = speciesData.map((species: any) => {
        const speciesSiteRelations = speciesSitesData?.filter((rel: any) => rel.species_id === species.id) || []
        const siteIds = speciesSiteRelations.map((rel: any) => rel.site_id)

        return {
          id: species.id,
          category: species.category as 'flora' | 'fauna',
          commonName: species.common_name,
          scientificName: species.scientific_name,
          status: species.conservation_status as SpeciesDetail['status'] || 'LC',
          blurb: species.description,
          habitat: species.habitat,
          siteIds: siteIds,
          highlights: species.key_facts || [], // Map key_facts to highlights
          images: species.image_urls || [], // Load images from image_urls column
          arExperienceUrl: species.ar_model_url || undefined, // Load AR experience URL
          arModelScale: species.ar_model_scale || 1.0, // Load AR model scale
          arModelRotation: species.ar_model_rotation || { x: 0, y: 0, z: 0 }, // Load AR model rotation
          arViewerHtml: species.ar_viewer_html || undefined, // Load AR viewer HTML
          arMarkerImageUrl: species.ar_marker_image_url || undefined, // Load AR marker image URL
          arPatternUrl: species.ar_pattern_url || undefined, // Load AR pattern URL
          // Additional fields from Supabase
          kingdom: species.kingdom,
          phylum: species.phylum,
          class: species.class,
          taxonomic_order: species.taxonomic_order,
          family: species.family,
          genus: species.genus,
          species: species.species,
          authorship: species.authorship,
          synonyms: species.synonyms,
          endemic: species.endemic,
          invasive: species.invasive,
          key_facts: species.key_facts,
          diet: species.diet,
          behavior: species.behavior,
          reproduction: species.reproduction,
          ecosystem_services: species.ecosystem_services,
          phenology: species.phenology,
          interactions: species.interactions,
          growth_form: species.growth_form,
          leaf_type: species.leaf_type,
          flowering_period: species.flowering_period,
          ethnobotanical_uses: species.ethnobotanical_uses,
          mobility: species.mobility,
          activity_pattern: species.activity_pattern,
          size: species.size,
          weight: species.weight,
          lifespan: species.lifespan,
          population_trend: species.population_trend,
          threats: species.threats,
          conservation_actions: species.conservation_actions,
          legal_protection: species.legal_protection,
          reference_sources: species.reference_sources
        }
      })

      // Update hotspots with species relationships
      const updatedSites = transformedSites.map(site => {
        const siteSpeciesRelations = speciesSitesData?.filter((rel: any) => rel.site_id === site.id) || []
        const highlightSpeciesIds = siteSpeciesRelations
          .filter((rel: any) => rel.is_highlight)
          .map((rel: any) => rel.species_id)

        const siteSpecies = transformedSpecies.filter(species =>
          siteSpeciesRelations.some((rel: any) => rel.species_id === species.id)
        )

        return {
          ...site,
          highlightSpeciesIds,
          floraIds: siteSpecies.filter(s => s.category === 'flora').map(s => s.id),
          faunaIds: siteSpecies.filter(s => s.category === 'fauna').map(s => s.id)
        }
      })

      // Transform team members data
      const transformedTeam: TeamMember[] = teamData.map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        image: member.avatar_url || '/default-avatar.jpg',
        description: member.bio || ''
      }))

      // Update state
      setHotspots(updatedSites)
      setSpecies(transformedSpecies)
      setTeamMembers(transformedTeam)
      setDataLoaded(true)

    } catch (err) {
      console.error('[DataProvider] failed to load data from Supabase', err)
      setError('Unable to load biodiversity data from database. Please try again later.')
      // Note: No longer falling back to local sample data - database is the source of truth
      setHotspots([])
      setSpecies([])
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }, [dataLoaded])

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  // Listen for service worker updates and refresh data when cache is cleared
  useEffect(() => {
    const handleServiceWorkerUpdate = () => {
      console.log('[DataContext] Service worker updated, refreshing data...')
      setDataLoaded(false)
      void hydrate(true)
    }

    // Listen for service worker controller change (when SW updates)
    const handleControllerChange = () => {
      console.log('[DataContext] Service worker controller changed, refreshing data...')
      setDataLoaded(false)
      void hydrate(true)
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
      
      // Also listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_CLEARED') {
          console.log('[DataContext] Cache cleared by service worker, refreshing data...')
          setDataLoaded(false)
          void hydrate(true)
        }
      })
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
      }
    }
  }, [hydrate])

  // Note: Data is now stored in Supabase, localStorage is no longer used for persistence

  // Admin CRUD operations - now work with Supabase
  const createSpecies = useCallback(async (newSpecies: SpeciesDetail) => {
    try {
      console.log('[DataContext] Creating species in Supabase:', newSpecies.commonName)

      // Only include fields that are actually provided and not null/undefined
      const insertData: any = {
        id: newSpecies.id,
        category: newSpecies.category,
        common_name: newSpecies.commonName,
        scientific_name: newSpecies.scientificName,
        conservation_status: newSpecies.status,
        description: newSpecies.blurb,
        habitat: newSpecies.habitat,
        key_facts: newSpecies.highlights || [],
        image_urls: newSpecies.images || [],
        ar_model_url: newSpecies.arExperienceUrl || null,
        ar_marker_image_url: newSpecies.arMarkerImageUrl || null,
        ar_model_scale: newSpecies.arModelScale || 1.0,
        ar_model_rotation: newSpecies.arModelRotation || { x: 0, y: 0, z: 0 },
        ar_pattern_url: newSpecies.arPatternUrl || null,
        ar_viewer_html: newSpecies.arViewerHtml || null
      }

      // Only add optional taxonomic fields if they exist
      if (newSpecies.kingdom) insertData.kingdom = newSpecies.kingdom
      if (newSpecies.phylum) insertData.phylum = newSpecies.phylum
      if (newSpecies.class) insertData.class = newSpecies.class
      if (newSpecies.taxonomic_order) insertData.taxonomic_order = newSpecies.taxonomic_order
      if (newSpecies.family) insertData.family = newSpecies.family
      if (newSpecies.genus) insertData.genus = newSpecies.genus
      if (newSpecies.species) insertData.species = newSpecies.species
      if (newSpecies.authorship) insertData.authorship = newSpecies.authorship
      if (newSpecies.synonyms) insertData.synonyms = newSpecies.synonyms
      if (newSpecies.endemic !== undefined) insertData.endemic = newSpecies.endemic
      if (newSpecies.invasive !== undefined) insertData.invasive = newSpecies.invasive
      if (newSpecies.diet) insertData.diet = newSpecies.diet
      if (newSpecies.behavior) insertData.behavior = newSpecies.behavior
      if (newSpecies.reproduction) insertData.reproduction = newSpecies.reproduction
      if (newSpecies.ecosystem_services) insertData.ecosystem_services = newSpecies.ecosystem_services
      if (newSpecies.phenology) insertData.phenology = newSpecies.phenology
      if (newSpecies.interactions) insertData.interactions = newSpecies.interactions
      if (newSpecies.growth_form) insertData.growth_form = newSpecies.growth_form
      if (newSpecies.leaf_type) insertData.leaf_type = newSpecies.leaf_type
      if (newSpecies.flowering_period) insertData.flowering_period = newSpecies.flowering_period
      if (newSpecies.ethnobotanical_uses) insertData.ethnobotanical_uses = newSpecies.ethnobotanical_uses
      if (newSpecies.mobility) insertData.mobility = newSpecies.mobility
      if (newSpecies.activity_pattern) insertData.activity_pattern = newSpecies.activity_pattern
      if (newSpecies.size) insertData.size = newSpecies.size
      if (newSpecies.weight) insertData.weight = newSpecies.weight
      if (newSpecies.lifespan) insertData.lifespan = newSpecies.lifespan
      if (newSpecies.population_trend) insertData.population_trend = newSpecies.population_trend
      if (newSpecies.threats) insertData.threats = newSpecies.threats
      if (newSpecies.conservation_actions) insertData.conservation_actions = newSpecies.conservation_actions
      if (newSpecies.legal_protection) insertData.legal_protection = newSpecies.legal_protection
      if (newSpecies.reference_sources) insertData.reference_sources = newSpecies.reference_sources

      // Insert into Supabase species table
      const { data, error } = await supabase
        .from('species')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error

      // Insert species-site relationships
      if (newSpecies.siteIds && newSpecies.siteIds.length > 0) {
        const relationships = newSpecies.siteIds.map(siteId => ({
          species_id: newSpecies.id,
          site_id: siteId,
          is_highlight: false // Default to not highlighted
        }))

        const { error: relError } = await supabase
          .from('species_sites')
          .upsert(relationships, { 
            onConflict: 'species_id,site_id' 
          })

        if (relError) {
          console.error('[DataContext] Failed to create species-site relationships:', relError)
          // Don't throw - species was created successfully, just log the error
        }
      }

  // Update local state
  setSpecies(prev => [...prev, newSpecies])
  console.log('[DataContext] Species created successfully in Supabase')

      // Log activity
      addActivityLog({
        type: 'create',
        entityType: 'species',
        entityId: newSpecies.id,
        entityName: newSpecies.commonName,
        details: `Created ${newSpecies.category} species: ${newSpecies.scientificName}`
      })

      // Log activity
      addActivityLog({
        type: 'create',
        entityType: 'species',
        entityId: newSpecies.id,
        entityName: newSpecies.commonName,
        details: `Created ${newSpecies.category} species: ${newSpecies.scientificName}`
      })

      return true
    } catch (err) {
      console.error('[DataContext] Failed to create species in Supabase:', err)
      // Fallback to local state only
      setSpecies(prev => [...prev, newSpecies])
      
      // Log activity even on fallback
      addActivityLog({
        type: 'create',
        entityType: 'species',
        entityId: newSpecies.id,
        entityName: newSpecies.commonName,
        details: `Created ${newSpecies.category} species: ${newSpecies.scientificName}`
      })

      return false
    }
  }, [])

  const updateSpecies = useCallback(async (id: string, updates: Partial<SpeciesDetail>) => {
    try {
      console.log('[DataContext] Updating species in Supabase:', id, updates)

      // Update in Supabase species table
      const supabaseUpdates: any = {}
      if (updates.category) supabaseUpdates.category = updates.category
      if (updates.commonName) supabaseUpdates.common_name = updates.commonName
      if (updates.scientificName) supabaseUpdates.scientific_name = updates.scientificName
      if (updates.status) supabaseUpdates.conservation_status = updates.status
      if (updates.blurb) supabaseUpdates.description = updates.blurb
      if (updates.habitat) supabaseUpdates.habitat = updates.habitat
      if (updates.highlights) supabaseUpdates.key_facts = updates.highlights
      if (updates.images !== undefined) supabaseUpdates.image_urls = updates.images // Save images to image_urls column
      if (updates.arExperienceUrl !== undefined) supabaseUpdates.ar_model_url = updates.arExperienceUrl // Save AR experience URL
      if (updates.arModelScale !== undefined) supabaseUpdates.ar_model_scale = updates.arModelScale // Save AR model scale
      if (updates.arModelRotation !== undefined) supabaseUpdates.ar_model_rotation = updates.arModelRotation // Save AR model rotation
      if (updates.arViewerHtml !== undefined) supabaseUpdates.ar_viewer_html = updates.arViewerHtml // Save AR viewer HTML
      if (updates.arMarkerImageUrl !== undefined) supabaseUpdates.ar_marker_image_url = updates.arMarkerImageUrl // Save AR marker image URL
      if (updates.arPatternUrl !== undefined) supabaseUpdates.ar_pattern_url = updates.arPatternUrl // Save AR pattern URL

      // Add other fields if they exist in updates, but skip client-only keys
      const skipKeys = ['commonName', 'scientificName', 'status', 'blurb', 'habitat', 'highlights', 'images', 'arModelUrl', 'arPatternUrl', 'arModelScale', 'arModelRotation', 'arViewerHtml', 'arMarkerImageUrl', 'arExperienceUrl', 'category', 'siteIds', 'id']
      Object.keys(updates).forEach(key => {
        if (key in supabaseUpdates) return // Already handled
        if (skipKeys.includes(key)) return // Skip client-only/mapped keys
        supabaseUpdates[key] = (updates as any)[key]
      })

      const { error } = await supabase
        .from('species')
        .update(supabaseUpdates)
        .eq('id', id)

      if (error) throw error

      // Update local state
      setSpecies(prev => prev.map(s =>
        s.id === id ? { ...s, ...updates } : s
      ))
      console.log('[DataContext] Species updated successfully in Supabase')

      // Log activity
      const updatedSpecies = species.find(s => s.id === id)
      if (updatedSpecies) {
        const changeDetails = []
        if (updates.commonName) changeDetails.push(`name to "${updates.commonName}"`)
        if (updates.status) changeDetails.push(`status to ${updates.status}`)
        if (updates.images) changeDetails.push(`images (${updates.images.length} total)`)
        
        addActivityLog({
          type: 'update',
          entityType: 'species',
          entityId: id,
          entityName: updates.commonName || updatedSpecies.commonName,
          details: changeDetails.length > 0 ? `Updated ${changeDetails.join(', ')}` : 'Updated species information'
        })
      }

      return true
    } catch (err) {
      console.error('[DataContext] Failed to update species in Supabase:', err)
      // Fallback to local state only
      setSpecies(prev => prev.map(s =>
        s.id === id ? { ...s, ...updates } : s
      ))
      
      // Log activity even on fallback
      const updatedSpecies = species.find(s => s.id === id)
      if (updatedSpecies) {
        addActivityLog({
          type: 'update',
          entityType: 'species',
          entityId: id,
          entityName: updates.commonName || updatedSpecies.commonName,
          details: 'Updated species information'
        })
      }

      return false
    }
  }, [species])

  const deleteSpecies = useCallback(async (id: string) => {
    // Get species info before deleting for logging
    const speciesItem = species.find(s => s.id === id)
    
    try {
      console.log('[DataContext] Deleting species from Supabase:', id)

      // Delete from Supabase (this will cascade to species_sites due to foreign key constraints)
      const { error } = await supabase
        .from('species')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state
      setSpecies(prev => prev.filter(s => s.id !== id))
      console.log('[DataContext] Species deleted successfully from Supabase')

      // Log activity
      if (speciesItem) {
        addActivityLog({
          type: 'delete',
          entityType: 'species',
          entityId: id,
          entityName: speciesItem.commonName,
          details: `Deleted ${speciesItem.category} species: ${speciesItem.scientificName}`
        })
      }

    } catch (err) {
      console.error('[DataContext] Failed to delete species from Supabase:', err)
      // Fallback to local state only
      setSpecies(prev => prev.filter(s => s.id !== id))
      
      // Log activity even on fallback
      if (speciesItem) {
        addActivityLog({
          type: 'delete',
          entityType: 'species',
          entityId: id,
          entityName: speciesItem.commonName,
          details: `Deleted ${speciesItem.category} species: ${speciesItem.scientificName}`
        })
      }
    }
  }, [species])

  // Team members CRUD operations - now work with Supabase
  const createTeamMember = useCallback(async (newMember: TeamMember) => {
    try {
      console.log('[DataContext] Creating team member in Supabase:', newMember.name)

      const { data, error } = await supabase
        .from('team_members')
        .insert({
          name: newMember.name,
          role: newMember.role,
          bio: newMember.description,
          avatar_url: newMember.image,
          is_active: true,
          sort_order: teamMembers.length // Add to end
        })
        .select()
        .single()

      if (error) throw error

      // Update local state with the returned data (including the generated UUID)
      const createdMember = {
        id: data.id,
        name: data.name,
        role: data.role,
        image: data.avatar_url || '/default-avatar.jpg',
        description: data.bio || ''
      }

      setTeamMembers(prev => [...prev, createdMember])
      console.log('[DataContext] Team member created successfully in Supabase')

    } catch (err) {
      console.error('[DataContext] Failed to create team member in Supabase:', err)
      // Fallback to local state only
      setTeamMembers(prev => [...prev, newMember])
    }
  }, [teamMembers.length])

  const updateTeamMember = useCallback(async (id: string, updates: Partial<TeamMember>) => {
    try {
      console.log('[DataContext] Updating team member in Supabase:', id, updates)

      const supabaseUpdates: any = {}
      if (updates.name) supabaseUpdates.name = updates.name
      if (updates.role) supabaseUpdates.role = updates.role
      if (updates.description) supabaseUpdates.bio = updates.description
      if (updates.image) supabaseUpdates.avatar_url = updates.image

      const { error } = await supabase
        .from('team_members')
        .update(supabaseUpdates)
        .eq('id', id)

      if (error) throw error

      // Update local state
      setTeamMembers(prev => prev.map(m =>
        m.id === id ? { ...m, ...updates } : m
      ))
      console.log('[DataContext] Team member updated successfully in Supabase')

    } catch (err) {
      console.error('[DataContext] Failed to update team member in Supabase:', err)
      // Fallback to local state only
      setTeamMembers(prev => prev.map(m =>
        m.id === id ? { ...m, ...updates } : m
      ))
    }
  }, [])

  const deleteTeamMember = useCallback(async (id: string) => {
    try {
      console.log('[DataContext] Deleting team member from Supabase:', id)

      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state
      setTeamMembers(prev => prev.filter(m => m.id !== id))
      console.log('[DataContext] Team member deleted successfully from Supabase')

    } catch (err) {
      console.error('[DataContext] Failed to delete team member from Supabase:', err)
      // Fallback to local state only
      setTeamMembers(prev => prev.filter(m => m.id !== id))
    }
  }, [])

  const resetToDefault = useCallback(async () => {
    console.log('[DataContext] Resetting to Supabase data')
    setDataLoaded(false) // Force reload
    await hydrate(true) // Force refresh
  }, [hydrate])

  const value = useMemo<DataContextValue>(() => ({
    hotspots,
    species,
    unifiedSpecies: buildUnifiedSpecies({ species }),
    teamMembers,
    loading,
    error,
    refresh: async () => {
      setDataLoaded(false)
      await hydrate(true)
    },
    createSpecies,
    updateSpecies,
    deleteSpecies,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    resetToDefault,
  }), [hotspots, species, teamMembers, loading, error, hydrate, createSpecies, updateSpecies, deleteSpecies, createTeamMember, updateTeamMember, deleteTeamMember, resetToDefault])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
