# MatiARBio System Data Dictionary

## Overview
This data dictionary documents all data entities, attributes, and relationships in the MatiARBio (Mati Augmented Reality Biodiversity) system - a biodiversity conservation platform for Mati City.

---

## 1. Species Entity

### Description
Core entity representing individual species (flora and fauna) found in Mati City's conservation areas.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | String | Yes | Unique identifier for the species | UUID/String | "species_001" |
| `commonName` | String | Yes | Common/local name of the species | Any string | "Philippine Eagle" |
| `scientificName` | String | Yes | Scientific/binomial nomenclature | Latin binomial | "Pithecophaga jefferyi" |
| `description` | String | Yes | Detailed description of the species | Text (min 50 chars) | "A critically endangered bird..." |
| `type` | Enum | Yes | Classification category | 'flora', 'fauna' | "fauna" |
| `status` | Enum | Yes | IUCN conservation status | 'CR', 'EN', 'VU', 'NT', 'LC', 'DD' | "CR" |
| `endemic` | Boolean | Yes | Whether species is endemic to the region | true, false | true |
| `habitats` | String[] | Yes | Array of habitat types | Array of strings | ["Tropical Rainforest", "Mountain Forest"] |
| `siteIds` | String[] | Yes | IDs of conservation sites where found | Array of UUIDs | ["site_001", "site_002"] |
| `media` | Media[] | No | Array of media objects (photos/videos) | Array of Media objects | See Media Entity |
| `threats` | String[] | No | Known threats to the species | Array of strings | ["Habitat Loss", "Hunting"] |
| `conservationEfforts` | String | No | Current conservation initiatives | Text | "Captive breeding program..." |
| `population` | String | No | Population estimate/status | Text | "Less than 400 individuals" |
| `dietaryHabits` | String | No | Feeding behavior (fauna only) | Text | "Carnivorous, feeds on monkeys" |
| `bloomingSeason` | String | No | Flowering period (flora only) | Text | "March to May" |

### IUCN Status Codes

| Code | Full Name | Description |
|------|-----------|-------------|
| CR | Critically Endangered | Extremely high risk of extinction |
| EN | Endangered | High risk of extinction |
| VU | Vulnerable | High risk of endangerment |
| NT | Near Threatened | Likely to become endangered |
| LC | Least Concern | Lowest risk |
| DD | Data Deficient | Insufficient information |

---

## 2. Hotspot (Conservation Site) Entity

### Description
Protected areas, biodiversity hotspots, and conservation sites in Mati City.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | String | Yes | Unique identifier for the site | UUID/String | "site_001" |
| `name` | String | Yes | Official name of the conservation site | Any string | "Mount Hamiguitan Range Wildlife Sanctuary" |
| `description` | String | Yes | Detailed description of the site | Text (min 100 chars) | "A UNESCO World Heritage Site..." |
| `coordinates` | Coordinates | Yes | Geographic location | {lat, lng} object | {lat: 6.7485, lng: 126.1689} |
| `areaSize` | Number | No | Size in hectares | Positive number | 6834 |
| `establishedYear` | Number | No | Year of establishment | 4-digit year | 2004 |
| `significance` | String[] | Yes | Key features/importance | Array of strings | ["UNESCO Site", "High Endemism"] |
| `speciesCount` | Number | Computed | Total species found at site | Positive integer | 156 |
| `floraCount` | Number | Computed | Number of flora species | Positive integer | 89 |
| `faunaCount` | Number | Computed | Number of fauna species | Positive integer | 67 |
| `threatenedSpeciesCount` | Number | Computed | Count of CR/EN/VU species | Positive integer | 42 |
| `media` | Media[] | No | Photos/videos of the site | Array of Media objects | See Media Entity |
| `activities` | String[] | No | Allowed conservation activities | Array of strings | ["Research", "Eco-tourism"] |
| `threats` | String[] | No | Current threats to the site | Array of strings | ["Illegal Logging", "Mining"] |

### Coordinates Sub-Object

| Field | Data Type | Description | Range |
|-------|-----------|-------------|-------|
| `lat` | Number | Latitude | -90 to 90 |
| `lng` | Number | Longitude | -180 to 180 |

---

## 3. Media Entity

### Description
Multimedia content (images, videos) associated with species or conservation sites.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `type` | Enum | Yes | Media type | 'image', 'video' | "image" |
| `url` | String | Yes | URL/path to media file | Valid URL/path | "/images/species/eagle_001.jpg" |
| `caption` | String | No | Descriptive caption | Any string | "Adult Philippine Eagle in flight" |
| `credit` | String | No | Attribution/photographer | Any string | "Photo by John Doe" |
| `isPrimary` | Boolean | No | Whether this is the main/cover media | true, false | true |

---

## 4. User Entity (Authentication)

