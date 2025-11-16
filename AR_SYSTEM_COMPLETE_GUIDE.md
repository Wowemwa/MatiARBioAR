# 🎯 Complete AR System Setup Guide

## Overview

This guide covers the complete setup and usage of the Mati Biodiversity AR system with proper marker-based tracking, QR code integration, and organized Supabase storage.

---

## 🏗️ Architecture

### Components

1. **QR Code Scanning**: Identifies which species to display
2. **Image Marker Tracking**: Anchors 3D model to physical marker
3. **3D Model Rendering**: Displays GLB models from Supabase
4. **Organized Storage**: Species-specific folders for all assets

### Flow

```
User Scans QR Code → Identifies Species → Loads AR Scene → 
Points at Marker → Model Appears → Tracks Marker Position
```

---

## 📦 1. Supabase Storage Setup

### Step 1: Create Storage Buckets

Go to **Supabase Dashboard** → **Storage** → **Create Bucket**

Create these three buckets:

#### Bucket 1: `species-models`
- **Description**: 3D AR models (.glb files)
- **Public**: ✅ YES
- **File Size Limit**: 50MB
- **Allowed MIME types**: `model/gltf-binary`, `application/octet-stream`

#### Bucket 2: `species-images`
- **Description**: Species photos
- **Public**: ✅ YES
- **File Size Limit**: 5MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

#### Bucket 3: `site-media`
- **Description**: Conservation site media
- **Public**: ✅ YES
- **File Size Limit**: 10MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `video/mp4`

### Step 2: Apply Storage Policies

Run the SQL script: `db/setup-storage.sql`

```bash
# In Supabase Dashboard → SQL Editor
# Paste contents of db/setup-storage.sql and execute
```

This creates RLS policies for:
- ✅ Public read access
- 🔐 Authenticated upload access
- 👨‍💼 Admin update/delete access

### Step 3: Verify Storage Structure

Your storage should organize files like this:

```
species-models/
  ├── philippine-eagle/
  │   └── philippine-eagle.glb
  ├── philippine-tarsier/
  │   └── philippine-tarsier.glb
  └── mati-butterfly/
      └── mati-butterfly.glb

species-images/
  ├── philippine-eagle/
  │   ├── philippine-eagle-main.jpg
  │   ├── philippine-eagle-1.jpg
  │   └── philippine-eagle-2.jpg
  └── philippine-tarsier/
      ├── philippine-tarsier-main.jpg
      └── philippine-tarsier-1.jpg
```

---

## 🗄️ 2. Database Schema Update

### Step 1: Update Species Table

Run the updated schema: `db/setup.sql`

```sql
-- New columns added to species table:
ALTER TABLE public.species 
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ar_model_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ar_model_scale DECIMAL DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS ar_model_rotation JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
ADD COLUMN IF NOT EXISTS qr_code_data TEXT DEFAULT NULL;
```

### Step 2: Verify Indexes

Ensure these indexes exist for fast AR queries:

```sql
CREATE INDEX IF NOT EXISTS idx_species_ar_model_url 
  ON public.species(ar_model_url) WHERE ar_model_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_species_qr_code 
  ON public.species(qr_code_data) WHERE qr_code_data IS NOT NULL;
```

---

## 🎨 3. Creating 3D Models

### Option 1: Free Model Resources

Download free GLB models from:

