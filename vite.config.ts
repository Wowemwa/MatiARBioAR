import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Exclude node_modules from Fast Refresh
      include: "**/*.{jsx,tsx}",
    })
  ],
  
  // Build optimizations
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false, // Disable source maps for production
    cssCodeSplit: true, // Enable CSS code splitting
    
    rollupOptions: {
      output: {
        // Optimize chunk splitting for better caching
        manualChunks: {
          // Core React libraries
          vendor: ['react', 'react-dom'],
          
          // Router library
          router: ['react-router-dom'],
          
          // Map library (heavy)
          leaflet: ['leaflet'],
          
          // AR libraries (heavy)
          ar: ['aframe', '@ar-js-org/ar.js', 'ar.js'],
          
          // Utility libraries
          utils: ['clsx', 'fuse.js', 'html5-qrcode', 'html2canvas']
        },
        
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'index'
            : 'index';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Terser optimization options
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.info', 'console.debug', 'console.warn'], // Remove specific console methods
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        safari10: true, // Fix Safari 10 issues
      },
      format: {
        comments: false, // Remove comments
      }
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Asset inlining threshold
    assetsInlineLimit: 4096
  },
  
  // Development optimizations
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'leaflet',
      'clsx'
    ],
    exclude: [] // No exclusions needed
  },
  
  // Development server configuration
  server: {
    hmr: {
      overlay: false // Disable error overlay for cleaner dev experience
    },
    // Enable compression in dev mode
    middlewareMode: false,
  },
  
  // Performance optimizations
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@context': '/src/context'
    }
  },
  
  // CSS optimizations
  css: {
    devSourcemap: false, // Disable CSS source maps in development
  },
  
  // Preview server configuration (for production preview)
  preview: {
    port: 4173,
    strictPort: true,
  }
})