### Description
User accounts for system authentication and personalization.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `uid` | String | Yes | Firebase user ID | UUID | "firebase_uid_123" |
| `email` | String | Yes | User email address | Valid email format | "user@example.com" |
| `displayName` | String | No | User's display name | Any string | "Juan dela Cruz" |
| `photoURL` | String | No | Profile picture URL | Valid URL | "https://..." |
| `createdAt` | Timestamp | Yes | Account creation date | ISO 8601 datetime | "2025-01-15T10:30:00Z" |
| `lastLogin` | Timestamp | No | Last login timestamp | ISO 8601 datetime | "2025-12-05T08:15:00Z" |

---

## 5. AR Marker Entity

### Description
Augmented reality markers for species visualization.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `markerId` | String | Yes | Unique marker identifier | String/Pattern ID | "marker_hiro" |
| `speciesId` | String | Yes | Associated species ID | Valid species ID | "species_001" |
| `modelUrl` | String | No | 3D model URL (if applicable) | Valid URL | "/models/eagle_3d.gltf" |
| `scale` | Number | No | Default scale factor | Positive number | 1.0 |

---

## 6. UI Filter State (Frontend)

### Description
User interface filter and search state for biodiversity explorer.

### Attributes

| Field Name | Data Type | Default | Description | Valid Values |
|------------|-----------|---------|-------------|--------------|
| `query` | String | "" | Search query string | Any string |
| `statusFilter` | String | "all" | Conservation status filter | 'all', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD' |
| `typeFilter` | String | "all" | Species type filter | 'all', 'flora', 'fauna' |
| `siteFilter` | String | "all" | Conservation site filter | 'all', {valid site ID} |
| `endemicOnly` | Boolean | false | Show only endemic species | true, false |
| `displayCount` | Number | 50 | Number of items displayed | Multiple of 50 |

---

## 7. Search Configuration

### Description
Fuzzy search configuration using Fuse.js.

### Attributes

| Field Name | Data Type | Description | Value |
|------------|-----------|-------------|-------|
| `keys` | String[] | Searchable fields | ['commonName', 'scientificName', 'description', 'habitats'] |
| `threshold` | Number | Search sensitivity (0=exact, 1=match anything) | 0.36 |

---

## 8. Pagination Configuration

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `ITEMS_PER_PAGE` | 50 | Number of species loaded per page |
| `STATUS_ORDER` | ['CR','EN','VU','NT','LC','DD'] | Sort order for conservation status |

---

## Data Relationships

### Species ↔ Hotspots (Many-to-Many)
- One species can be found in multiple conservation sites
- One conservation site can host multiple species
- Junction: `species.siteIds[]` references `hotspot.id`

### Species ↔ Media (One-to-Many)
- One species can have multiple media items
- Media is embedded within species object

### Hotspots ↔ Media (One-to-Many)
- One hotspot can have multiple media items
- Media is embedded within hotspot object

### AR Markers ↔ Species (One-to-One)
- Each AR marker is associated with one species
- A species may have one AR marker

---

## Data Sources & Storage

### Primary Data Store
- **Platform**: Firebase/Firestore or JSON files
- **Location**: Context API (`DataContext`)
- **Structure**: Document-based or flat file JSON

### Media Storage
- **Platform**: Firebase Storage or local assets
- **Supported Formats**: 
  - Images: JPG, PNG, WebP
  - Videos: MP4, WebM
  - 3D Models: GLTF, GLB

### Computed Fields
The following fields are calculated dynamically:
- `hotspot.speciesCount`
- `hotspot.floraCount`
- `hotspot.faunaCount`
- `hotspot.threatenedSpeciesCount`

---

## Search & Filter Operations

### Search Algorithm
- **Engine**: Fuse.js fuzzy search
- **Searchable Fields**: commonName, scientificName, description, habitats
- **Debounce**: 300ms delay

### Filter Logic
Filters are applied sequentially in this order:
1. Text search (if query exists)
2. Conservation status filter
3. Type filter (flora/fauna)
4. Site/location filter
5. Endemic species filter
6. Sort by conservation status (most threatened first)

---

## API Endpoints (If Applicable)

*Document your backend API endpoints here if you have a server-side component*

---

## Validation Rules

### Species
- `commonName`: Min 2 characters
- `scientificName`: Must follow binomial nomenclature pattern
- `description`: Min 50 characters recommended
- `habitats`: At least 1 habitat required
- `siteIds`: At least 1 site ID required

### Hotspots
- `name`: Min 3 characters
- `description`: Min 100 characters recommended
- `coordinates.lat`: -90 to 90
- `coordinates.lng`: -180 to 180
- `establishedYear`: 1800 to current year

### Media
- `url`: Must be accessible URL or valid file path
- Image formats: .jpg, .jpeg, .png, .webp
- Video formats: .mp4, .webm

---

## Change Logs

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-05 | Initial data dictionary created | System Documentation |

---

## Notes

- All string fields support Unicode for international character support
- Timestamps follow ISO 8601 format
- IDs should be unique across the system
- Conservation status codes follow IUCN Red List standards
- The system is designed for Mati City, Philippines biodiversity data