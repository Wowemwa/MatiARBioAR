# AR.js Implementation Guide - Pattern-Based Marker Tracking

## Overview

This guide documents the migration from MindAR to AR.js with pattern-based marker tracking for the Mati Biodiversity platform. AR.js uses custom pattern markers that can be generated from any image, providing a more flexible and reliable AR experience.

## What Changed

### Database Schema Updates

New columns added to `species` table:
- `ar_pattern_url` - URL to the .patt pattern file for AR.js recognition
- `ar_marker_image_url` - URL to the marker image (PNG/JPG) displayed to users
- `ar_viewer_html` - Optional custom HTML for specialized AR viewers

Removed:
- `qr_code_data` - No longer using QR codes for AR activation

### Storage Buckets

New Supabase storage buckets required:
1. **ar-patterns** - Stores .patt pattern files
2. **ar-markers** - Stores marker images (PNG/JPG)
3. **species-models** - Stores 3D models (.glb) [existing]

### Upload Flow

For each species with AR content, admins must upload:

1. **3D Model (.glb)** - The 3D representation shown in AR
2. **Pattern File (.patt)** - Generated from the marker image for recognition
3. **Marker Image (PNG/JPG)** - Displayed to users for scanning

## How to Use

### 1. Generate AR Pattern and Marker

#### Option A: Use AR.js Pattern Generator (Recommended)

1. Visit: https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
2. Upload or design your marker image
3. Download the .patt file
4. Save your marker image as PNG

**Best Practices for Markers:**
- High contrast images work best
- Simple, recognizable shapes
- Avoid symmetrical patterns
- Black border around the design helps
- Minimum 512x512px resolution

#### Option B: Create Custom Marker

1. Design a unique image (logo, symbol, or illustration)
2. Use AR.js Marker Training tool to generate .patt file
3. Ensure marker has good feature points for tracking

### 2. Upload Assets via Admin Panel

1. Log into Admin Panel
2. Select or create a species
3. Upload the following in order:

   **Step 1: Upload 3D Model**
   - Click "AR 3D Model" section
   - Upload .glb or .gltf file
   - Model is stored in `species-models` bucket

   **Step 2: Upload Pattern File**
   - Click "AR.js Pattern File" section
   - Upload the .patt file generated from marker
   - Pattern is stored in `ar-patterns` bucket

   **Step 3: Upload Marker Image**
   - Click "AR Marker Image" section
   - Upload PNG/JPG marker image
   - Image is stored in `ar-markers` bucket
   - This is what users will scan with their camera

4. Save the species to persist all changes

### 3. Display Marker to Users

The marker image (`ar_marker_image_url`) should be displayed in:
- Species detail cards
- AR experience landing pages
- Printable marker sheets

Users point their camera at this marker to activate the AR experience.

### 4. AR Viewer Usage

#### Standalone HTML Viewer

Located at: `/public/ar-viewer-arjs.html`

**URL Parameters:**
- `model` - URL to the .glb model
- `pattern` - URL to the .patt pattern file
- `scale` - Model scale (default: 1.0)
- `rx`, `ry`, `rz` - Rotation in degrees
- `name` - Species common name
- `scientific` - Species scientific name

**Example URL:**
```
/ar-viewer-arjs.html?model=https://...species.glb&pattern=https://...species.patt&scale=1.5&ry=180&name=Philippine%20Eagle&scientific=Pithecophaga%20jefferyi
```

#### React Component

Use `ARJSViewer` component in your React app:

```tsx
import ARJSViewer from './components/ARJSViewer'

<ARJSViewer 
  isVisible={showAR} 
  onClose={() => setShowAR(false)}
  speciesId="philippine-eagle"
/>
```

## Database Migration

### Run Migration Script

Execute in Supabase SQL Editor:

```bash
db/migrate-to-arjs.sql
```

This will:
- Add new AR.js columns
- Create indexes for performance
- Add helpful column comments

### Create Storage Buckets

1. Go to Supabase Dashboard > Storage
2. Create three new buckets:
   - `ar-patterns` (public: true)
   - `ar-markers` (public: true)
   - `species-models` (public: true) [if not exists]

### Apply Storage Policies

Execute in Supabase SQL Editor:

```bash
db/setup-storage.sql
```

