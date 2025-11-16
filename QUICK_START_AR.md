# 🚀 Quick Start: AR System Setup

## Immediate Next Steps (Do This Now)

### ⚡ Step 1: Create Supabase Storage Buckets (5 minutes)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to your project: **MatiARBio**
3. Click **Storage** in left sidebar
4. Create 3 buckets:

#### Bucket 1: `species-models`
```
Click "Create Bucket"
Name: species-models
Public: ✅ CHECK THIS
Click "Create"
```

#### Bucket 2: `species-images`
```
Click "Create Bucket"
Name: species-images
Public: ✅ CHECK THIS
Click "Create"
```

#### Bucket 3: `site-media`
```
Click "Create Bucket"
Name: site-media
Public: ✅ CHECK THIS
Click "Create"
```

### ⚡ Step 2: Run Migration Script (2 min)

1. In Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Open `db/migrate-ar-system.sql`
4. Copy and paste ALL contents
5. Click **"Run"**
6. Wait for "✅ Migration successful!" message

### ⚡ Step 2.5: Verify Migration (1 min) - Optional but Recommended

1. Still in **SQL Editor** → **New query**
2. Open `db/verify-ar-migration.sql`
3. Copy and paste ALL contents
4. Click **"Run"**
5. Should see "✅ AR system verification completed successfully!"

### ⚡ Step 3: Optimize Admin Login Performance (1 minute)

Admin login was slow due to multiple database queries. Run this optimization:

1. In Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Open `db/optimize-admin-login.sql`
4. Copy and paste ALL contents
5. Click **"Run"**
6. Should see "✅ Admin user created/updated successfully!"

### ⚡ Step 3.5: Verify Admin Login Fix (1 minute) - Optional

1. Still in **SQL Editor** → **New query**
2. Open `db/debug-admin-login.sql`
3. Copy and paste ALL contents
4. Click **"Run"**
5. Check that functions are optimized and indexes exist

### ⚡ Step 4: Apply Storage Policies (2 minutes)

1. In Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Open file: `db/setup-storage.sql`
4. Copy ALL contents
5. Paste into SQL Editor
6. Click **"Run"** button
7. Wait for "Success" message

### ⚡ Step 5: Test the System (5 minutes)

1. Open website: `http://localhost:5173/ar-test.html`
2. Check all green ✅ in System Status
3. Scroll down to see test marker
4. Click **"Start AR Test"**
5. Allow camera access
6. Point at marker on screen
7. Verify cube appears and rotates

---

## 🎯 Upload Your First AR Model

### Option A: Use Test Model

Download a free GLB:
1. Go to: https://sketchfab.com/3d-models/philippine-eagle-c0b3f3b3a3b34e3e8e3e3e3e3e3e3e3e
2. Download GLB
3. Rename to: `philippine-eagle.glb`

### Option B: Create Placeholder

Use Blender or online tool to create simple test cube.

### Upload to Admin Panel

1. Go to: `http://localhost:5173`
2. Click logo 7 times → Opens Admin Panel
3. Login with admin credentials
4. Click **"Species Management"** tab
5. Create or edit a species
6. Scroll to **"AR Model"** section
7. Click **"Upload AR Model"**
8. Select your `.glb` file
9. Wait for "✅ Upload successful"
10. Click **"Save Species"**

---

## 🔍 Verify Upload Worked

1. Open Supabase Dashboard → **Storage**
2. Click `species-models` bucket
3. You should see: `{species-id}/{species-id}.glb`
4. Click the file → Copy public URL
5. Paste URL in browser → File should download

---

## 📸 Create Your First QR Code

### Using Test Page

1. Open: `http://localhost:5173/ar-test.html`
2. Scroll to **"QR Code Generator"**
3. Enter species ID: `philippine-eagle`
4. Click **"Generate QR"**
5. Right-click QR → Save image
6. Print or display on phone

### Using Online Tool

1. Go to: https://www.qr-code-generator.com/
2. Enter text: `philippine-eagle`
3. Generate → Download PNG
4. Print on paper

---

## 🎨 Create AR Marker (Optional)

This step is optional for now. You can use test markers first.

### Using MindAR Compiler

```bash
# Install compiler
npm install -g mind-ar

# Compile marker from species photo
mind-ar-compiler \
  --input species-photo.jpg \
  --output public/ar-targets/philippine-eagle-target.mind \
  --width 1024
```

### For Now: Use Test Marker

The test page already has a marker you can use: `/ar-demo/images/pitcher.jpg`

---

## ✅ Verify Everything Works

### Checklist:

- [ ] 3 storage buckets created
- [ ] Storage policies applied (no errors in SQL)
- [ ] Database schema updated (AR columns added)
- [ ] Admin login performance optimized
- [ ] Test page shows all green checks
- [ ] Test AR cube appears when pointing at marker
- [ ] GLB model uploaded via Admin Panel
- [ ] Model appears in Supabase Storage
- [ ] QR code generated for species
- [ ] Full AR test with real species (coming next)

---

## 🐛 If Something Breaks

### Storage Policy Error
```
Error: relation "storage.objects" does not exist
```
**Fix**: You're in wrong SQL editor. Use Supabase SQL Editor, not local.

### Upload Fails
```
Error: Failed to upload AR model
```
**Fix**:
1. Check bucket name is `species-models` (not `species-assets`)
2. Verify bucket is public
3. Check file is under 50MB

### Model Not Showing
```
AR loads but no 3D model
```
**Fix**:
1. Open browser console (F12)
2. Check for 404 errors
3. Verify `ar_model_url` in database
4. Test GLB at https://gltf-viewer.donmccurdy.com/

### Camera Won't Start
```
Camera access denied
```
**Fix**:
1. Use HTTPS or localhost
2. Check browser permissions
3. Try different browser (Chrome recommended)

---

## 📞 Need Help?

1. **Check console**: F12 → Console tab (shows errors)
2. **Check network**: F12 → Network tab (shows failed requests)
3. **Check storage**: Supabase Dashboard → Storage (verify files)
4. **Re-read guide**: `AR_SYSTEM_COMPLETE_GUIDE.md`

---

## 🎉 What You've Accomplished

After these steps, you have:

✅ Organized Supabase storage structure
✅ Secure storage policies
✅ AR-ready database schema
✅ Working GLB upload system
✅ QR code generation
✅ Test environment

**You're ready to add AR models to all your species! 🚀**

---

**Time to Complete**: ~15 minutes
**Difficulty**: Easy (just follow steps)
**Result**: Fully functional AR system
