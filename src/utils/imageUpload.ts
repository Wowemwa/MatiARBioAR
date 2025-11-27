import { supabase } from '../supabaseClient'
import { setupStorageBuckets } from './storageSetup'

/**
 * Ensures that a storage bucket exists, creating it if necessary
 * @param bucketName The name of the bucket to ensure exists
 * @returns Promise<void>
 */
async function ensureBucketExists(bucketName: string): Promise<void> {
  try {
    // Try to list objects in the bucket to check if it exists
    const { error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 })

    if (error && error.message.includes('not found')) {
      console.log(`[ImageUpload] Bucket '${bucketName}' not found, attempting to create it...`)

      // Try to create the bucket with proper configuration
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })

      if (createError) {
        console.error(`[ImageUpload] Failed to create bucket '${bucketName}':`, createError)

        // If bucket creation fails, provide helpful instructions
        if (createError.message.includes('permission') || createError.message.includes('unauthorized')) {
          throw new Error(`Storage bucket '${bucketName}' doesn't exist and cannot be created automatically due to insufficient permissions. Please run the storage setup script or ask a Supabase administrator to create the storage buckets using this SQL command:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('${bucketName}', '${bucketName}', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;`)
        } else {
          throw new Error(`Storage bucket '${bucketName}' is not available. Please contact an administrator to set up the storage buckets.`)
        }
      }

      console.log(`[ImageUpload] Successfully created bucket '${bucketName}'`)
    }
  } catch (error) {
    console.error(`[ImageUpload] Error ensuring bucket '${bucketName}' exists:`, error)
    throw error
  }
}

/**
 * Uploads an image file to Supabase Storage and returns the public URL
 * @param file The image file to upload
 * @param bucket The storage bucket to upload to (default: 'species-images')
 * @returns Promise<string> The public URL of the uploaded image
 */
export async function uploadImageToStorage(file: File, bucket = 'species-images'): Promise<string> {
  try {
    // Ensure the bucket exists before attempting upload
    await ensureBucketExists(bucket)

    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `species/${fileName}`

    console.log(`[ImageUpload] Uploading ${file.name} to ${bucket}/${filePath}`)

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('[ImageUpload] Upload error:', error)
      throw error
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    console.log(`[ImageUpload] Upload successful: ${publicUrl}`)
    return publicUrl

  } catch (error) {
    console.error('[ImageUpload] Failed to upload image:', error)
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Uploads multiple image files to Supabase Storage
 * @param files Array of image files to upload
 * @param bucket The storage bucket to upload to (default: 'species-images')
 * @returns Promise<string[]> Array of public URLs for the uploaded images
 */
export async function uploadImagesToStorage(files: File[], bucket = 'species-images'): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImageToStorage(file, bucket))
  return Promise.all(uploadPromises)
}

/**
 * Validates if a file is an image
 * @param file The file to validate
 * @returns boolean True if the file is a valid image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize
}