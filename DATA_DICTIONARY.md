# DATA DICTIONARY (Tabular)

The data dictionary provides a detailed description of the tables and fields in the database. It also summarizes indexes, relationships, constraints, row-level security (RLS) policies, storage buckets, and utility functions. This document is derived from the Supabase PostgreSQL schema in `db/database_schema_reference.sql` (Generated: November 21, 2025).

**Database Overview**
- Type: PostgreSQL (Supabase)
- Schema: `public`
- IDs: `UUID` for identities; `TEXT` for domain keys
- Timestamps: `created_at`, `updated_at` with trigger-maintained updates
- RLS: Enabled on all tables

---

**public.admins**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK, FK `auth.users(id)`, ON DELETE CASCADE |  | Admin user ID |
| email | TEXT | NOT NULL, UNIQUE |  | Admin email |
| role | TEXT | NOT NULL, CHECK IN ('super_admin','admin','moderator') | 'admin' | Role |
| last_login_at | TIMESTAMPTZ |  |  | Last login timestamp |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | Update timestamp |

Indexes: `idx_admins_email`, `idx_admins_role` — RLS: self-view; super admin manage

---

**public.profiles**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK, FK `auth.users(id)`, ON DELETE CASCADE |  | User ID |
| username | TEXT | UNIQUE |  | Handle |
| full_name | TEXT |  |  | Full name |
| bio | TEXT |  |  | Bio |
| avatar_url | TEXT |  |  | Avatar URL |
| is_admin | BOOLEAN | NOT NULL | false | Admin flag |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | Update timestamp |

Indexes: `idx_profiles_username`, `idx_profiles_is_admin` — RLS: auth read; self update; admin manage

---

**public.sites**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | TEXT | PK |  | Site ID |
| name | TEXT | NOT NULL |  | Site name |
| type | TEXT | NOT NULL, CHECK IN ('marine','terrestrial','freshwater','coastal') |  | Site type |
| barangay | TEXT |  |  | Barangay |
| city | TEXT | NOT NULL |  | City |
| province | TEXT | NOT NULL |  | Province |
| designation | TEXT | NOT NULL |  | Protection designation |
| area_hectares | DECIMAL |  |  | Area (ha) |
| lat | DECIMAL(10,8) | NOT NULL |  | Latitude |
| lng | DECIMAL(11,8) | NOT NULL |  | Longitude |
| elevation_range_meters | INT4RANGE |  |  | Elevation range (m) |
| summary | TEXT | NOT NULL |  | Summary |
| description | TEXT | NOT NULL |  | Description |
| features | TEXT[] | NOT NULL | {} | Key features |
| stewardship | TEXT | NOT NULL |  | Stewardship info |
| image_url | TEXT |  |  | Image URL |
| tags | TEXT[] | NOT NULL | {} | Tags |
| visitor_notes | TEXT |  |  | Visitor notes |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | Update timestamp |

Indexes: `idx_sites_type`, `idx_sites_city`, `idx_sites_province`, `idx_sites_lat_lng`, `idx_sites_tags` (GIN) — RLS: public read; admin manage

---

**public.species**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | TEXT | PK |  | Species ID |
| category | TEXT | NOT NULL, CHECK IN ('flora','fauna') |  | Category |
| common_name | TEXT | NOT NULL |  | Common name |
| scientific_name | TEXT | NOT NULL |  | Scientific name |
| kingdom | TEXT |  |  | Taxonomy |
| phylum | TEXT |  |  | Taxonomy |
| class | TEXT |  |  | Taxonomy |
| taxonomic_order | TEXT |  |  | Taxonomy |
| family | TEXT |  |  | Taxonomy |
| genus | TEXT |  |  | Taxonomy |
| species | TEXT |  |  | Taxonomy |
| authorship | TEXT |  |  | Taxonomic authorship |
| synonyms | TEXT[] |  |  | Alternative names |
| conservation_status | TEXT | CHECK IN ('CR','EN','VU','NT','LC','DD') |  | IUCN status |
| endemic | BOOLEAN | NOT NULL | false | Endemic flag |
| invasive | BOOLEAN | NOT NULL | false | Invasive flag |
| description | TEXT | NOT NULL |  | Description |
| key_facts | TEXT[] |  |  | Key facts |
| habitat | TEXT |  |  | Habitat |
| diet | TEXT |  |  | Diet |
| behavior | TEXT |  |  | Behavior |
| reproduction | TEXT |  |  | Reproduction |
| ecosystem_services | TEXT[] |  |  | Ecosystem services |
| phenology | TEXT |  |  | Phenology |
| interactions | TEXT[] |  |  | Interactions |
| growth_form | TEXT |  |  | Plant growth form |
| leaf_type | TEXT |  |  | Leaf type |
| flowering_period | TEXT |  |  | Flowering period |
| ethnobotanical_uses | TEXT[] |  |  | Uses |
| mobility | TEXT |  |  | Mobility |
| activity_pattern | TEXT |  |  | Activity pattern |
| size | TEXT |  |  | Size |
| weight | TEXT |  |  | Weight |
| lifespan | TEXT |  |  | Lifespan |
| population_trend | TEXT |  |  | Trend |
| threats | TEXT[] |  |  | Threats |
| conservation_actions | TEXT[] |  |  | Actions |
| legal_protection | TEXT[] |  |  | Legal protection |
| reference_sources | TEXT[] |  |  | References |
| image_urls | TEXT[] | NOT NULL | {} | Images |
| ar_model_url | TEXT |  |  | AR model URL |
| ar_model_scale | DECIMAL | NOT NULL | 1.0 | AR model scale |
| ar_model_rotation | JSONB | NOT NULL | {"x":0,"y":0,"z":0} | AR rotation |
| ar_pattern_url | TEXT |  |  | AR pattern URL |
| ar_marker_image_url | TEXT |  |  | AR marker image |
| ar_viewer_html | TEXT |  |  | AR viewer HTML |
| audio_url | TEXT |  |  | Audio URL |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | Update timestamp |

