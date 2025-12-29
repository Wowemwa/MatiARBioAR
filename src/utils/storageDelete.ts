import { supabase } from '../supabaseClient'

/**
 * Extracts the file path from a Supabase storage URL
 * @param url The full Supabase storage URL
 * @param bucket The bucket name
 * @returns The file path within the bucket, or null if not a valid storage URL
 */
export function extractFilePathFromUrl(url: string, bucket: string): string | null {
  if (!url) return null

  try {
    const urlObj = new URL(url)
    // Supabase storage URLs typically look like:
    // https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === bucket)

    if (bucketIndex === -1 || bucketIndex >= pathParts.length - 1) {
      return null
    }

    // Extract everything after the bucket name
    return pathParts.slice(bucketIndex + 1).join('/')
  } catch {
    return null
  }
}

/**
 * Deletes a file from Supabase storage
 * @param bucket The storage bucket name
 * @param filePath The file path within the bucket
 * @returns Promise<boolean> True if deleted successfully, false otherwise
 */
export async function deleteFileFromStorage(bucket: string, filePath: string): Promise<boolean> {
  try {
    if (!bucket || !filePath) {
      console.warn('[StorageDelete] Invalid bucket or filePath provided')
      return false
    }

    console.log(`[StorageDelete] Deleting file from ${bucket}/${filePath}`)

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('[StorageDelete] Error deleting file:', error)
      return false
    }

    console.log(`[StorageDelete] Successfully deleted file: ${bucket}/${filePath}`)
    return true
  } catch (error) {
    console.error('[StorageDelete] Failed to delete file:', error)
    return false
  }
}

/**
 * Deletes multiple files from Supabase storage
 * @param bucket The storage bucket name
 * @param filePaths Array of file paths within the bucket
 * @returns Promise<boolean> True if all files deleted successfully, false if any failed
 */
export async function deleteFilesFromStorage(bucket: string, filePaths: string[]): Promise<boolean> {
  try {
    if (!bucket || !filePaths.length) {
      console.warn('[StorageDelete] Invalid bucket or empty filePaths array')
      return false
    }

    // Filter out empty paths
    const validPaths = filePaths.filter(path => path && path.trim())

    if (!validPaths.length) {
      console.warn('[StorageDelete] No valid file paths provided')
      return false
    }

    console.log(`[StorageDelete] Deleting ${validPaths.length} files from ${bucket}`)

    const { error } = await supabase.storage
      .from(bucket)
      .remove(validPaths)

    if (error) {
      console.error('[StorageDelete] Error deleting files:', error)
      return false
    }

    console.log(`[StorageDelete] Successfully deleted ${validPaths.length} files from ${bucket}`)
    return true
  } catch (error) {
    console.error('[StorageDelete] Failed to delete files:', error)
    return false
  }
}

/**
 * Safely deletes a database record and its associated storage files
 * @param table The database table name
 * @param recordId The record ID to delete
 * @param fileUrls Array of storage URLs to delete before removing the record
 * @returns Promise<{success: boolean, error?: string}> Result of the operation
 */
