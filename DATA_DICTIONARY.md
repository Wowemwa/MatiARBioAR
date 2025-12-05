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

## 4. Admin Entity

### Description
Administrative user accounts with role-based access control for managing the system.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | Admin user ID (references auth.users) | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `email` | String | Yes | Admin email address | Valid email format | "admin@matiarbio.com" |
| `role` | Enum | Yes | Admin role/permission level | 'super_admin', 'admin', 'moderator' | "admin" |
| `last_login_at` | Timestamp | No | Last login timestamp | ISO 8601 datetime | "2025-12-05T08:15:00Z" |
| `created_at` | Timestamp | Yes | Account creation date | ISO 8601 datetime | "2025-01-15T10:30:00Z" |
| `updated_at` | Timestamp | Yes | Last update timestamp | ISO 8601 datetime | "2025-12-05T08:15:00Z" |

### Admin Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| super_admin | Full system access | Can manage all admins, modify all data, access all features |
| admin | Standard admin access | Can manage species, sites, feedback, team members |
| moderator | Limited access | Can view analytics, moderate content, respond to feedback |

---

## 5. User Profile Entity

### Description
Extended user profile information for authenticated users.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | User ID (references auth.users) | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `username` | String | No | Unique username | Any string | "juandc" |
| `full_name` | String | No | User's full name | Any string | "Juan dela Cruz" |
| `bio` | String | No | User biography | Text | "Environmental educator..." |
| `avatar_url` | String | No | Profile picture URL | Valid URL | "https://storage.../avatar.jpg" |
| `is_admin` | Boolean | Yes | Whether user has admin privileges | true, false | false |
| `created_at` | Timestamp | Yes | Account creation date | ISO 8601 datetime | "2025-01-15T10:30:00Z" |
| `updated_at` | Timestamp | Yes | Last update timestamp | ISO 8601 datetime | "2025-12-05T08:15:00Z" |

---

## 6. Feedback Entity

### Description
User feedback and contact form submissions for system improvement.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | Unique feedback ID | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `user_id` | UUID | No | User ID (if authenticated) | UUID or null | "550e8400-e29b..." |
| `email` | String | No | User email address | Valid email or null | "user@example.com" |
| `message` | String | Yes | Feedback message content | Text (min 10 chars) | "Great platform! Suggestion..." |
| `user_agent` | String | No | Browser/device information | User agent string | "Mozilla/5.0..." |
| `url` | String | No | Page URL where feedback was submitted | Valid URL | "/biodiversity-explorer" |
| `ip_address` | INET | No | User's IP address | IP address | "192.168.1.1" |
| `is_read` | Boolean | Yes | Whether admin has read feedback | true, false | false |
| `created_at` | Timestamp | Yes | Submission timestamp | ISO 8601 datetime | "2025-12-05T10:30:00Z" |

---

## 7. Team Member Entity

### Description
Team member profiles displayed on the About page.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | Unique team member ID | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `name` | String | Yes | Team member's full name | Any string | "Dr. Maria Santos" |
| `role` | String | Yes | Position/role in the team | Any string | "Lead Researcher" |
| `bio` | String | No | Biography/description | Text | "PhD in Marine Biology..." |
| `email` | String | No | Contact email | Valid email | "maria@matiarbio.com" |
| `avatar_url` | String | No | Profile picture URL | Valid URL | "https://storage.../avatar.jpg" |
| `social_links` | JSON | No | Social media links | JSON object | {"twitter": "...", "linkedin": "..."} |
| `is_active` | Boolean | Yes | Whether member is currently active | true, false | true |
| `sort_order` | Integer | Yes | Display order on page | Positive integer | 1 |
| `created_at` | Timestamp | Yes | Record creation date | ISO 8601 datetime | "2025-01-15T10:30:00Z" |
| `updated_at` | Timestamp | Yes | Last update timestamp | ISO 8601 datetime | "2025-12-05T08:15:00Z" |

---

## 8. Activity Log Entity

### Description
Audit trail for administrative actions and system changes.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | Unique log entry ID | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `admin_id` | UUID | No | Admin who performed action | UUID or null | "550e8400-e29b..." |
| `action_type` | String | Yes | Type of action performed | String | "CREATE", "UPDATE", "DELETE" |
| `entity_type` | String | Yes | Type of entity affected | String | "species", "site", "admin" |
| `entity_id` | String | No | ID of affected entity | String or null | "species_001" |
| `action_details` | JSON | No | Additional action details | JSON object | {"field": "status", "old": "EN", "new": "CR"} |
| `ip_address` | INET | No | Admin's IP address | IP address | "192.168.1.1" |
| `user_agent` | String | No | Browser/device information | User agent string | "Mozilla/5.0..." |
| `created_at` | Timestamp | Yes | Action timestamp | ISO 8601 datetime | "2025-12-05T10:30:00Z" |

