# Mati City Biodiversity Explorer 🌿

[![Version](https://img.shields.io/badge/version-v1.0### 📱 Intelligent Platform Detection
- **Automatic Detection**: Seamless adaptation to iOS, Android, and Desktop
- **Visual Adaptation**: Blue theme and optimized layouts for mobile devices
- **Platform Indicators**: Auto-detected device type and screen information
- **Touch Optimization**: Larger buttons and improved spacing on mobile
- **No Manual Toggle**: Purely automatic, hassle-free experience

### 🎯 Platform-Specific Optimizations

#### 📱 **Mobile (iOS/Android)**
- **Touch Targets**: iOS 44px, Android 48px minimum touch areas
- **Safe Areas**: iOS notch and home indicator support
- **Gesture Navigation**: Optimized scroll and swipe interactions
- **Performance**: Reduced animations, hardware acceleration
- **Typography**: Platform-appropriate font rendering
- **Visual Feedback**: Active states and haptic-style interactions

#### 🖥️ **Desktop**
- **Hover Effects**: Rich micro-interactions and animations
- **Keyboard Navigation**: Full accessibility support
- **Multi-column Layouts**: Efficient use of screen real estate
- **Advanced Animations**: Smooth transitions and parallax effects
- **High-DPI Support**: Retina and 4K display optimization
- **Cursor Interactions**: Contextual cursor changes and feedbacke.svg)](https://github.com/Wowemwa/mati-website)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org/)

> **A comprehensive digital platform showcasing the rich biodiversity of Mati City, Davao Oriental, Philippines. Features interactive GIS mapping, scientific species documentation, AR experiences, and a professional admin management system.**

## 🌟 Key Features

### 🗺️ **Interactive GIS Mapping**
- Real-time biodiversity hotspot visualization
- Leaflet-powered interactive maps with custom markers
- Detailed location information with GPS coordinates
- UNESCO World Heritage Site integration

### 🔬 **Scientific Species Database**
- Comprehensive flora and fauna documentation
- IUCN conservation status tracking
- High-resolution scientific photography
- Taxonomic classification and habitat information

### 🥽 **Augmented Reality Experience**
- Advanced MindAR-powered species recognition
- 3D model overlays and interactive content
- Mobile-optimized AR functionality
- Educational AR targets and experiences

### 👑 **Professional Admin System**
- Complete CRUD operations for all data
- Real-time analytics and reporting
- Bulk data export (CSV/JSON)
- Secure authentication and session management

### 🎨 **Modern UI/UX Design**
- Glassmorphism design with backdrop blur effects
- Dark/light theme with system preference detection
## 🛠️ Development
# Mati City — AR Biodiversity Gallery

This repository contains the web frontend and assets for the Mati City Augmented Reality Biodiversity Gallery.

Purpose
- Provide an accessible, mobile-first gallery of species recorded in Mati City, with QR-driven AR viewers for each species.
- Support education and public engagement by letting users view scientific species models in-situ using their mobile cameras.

What you'll find here
- A React + TypeScript single-page app (Vite)
- Tailwind CSS-based design system and reusable components
- An AR demo (MindAR/A-Frame) and sample GLB models under `public/models`
- Species data and admin preview flows under `src/data` and `src/context`

Quick start
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open: `http://localhost:5173` and navigate to "AR Demo"

Contributing
- Add models to `public/models/` and update species metadata in `src/data/mati-hotspots.ts`.
- Follow existing patterns for components and types. Run lint/type checks before committing.

License
MIT


### Scientific Contributors
- Species photography from Wikimedia Commons and scientific databases
- Taxonomic data verified against IUCN Red List and Philippine biodiversity records
- Geographic data sourced from official government surveys

## 📞 Contact & Support

### Get Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussion**: Use GitHub Discussions for questions

### Contact Information
- **Email**: [your-email@domain.com]
- **GitHub**: [@YourUsername](https://github.com/YourUsername)
- **Website**: [Your Portfolio/Website]

---

<div align="center">

**🌿 Protecting Philippines' Biodiversity Through Technology 🌿**

*Made with ❤️ for environmental conservation and education*

[![GitHub Stars](https://img.shields.io/github/stars/Wowemwa/mati-website?style=social)](https://github.com/Wowemwa/mati-website)
[![GitHub Forks](https://img.shields.io/github/forks/Wowemwa/mati-website?style=social)](https://github.com/Wowemwa/mati-website)

</div>
# Clone the repository
git clone https://github.com/Wowemwa/mati-website.git
cd mati-website

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will launch at `http://localhost:5173` (or next available port).

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🏗️ Architecture & Technology Stack

### **Core Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.5.2 | Type Safety & Developer Experience |
| Vite | 5.4.1 | Build Tool & Dev Server |
| Tailwind CSS | 3.4.10 | Utility-First Styling |
| Leaflet.js | 1.9.4 | Interactive Mapping & GIS |

### **Key Libraries**
- **React Router**: Client-side routing and navigation
- **Lucide React**: Modern icon system
- **MindAR**: AR image tracking and 3D experiences
- **A-Frame**: WebXR framework for immersive experiences

### **Performance Features**
- Code splitting with dynamic imports
- Lazy loading with React Suspense
- Progressive image loading
- Bundle optimization and tree shaking
- Service worker ready architecture5.0-brightgreen.svg)](https://github.com/Wowemwa/mati-website)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **An Interactive Biodiversity Explorer Platform Using Augmented Reality and Web-Based Mapping for Environmental Education and Eco-Tourism in Mati City, Philippines**

A modern, comprehensive web application showcasing Mati City's rich biodiversity through interactive GIS mapping, species exploration, and cutting-edge AR technology. Built with React, TypeScript, and advanced glassmorphism design principles.

## 🌟 Key Features

### 🗺️ **Interactive GIS Mapping**
- Real-time biodiversity hotspot visualization using Leaflet.js
- Multi-layer ecosystem mapping (Marine & Terrestrial)
- Geospatial data integration with WGS84 coordinate system
- Mobile-optimized touch controls and responsive cartography

### � **Species Explorer**
- Comprehensive database of 20+ scientifically documented species
- Advanced search and filtering capabilities
- Detailed species profiles with ecology, distribution, and conservation data
- High-quality imagery and taxonomic information

### ✨ **Augmented Reality Demo**
- MindAR-powered image tracking with A-Frame integration
- Interactive 3D species models and environmental overlays
- Educational AR experiences for immersive learning

### 🎨 **Modern UI/UX Design**
- Glassmorphism design system with animated backdrops
- High-contrast navigation with dynamic gradient animations
- Responsive design optimized for all device sizes
- Dark/light theme support with smooth transitions

---

## 📋 Release Notes

### **Version 0.5.0** - Latest (September 26, 2025)

#### 🎨 **Navigation & UI Enhancements**
- **Enhanced Navigation Header**: Redesigned with high-contrast animated backdrop featuring dynamic gradient animations
- **Improved Glassmorphism Effects**: Upgraded backdrop blur, enhanced shadows, and refined transparency layers
- **Mobile Navigation Overhaul**: Modern card-based design with enhanced SOON badges and smooth animations
- **Visual Polish**: Added rotation animations, multi-stage opacity transitions, and inner glow effects

#### � **Performance Optimizations**
- Implemented lazy loading for major components with Suspense boundaries
- Advanced code splitting and bundle optimization with Terser minification
- Progressive image loading with intersection observer API
- Enhanced HTML meta tags with preconnect and DNS prefetch optimizations

#### 🔧 **Technical Improvements**
- Centralized data management with `DataContext` and unified API helpers
- Admin preview system with password-gated access and persistent authentication
- Memoized expensive computations for improved render performance
- Enhanced TypeScript interfaces and data validation

### **Previous Versions**
<details>
<summary>View version history</summary>

#### **Version 0.4.0** - Performance & Layout
- Layout optimizations for better screen utilization
- Typography enhancements and color scheme improvements
- Responsive design refinements and spacing optimizations

#### **Version 0.3.0** - Data Architecture
- Introduced centralized data context system
- Added admin preview functionality
- Enhanced navbar with consistent pill design
- Integrated live data counts throughout the application

</details>

## Release snapshot

- **Version:** v0.3.0
- **Updated:** 2025-09-26 02:50 (UTC)

### What changed in this drop

- Introduced `DataContext` to centralize hotspot and species data with a unified helper API, replacing page-level static imports.
- Added `AdminContext` with password-gated preview mode, persistent login, and a dedicated `/admin/preview` route.
- Created a reusable `ComingSoon` component and wired AR/Virtual Tour navigation flows to show coming-soon messaging for non-admins.
- Refined the desktop navbar: consistent pill spacing, enhanced active-state glow, and compact “Soon” badges for unreleased features.
- Updated hero and stats sections to surface live counts from context data, aligning with the sticky header counters.

---

## 📁 Project Structure

```
mati-website/
├── 📂 src/
│   ├── 📂 components/          # Reusable UI components
│   │   ├── AnimatedLogo.tsx    # Animated branding elements
│   │   ├── AnimatedText.tsx    # Text animation utilities
│   │   ├── Atmosphere.tsx      # Background effects
│   │   ├── ComingSoon.tsx      # Feature preview component
│   │   ├── Icons.tsx           # Icon system
│   │   ├── ShowcaseNavbar.tsx  # Navigation components
│   │   └── UI.tsx              # Core UI primitives
│   ├── 📂 context/             # State management
│   │   ├── AdminContext.tsx    # Admin authentication
│   │   └── DataContext.tsx     # Centralized data management
│   ├── 📂 data/                # Data layer
│   │   ├── adapters.ts         # Data transformation utilities
│   │   ├── hotspots.ts         # Biodiversity location data
│   │   ├── sample.ts           # Sample/mock data
│   │   └── schema.ts           # TypeScript interfaces
│   ├── 📂 hooks/               # Custom React hooks
│   │   └── useScrollPosition.ts # Scroll behavior utilities
│   ├── 📂 pages/               # Route components
│   │   ├── BiodiversityExplorer.tsx # Species discovery interface
│   │   └── SpeciesDetail.tsx        # Individual species pages
│   ├── 📂 types/               # TypeScript definitions
│   │   └── firebase.d.ts       # Firebase type extensions
│   ├── App.tsx                 # Main application component
│   ├── firebase.ts             # Firebase configuration
│   ├── main.tsx                # Application entry point
│   ├── styles.css              # Global styles & animations
│   └── useTheme.ts             # Theme management
├── 📂 public/
│   └── 📂 ar-demo/             # Static AR demonstration
└── 📄 Configuration files      # Vite, Tailwind, TypeScript configs
```

---

## 🗺️ GIS Integration & Mapping Technology

### **Advanced Geographic Information System**

The platform leverages enterprise-grade GIS technology for precise biodiversity mapping and spatial analysis:

#### **Core GIS Capabilities**
- **Interactive Cartography**: Leaflet.js-powered maps with advanced zoom, pan, and layer management
- **Spatial Data Visualization**: High-precision biodiversity hotspot positioning with coordinate accuracy
- **Multi-layer Ecosystem Mapping**: Separate marine and terrestrial layer systems with custom styling
- **Geospatial Analysis**: Location-based filtering, species distribution mapping, and habitat correlation
- **Responsive Mobile Cartography**: Touch-optimized controls with gesture support

#### **Technical Implementation**
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Mapping Engine** | Leaflet.js 1.9.4 | Lightweight, mobile-optimized GIS library |
| **Coordinate System** | WGS84 (EPSG:4326) | Global compatibility and precision |
| **Data Format** | GeoJSON + Custom Schema | Structured geographic data representation |
| **Base Maps** | OpenStreetMap | High-quality tile layer services |
| **Custom Overlays** | Species markers & habitat zones | Interactive biodiversity visualization |

#### **Data Architecture**
```typescript
// Biodiversity Hotspot Schema
interface BiodiversityHotspot {
  id: string;
  name: string;
  coordinates: [latitude: number, longitude: number];
  type: 'marine' | 'terrestrial';
  species: Species[];
  description: string;
  ecosystem: EcosystemType;
  conservationStatus: ConservationLevel;
  accessibility: AccessibilityInfo;
}

// Species Distribution Mapping
interface SpeciesLocation {
  speciesId: string;
  coordinates: [number, number];
  abundance: 'common' | 'uncommon' | 'rare';
  observationDate: Date;
  habitat: HabitatType;
}
```

The GIS system provides scientifically accurate geographic referencing of Mati City's biodiversity, enabling precise location-based education and research applications.

---

## 🔮 Augmented Reality Experience

### **Immersive AR Technology Stack**

The AR demo showcases cutting-edge web-based augmented reality for biodiversity education:

- Targets file: https://raw.githubusercontent.com/MindAR-js/aframe-examples/master/image-tracking/assets/card-example/card.mind
- Target image: https://raw.githubusercontent.com/MindAR-js/aframe-examples/master/image-tracking/assets/card-example/card.png

How to try:
- Open `/ar-demo/` (or click AR Demo from the navbar), allow camera permissions, and point the camera at the target image (link above). You should see a Duck glTF appear on the marker.

Swap to your own target later:
- Generate a `targets.mind` from your image using MindAR’s target compiler, place it under `public/ar-demo/targets.mind`, and change `imageTargetSrc` in `public/ar-demo/index.html` to `./targets.mind`.

Quick compile from pitcher image (CLI):
- Put your image at `public/ar-demo/images/pitcher.jpg` (replace with your own file name if different)
- Run: `npm run ar:compile` (uses mind-ar-tools via npx to output `public/ar-demo/targets.mind`)
- Open `/ar-demo/?local=1` to force using your local target

---

## 🛠️ Development & Deployment

### **Environment Setup**
```bash
# Recommended Node.js version
nvm use 20

# Clean installation (if needed)
rm -rf node_modules package-lock.json
npm install
```

### **Available Scripts**
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run ar:compile` | Generate AR target recognition data |

### **Troubleshooting**

#### **Common Issues**
- **Port Conflicts**: Vite auto-selects ports (5173 → 5174 → 5175 → 5176)
- **CSS Warnings**: `@tailwind` directives may show warnings in some editors (normal behavior)
- **Node Version**: Ensure Node 18+ for ESM compatibility
- **AR Camera**: Allow camera permissions and ensure HTTPS for production

#### **Performance Optimization**
- Enable browser hardware acceleration for AR features
- Use Chrome DevTools Performance tab for bundle analysis
- Monitor memory usage during extended AR sessions

---

## 🚀 Roadmap & Future Development

### **Phase 1: Content Expansion** *(Current)*
- [ ] Additional biodiversity hotspot mapping
- [ ] Enhanced species database with multimedia content
- [ ] Community contribution system for species observations

### **Phase 2: Backend Integration**
- [ ] Firebase Authentication & Firestore integration
- [ ] Admin content management system
- [ ] Real-time species observation tracking
- [ ] User-generated content moderation

### **Phase 3: Advanced AR Features**
- [ ] Custom species-specific AR markers
- [ ] 3D habitat reconstruction
- [ ] Multi-marker environmental scenes
- [ ] Educational AR guided tours

### **Phase 4: Community & Analytics**
- [ ] User progress tracking and gamification
- [ ] Social sharing and community features
- [ ] Advanced analytics and conservation metrics
- [ ] Integration with scientific research databases

---

---

## 🎯 Final Defense Checklist & Targets

_Assumption: Final defense scheduled for **2025-11-01**. If your defense date differs, update the target dates below accordingly._

This checklist groups every major task we should complete before the official deployment and final defense. Each line has a clear success criterion and a suggested target date. Aim to mark items as Done/Blocked/In Progress in issues or a project board.

Timeline overview (4-week plan):
- Week 1: 2025-10-02 → 2025-10-09
- Week 2: 2025-10-10 → 2025-10-16
- Week 3: 2025-10-17 → 2025-10-23
- Week 4: 2025-10-24 → 2025-10-30
- Buffer & Final Prep: 2025-10-31 → 2025-11-01 (Final Defense)

1) Project & Content
- [ ] Finalize species dataset (photos, descriptions, taxonomy, IUCN) — Target: 2025-10-09 — Success: all species pages have required fields and at least one high-res image
- [ ] Add / verify GPS coordinates for hotspots and test markers — Target: 2025-10-09 — Success: all map markers show correct coords and popup content
- [ ] Curate hero content and simplified copy for presentation — Target: 2025-10-09 — Success: final hero text, 2–3 call-to-action buttons

2) UI / UX / Accessibility
- [ ] Mobile and tablet polish (spacing, touch targets, safe-area) — Target: 2025-10-12 — Success: manual check on at least two phone sizes
- [ ] Keyboard navigation & focus states — Target: 2025-10-12 — Success: tab order logical, visible focus styles
- [ ] WCAG checks (contrast, alt text, reduced-motion) — Target: 2025-10-12 — Success: pass basic Lighthouse accessibility checks

3) AR & GIS Features
- [ ] Test MindAR demo on target physical markers and multiple devices — Target: 2025-10-16 — Success: AR overlay appears and is stable on phones tested
- [ ] Optimize Leaflet maps, clustering, and performance — Target: 2025-10-16 — Success: map loads under 2s on mid-tier devices; clustering works for dense hotspots
- [ ] Prepare AR targets and add to `public/ar-demo/targets.mind` — Target: 2025-10-16 — Success: working compiled target file and README with test steps

4) Backend & Auth (Firebase)
- [ ] Finalize Firebase config (production API keys in environment, not committed) — Target: 2025-10-20 — Success: env var setup documented; no secrets in repo
- [ ] Admin authentication and role checks — Target: 2025-10-20 — Success: secure admin login flow and protected routes
- [ ] Data import script / migration for species & hotspots — Target: 2025-10-20 — Success: idempotent script to seed production DB

5) Performance & Build
- [ ] Remove unused assets and compress images (webp where possible) — Target: 2025-10-23 — Success: build size reduced; key pages < 500KB
- [ ] Run production build, analyze bundle (`npm run build:analyze`) and fix large vendors — Target: 2025-10-23 — Success: no single chunk > 1MB; lazy-load heavy components
- [ ] Lighthouse checks (Performance >= 90 target) — Target: 2025-10-23 — Success: acceptable scores on desktop and mobile

6) Security & Privacy
- [ ] Audit dependencies and apply non-breaking security fixes — Target: 2025-10-23 — Success: `npm audit` has no critical vulnerabilities; list outstanding moderate ones
- [ ] Prepare privacy notice and data retention for any analytics or Firebase storage — Target: 2025-10-23 — Success: short privacy section added to README or site footer

7) SEO & Social
- [ ] Finalize meta tags, open graph images, and structured data (JSON-LD) — Target: 2025-10-26 — Success: social preview and basic structured metadata present
- [ ] Create a concise sitemap.xml and robots.txt for deployment — Target: 2025-10-26 — Success: sitemap available in production

8) Testing & QA
- [ ] Manual QA checklist run (navigation, forms, maps, AR) — Target: 2025-10-27 — Success: QA checklist documented and test passes
- [ ] Add unit/integration tests for critical components (map, auth, species list) — Target: 2025-10-27 — Success: basic tests in repo; CI runs them
- [ ] Cross-browser testing and device testing (Chrome, Safari iOS, Firefox Android) — Target: 2025-10-27 — Success: screenshots or notes for major issues

9) Deployment & CI/CD
- [ ] Setup production hosting (Netlify / Vercel / Firebase Hosting) and preview deploys — Target: 2025-10-29 — Success: production URL ready; preview deploy for PRs
- [ ] Create a simple CI to run build and tests on push (GitHub Actions) — Target: 2025-10-29 — Success: passing workflow for main branch
- [ ] Configure environment variables for production and preview — Target: 2025-10-29 — Success: secrets in CI, not in repo

10) Documentation & Presentation
- [ ] Finalize `README.md` (this checklist + usage + deployment steps) — Target: 2025-10-30 — Success: README covers features, how to run locally, and deployment
- [ ] Prepare demo script and slides for the final defense — Target: 2025-10-30 — Success: 10–15 minute demo script with talking points and backup plan
- [ ] Create short demo video (60–90s) showing map, species page, and AR — Target: 2025-10-30 — Success: video file in `public/` and linked in README

11) Launch & Contingency
- [ ] Soft launch and sanity check on production — Target: 2025-10-31 — Success: basic workflow tested in production (map, species pages, admin login)
- [ ] Final rehearsals and deploy freeze — Target: 2025-11-01 (Final Defense) — Success: site in stable state and team ready

Buffer notes:
- Reserve at least 2 days before defense for hotfixes (2025-10-30 → 2025-10-31).
- If any critical bug appears, move non-essential polish to post-defense backlog.

---

## 📄 License & Contributing

This project is licensed under the MIT License. Contributions are welcome through pull requests and issue reporting.

### **Contributing Guidelines**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Contact & Support

**Project Maintainer**: Wowemwa  
**Repository**: [github.com/Wowemwa/mati-website](https://github.com/Wowemwa/mati-website)  
**Issues**: [Report bugs or request features](https://github.com/Wowemwa/mati-website/issues)

---

<div align="center">

**Built with ❤️ for biodiversity conservation and environmental education**

*Mati City Biodiversity Explorer - Connecting people with nature through technology*

</div>