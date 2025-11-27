import { supabase } from '../supabaseClient'

/**
 * Sets up the required storage buckets for the application
 * This should be run once during initial setup or when buckets are missing
 */
export async function setupStorageBuckets(): Promise<void> {
  console.log('[StorageSetup] Setting up storage buckets...')

  const buckets = [
    {
      id: 'species-images',
      name: 'species-images',
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    },
    {
      id: 'species-models',
      name: 'species-models',
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['model/gltf-binary', 'application/octet-stream']
    },
    {
      id: 'species-audio',
      name: 'species-audio',
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
    },
    {
      id: 'site-media',
      name: 'site-media',
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4']
    },
    {
      id: 'ar-patterns',
      name: 'ar-patterns',
      public: true,
      fileSizeLimit: 1024000, // 1MB
      allowedMimeTypes: ['text/plain', 'application/octet-stream']
    },
    {
      id: 'ar-markers',
      name: 'ar-markers',
      public: true,
      fileSizeLimit: 2097152, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg']
    }
  ]

  for (const bucket of buckets) {
    try {
      console.log(`[StorageSetup] Checking bucket: ${bucket.id}`)

      // Check if bucket exists
      const { error: listError } = await supabase.storage
        .from(bucket.id)
        .list('', { limit: 1 })

      if (listError && listError.message.includes('not found')) {
        console.log(`[StorageSetup] Creating bucket: ${bucket.id}`)

        const { error: createError } = await supabase.storage.createBucket(bucket.id, {
          public: bucket.public,
          allowedMimeTypes: bucket.allowedMimeTypes,
          fileSizeLimit: bucket.fileSizeLimit
        })

        if (createError) {
          console.error(`[StorageSetup] Failed to create bucket ${bucket.id}:`, createError)
          if (createError.message.includes('permission') || createError.message.includes('unauthorized')) {
            console.error(`[StorageSetup] No permission to create buckets. Please run this SQL in your Supabase dashboard:`)
            console.error(`
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('${bucket.id}', '${bucket.name}', ${bucket.public}, ${bucket.fileSizeLimit}, ARRAY[${bucket.allowedMimeTypes.map(type => `'${type}'`).join(', ')}])
ON CONFLICT (id) DO NOTHING;
            `)
          }
        } else {
          console.log(`[StorageSetup] Successfully created bucket: ${bucket.id}`)
        }
      } else {
        console.log(`[StorageSetup] Bucket ${bucket.id} already exists`)
      }
    } catch (error) {
      console.error(`[StorageSetup] Error setting up bucket ${bucket.id}:`, error)
    }
  }

  console.log('[StorageSetup] Storage bucket setup complete')
}