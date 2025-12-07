# MatiARBioAR User Manual

**Version:** 0.1.0  
**Date:** December 5, 2025  
**Purpose:** Complete guide for end users, educators, tourists, and administrators

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Navigation & Interface](#3-navigation--interface)
4. [Interactive GIS Map](#4-interactive-gis-map)
5. [Biodiversity Explorer](#5-biodiversity-explorer)
6. [Species Details & Information](#6-species-details--information)
7. [Augmented Reality (AR) Experience](#7-augmented-reality-ar-experience)
8. [Search & Filter Features](#8-search--filter-features)
9. [Educational Resources](#9-educational-resources)
10. [Administrator Guide](#10-administrator-guide)
11. [Troubleshooting](#11-troubleshooting)
12. [Frequently Asked Questions](#12-faq)
13. [Appendices](#13-appendices)

---

## 1. Introduction

### 1.1 What is MatiARBioAR?

MatiARBioAR is an **interactive web-based platform** designed to showcase and educate users about the rich biodiversity of Mati City, Davao Oriental, Philippines. The application combines modern web technologies with cutting-edge augmented reality to create an immersive learning experience about local flora and fauna.

### 1.2 Key Features

✅ **Interactive GIS Mapping** - Real-time visualization of biodiversity hotspots  
✅ **Comprehensive Species Database** - Scientifically documented species with detailed profiles  
✅ **Augmented Reality** - Immersive 3D experiences using your device camera  
✅ **Conservation Information** - Up-to-date conservation status and threats  
✅ **Educational Content** - Ecology, distribution, and habitat information  
✅ **Multi-Device Support** - Optimized for desktop, tablet, and mobile devices  
✅ **Dark/Light Themes** - Comfortable viewing in any lighting condition  
✅ **Offline Capability** - Basic functionality works without internet (PWA)

### 1.3 Who Should Use This App?

- **Students & Educators** - Learning and teaching about local biodiversity
- **Tourists & Visitors** - Discovering Mati City's natural wonders
- **Researchers** - Accessing scientific data on local species
- **Conservationists** - Understanding protection efforts and status
- **Local Communities** - Learning about their natural heritage
- **Government Officials** - Planning conservation initiatives

### 1.4 System Requirements

**For General Use:**
- Modern web browser (Chrome, Edge, Firefox, Safari)
- Stable internet connection (3G minimum, 4G/WiFi recommended)
- Screen resolution: 320px minimum width (mobile-optimized)

**For AR Features:**
- Device with rear camera (smartphone or tablet recommended)
- Camera permission enabled
- Chrome or Edge browser (best AR support)
- Good lighting conditions
- Printed AR markers (provided in app)

---

## 2. Getting Started

### 2.1 Accessing the Website

**Online Access (Recommended):**
1. Open your web browser (Chrome, Edge, Firefox, or Safari)
2. Visit the MatiARBioAR website URL (provided by your institution or deployment)
3. The website will load automatically - no installation required!

**First-Time Visitors:**
- The homepage will greet you with an overview of Mati City's biodiversity
- Allow a few seconds for the initial load (images and map data)
- Grant camera permissions when prompted if you want to use AR features

### 2.2 Mobile Installation (Progressive Web App)

You can install MatiARBioAR as an app on your mobile device:

**On Android (Chrome/Edge):**
1. Visit the website
2. Tap the menu (⋮) in the browser
3. Select "Install app" or "Add to Home Screen"
4. Confirm installation
5. The app icon will appear on your home screen

**On iOS (Safari):**
1. Visit the website
2. Tap the Share button (□↑)
3. Scroll and tap "Add to Home Screen"
4. Name it and tap "Add"
5. Access from your home screen like any app

**Benefits of Installation:**
- Quick access from home screen
- Works partially offline
- Full-screen experience
- Faster loading times

### 2.3 Browser Permissions

The app may request the following permissions:

**Camera Access (Required for AR):**
- Purpose: Enable augmented reality features
- When: First time accessing AR viewer
- Privacy: Video stays on your device, never uploaded

**Location (Optional):**
- Purpose: Show nearby hotspots
- When: If implemented in future updates
- Privacy: Used only for map positioning

**Notifications (Optional):**
- Purpose: Updates about new species or features
- When: If you choose to enable
- Control: Can be disabled anytime in browser settings

---

## 3. Navigation & Interface

### 3.1 Main Navigation Bar

Located at the top of the page, the navigation bar provides access to all major sections:

**🏠 Home**
- Returns to the main landing page
- Overview of the platform
- Quick access to featured species and hotspots

**🗺️ GIS Map**
- Interactive map of conservation sites
- Biodiversity hotspot visualization
- Species distribution markers

**🔍 Explorer**
- Browse all documented species
- Advanced search and filtering
- Species comparison tools

**🥽 AR Experience**
- Augmented reality viewer
- Interactive 3D models
- Marker-based AR activities

**ℹ️ About**
- Project information
- Team credits
- Educational objectives
- Contact information

**⚙️ Admin** (Protected)
- Management dashboard
- Data entry and editing
- Analytics and reports

### 3.2 Theme Toggle

**Sun/Moon Icon** (Top right corner)
- Click to switch between light and dark themes
- Your preference is saved automatically
- Dark theme reduces eye strain in low light
- Light theme improves visibility in bright conditions

### 3.3 Mobile Menu

On mobile devices (screens < 768px):
- Hamburger menu (☰) appears in top-right
- Tap to expand full navigation
- Tap outside or X to close
- Swipe gestures supported on some sections

### 3.4 Page Layout

**Desktop Layout:**
- Full navigation bar at top
- Content in center (max 1400px wide)
- Floating feedback button (bottom-right)
- Smooth scrolling between sections

**Mobile Layout:**
- Collapsible navigation menu
- Single-column content
- Touch-optimized buttons and controls
- Swipeable image galleries

### 3.5 Common UI Elements

**Badges & Tags:**
- 🔴 **Red** - Critically Endangered (CR)
- 🟠 **Orange** - Endangered (EN)
- 🟡 **Yellow** - Vulnerable (VU)
- 🟢 **Green** - Least Concern (LC)
- ⚪ **Gray** - Data Deficient (DD)
- 🌿 **Green badge** - Flora species
- 🐾 **Amber badge** - Fauna species
- ⭐ **Purple badge** - Endemic to Philippines

**Buttons:**
- **Gradient buttons** - Primary actions (View Details, Start AR)
- **Outline buttons** - Secondary actions (Cancel, Close)
- **Icon buttons** - Quick actions (Share, Favorite)

**Loading States:**
- Spinning circle = Loading content
- Shimmer effect = Loading images
- Progress bar = Loading large datasets

---

## 4. Interactive GIS Map

### 4.1 Overview

The GIS (Geographic Information System) Map displays all biodiversity hotspots and conservation sites in Mati City using interactive markers and detailed geographic data.

### 4.2 Basic Map Controls

**Navigation:**
- **Pan:** Click and drag to move around the map
  - Mobile: Use one finger to drag
- **Zoom:** Use mouse wheel or +/- buttons
  - Mobile: Pinch to zoom in/out
- **Reset View:** Click the home icon (🏠) to return to Mati City

**Map Layers:**
- **Street Map:** Default view with roads and labels
- **Satellite:** Aerial imagery (if available)
- **Terrain:** Topographic view showing elevation

**Controls Location:**
- Zoom buttons: Top-left corner
- Layer selector: Top-right corner
- Scale indicator: Bottom-left corner

### 4.3 Understanding Map Markers

**Marker Types:**

🏔️ **Green Mountain Icon** - Terrestrial conservation sites
- Forests, mountains, and land-based ecosystems
- Click to see site details and species list

🌊 **Blue Wave Icon** - Marine conservation sites
- Coastal areas, marine protected areas
- Shows aquatic species and coral data

📍 **Species Markers**
- Individual species observation points
- Color-coded by conservation status
- Clustered when zoomed out for clarity

**Marker Colors:**
- **Dark Red** - Critically Endangered species
- **Orange** - Endangered species
- **Yellow** - Vulnerable species
- **Green** - Least Concern species
- **Blue** - Marine ecosystems
- **Green** - Terrestrial ecosystems

### 4.4 Interacting with Markers

**Click a Marker:**
1. Popup appears with basic information
2. Site name and type displayed
3. Number of documented species shown
4. "View Details" button for full information

**View Site Details:**
- Full description of the conservation area
- Complete species list (flora and fauna)
- Conservation status and protection level
- Visitor information and guidelines
- Coordinates and area size
- Threats and conservation efforts

**Filter by Type:**
- Toggle checkboxes to show/hide:
  - ☑️ Terrestrial sites
  - ☑️ Marine sites
  - ☑️ Flora species
  - ☑️ Fauna species
  - ☑️ Endemic species only

### 4.5 Map Search Features

**Search Bar:**
- Type site name to locate quickly
- Search by barangay or location
- Find specific coordinates
- Results highlight automatically

**Nearby Sites:**
- If location enabled, see sites near you
- Distance calculations from your position
- Directions to conservation areas

### 4.6 Advanced Map Features

**Heatmap View:**
- Shows biodiversity concentration
- Red = High species density
- Blue = Lower species density
- Toggle on/off in controls

**Draw & Measure:**
- Draw polygons for area calculation
- Measure distances between points
- Export custom boundaries

**Export Map:**
- Download current view as image
- Share map with specific markers
- Print map for field use

### 4.7 Mobile Map Tips

📱 **Touch Gestures:**
- One finger drag - Pan map
- Two finger pinch - Zoom in/out
- Two finger rotate - Rotate map (if enabled)
- Double tap - Quick zoom to location

⚡ **Performance:**
- Reduce marker clusters for faster loading
- Use WiFi for initial map load
- Download offline maps (if supported)

---

## 5. Biodiversity Explorer

### 5.1 Introduction to Explorer

The Biodiversity Explorer is your gateway to discovering all documented species in Mati City. Browse, search, and learn about hundreds of flora and fauna species with detailed scientific information.

### 5.2 Explorer Interface

**Main Sections:**

📊 **Statistics Dashboard** (Top of page)
- Total number of documented species
- Flora vs Fauna breakdown
- Conservation status distribution
- Endemic species count
- Recent additions

🔍 **Search & Filter Panel**
- Text search box
- Conservation status filter
- Type filter (Flora/Fauna)
- Site/Location filter
- Endemic only toggle
- Sort options

📋 **Species Grid**
- Card-based layout
- 50 species per page (auto-load more)
- Image thumbnails
- Quick info badges
- "View Details" buttons

### 5.3 Browsing Species

**Species Cards Include:**
- **Thumbnail Image** - High-quality species photo
- **Common Name** - Local/English name
- **Scientific Name** - Latin taxonomic name
- **Status Badge** - Conservation status (CR, EN, VU, NT, LC, DD)
- **Type Badge** - Flora (🌿) or Fauna (🐾)
- **Endemic Badge** - ⭐ if endemic to Philippines
- **Quick Stats** - Habitat, locations found

**Card Interactions:**
- **Hover** (Desktop) - Card lifts with shadow effect
- **Click anywhere** - Opens detailed species modal
- **Quick preview** - See first few lines of description

### 5.4 Search Functionality

**Text Search:**
- Search by common name (e.g., "Philippine Eagle")
- Search by scientific name (e.g., "Pithecophaga jefferyi")
- Search by description keywords
- Fuzzy matching helps with spelling errors
- Real-time results as you type (300ms debounce)

**Search Examples:**
```
"eagle" → Finds all eagle species
"endangered tree" → Finds endangered flora
"reef" → Finds coral and reef species
"Davao" → Species mentions in description
```

**Tips for Better Searches:**
- Use specific terms for precise results
- Try both common and scientific names
- Include habitat keywords
- Use conservation status terms

### 5.5 Filtering Options

**Conservation Status Filter:**
- All statuses (default)
- CR - Critically Endangered
- EN - Endangered
- VU - Vulnerable
- NT - Near Threatened
- LC - Least Concern
- DD - Data Deficient

**Type Filter:**
- All types (default)
- Flora only (plants, trees, flowers)
- Fauna only (animals, birds, insects)

**Site/Location Filter:**
- All sites (default)
- Specific conservation site
- By barangay
- By ecosystem type (marine/terrestrial)

**Endemic Filter:**
- ☑️ Show endemic species only
- Shows only Philippines-native species
- Highlights conservation priorities

**Combining Filters:**
- Use multiple filters simultaneously
- Example: "Endangered + Flora + Mount Hamiguitan"
- Filters work with search query
- Results update in real-time

### 5.6 Sorting Options

**Sort species by:**
- **Conservation Priority** (default) - CR → EN → VU → NT → LC → DD
- **Alphabetical A-Z** - By common name
- **Scientific Name** - Taxonomic order
- **Recently Added** - Newest entries first
- **Most Documented** - Species with most site records

### 5.7 Loading & Pagination

**Auto-Load More:**
- Initially shows 50 species
- Scroll to bottom to load 50 more automatically
- Loading indicator appears during fetch
- Continue scrolling to load all results

**Performance:**
- Lazy loading of images
- Virtualized scrolling on large datasets
- Smooth transitions between loads
- Total count shown at top

---

## 6. Species Details & Information

### 6.1 Opening Species Details

**From Explorer:**
- Click any species card
- Animated modal opens with full details
- Smooth zoom-in transition

**From Map:**
- Click species marker on GIS map
- Popup shows quick info
- Click "View Details" for full modal

**From Related Species:**
- Links within species descriptions
- "Found in same location" suggestions
- Taxonomic family connections

### 6.2 Species Detail Modal

**Modal Layout:**

**Header Section:**
- 🖼️ **Hero Image** - Large, high-quality photo
- 📝 **Caption** - Photo description and credit
- 🏷️ **Status Badges** - Conservation status, type, endemic
- 📛 **Common Name** - Large, animated title
- 🔬 **Scientific Name** - Italic, below common name
- 📖 **Short Description** - One-paragraph overview

**Tab Navigation:**
1. **Overview** - General information
2. **Ecology** - Habitat and behaviors
3. **Distribution** - Where it's found
4. **Conservation** - Protection status and threats

**Close Button:**
- X button in top-right corner
- Click anywhere outside modal (desktop)
- Press ESC key
- Swipe down (mobile)

### 6.3 Overview Tab

**Included Information:**
- 📝 **Full Description** - Detailed species profile
- ✨ **Key Features** - Highlighted characteristics
  - Physical appearance
  - Unique traits
  - Identification tips
  - Interesting facts
- 📸 **Image Gallery** - Multiple photos (if available)
- 🏅 **Recognition** - Awards or significance

**Key Features Section:**
- Bullet-pointed highlights
- Easy-to-scan format
- Most important characteristics first
- Helpful for field identification

### 6.4 Ecology Tab

**Ecological Information:**

🏞️ **Habitat:**
- Primary ecosystem (forest, reef, grassland)
- Elevation range
- Preferred conditions (temperature, humidity)
- Microhabitat details

🥗 **Diet & Feeding (Fauna):**
- Food sources
- Feeding behavior
- Hunting/foraging patterns
- Dietary preferences

🌱 **Growth & Reproduction (Flora):**
- Growth rate and conditions
- Flowering/fruiting season
- Pollination method
- Seed dispersal

🔄 **Life Cycle:**
- Developmental stages
- Lifespan
- Breeding season (fauna)
- Reproduction strategy

🤝 **Ecological Role:**
- Position in food web
- Ecosystem services provided
- Symbiotic relationships
- Keystone species information

**iNaturalist Integration:**
- Real observations from community
- Recent sightings
- Observation photos
- Seasonal patterns

### 6.5 Distribution Tab

**Geographic Information:**

🗺️ **Interactive Distribution Map:**
- Global range (if applicable)
- Philippine distribution
- Mati City specific locations
- Observation density heatmap

📍 **Conservation Sites:**
- List of sites where species found
- Site type (marine/terrestrial)
- Coordinates
- Click site to view full details

🌍 **Range Description:**
- Native range
- Introduced/invasive status (if applicable)
- Elevation limits
- Climate preferences

📊 **Population Data:**
- Estimated population (if known)
- Population trend (increasing/stable/declining)
- Distribution changes over time

**iNaturalist Map:**
- Community-contributed observations
- Verified sightings
- Date of observations
- Observer information (privacy-respected)

### 6.6 Conservation Tab

**Conservation Information:**

⚠️ **IUCN Status:**
- Official conservation category
- Status explanation
- Assessment date
- Criteria for classification

📉 **Threats:**
- Habitat loss details
- Human activities impact
- Climate change effects
- Invasive species competition
- Pollution sources
- Over-exploitation risks

🛡️ **Protection Measures:**
- Legal protection status
- Protected areas where found
- Conservation programs
- Active management efforts
- Research initiatives

🎯 **Conservation Actions:**
- What's being done
- Organizations involved
- Success stories
- How to help

💚 **Get Involved:**
- Volunteer opportunities
- Citizen science projects
- Donation information
- Awareness campaigns

**Philippine-Specific:**
- DENR classification
- Local protection laws
- Endemic species priority
- Cultural significance

### 6.7 Media Gallery

**Image Viewer:**
- High-resolution photos
- Swipe/arrow navigation
- Zoom functionality
- Pinch to zoom (mobile)
- Captions and credits
- Download option (if permitted)

**Types of Images:**
- Full organism photos
- Close-up details
- Habitat shots
- Juvenile/adult stages
- Seasonal variations
- Behavior documentation

### 6.8 Related Information

**Quick Links:**
- 🔗 Other species in same family
- 🗺️ Other species at same site
- 📚 External resources (IUCN, Wikipedia)
- 🔬 Scientific papers
- 📖 Field guides

**Social Sharing:**
- Share species on social media
- Copy link to species
- Download species card
- Email species information

---

## 7. Augmented Reality (AR) Experience

### 7.1 What is AR in MatiARBioAR?

Augmented Reality overlays digital 3D models and information onto the real world through your device's camera. Point at special AR markers to see species come to life!

**AR Features:**
- 📱 3D species models
- 🎯 Marker-based activation
- 📚 Interactive learning content
- 🎮 Educational games
- 📸 Photo opportunities

### 7.2 AR System Requirements

**Device Requirements:**
- Smartphone or tablet with rear camera
- Minimum 2GB RAM
- Gyroscope and accelerometer sensors
- Recent operating system (Android 8+, iOS 12+)

**Browser Requirements:**
- **Best:** Chrome or Edge on Android
- **Good:** Safari on iOS
- **Avoid:** Firefox (limited AR support)

**Environment Requirements:**
- Good lighting (not too bright, not too dark)
- Stable surface for markers
- Avoid direct sunlight or glare
- 30-100cm distance from marker

### 7.3 Getting Started with AR

**Step-by-Step Setup:**

1. **Access AR Viewer:**
   - Tap "AR Experience" in main navigation
   - Or use QR code if provided at conservation site
   - Select species to view in AR

2. **Grant Camera Permission:**
   - Browser will request camera access
   - Tap "Allow" or "OK"
   - Permission saved for future visits
   - *Privacy: Video never leaves your device*

3. **Prepare AR Marker:**
   - Print AR markers from app (Download section)
   - Use provided markers at conservation sites
   - Place marker on flat, stable surface
   - Ensure good lighting on marker

4. **Point and Discover:**
   - Point camera at AR marker
   - Hold steady for 2-3 seconds
   - 3D model appears on marker
   - Move device to see from different angles

### 7.4 Using AR Features

**Basic AR Controls:**

📹 **Camera View:**
- Real-time camera feed with overlays
- AR elements appear on markers
- Smooth tracking as you move
- Multiple markers can be active

🎮 **Interactions:**
- Tap 3D models for information
- Pinch to resize (some models)
- Swipe for animations
- Tap buttons for sounds/facts

📸 **Capture Moments:**
- Screenshot button in corner
- Captures AR scene with model
- Save to device gallery
- Share on social media

🔊 **Audio Features:**
- Animal sounds (for fauna)
- Narration of facts
- Environmental ambiance
- Toggle on/off with speaker icon

### 7.5 AR Marker Types

**Species Markers:**
- Individual species-specific markers
- Unique ID code on each marker
- Shows 3D model of that species
- Includes fact panels

**Ecosystem Markers:**
- Shows multiple species in habitat
- Demonstrates relationships
- Interactive food web
- Day/night cycle visualization

**Educational Markers:**
- Quiz questions appear
- Interactive lessons
- Conservation challenges
- Gamified learning

### 7.6 AR Experiences by Species

**Flora (Plants) AR:**
- 360° view of full plant
- Zoom into flower details
- See growth stages over time
- Pollinator interactions
- Seasonal changes

**Fauna (Animals) AR:**
- Animated 3D models
- Movement and behaviors
- Size comparison to real-life
- Sound effects
- Feeding demonstrations

**Endemic Species:**
- Special "Endemic" badge
- Philippine map showing range
- Cultural significance information
- Conservation importance

### 7.7 Downloading AR Markers

**Get Markers:**
1. In AR viewer, tap "Download Markers"
2. Select species or marker set
3. PDF downloads automatically
4. Print on standard paper (A4/Letter)

**Printing Tips:**
- Use color printer for best results
- 100% scale (no fit-to-page)
- High quality setting
- Matte paper recommended
- Avoid glossy paper (causes glare)

**Marker Care:**
- Keep markers flat and unwrinkled
- Laminate for outdoor use
- Avoid water damage
- Store in folder between uses

### 7.8 AR Field Activities

**At Conservation Sites:**
- Follow marker trail
- Scan markers at designated spots
- Collect digital badges
- Complete field journal
- Share discoveries

**In Classroom:**
- Virtual field trip
- Species identification practice
- Ecosystem simulation
- Group AR activities
- Assessment tools

**At Home:**
- Print home marker set
- Family learning time
- Homework activities
- Virtual exhibition

### 7.9 AR Troubleshooting

**AR Not Working?**

❌ **Camera not detecting marker:**
- Ensure good lighting
- Clean camera lens
- Hold device steady
- Bring marker closer/further
- Check marker isn't damaged

❌ **3D model not appearing:**
- Wait 3-5 seconds for loading
- Check internet connection
- Restart AR viewer
- Clear browser cache
- Try different marker

❌ **Tracking is jittery:**
- Improve lighting
- Reduce hand movement
- Place marker on stable surface
- Close other apps
- Restart device if necessary

❌ **Performance issues:**
- Close background apps
- Reduce screen brightness
- Disable other browser tabs
- Use WiFi instead of mobile data

**Camera Permission Denied?**
1. Go to browser settings
2. Find site permissions
3. Enable camera for MatiARBioAR
4. Reload the AR viewer

---

## 8. Search & Filter Features

### 8.1 Global Search

**Search Bar Location:**
- Top of Biodiversity Explorer
- Always visible while scrolling
- Instant results dropdown

**What You Can Search:**
- Species common names
- Scientific (Latin) names
- Description keywords
- Habitat types
- Location names
- Conservation status terms

**Search Tips:**
```
✅ Good searches:
- "philippine eagle"
- "endangered mammals"
- "coral species"
- "mount hamiguitan plants"
- "endemic birds"

⚠️ Less effective:
- Single letters
- Very common words
- Incomplete scientific names
```

### 8.2 Smart Search Features

**Fuzzy Matching:**
- Tolerates spelling errors
- Finds similar words
- Example: "egale" → "eagle"
- Threshold: 36% similarity

**Auto-Complete:**
- Suggestions appear as you type
- Shows popular searches
- Recent search history
- Quick select to search

**Search Highlighting:**
- Matched terms highlighted in results
- Easy to see why item matched
- Works in names and descriptions

### 8.3 Advanced Filters

**Filter Panel:**
- Expandable sidebar (desktop)
- Slide-up panel (mobile)
- Multiple filters apply simultaneously
- Clear all filters button

**Conservation Status:**
```
🔴 CR - Critically Endangered (highest priority)
🟠 EN - Endangered
🟡 VU - Vulnerable  
🔵 NT - Near Threatened
🟢 LC - Least Concern (most species)
⚪ DD - Data Deficient
```

**Type Categories:**
- 🌿 Flora (all plants)
  - Trees
  - Shrubs
  - Herbs
  - Vines
  - Ferns
  - Orchids
- 🐾 Fauna (all animals)
  - Mammals
  - Birds
  - Reptiles
  - Amphibians
  - Fish
  - Invertebrates

**Location Filters:**
- By conservation site
- By barangay
- By ecosystem (Marine/Terrestrial)
- By elevation range

**Special Filters:**
- ⭐ Endemic only
- 📸 Has photos
- 🗺️ Has distribution map
- 🥽 AR available
- 📝 Recently updated

### 8.4 Filter Combinations

**Example Workflows:**

**Find endangered animals in Mt. Hamiguitan:**
1. Type: Fauna ✓
2. Status: EN ✓
3. Location: Mount Hamiguitan ✓
4. Results: 12 species found

**Find all endemic plants with AR:**
1. Type: Flora ✓
2. Endemic: ✓
3. AR Available: ✓
4. Results: 8 species found

**Quick status overview:**
1. Status: CR ✓
2. View all critically endangered
3. Prioritize conservation learning

### 8.5 Sorting Results

**Sort Options:**
- **Relevance** (default for searches)
- **Conservation Priority** (CR first)
- **Alphabetical A-Z**
- **Scientific Name**
- **Recently Added**
- **Most Viewed**

**Sort Direction:**
- Ascending (A→Z, Low→High)
- Descending (Z→A, High→Low)

### 8.6 Saving Searches

**Bookmarking:**
- Favorite specific species
- Save filter combinations
- Quick access from profile
- Share search links with others

**Search History:**
- Last 20 searches saved
- Clear history option
- Privacy: stored locally only

---

## 9. Educational Resources

### 9.1 For Students

**Learning Features:**
- 📚 Species fact sheets
- 🎓 Quiz mode (if available)
- 📊 Comparison tools
- 🗺️ Geographic learning
- 🥽 AR field experiences

**Study Guides:**
- Conservation status explanations
- Ecosystem concepts
- Biodiversity importance
- Philippine endemic species
- Taxonomy basics

**Assignments:**
- Species identification practice
- Habitat mapping exercises
- Conservation status analysis
- Field observation logs
- AR scavenger hunts

### 9.2 For Teachers

**Classroom Integration:**
- Projection-ready interface
- Discussion prompts included
- Assessment rubrics
- Printable materials
- Lesson plan alignment

**Curriculum Connections:**
- Science (Biology, Ecology)
- Geography (Philippine regions)
- Environmental Education
- Technology (AR, GIS)
- Languages (Scientific names)

**Activities:**
- Virtual field trips
- Species research projects
- Conservation debates
- Ecosystem modeling
- Citizen science participation

### 9.3 For Tourists

**Pre-Visit Planning:**
- See what species to expect
- Plan site visits
- Download offline content
- Print AR markers
- Weather and season info

**During Visit:**
- Mobile-optimized interface
- GPS integration (if enabled)
- Field identification
- AR experiences at sites
- Photo documentation

**Post-Visit:**
- Review photos and notes
- Share experiences
- Contribute observations
- Plan return visits

### 9.4 For Researchers

**Data Access:**
- Scientific names and taxonomy
- Observation records
- Distribution data
- Conservation status sources
- Bibliography and references

**Documentation:**
- Methodology notes
- Data collection protocols
- Species identification keys
- Habitat classifications
- Coordinate systems (WGS84)

**Collaboration:**
- Submit corrections
- Contribute data
- Share research
- Update distribution maps

### 9.5 Downloadable Resources

**Available Downloads:**
- 📄 Species fact sheets (PDF)
- 🖼️ High-resolution images
- 🗺️ Distribution maps
- 🎯 AR marker sets
- 📊 Data exports (CSV)

**Access:**
- Download buttons on species pages
- Bulk export in Admin panel
- Attribution required for use
- Creative Commons licensing

---


---

## 11. Troubleshooting

### 11.1 Common Issues & Solutions

**Website Won't Load:**
- Check internet connection
- Try different browser (Chrome, Edge, Firefox recommended)
- Clear browser cache: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
- Disable browser extensions temporarily
- Try incognito/private browsing mode

**Map Not Displaying:**
- Refresh the page (F5 or Ctrl+R)
- Ensure JavaScript is enabled
- Check browser console for errors (F12 → Console tab)
- Verify internet connection is stable
- Try zooming out to see if markers appear

**AR Not Working:**
- Grant camera permissions in browser settings
- Use Chrome or Edge for best AR support
- Ensure good lighting (not too bright or dark)
- Hold device steady, 30-100cm from marker
- Clean camera lens
- Print markers clearly without wrinkles or glare
- Check if device has gyroscope/accelerometer sensors

**Search Not Finding Results:**
- Check spelling of search terms
- Try partial words or scientific names
- Remove filters and try again
- Refresh the page
- Clear browser cache

**Images Not Loading:**
- Wait for lazy loading to complete
- Check internet speed
- Disable ad blockers temporarily
- Try refreshing the page
- Report broken images via feedback

**Performance Issues:**
- Close unnecessary browser tabs
- Use WiFi instead of mobile data
- Reduce active map layers
- Clear browser cache and cookies
- Close background applications
- Update browser to latest version

**Admin Panel Access Issues:**
- Verify admin credentials
- Check if session has expired (60 min timeout)
- Clear cookies and login again
- Contact super admin for access issues
- Verify account has proper permissions

### 11.2 Getting Help

**Self-Help Resources:**
- Read relevant sections of this manual
- Check FAQ section below
- Search GitHub issues for similar problems

**Contact Support:**
- Use in-app feedback button
- GitHub Issues: https://github.com/Wowemwa/MatiARBioAR/issues
- Include: browser version, device type, steps to reproduce, screenshots

---

## 12. Frequently Asked Questions (FAQ)

### 12.1 General Questions

**Q: Is this application free to use?**  
A: Yes, MatiARBioAR is free for educational, research, and personal use.

**Q: Do I need to install anything?**  
A: No installation required! Access via web browser. Optionally install as PWA on mobile.

**Q: Do I need an account?**  
A: No account needed for browsing. Only administrators need accounts for content management.

**Q: Can I use this offline?**  
A: Basic features work offline after first visit (PWA). Maps and AR require internet.

**Q: Is my privacy protected?**  
A: Yes. No personal data collection. Camera is used locally only, video never uploaded.

### 12.2 Species & Data Questions

**Q: How many species are in the database?**  
A: The database is continuously growing. Check Explorer for current count.

**Q: How accurate is the conservation status?**  
A: Based on IUCN Red List and verified with local data. Regularly updated.

**Q: Can I submit species observations?**  
A: Yes! Use the feedback form to submit sightings with photos, location, and date.

**Q: What if I find an error?**  
A: Report via feedback button with specific details. Admin team reviews all submissions.

**Q: Why isn't [specific species] included?**  
A: Database focuses on documented species in Mati City. Submit suggestions via feedback.

### 12.3 Technical Questions

**Q: Which browsers work best?**  
A: Chrome and Edge (best for AR), Firefox, Safari. Use latest versions.

**Q: Why is AR not working on my iPhone?**  
A: AR.js has limited iOS support. Use Safari and grant camera permissions. Android recommended for AR.

**Q: How much mobile data does this use?**  
A: ~5MB initial load, ~1-2MB per species page, ~5MB for AR sessions. WiFi recommended.

### 12.4 Educational Use

**Q: Can teachers use this in classrooms?**  
A: Absolutely! Designed for educational use. Projector-friendly interface included.

**Q: Are there lesson plans available?**  
A: Basic educational resources included. More comprehensive materials in development.

**Q: How do I cite this in research?**  
A: "MatiARBioAR (2025). Mati City Biodiversity Explorer. https://github.com/Wowemwa/MatiARBioAR. Accessed [date]."

### 12.5 Conservation Questions

**Q: How can I help protect these species?**  
A: Learn about threats, support conservation organizations, participate in citizen science, spread awareness.

**Q: Can I visit these conservation sites?**  
A: Many sites are open to public with guidelines. Check site details for visitor information and restrictions.

**Q: How can I report wildlife sightings?**  
A: Submit through feedback form or contribute to iNaturalist. Include photos, location, and date.

---

## 13. Appendices

### Appendix A: Glossary of Terms

**Biodiversity** - The variety of all life forms including species, genetic, and ecosystem diversity.

**Conservation Status** - IUCN classification indicating a species' risk of extinction (CR, EN, VU, NT, LC, DD).

**Endemic** - Species naturally occurring only in a specific geographic region (e.g., Philippines).

**GIS (Geographic Information System)** - Technology for capturing, managing, and analyzing spatial/geographic data.

**Hotspot (Biodiversity)** - Area with exceptional concentration of endemic species facing significant habitat loss.

**IUCN** - International Union for Conservation of Nature, global authority on conservation status.

**Marker-based AR** - Augmented reality activated by recognizing and tracking printed markers/images.

**PWA (Progressive Web App)** - Web application that can be installed and work offline like native apps.

**Taxon (plural: Taxa)** - Taxonomic group of any rank (species, genus, family, order, etc.).

**WGS84** - World Geodetic System 1984, standard coordinate reference system for GPS and mapping.

### Appendix B: Conservation Status Guide

| Code | IUCN Category | Description | Color Code |
|------|---------------|-------------|------------|
| **CR** | Critically Endangered | Extremely high risk of extinction | 🔴 Red |
| **EN** | Endangered | High risk of extinction | 🟠 Orange |
| **VU** | Vulnerable | High risk of becoming endangered | 🟡 Yellow |
| **NT** | Near Threatened | Likely to become threatened soon | 🔵 Blue |
| **LC** | Least Concern | Widespread and abundant | 🟢 Green |
| **DD** | Data Deficient | Inadequate information | ⚪ Gray |

### Appendix C: Quick Reference

**Keyboard Shortcuts:**
- `Ctrl/Cmd + F` - Search species
- `Esc` - Close modal or popup
- `Ctrl/Cmd + +/-` - Zoom in/out
- `F11` - Full screen mode
- `F5` - Refresh page
- Arrow keys - Navigate through results

**Mobile Touch Gestures:**
- Swipe left/right - Navigate image galleries
- Pinch to zoom - Map and AR viewing
- Two-finger drag - Pan map
- Double tap - Quick zoom to location
- Swipe down - Refresh/close modal

**Common URLs:**
- Home: `/`
- Species Explorer: `/explorer`
- GIS Map: `/map`
- AR Experience: `/ar`
- About: `/about`
- Admin Panel: `/admin` (requires login)

**Color Codes:**
- 🔴 Red - Critically Endangered
- 🟠 Orange - Endangered
- 🟡 Yellow - Vulnerable
- 🔵 Blue - Near Threatened / Marine
- 🟢 Green - Least Concern / Terrestrial
- ⭐ Purple - Endemic species

### Appendix D: Educational Resources

**For Teachers:**
- Use species profiles for lesson content
- AR experiences for virtual field trips
- Map exploration for geography lessons
- Conservation status for environmental education
- Scientific names for taxonomy lessons

**For Students:**
- Species identification practice
- Ecosystem research projects
- Conservation awareness campaigns
- Field observation journals
- AR scavenger hunts

**Activity Ideas:**
- Compare endemic vs introduced species
- Map species distribution patterns
- Create conservation action plans
- Design AR markers for local species
- Document biodiversity in your area

### Appendix E: Contact & Support

**Project Information:**
- **Repository:** https://github.com/Wowemwa/MatiARBioAR
- **Developer:** Wowemwa
- **Bug Reports:** GitHub Issues
- **Feature Requests:** GitHub Discussions

**Conservation Partners:**
- **DENR** - Department of Environment and Natural Resources
- **Mati City LGU** - Local Government Unit
- **Local NGOs** - Conservation organizations

**Contributing:**
- Report bugs and issues
- Share feedback and suggestions
- Contribute species observations
- Participate in citizen science

### Appendix F: Acknowledgments

This project would not be possible without:

- **Scientific Community** - Researchers who documented Mati City's biodiversity
- **iNaturalist Contributors** - Community observations and photos
- **Conservation Organizations** - DENR, LGUs, and local NGOs
- **Open Source Community** - Developers of React, Leaflet, A-Frame, and other tools
- **OpenStreetMap** - Volunteers providing map data
- **Educational Institutions** - Supporting biodiversity research
- **Local Communities** - Stewards of natural heritage

---

## 14. License & Legal Information

**Software License:**  
MIT License - Free to use, modify, and distribute with attribution.

**Content License:**  
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)
- ✅ Share and adapt content
- ✅ Attribution required
- ❌ Commercial use prohibited without permission
- ✅ Share derivatives under same license

**Third-Party Licenses:**
- React, Leaflet, A-Frame: Various open source licenses
- OpenStreetMap data: ODbL (Open Database License)
- Species images: Individual attributions in captions

**Disclaimer:**  
This application is provided for educational and informational purposes. While we strive for accuracy, species information should be verified with official sources for critical conservation decisions. The developers are not liable for any consequences arising from the use of this application.

**Copyright © 2025 MatiARBioAR Project Team**

---

**End of User Manual**

**Document Version:** 2.0 - Comprehensive Edition  
**Last Updated:** December 5, 2025  
**For Capstone Project Documentation**

---

*For the most up-to-date information, visit: https://github.com/Wowemwa/MatiARBioAR*

*Thank you for using MatiARBioAR to explore and protect Mati City's incredible biodiversity!* 🌿🦜🌊