- [Sketchfab](https://sketchfab.com/) - Search for animals/plants
- [Poly Haven](https://polyhaven.com/) - High-quality free models
- [Google Poly Archive](https://poly.pizza/) - Community models
- [TurboSquid Free](https://www.turbosquid.com/Search/3D-Models/free/) - Free section

### Option 2: Create Your Own

Use these tools to create models:

1. **Blender** (Free) - Professional 3D modeling
2. **Polycam** (Mobile) - Photogrammetry scanning
3. **Luma AI** - AI-powered 3D scanning

### Model Requirements

- **Format**: `.glb` (binary glTF)
- **Size**: Under 50MB (smaller is better for mobile)
- **Textures**: Embedded in GLB
- **Optimization**: Use Blender or [glTF Transform](https://gltf-transform.donmccurdy.com/) to compress

### Recommended Model Settings

```javascript
// Scale for AR (adjust per species)
{
  "ar_model_scale": 0.5,  // 50% of original size
  "ar_model_rotation": {
    "x": 0,
    "y": 0,
    "z": 0
  }
}
```

---

## 📱 4. AR Marker Creation

### What is an AR Marker?

An AR marker is a physical image that the AR system tracks to anchor the 3D model. When you point your camera at the marker, the model appears.

### Option 1: Use MindAR Compiler (Recommended)

MindAR creates optimized image targets for tracking.

#### Install MindAR Compiler

```bash
npm install -g mind-ar
```

#### Create Marker Image

1. Choose a high-contrast image (species photo, logo, pattern)
2. Image should be **unique** and have **distinct features**
3. Recommended size: 1024x1024px or 2048x2048px

#### Compile Marker

```bash
# Compile marker image to .mind file
mind-ar-compiler \
  --input species-photo.jpg \
  --output philippine-eagle-target.mind \
  --width 1024
```

#### Store Marker Files

```
public/ar-targets/
  ├── philippine-eagle-target.mind
  ├── philippine-tarsier-target.mind
  └── mati-butterfly-target.mind
```

### Option 2: Use Pre-made Markers

For testing, use standard AR markers:

- **HIRO Marker**: [Download](https://github.com/AR-js-org/AR.js/blob/master/data/images/hiro.png)
- **Kanji Marker**: [Download](https://github.com/AR-js-org/AR.js/blob/master/data/images/kanji.png)

---

## 🔍 5. QR Code Generation

### Generate QR Codes for Each Species

#### Method 1: Online QR Generator

Use [QR Code Generator](https://www.qr-code-generator.com/):

1. Enter species ID: `philippine-eagle`
2. Generate QR code
3. Download PNG (300x300px minimum)
4. Print on information cards

#### Method 2: Node.js Script

```bash
npm install qrcode
```

```javascript
// generate-qr-codes.js
const QRCode = require('qrcode');
const fs = require('fs');

const species = [
  'philippine-eagle',
  'philippine-tarsier',
  'mati-butterfly'
];

species.forEach(async (id) => {
  const qrData = `https://mati-biodiversity.com/ar?species=${id}`;
  await QRCode.toFile(`qr-codes/${id}-qr.png`, qrData, {
    width: 500,
    margin: 2
  });
  console.log(`✅ Generated QR code for ${id}`);
});
```

### QR Code Format

The QR code should contain:
- Species ID only: `philippine-eagle`
- OR Full URL: `https://yoursite.com/ar?species=philippine-eagle`

The AR viewer will extract the species ID automatically.

---

## 🖥️ 6. Admin Panel Usage

### Upload GLB Model

1. **Login** to Admin Panel (click logo 7 times)
2. **Open Species Editor** → Select species
3. **Scroll to AR Model Section**
4. **Click "Upload AR Model"**
5. **Select your `.glb` file**
6. **Wait for upload** (shows progress)
7. **Save Species** to persist changes

### Storage Path

Models are automatically organized:
```
species-models/{species-id}/{species-id}.glb
```

Example: `species-models/philippine-eagle/philippine-eagle.glb`

### Update Model

To replace a model:
1. Upload new `.glb` file
2. Old model is automatically deleted
3. New model takes its place

---

## 📲 7. Testing AR System

### Desktop Testing

1. Open website: `http://localhost:5173`
2. Click **AR Experience** button
3. Allow camera access
4. Hold up QR code to camera
5. Point camera at AR marker
6. Model should appear anchored to marker

### Mobile Testing (Recommended)

AR works best on mobile devices:

#### iOS (iPhone/iPad)
- Safari 12+ or Chrome
- iOS 12+ required for WebXR
- Camera permission required

#### Android
- Chrome 79+ or Firefox
- Android 8+ required
- ARCore supported devices recommended

### Testing Checklist

- [ ] QR code scans correctly
- [ ] Species identified and loaded
- [ ] Camera switches to AR mode
- [ ] Marker detected (model appears)
- [ ] Model stays anchored to marker
- [ ] Model moves with marker
- [ ] Model quality looks good
- [ ] Performance is smooth (30+ FPS)

---

## 🐛 8. Troubleshooting

### Model Not Loading

**Problem**: AR viewer shows "Image Only" instead of 3D model

**Solutions**:
1. Check `ar_model_url` in database:
   ```sql
   SELECT id, common_name, ar_model_url FROM species WHERE id = 'philippine-eagle';
   ```
2. Verify file exists in Supabase Storage
3. Check console for errors (F12 → Console)
4. Verify GLB file is valid (open in [glTF Viewer](https://gltf-viewer.donmccurdy.com/))

### Marker Not Detecting

**Problem**: AR scene loads but model doesn't appear

**Solutions**:
1. Ensure marker image is high-contrast and unique
2. Print marker larger (A4 size works best)
3. Ensure good lighting (avoid shadows)
4. Hold device steady and close to marker
5. Check marker file exists: `public/ar-targets/{species-id}-target.mind`

### QR Code Not Scanning

**Problem**: QR scanner doesn't detect code

**Solutions**:
1. Ensure QR code is clear and not blurry
2. Try different distances (15-30cm works best)
3. Check camera permission granted
4. Verify QR contains correct species ID
5. Check browser console for errors

### Storage Upload Fails

**Problem**: GLB upload shows error

**Solutions**:
1. Verify `species-models` bucket exists
2. Check storage policies are applied
3. Verify file size under 50MB
4. Check internet connection
5. Review browser console for specific error

### Performance Issues

**Problem**: AR is laggy or stuttering

**Solutions**:
1. Reduce model complexity (use Blender to decimate)
2. Compress textures (use [Squoosh](https://squoosh.app/))
3. Lower `ar_model_scale` value
4. Test on newer device
5. Close other browser tabs

---

## 📊 9. Analytics & Monitoring

### Track AR Usage

```typescript
// Log AR session start
await supabase.from('analytics_events').insert({
  event_type: 'ar_session_start',
  event_data: {
    species_id: speciesId,
    device: navigator.userAgent
  }
});
```

### Monitor Model Performance

```typescript
// Track model load time
const startTime = performance.now();
// ... load model ...
const loadTime = performance.now() - startTime;

await supabase.from('performance_metrics').insert({
  metric_type: 'ar_model_load_time',
  value: loadTime,
  metadata: { species_id: speciesId }
});
```

---

## 🚀 10. Production Deployment

### Pre-Deployment Checklist

- [ ] All storage buckets created
- [ ] Storage policies applied
- [ ] Database schema updated
- [ ] All species have GLB models uploaded
- [ ] AR markers generated and compiled
- [ ] QR codes printed on information cards
- [ ] Mobile testing completed
- [ ] Performance benchmarks met
- [ ] Error handling verified

### Environment Variables

Ensure these are set in production:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### CDN Configuration

For better performance, consider using CDN for:
- GLB models (large files)
- AR marker images
- QR codes

### HTTPS Required

AR features require HTTPS in production:
- Vercel automatically provides HTTPS
- Camera access blocked on HTTP

---

## 📖 11. User Guide

### For Visitors

**How to Experience AR:**

1. **Find Information Card** with QR code at conservation site
2. **Scan QR Code** using website's AR scanner
3. **Point at Marker Image** on the card
4. **Watch 3D Model Appear** anchored to marker
5. **Move Around** to see model from different angles
6. **Learn About Species** from info overlay

### For Administrators

**How to Add New Species AR:**

1. **Prepare GLB Model** (optimized, under 50MB)
2. **Create AR Marker Image** (high-contrast, unique)
3. **Compile Marker** using MindAR compiler
4. **Generate QR Code** for species
5. **Login to Admin Panel**
6. **Upload GLB** via Species Editor
7. **Print QR Code + Marker** on information card
8. **Deploy at Conservation Site**

---

## 🔗 12. Resources

### Tools & Libraries

- **A-Frame**: [https://aframe.io/](https://aframe.io/)
- **MindAR**: [https://hiukim.github.io/mind-ar-js-doc/](https://hiukim.github.io/mind-ar-js-doc/)
- **html5-qrcode**: [https://github.com/mebjas/html5-qrcode](https://github.com/mebjas/html5-qrcode)
- **Supabase Storage**: [https://supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)

### Learning Resources

- [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [glTF 2.0 Specification](https://www.khronos.org/gltf/)
- [Marker-Based AR Tutorial](https://aframe.io/docs/1.4.0/introduction/vr-headsets.html)

### Model Optimization

- [glTF Transform](https://gltf-transform.donmccurdy.com/)
- [Blender glTF Exporter](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
- [Three.js GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)

---

## ✅ Next Steps

1. **Create Storage Buckets** in Supabase Dashboard
2. **Run SQL Scripts** (setup.sql + setup-storage.sql)
3. **Upload Test Model** via Admin Panel
4. **Generate QR Code** for test species
5. **Create AR Marker** using MindAR compiler
6. **Test on Mobile Device**
7. **Deploy to Conservation Sites**

---

## 🆘 Support

For issues or questions:
- Check browser console (F12) for error messages
- Review Supabase Storage logs
- Test on different devices
- Verify all setup steps completed

**Common Issues**: See section 8 (Troubleshooting)

---

**Last Updated**: November 16, 2025
**Version**: 2.0 (Marker-Based Tracking)