export async function deleteRecordWithFiles(
  table: string,
  recordId: string,
  fileUrls: string[] = []
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[StorageDelete] Starting safe deletion of ${table} record: ${recordId}`)

    // First, delete associated storage files
    if (fileUrls.length > 0) {
      console.log(`[StorageDelete] Deleting ${fileUrls.length} associated files`)

      for (const url of fileUrls) {
        if (!url) continue

        // Determine bucket based on URL pattern or file type
        let bucket = 'species-images' // default

        if (url.includes('/panoramas/')) {
          bucket = 'panoramas'
        } else if (url.includes('/models_3d/') || url.includes('.gltf') || url.includes('.glb')) {
          bucket = 'models_3d'
        } else if (url.includes('/species-models/')) {
          bucket = 'species-models'
        } else if (url.includes('/species-audio/') || url.includes('.mp3') || url.includes('.wav')) {
          bucket = 'species-audio'
        } else if (url.includes('/site-media/')) {
          bucket = 'site-media'
        } else if (url.includes('/ar-patterns/')) {
          bucket = 'ar-patterns'
        } else if (url.includes('/ar-markers/')) {
          bucket = 'ar-markers'
        }

        const filePath = extractFilePathFromUrl(url, bucket)
        if (filePath) {
          await deleteFileFromStorage(bucket, filePath)
        } else {
          console.warn(`[StorageDelete] Could not extract file path from URL: ${url}`)
        }
      }
    }

    // Then delete the database record
    console.log(`[StorageDelete] Deleting database record from ${table}`)

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', recordId)

    if (error) {
      console.error('[StorageDelete] Error deleting database record:', error)
      return { success: false, error: error.message }
    }

    console.log(`[StorageDelete] Successfully deleted ${table} record: ${recordId}`)
    return { success: true }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[StorageDelete] Failed to delete record with files:', error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Safely deletes a panorama and its associated files
 * @param panoramaId The panorama ID to delete
 * @returns Promise<{success: boolean, error?: string}> Result of the operation
 */
export async function deletePanoramaWithFiles(panoramaId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the panorama data to know what files to delete
    const { data: panorama, error: fetchError } = await supabase
      .from('panoramas')
      .select('image_url, thumbnail_url')
      .eq('id', panoramaId)
      .single()

    if (fetchError) {
      console.error('[StorageDelete] Error fetching panorama data:', fetchError)
      return { success: false, error: fetchError.message }
    }

    const fileUrls: string[] = []
    if (panorama.image_url) fileUrls.push(panorama.image_url)
    if (panorama.thumbnail_url) fileUrls.push(panorama.thumbnail_url)

    return await deleteRecordWithFiles('panoramas', panoramaId, fileUrls)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[StorageDelete] Failed to delete panorama with files:', error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Safely deletes a panorama marker and its associated files
 * @param markerId The marker ID to delete
 * @returns Promise<{success: boolean, error?: string}> Result of the operation
 */
export async function deletePanoramaMarkerWithFiles(markerId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the marker data to know what files to delete
    const { data: marker, error: fetchError } = await supabase
      .from('panorama_markers')
      .select('icon_url, model_url')
      .eq('id', markerId)
      .single()

    if (fetchError) {
      console.error('[StorageDelete] Error fetching marker data:', fetchError)
      return { success: false, error: fetchError.message }
    }

    const fileUrls: string[] = []
    if (marker.icon_url) fileUrls.push(marker.icon_url)
    if (marker.model_url) fileUrls.push(marker.model_url)

    return await deleteRecordWithFiles('panorama_markers', markerId, fileUrls)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[StorageDelete] Failed to delete marker with files:', error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Safely deletes a species and its associated files
 * @param speciesId The species ID to delete
 * @returns Promise<{success: boolean, error?: string}> Result of the operation
 */
export async function deleteSpeciesWithFiles(speciesId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the species data to know what files to delete
    const { data: species, error: fetchError } = await supabase
      .from('species')
      .select('image_urls, ar_model_url, ar_pattern_url, ar_marker_image_url, audio_url')
      .eq('id', speciesId)
      .single()

    if (fetchError) {
      console.error('[StorageDelete] Error fetching species data:', fetchError)
      return { success: false, error: fetchError.message }
    }

    const fileUrls: string[] = []
    if (species.image_urls && Array.isArray(species.image_urls)) {
      fileUrls.push(...species.image_urls.filter(url => url))
    }
    if (species.ar_model_url) fileUrls.push(species.ar_model_url)
    if (species.ar_pattern_url) fileUrls.push(species.ar_pattern_url)
    if (species.ar_marker_image_url) fileUrls.push(species.ar_marker_image_url)
    if (species.audio_url) fileUrls.push(species.audio_url)

    return await deleteRecordWithFiles('species', speciesId, fileUrls)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[StorageDelete] Failed to delete species with files:', error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Safely deletes a site and its associated image
 * @param siteId The site ID to delete
 * @returns Promise<{success: boolean, error?: string}> Result of the operation
 */
export async function deleteSiteWithFiles(siteId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the site data to know what files to delete
    const { data: site, error: fetchError } = await supabase
      .from('sites')
      .select('image_url')
      .eq('id', siteId)
      .single()

    if (fetchError) {
      console.error('[StorageDelete] Error fetching site data:', fetchError)
      return { success: false, error: fetchError.message }
    }

    const fileUrls: string[] = []
    if (site.image_url) fileUrls.push(site.image_url)

    return await deleteRecordWithFiles('sites', siteId, fileUrls)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[StorageDelete] Failed to delete site with files:', error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Safely deletes a team member and their avatar
 * @param memberId The team member ID to delete
 * @returns Promise<{success: boolean, error?: string}> Result of the operation
 */
export async function deleteTeamMemberWithFiles(memberId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the team member data to know what files to delete
    const { data: member, error: fetchError } = await supabase
      .from('team_members')
      .select('avatar_url')
      .eq('id', memberId)
      .single()

    if (fetchError) {
      console.error('[StorageDelete] Error fetching team member data:', fetchError)
      return { success: false, error: fetchError.message }
    }

    const fileUrls: string[] = []
    if (member.avatar_url) fileUrls.push(member.avatar_url)

    return await deleteRecordWithFiles('team_members', memberId, fileUrls)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[StorageDelete] Failed to delete team member with files:', error)
    return { success: false, error: errorMessage }
  }
}