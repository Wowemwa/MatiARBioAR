# AR Features Documentation

## Overview
Mati Biodiversity Platform now includes two fully functional augmented reality experiences:

### 1. **AR Viewer** (`/ar-viewer.html`)
- **Technology:** Google's model-viewer web component
- **Type:** Markerless AR (surface tracking)
- **Compatibility:** 
  - ✅ iOS 12+ (Safari, Chrome) - Uses Apple's Quick Look
  - ✅ Android 8+ (Chrome) - Uses Google's Scene Viewer
  - ✅ Desktop browsers - 3D model interaction with mouse
- **Features:**
  - 6 biodiversity species with 3D models
  - Interactive rotation, scaling, and placement
  - Auto-rotation and shadow effects
  - Tap-to-place AR on mobile devices
  - Real-time surface detection

### 2. **MindAR Demo** (`/ar-demo/`)
- **Technology:** MindAR + A-Frame
- **Type:** Marker-based AR (image tracking)
- **Compatibility:**
  - ✅ Modern browsers with WebGL support
  - ✅ Mobile devices with camera access
- **Features:**
  - Image target recognition
  - Custom marker compilation support
  - 3D model overlay on detected markers

## How to Use

### AR Viewer
1. Visit `/ar-viewer.html` in your browser
2. On mobile: Tap "View in AR" on any species card
3. Allow camera access when prompted
4. Point your device at a flat surface (floor, table, ground)
5. Tap to place the 3D model in your space
6. Walk around, pinch to scale, drag to rotate

### MindAR Demo
1. Visit `/ar-demo/` in your browser
2. Allow camera access when prompted
3. Point your camera at the target image (link provided in the demo)
4. Watch the 3D model appear when the marker is detected

## Current Species Models

The AR Viewer currently showcases:
1. 🦅 **Philippine Eagle** (*Pithecophaga jefferyi*) - Critically Endangered
2. 👀 **Philippine Tarsier** (*Carlito syrichta*) - Near Threatened
3. 🦋 **Mati Blue Butterfly** (*Graphium sarpedon*) - Common
4. 🌳 **Red Mangrove** (*Rhizophora mangle*) - Ecologically Important
5. 🪸 **Staghorn Coral** (*Acropora cervicornis*) - Threatened
6. 🥥 **Coconut Palm** (*Cocos nucifera*) - Abundant

**Note:** Current models are sample glTF files from Khronos Group for demonstration. 
Future versions will feature photorealistic models of actual Mati City species.

## Technical Details

### Model Viewer Technology
- Uses WebXR Device API for AR capabilities
- Automatically selects best AR mode for device:
  - **iOS:** Quick Look (native AR)
  - **Android:** Scene Viewer (Google AR)
  - **Desktop:** 3D interaction mode
- Supports standard glTF 2.0 and GLB formats

### MindAR Technology
- Computer vision-based image tracking
- Runs entirely in the browser (no server required)
- Custom marker compilation via CLI:
  ```bash
  npm run ar:compile
  ```

## Adding Custom 3D Models

### For AR Viewer
1. Obtain or create a GLB file (glTF 2.0 Binary)
2. Host the file or place it in `/public/models/`
3. Update the `src` attribute in `ar-viewer.html`:
   ```html
   <model-viewer
     src="/models/your-species.glb"
     alt="Your Species"
     ar
     ar-modes="webxr scene-viewer quick-look"
     camera-controls
     auto-rotate
   >
   ```

### For MindAR Demo
1. Create or find a high-contrast marker image
2. Place it in `/public/ar-demo/images/`
3. Compile the target file:
   ```bash
   npm run ar:compile
   ```
4. Update `index.html` to reference your model

## Optimization Tips

### 3D Model Optimization
- Keep GLB files under 5MB for fast loading
- Use Draco compression for geometry
- Texture sizes: 1024x1024 or 2048x2048 max
- Polygon count: 10k-50k triangles recommended
- Use PBR materials for realistic rendering

### Performance
- Models auto-rotate for preview
- Lazy loading on scroll
- Shadow rendering optimized for mobile
- Environment lighting set to "neutral"

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| 3D Viewing | ✅ | ✅ | ✅ | ✅ |
| AR Mode (Mobile) | ✅ | ✅ | ❌ | ✅ |
| WebXR | ✅ | ❌ | ❌ | ✅ |
| Quick Look | ❌ | ✅ | ❌ | ❌ |

## Future Enhancements

- [ ] Custom glTF models of actual Mati species from photogrammetry
- [ ] Multi-marker support in MindAR demo
- [ ] AR annotations and educational overlays
- [ ] Save/share AR photos feature
- [ ] Location-based AR experiences
- [ ] Integration with species database
- [ ] AR quiz/gamification features
- [ ] Offline model caching
- [ ] Voice narration for accessibility

## Resources

- [model-viewer Documentation](https://modelviewer.dev/)
- [MindAR Documentation](https://hiukim.github.io/mind-ar-js-doc/)
- [glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models)
- [WebXR Device API](https://immersiveweb.dev/)

## Testing

Access the AR features:
- **AR Viewer:** http://localhost:5173/ar-viewer.html
- **MindAR Demo:** http://localhost:5173/ar-demo/

Both experiences are also linked from the `/ar` route when admin is authenticated.

---

**Created:** November 9, 2025  
**Last Updated:** November 9, 2025  
**Version:** 1.0.0
