import { setupStorageBuckets } from './utils/storageSetup'

// This script can be run in the browser console to set up storage buckets
// Usage: Copy and paste this into the browser console when logged in as admin

console.log('Setting up storage buckets...')
setupStorageBuckets()
  .then(() => {
    console.log('Storage buckets setup complete!')
  })
  .catch((error) => {
    console.error('Failed to setup storage buckets:', error)
  })

// Export for use in other scripts
export { setupStorageBuckets }