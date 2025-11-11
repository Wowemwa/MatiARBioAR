import { createContext, ReactNode, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { MATI_HOTSPOTS as HOTSPOTS, MATI_SPECIES as SPECIES, Hotspot, SpeciesDetail } from '../data/mati-hotspots'
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

  // Load data from Supabase
  const hydrate = useCallback(async () => {
    try {
      setLoading(true)
      setError(undefined)

      // Fetch sites from Supabase
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select('*')
        .order('name')

      if (sitesError) throw sitesError

      // Transform sites data to match Hotspot interface
      const transformedSites: Hotspot[] = (sitesData || []).map(site => ({
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

      setHotspots(transformedSites)

      // Fetch species from Supabase
      const { data: speciesData, error: speciesError } = await supabase
        .from('species')
        .select('*')
        .order('common_name')

      if (speciesError) throw speciesError

      // Fetch species-site relationships
      const { data: speciesSitesData, error: speciesSitesError } = await supabase
        .from('species_sites')
        .select('*')

      if (speciesSitesError) throw speciesSitesError

      // Transform species data to match SpeciesDetail interface
      const transformedSpecies: SpeciesDetail[] = (speciesData || []).map(species => {
        const speciesSiteRelations = speciesSitesData?.filter(rel => rel.species_id === species.id) || []
        const siteIds = speciesSiteRelations.map(rel => rel.site_id)
        const highlightRelations = speciesSiteRelations.filter(rel => rel.is_highlight)

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
          arModelUrl: species.ar_model_url || undefined, // Load AR model URL
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

      setSpecies(transformedSpecies)

      // Update hotspots with species relationships
      const updatedSites = transformedSites.map(site => {
        const siteSpeciesRelations = speciesSitesData?.filter(rel => rel.site_id === site.id) || []
        const highlightSpeciesIds = siteSpeciesRelations
          .filter(rel => rel.is_highlight)
          .map(rel => rel.species_id)

        const siteSpecies = transformedSpecies.filter(species =>
          siteSpeciesRelations.some(rel => rel.species_id === species.id)
        )

        return {
          ...site,
          highlightSpeciesIds,
          floraIds: siteSpecies.filter(s => s.category === 'flora').map(s => s.id),
          faunaIds: siteSpecies.filter(s => s.category === 'fauna').map(s => s.id)
        }
      })

      setHotspots(updatedSites)

      // Fetch team members from Supabase
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order')

      if (teamError) throw teamError

      // Transform team members data
      const transformedTeam: TeamMember[] = (teamData || []).map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        image: member.avatar_url || '/default-avatar.jpg',
        description: member.bio || ''
      }))

      setTeamMembers(transformedTeam)

    } catch (err) {
      console.error('[DataProvider] failed to load data from Supabase', err)
      setError('Unable to load biodiversity data from database. Please try again later.')
      // Fallback to local data
      setHotspots(HOTSPOTS)
      setSpecies(SPECIES)
      setTeamMembers(DEFAULT_TEAM_MEMBERS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  // Note: Data is now stored in Supabase, localStorage is no longer used for persistence

  // Admin CRUD operations - now work with Supabase
  const createSpecies = useCallback(async (newSpecies: SpeciesDetail) => {
    try {
      console.log('[DataContext] Creating species in Supabase:', newSpecies.commonName)

      // Insert into Supabase species table
      const { data, error } = await supabase
        .from('species')
        .insert({
          id: newSpecies.id,
          category: newSpecies.category,
          common_name: newSpecies.commonName,
          scientific_name: newSpecies.scientificName,
          conservation_status: newSpecies.status,
          description: newSpecies.blurb,
          habitat: newSpecies.habitat,
          key_facts: newSpecies.highlights,
          image_urls: newSpecies.images || [], // Save images to image_urls column
          ar_model_url: newSpecies.arModelUrl || null, // Save AR model URL
          kingdom: newSpecies.kingdom,
          phylum: newSpecies.phylum,
          class: newSpecies.class,
          taxonomic_order: newSpecies.taxonomic_order,
          family: newSpecies.family,
          genus: newSpecies.genus,
          species: newSpecies.species,
          authorship: newSpecies.authorship,
          synonyms: newSpecies.synonyms,
          endemic: newSpecies.endemic,
          invasive: newSpecies.invasive,
          diet: newSpecies.diet,
          behavior: newSpecies.behavior,
          reproduction: newSpecies.reproduction,
          ecosystem_services: newSpecies.ecosystem_services,
          phenology: newSpecies.phenology,
          interactions: newSpecies.interactions,
          growth_form: newSpecies.growth_form,
          leaf_type: newSpecies.leaf_type,
          flowering_period: newSpecies.flowering_period,
          ethnobotanical_uses: newSpecies.ethnobotanical_uses,
          mobility: newSpecies.mobility,
          activity_pattern: newSpecies.activity_pattern,
          size: newSpecies.size,
          weight: newSpecies.weight,
          lifespan: newSpecies.lifespan,
          population_trend: newSpecies.population_trend,
          threats: newSpecies.threats,
          conservation_actions: newSpecies.conservation_actions,
          legal_protection: newSpecies.legal_protection,
          reference_sources: newSpecies.reference_sources
        })
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
          .insert(relationships)

        if (relError) throw relError
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
      if (updates.arModelUrl !== undefined) supabaseUpdates.ar_model_url = updates.arModelUrl // Save AR model URL

      // Add other fields if they exist in updates, but skip client-only keys
      const skipKeys = ['commonName', 'scientificName', 'status', 'blurb', 'habitat', 'highlights', 'images', 'arModelUrl', 'category', 'siteIds', 'id']
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
    await hydrate() // Refresh from Supabase
  }, [hydrate])

  const value = useMemo<DataContextValue>(() => ({
    hotspots,
    species,
    unifiedSpecies: buildUnifiedSpecies({ species }),
    teamMembers,
    loading,
    error,
    refresh: async () => hydrate(),
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