Indexes: category, conservation_status, endemic, invasive, partial on AR fields, GIN on `image_urls`, `synonyms`, `threats` — RLS: public read; admin manage

---

**public.species_sites**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK | gen_random_uuid() | Link ID |
| species_id | TEXT | NOT NULL, FK `public.species(id)`, ON DELETE CASCADE |  | Species ID |
| site_id | TEXT | NOT NULL, FK `public.sites(id)`, ON DELETE CASCADE |  | Site ID |
| highlight | BOOLEAN | NOT NULL | false | Highlight flag |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Creation timestamp |

Constraints: UNIQUE(species_id, site_id) — Indexes: species_id, site_id, highlight — RLS: public read; admin manage

---

**public.distribution_records**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK | gen_random_uuid() | Record ID |
| species_id | TEXT | NOT NULL, FK `public.species(id)`, ON DELETE CASCADE |  | Species ID |
| site_id | TEXT | FK `public.sites(id)`, ON DELETE SET NULL |  | Site ID |
| observer_name | TEXT |  |  | Observer name |
| observer_email | TEXT |  |  | Observer email |
| observation_date | DATE | NOT NULL |  | Observation date |
| latitude | DECIMAL(10,8) |  |  | Latitude |
| longitude | DECIMAL(11,8) |  |  | Longitude |
| abundance_estimate | TEXT |  |  | Abundance estimate |
| notes | TEXT |  |  | Notes |
| media_urls | TEXT[] |  | {} | Media URLs |
| verified | BOOLEAN | NOT NULL | false | Verified flag |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | Update timestamp |

Indexes: species_id, site_id, observation_date, verified, lat+lng — RLS: public view verified; auth insert; admin manage

---

**public.media_assets**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK | gen_random_uuid() | Media ID |
| filename | TEXT | NOT NULL |  | Stored filename |
| original_filename | TEXT | NOT NULL |  | Original filename |
| file_path | TEXT | NOT NULL |  | File path |
| file_url | TEXT | NOT NULL |  | Public URL |
| file_size | BIGINT | NOT NULL |  | Bytes |
| mime_type | TEXT | NOT NULL |  | MIME type |
| media_type | TEXT | NOT NULL, CHECK IN ('image','video','audio','model','document') |  | Media type |
| alt_text | TEXT |  |  | Alt text |
| caption | TEXT |  |  | Caption |
| species_id | TEXT | FK `public.species(id)`, ON DELETE SET NULL |  | Species ID |
| site_id | TEXT | FK `public.sites(id)`, ON DELETE SET NULL |  | Site ID |
| uploaded_by | UUID | FK `auth.users(id)`, ON DELETE SET NULL |  | Uploader |
| is_public | BOOLEAN | NOT NULL | true | Public flag |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | Update timestamp |

Indexes: species_id, site_id, uploaded_by, media_type, is_public — RLS: public select where `is_public`; auth insert; owner update; admin manage

---

**public.feedback**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK | gen_random_uuid() | Feedback ID |
| user_id | UUID | FK `auth.users(id)`, ON DELETE SET NULL |  | User ID |
| email | TEXT |  |  | Email |
| message | TEXT | NOT NULL |  | Message |
| user_agent | TEXT |  |  | User agent |
| url | TEXT |  |  | Page URL |
| ip_address | INET |  |  | IP address |
| is_read | BOOLEAN | NOT NULL | false | Read flag |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Creation timestamp |

