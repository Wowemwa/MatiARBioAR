# AR.js Admin Quick Start Guide

## 🚀 Quick Setup for Species AR Content

### What You Need

For each species to have AR functionality, you need **3 files**:

1. **📦 3D Model** - `.glb` file of the species
2. **🎯 Pattern File** - `.patt` file for AR recognition  
3. **🖼️ Marker Image** - `.png` or `.jpg` image for users to scan

---

## Step 1: Generate AR Pattern & Marker

### Using AR.js Pattern Generator

1. **Visit**: https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html

2. **Create your marker**:
   - Upload an image OR use the drawing tool
   - Make it high contrast (black & white works best)
   - Add a black border around edges
   - Keep it simple and unique

3. **Download**:
   - Click "Download Marker" → Save as `.patt` file
   - Click "Download Image" → Save as `.png` file

### ✅ Good Marker Examples
- Species logo with border
- Stylized icon or symbol
- High-contrast illustration
- QR-code style design

### ❌ Avoid
- Photos with low contrast
- Symmetrical patterns
- Very detailed images
- Plain colors without features

---

## Step 2: Upload in Admin Panel

### Open Admin Panel

1. Click **"🌿 Species Administration"**
2. Select existing species OR create new one
3. Scroll to AR sections

### Upload Files (in order)

#### 1️⃣ Upload 3D Model
```
Section: "AR 3D Model (.gltf / .glb)"
→ Click file input
→ Select your .glb file
→ Wait for upload confirmation
```

#### 2️⃣ Upload Pattern File
```
Section: "AR.js Pattern File (.patt)"
→ Click file input
→ Select your .patt file
→ Wait for upload confirmation
```

#### 3️⃣ Upload Marker Image
```
Section: "AR Marker Image (PNG/JPG)"
→ Click file input
→ Select your marker .png file
→ Wait for upload confirmation
→ Preview appears automatically
```

### Save Species
Click **"💾 Save Species"** at the bottom

---

## Step 3: Test AR Experience

1. Open the species page on your phone
2. Look for the marker image displayed
3. Point your camera at the marker
4. The 3D model should appear!

---

## 🎨 Creating Custom Markers

### Design Tips

**Contrast is Key**
- Use black and white
- Strong borders help detection
- Avoid gradients

**Size Matters**
- Minimum 512x512 pixels
- Print at least 15cm x 15cm
- Larger = easier to detect

**Unique Patterns**
- Each species should have different marker
- Avoid similar designs
- Add identifying features

### Tools You Can Use

1. **Canva** - Design custom markers
2. **Photoshop/GIMP** - Edit images
3. **Inkscape** - Vector graphics
4. **AR.js Generator** - Built-in drawing tool

---

## 📋 Checklist for Each Species

Before publishing a species with AR:

- [ ] 3D model (.glb) uploaded
- [ ] Pattern file (.patt) uploaded  
- [ ] Marker image uploaded
- [ ] Marker image displays in species card
- [ ] Species saved successfully
- [ ] Tested AR on mobile device
- [ ] Marker detects reliably
- [ ] Model appears at correct size
- [ ] Model is properly positioned

---

## 🔧 Troubleshooting

### "Model not appearing"
- ✓ Check all 3 files are uploaded
- ✓ Verify .glb file is valid
- ✓ Try adjusting model scale (0.5 - 2.0)

### "Marker not detecting"
- ✓ Ensure good lighting
- ✓ Keep marker flat and visible
- ✓ Try regenerating with higher contrast
- ✓ Print marker larger

### "Upload failed"
- ✓ Check file format (.glb, .patt, .png/jpg)
- ✓ Verify file size (models < 50MB)
- ✓ Check internet connection
- ✓ Try refreshing page

---

## 📱 User Instructions to Share

**How to Use AR:**

1. Find the marker image on species page
2. Open on your phone (or print the marker)
3. Point your camera at the marker
4. Keep marker in view and flat
5. 3D model appears on marker!

**Tips for Users:**
- Use good lighting
- Keep marker flat
- Move slowly for best tracking
- Marker works best printed

---

## 🗂️ File Organization

Files are automatically organized:

```
species-models/
  └── philippine-eagle/
      └── philippine-eagle.glb

ar-patterns/
  └── philippine-eagle/
      └── philippine-eagle.patt

ar-markers/
  └── philippine-eagle/
      └── philippine-eagle-marker.png
```

Species ID is used for folder names.

---

## 🎯 Best Practices

### Model Optimization
- Keep polygon count under 50k
- Optimize textures (1024x1024 max)
- Test on mobile devices
- Use .glb format (not .gltf)

### Marker Design
- Create species-specific designs
- Use conservation status colors
- Add species name/icon
- Make it printable (high res)

### User Experience
- Display marker prominently
- Provide print option
- Include simple instructions
- Test on various devices

---

## 📞 Quick Links

- **Pattern Generator**: https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
- **AR.js Docs**: https://ar-js-org.github.io/AR.js-Docs/
- **Admin Panel**: Click "🔐 Admin" → Login
- **Full Guide**: See `AR_JS_IMPLEMENTATION_GUIDE.md`

---

## 🆘 Need Help?

1. Check the full implementation guide
2. Review troubleshooting section
3. Test in different lighting
4. Verify file formats
5. Contact technical support

---

**Remember**: All three files (model, pattern, marker) are required for AR to work!

**Last Updated**: November 18, 2025