---

## 9. Analytics Event Entity

### Description
User interaction and usage analytics for system monitoring.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | Unique event ID | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `event_type` | String | Yes | Type of event | String | "page_view", "species_view", "ar_activated" |
| `event_data` | JSON | No | Event-specific data | JSON object | {"species_id": "species_001", "duration": 45} |
| `user_id` | UUID | No | User ID (if authenticated) | UUID or null | "550e8400-e29b..." |
| `session_id` | String | No | Session identifier | String | "sess_abc123xyz" |
| `url` | String | No | Page URL | Valid URL | "/species/philippine-eagle" |
| `user_agent` | String | No | Browser/device information | User agent string | "Mozilla/5.0..." |
| `ip_address` | INET | No | User's IP address | IP address | "192.168.1.1" |
| `created_at` | Timestamp | Yes | Event timestamp | ISO 8601 datetime | "2025-12-05T10:30:00Z" |

---

## 10. Performance Metrics Entity

### Description
Application performance monitoring data.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | Unique metric ID | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `metric_type` | String | Yes | Type of performance metric | String | "page_load", "api_response", "render_time" |
| `value` | Number | Yes | Metric value | Decimal | 1.234 |
| `metadata` | JSON | No | Additional metric data | JSON object | {"component": "BiodiversityExplorer"} |
| `url` | String | No | Page URL | Valid URL | "/biodiversity-explorer" |
| `user_agent` | String | No | Browser/device information | User agent string | "Mozilla/5.0..." |
| `created_at` | Timestamp | Yes | Metric timestamp | ISO 8601 datetime | "2025-12-05T10:30:00Z" |

---

## 11. Species-Sites Junction Entity

### Description
Many-to-many relationship linking species to conservation sites.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | Unique junction record ID | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `species_id` | String | Yes | Species identifier | Valid species ID | "species_001" |
| `site_id` | String | Yes | Site identifier | Valid site ID | "site_001" |
| `highlight` | Boolean | Yes | Whether this is a featured species at site | true, false | true |
| `created_at` | Timestamp | Yes | Relationship creation date | ISO 8601 datetime | "2025-01-15T10:30:00Z" |

---

## 12. Distribution Record Entity

### Description
Species observation and distribution data for scientific records.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | Unique record ID | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `species_id` | String | Yes | Species identifier | Valid species ID | "species_001" |
| `site_id` | String | No | Site identifier | Valid site ID or null | "site_001" |
| `observer_name` | String | No | Name of observer | Any string | "Dr. Juan Cruz" |
| `observer_email` | String | No | Observer email | Valid email | "juan@research.ph" |
| `observation_date` | Date | Yes | Date of observation | ISO 8601 date | "2025-03-15" |
| `latitude` | Decimal | No | Observation latitude | -90 to 90 | 6.7485 |
| `longitude` | Decimal | No | Observation longitude | -180 to 180 | 126.1689 |
| `abundance_estimate` | String | No | Population estimate | Text | "10-20 individuals observed" |
| `notes` | String | No | Additional notes | Text | "Seen near river..." |
| `media_urls` | String[] | No | Photo/video URLs | Array of URLs | ["https://storage.../obs1.jpg"] |
| `verified` | Boolean | Yes | Whether record is verified | true, false | false |
| `created_at` | Timestamp | Yes | Record creation date | ISO 8601 datetime | "2025-03-15T10:30:00Z" |
| `updated_at` | Timestamp | Yes | Last update timestamp | ISO 8601 datetime | "2025-03-15T10:30:00Z" |

---

## 13. Media Assets Entity

### Description
Centralized media management for all images, videos, and AR models.

### Attributes

| Field Name | Data Type | Required | Description | Valid Values | Example |
|------------|-----------|----------|-------------|--------------|---------|
| `id` | UUID | Yes | Unique media asset ID | UUID | "550e8400-e29b-41d4-a716-446655440000" |
| `filename` | String | Yes | Stored filename | String | "eagle_001_1234567890.jpg" |
| `original_filename` | String | Yes | Original upload filename | String | "philippine_eagle.jpg" |
| `file_path` | String | Yes | Storage path | Path string | "/species/images/eagle_001.jpg" |
| `file_url` | String | Yes | Public access URL | Valid URL | "https://storage.../eagle_001.jpg" |
| `file_size` | BigInt | Yes | File size in bytes | Positive integer | 2048576 |
| `mime_type` | String | Yes | File MIME type | MIME type string | "image/jpeg" |
| `media_type` | Enum | Yes | Media category | 'image', 'video', 'audio', 'model', 'document' | "image" |
| `alt_text` | String | No | Accessibility description | Text | "Philippine Eagle in flight" |
| `caption` | String | No | Media caption | Text | "Adult male photographed in 2025" |
| `species_id` | String | No | Associated species | Valid species ID or null | "species_001" |
| `site_id` | String | No | Associated site | Valid site ID or null | "site_001" |
| `uploaded_by` | UUID | No | Uploader user ID | UUID or null | "550e8400-e29b..." |
| `is_public` | Boolean | Yes | Whether media is publicly accessible | true, false | true |
| `created_at` | Timestamp | Yes | Upload timestamp | ISO 8601 datetime | "2025-01-15T10:30:00Z" |
| `updated_at` | Timestamp | Yes | Last update timestamp | ISO 8601 datetime | "2025-01-15T10:30:00Z" |