Indexes: user_id, email, is_read, created_at — RLS: anyone insert; admin manage

---

**public.analytics_events**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK | gen_random_uuid() | Event ID |
| event_type | TEXT | NOT NULL |  | Event type |
| event_data | JSONB |  |  | Event payload |
| user_id | UUID | FK `auth.users(id)`, ON DELETE SET NULL |  | User ID |
| session_id | TEXT |  |  | Session ID |
| url | TEXT |  |  | Page URL |
| user_agent | TEXT |  |  | User agent |
| ip_address | INET |  |  | IP address |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Timestamp |

Indexes: event_type, user_id, session_id, created_at, `event_data` (GIN) — RLS: admin only

---

**public.performance_metrics**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK | gen_random_uuid() | Metric ID |
| metric_type | TEXT | NOT NULL |  | Metric type |
| value | DECIMAL | NOT NULL |  | Metric value |
| metadata | JSONB |  |  | Metadata |
| url | TEXT |  |  | Page URL |
| user_agent | TEXT |  |  | User agent |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Timestamp |

Indexes: metric_type, created_at, `metadata` (GIN) — RLS: admin only

---

**public.team_members**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK | gen_random_uuid() | Member ID |
| name | TEXT | NOT NULL |  | Name |
| role | TEXT | NOT NULL |  | Role |
| bio | TEXT |  |  | Bio |
| email | TEXT |  |  | Email |
| avatar_url | TEXT |  |  | Avatar URL |
| social_links | JSONB |  |  | Social links |
| is_active | BOOLEAN | NOT NULL | true | Active flag |
| sort_order | INTEGER | NOT NULL | 0 | Sort order |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | Update timestamp |

Indexes: is_active, sort_order — RLS: public select active; admin manage

---

**public.activity_log**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PK | gen_random_uuid() | Activity ID |
| admin_id | UUID | FK `public.admins(id)`, ON DELETE SET NULL |  | Admin ID |
| action_type | TEXT | NOT NULL |  | Action type |
| entity_type | TEXT | NOT NULL |  | Entity type |
| entity_id | TEXT |  |  | Entity ID |
| action_details | JSONB |  |  | Details |
| ip_address | INET |  |  | IP address |
| user_agent | TEXT |  |  | User agent |
| created_at | TIMESTAMPTZ | NOT NULL | now() | Timestamp |

Indexes: admin_id, action_type, entity_type, created_at — RLS: admin view; system/auth insert

---

**Relationships**
- `admins.id` ↔ `auth.users.id` (1:1)
- `profiles.id` ↔ `auth.users.id` (1:1)
- `species_sites` links `species` ↔ `sites` (M:N)
- `distribution_records` ↔ `species` (N:1), ↔ `sites` (N:1, nullable)
- `media_assets` ↔ `species` (N:1, nullable), ↔ `sites` (N:1, nullable), ↔ `auth.users` (uploader)
- `feedback.user_id` ↔ `auth.users.id`
- `activity_log.admin_id` ↔ `admins.id`

**Triggers**
- `update_updated_at_column()` BEFORE UPDATE on: `admins`, `profiles`, `sites`, `species`, `distribution_records`, `media_assets`, `team_members`

**Storage Buckets**
- `species-models` (public, 50MB) — `model/gltf-binary`, `application/octet-stream`
- `species-images` (public, 5MB) — `image/jpeg`, `image/png`, `image/webp`
- `species-audio` (public, 10MB) — `audio/mpeg`, `audio/mp3`, `audio/wav`, `audio/ogg`
- `site-media` (public, 10MB) — `image/jpeg`, `image/png`, `video/mp4`
- `ar-patterns` (public, ~1MB) — `text/plain`, `application/octet-stream`
- `ar-markers` (public, ~2MB) — `image/jpeg`, `image/png`, `image/jpg`

Storage RLS: Public SELECT per bucket; authenticated INSERT; admin DELETE

**Utility Functions**
- `get_species_count_by_category(category_filter TEXT DEFAULT NULL)` → `(category, count)`
- `get_conservation_status_summary()` → `(status, count)` ordered by severity
- `search_species(search_term TEXT, limit_count INTEGER DEFAULT 50)` → ranked results

**Indexes (Overview)**
- B-tree: common filters (`type`, `category`, dates)
- Partial: nullable AR/media fields in `species`
- GIN: arrays and JSONB (`image_urls`, `synonyms`, `threats`, `event_data`, `metadata`, `tags`)

**Notes**
- Supabase PostgreSQL with comprehensive RLS
- Trigger-maintained `updated_at`
- Validate uploads against bucket MIME and size limits