This creates policies for:
- Public read access to all AR assets
- Authenticated users can upload
- Admins can update/delete

## File Structure

```
species-models/
  └── {species-id}/
      └── {species-id}.glb

ar-patterns/
  └── {species-id}/
      └── {species-id}.patt

ar-markers/
  └── {species-id}/
      └── {species-id}-marker.png

Example:
species-models/philippine-eagle/philippine-eagle.glb
ar-patterns/philippine-eagle/philippine-eagle.patt
ar-markers/philippine-eagle/philippine-eagle-marker.png
```

## Technical Details

### AR.js Configuration

The AR viewer uses these AR.js settings:

```javascript
arjs="
  sourceType: webcam;
  debugUIEnabled: false;
  detectionMode: mono_and_matrix;
  matrixCodeType: 3x3;
"
```

**Key Settings:**
- `sourceType: webcam` - Uses device camera
- `detectionMode: mono_and_matrix` - Supports custom patterns
- `smooth: true` - Smooths marker tracking
- `smoothCount: 10` - Number of frames for smoothing

### Model Configuration

Models are configured with:
- **Scale** - Uniform scaling (x, y, z)
- **Rotation** - Euler angles in degrees
- **Position** - Always (0, 0, 0) relative to marker
- **Animation** - Optional rotation animation

### Browser Compatibility

**Supported Browsers:**
- Chrome/Edge (Mobile & Desktop)
- Safari (iOS 11+)
- Firefox (Mobile & Desktop)

**Requirements:**
- HTTPS (required for camera access)
- Camera permissions
- WebGL support

## Troubleshooting

### Marker Not Detected

**Solutions:**
1. Ensure good lighting
2. Keep marker flat and visible
3. Try regenerating pattern with higher contrast
4. Check marker is in focus
5. Verify .patt file uploaded correctly

### Model Not Appearing

**Check:**
1. .glb file is valid and uploaded
2. Model scale is appropriate (try 0.5 - 2.0)
3. Browser console for loading errors
4. File URLs are publicly accessible

### Poor Tracking Performance

**Optimize:**
1. Use high-contrast markers
2. Ensure marker has unique features
3. Increase marker size (print larger)
4. Improve lighting conditions
5. Reduce model complexity/polygon count

## Advantages Over QR Codes

1. **Custom Branding** - Use your own designs as markers
2. **Better Tracking** - More stable and accurate
3. **Larger Recognition Area** - Works from various angles
4. **No Internet Required** - Pattern recognition is local
5. **Professional Look** - Custom markers match your brand

## Resources

- **AR.js Documentation**: https://ar-js-org.github.io/AR.js-Docs/
- **Pattern Generator**: https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
- **A-Frame Documentation**: https://aframe.io/docs/
- **Marker Training**: https://github.com/AR-js-org/AR.js/tree/master/aframe/examples/marker-training

## API Reference

### Species Type Extensions

```typescript
interface Species {
  // ... existing fields
  arModelUrl?: string           // URL to .glb model
  arModelScale?: number          // Scale factor (default: 1.0)
  arModelRotation?: {            // Rotation in degrees
    x: number
    y: number
    z: number
  }
  arPatternUrl?: string          // URL to .patt file
  arMarkerImageUrl?: string      // URL to marker image
  arViewerHtml?: string          // Custom viewer HTML
}
```

### Upload Functions

```typescript
// Upload AR pattern file
handleArPatternUpload(file: File): Promise<void>

// Upload AR marker image
handleArMarkerUpload(file: File): Promise<void>

// Upload 3D model
handleArModelUpload(file: File): Promise<void>
```

## Migration Checklist

- [ ] Run database migration script
- [ ] Create storage buckets
- [ ] Apply storage policies
- [ ] Update admin panel code
- [ ] Test pattern upload
- [ ] Test marker upload
- [ ] Test AR viewer
- [ ] Generate markers for existing species
- [ ] Update user documentation
- [ ] Train admins on new workflow

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all three assets are uploaded
3. Test marker recognition in good lighting
4. Review AR.js documentation
5. Check Supabase storage bucket permissions

---

**Last Updated**: November 18, 2025
**Version**: 1.0.0
**System**: Mati Biodiversity AR Platform