---

## 14. AR Marker Entity

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

## 15. UI Filter State (Frontend)

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

## 16. Search Configuration

### Description
Fuzzy search configuration using Fuse.js.

### Attributes

| Field Name | Data Type | Description | Value |
|------------|-----------|-------------|-------|
| `keys` | String[] | Searchable fields | ['commonName', 'scientificName', 'description', 'habitats'] |
| `threshold` | Number | Search sensitivity (0=exact, 1=match anything) | 0.36 |

---

## 17. Pagination Configuration

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
- Junction table: `species_sites` with fields (id, species_id, site_id, highlight, created_at)
- Reference: `species.id` ↔ `species_sites.species_id` ↔ `species_sites.site_id` ↔ `sites.id`

### Species ↔ Media (One-to-Many)
- One species can have multiple media items
- Media can be stored inline (`species.image_urls`, `species.ar_model_url`) or in `media_assets` table
- Reference: `species.id` ↔ `media_assets.species_id`

### Sites ↔ Media (One-to-Many)
- One site can have multiple media items
- Media stored inline (`sites.image_url`) or in `media_assets` table
- Reference: `sites.id` ↔ `media_assets.site_id`

### Species ↔ Distribution Records (One-to-Many)
- One species can have multiple distribution/observation records
- Reference: `species.id` ↔ `distribution_records.species_id`

### Sites ↔ Distribution Records (One-to-Many)
- One site can have multiple distribution records
- Reference: `sites.id` ↔ `distribution_records.site_id`

### Admin ↔ Activity Log (One-to-Many)
- One admin can have multiple logged actions
- Reference: `admins.id` ↔ `activity_log.admin_id`

### User ↔ Feedback (One-to-Many)
- One user can submit multiple feedback entries
- Reference: `profiles.id` ↔ `feedback.user_id`

### User ↔ Analytics Events (One-to-Many)
- One user can generate multiple analytics events
- Reference: `profiles.id` ↔ `analytics_events.user_id`

### User ↔ Media Assets (One-to-Many)
- One user can upload multiple media assets
- Reference: `profiles.id` ↔ `media_assets.uploaded_by`

### AR Markers ↔ Species (One-to-One)
- Each AR marker is associated with one species
- A species may have AR data embedded (ar_model_url, ar_pattern_url, ar_marker_image_url)

---

## Data Sources & Storage

### Primary Data Store
- **Platform**: Supabase (PostgreSQL)
- **Location**: Cloud-hosted database with realtime subscriptions
- **Structure**: Relational database with row-level security (RLS)
- **Backup**: Context API (`DataContext`) for client-side caching

### Authentication
- **Platform**: Supabase Auth (with Firebase fallback)
- **Methods**: Email/Password, OAuth providers
- **Storage**: LocalStorage for session persistence
- **Flow Type**: PKCE (Proof Key for Code Exchange)

### Media Storage
- **Platform**: Supabase Storage buckets
- **Supported Formats**: 
  - Images: JPG, JPEG, PNG, WebP
  - Videos: MP4, WebM
  - Audio: MP3, WAV, OGG
  - 3D Models: GLTF, GLB
  - Documents: PDF
- **Access**: Public and private buckets with URL-based access
- **Management**: Centralized via `media_assets` table

### Computed Fields
The following fields are calculated dynamically in the frontend:
- Site statistics: `speciesCount`, `floraCount`, `faunaCount`, `threatenedSpeciesCount`
- Search results and filter counts
- Analytics aggregations

### Database Features
- **Row Level Security (RLS)**: Enabled on all tables
- **Automatic Timestamps**: `updated_at` fields auto-updated via triggers
- **Indexes**: Optimized for search, filtering, and geospatial queries
- **Foreign Keys**: Enforce referential integrity
- **JSON Fields**: Support for complex data (metadata, social_links, etc.)

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

## API Endpoints (Supabase)

### Authentication Endpoints
- `POST /auth/v1/signup` - Create new user account
- `POST /auth/v1/token` - Login with credentials
- `POST /auth/v1/logout` - Sign out user
- `GET /auth/v1/user` - Get current user info
- `PUT /auth/v1/user` - Update user profile

### Database REST API
All tables accessible via Supabase REST API:
- `GET /rest/v1/{table}` - Query records with filters
- `POST /rest/v1/{table}` - Insert new records
- `PATCH /rest/v1/{table}` - Update records
- `DELETE /rest/v1/{table}` - Delete records

### Storage API
- `POST /storage/v1/object/{bucket}/{path}` - Upload file
- `GET /storage/v1/object/{bucket}/{path}` - Download file
- `DELETE /storage/v1/object/{bucket}/{path}` - Delete file

### Admin Operations
Protected by RLS policies, admins can:
- Manage species data (CRUD operations)
- Manage conservation sites (CRUD operations)
- View and respond to feedback
- Manage team members
- View analytics and activity logs
- Bulk import/export data

### Public Read Endpoints
Available without authentication:
- Species list and details
- Conservation sites information
- Team member profiles
- GIS/mapping data

---

## Validation Rules

### Species
- `common_name`: Min 2 characters, required
- `scientific_name`: Required, should follow binomial nomenclature
- `description`: Min 50 characters recommended
- `category`: Must be 'flora' or 'fauna'
- `conservation_status`: Must be one of: CR, EN, VU, NT, LC, DD
- `image_urls`: At least 1 image recommended
- `ar_model_scale`: Positive number, default 1.0

### Sites (Hotspots)
- `name`: Min 3 characters, required
- `description`: Min 100 characters recommended
- `type`: Must be one of: marine, terrestrial, freshwater, coastal
- `lat`: -90 to 90, required
- `lng`: -180 to 180, required
- `area_hectares`: Positive number
- `features`: Array with at least 1 item recommended

### Admin
- `email`: Valid email format, unique
- `role`: Must be one of: super_admin, admin, moderator
- `id`: Must reference valid auth.users(id)

### Feedback
- `message`: Min 10 characters, required
- `email`: Valid email format (if provided)
- `is_read`: Boolean, defaults to false

### Team Members
- `name`: Min 2 characters, required
- `role`: Min 2 characters, required
- `email`: Valid email format (if provided)
- `sort_order`: Integer, default 0
- `is_active`: Boolean, default true

### Media Assets
- `file_size`: Max 50MB for images, 500MB for videos
- `mime_type`: Must match file extension
- `media_type`: Must be one of: image, video, audio, model, document
- Image formats: .jpg, .jpeg, .png, .webp
- Video formats: .mp4, .webm
- Audio formats: .mp3, .wav, .ogg
- Model formats: .gltf, .glb

### Distribution Records
- `observation_date`: Cannot be in the future
- `latitude`: -90 to 90 (if provided)
- `longitude`: -180 to 180 (if provided)
- `verified`: Boolean, default false
- `species_id`: Must reference valid species

### Activity Log
- `action_type`: Required string
- `entity_type`: Required string
- `admin_id`: Must reference valid admins(id)

---

## Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-05 | Initial data dictionary created | System Documentation |
| 1.1 | 2025-12-05 | Added admin entities, complete database schema, API endpoints | System Documentation |

---

## Database Schema Summary

### Complete Table List

1. **admins** - Administrative user accounts with role-based access
2. **profiles** - Extended user profile information
3. **sites** - Biodiversity hotspots and conservation sites
4. **species** - Comprehensive species database with AR support
5. **species_sites** - Many-to-many junction table
6. **distribution_records** - Species observation and distribution data
7. **media_assets** - Centralized media management
8. **feedback** - User feedback and contact submissions
9. **analytics_events** - User interaction analytics
10. **performance_metrics** - Application performance monitoring
11. **team_members** - Team member profiles
12. **activity_log** - Administrative action audit trail

### Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Admin Policies**: Role-based access control for admin operations
- **User Policies**: Users can only modify their own data
- **Public Read**: Species, sites, and team data publicly readable
- **Protected Write**: Only admins can create/update/delete records
- **Cascade Deletes**: Foreign keys properly cascade on delete

### Performance Optimizations

- **Indexes**: Strategic indexing on frequently queried fields
- **GIN Indexes**: Array and JSON fields optimized with GIN indexes
- **Geospatial Indexes**: Lat/lng coordinates indexed for map queries
- **Timestamp Indexes**: Created_at fields indexed for time-based queries
- **Triggers**: Automatic updated_at timestamp updates

---

## Notes

- All string fields support Unicode for international character support
- Timestamps follow ISO 8601 format and are stored as TIMESTAMPTZ (with timezone)
- UUIDs are used for all primary keys except species and sites (which use text IDs)
- IDs should be unique across the system
- Conservation status codes follow IUCN Red List standards
- The system is designed for Mati City, Philippines biodiversity data
- RLS policies ensure data security and proper access control
- All tables include created_at; most include updated_at for audit trails
- JSON/JSONB fields allow flexible metadata storage
- IP addresses stored as PostgreSQL INET type for proper validation
