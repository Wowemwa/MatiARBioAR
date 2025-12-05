# DATA DICTIONARY

The data dictionary provides a detailed description of the tables and fields in the database. It also summarizes indexes, relationships, constraints, row-level security (RLS) policies, storage buckets, and utility functions. This document is derived from the Supabase PostgreSQL schema in `db/database_schema_reference.sql` (Generated: November 21, 2025).

**Database Overview**
- Type: PostgreSQL (Supabase)
- Naming: All application tables are under the `public` schema
- IDs: Primarily `UUID` for identity tables; some domain tables use `TEXT` IDs
- Timestamps: Most tables include `created_at` and `updated_at`; `updated_at` maintained by triggers
- RLS: Enabled on all tables with policies for public, authenticated, and admin access

**Conventions**
- `NOT NULL`: Field must have a value
- `DEFAULT`: Value set when not provided
- `CHECK`: Constraint limiting allowed values
- Arrays are `TEXT[]` unless noted
- JSON data stored as `JSONB`

---

**Table: `public.admins` — Administrative user accounts**
- `id` (UUID, PK, references `auth.users(id)`, on delete cascade)
- `email` (TEXT, not null, unique)
- `role` (TEXT, not null, default `'admin'`, check in `['super_admin','admin','moderator']`)
- `last_login_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ, not null, default `now()`)
- `updated_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: `idx_admins_email`, `idx_admins_role`
- RLS: Users can view own record; super admins can manage all

**Table: `public.profiles` — Extended user profile**
- `id` (UUID, PK, references `auth.users(id)`, on delete cascade)
- `username` (TEXT, unique)
- `full_name` (TEXT)
- `bio` (TEXT)
- `avatar_url` (TEXT)
- `is_admin` (BOOLEAN, not null, default `false`)
- `created_at` (TIMESTAMPTZ, not null, default `now()`)
- `updated_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: `idx_profiles_username`, `idx_profiles_is_admin`
- RLS: Authenticated can view all; users can update own; admins can manage all

**Table: `public.sites` — Biodiversity hotspot locations**
- `id` (TEXT, PK)
- `name` (TEXT, not null)
- `type` (TEXT, not null, check in `['marine','terrestrial','freshwater','coastal']`)
- `barangay` (TEXT)
- `city` (TEXT, not null)
- `province` (TEXT, not null)
- `designation` (TEXT, not null)
- `area_hectares` (DECIMAL)
- `lat` (DECIMAL(10,8), not null)
- `lng` (DECIMAL(11,8), not null)
- `elevation_range_meters` (INT4RANGE)
- `summary` (TEXT, not null)
- `description` (TEXT, not null)
- `features` (TEXT[], not null, default `{}`)
- `stewardship` (TEXT, not null)
- `image_url` (TEXT)
- `tags` (TEXT[], not null, default `{}`)
- `visitor_notes` (TEXT)
- `created_at` (TIMESTAMPTZ, not null, default `now()`)
- `updated_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: `idx_sites_type`, `idx_sites_city`, `idx_sites_province`, `idx_sites_lat_lng`, `idx_sites_tags` (GIN)
- RLS: Public read; admins manage

**Table: `public.species` — Species info with AR support**
- `id` (TEXT, PK)
- `category` (TEXT, not null, check in `['flora','fauna']`)
- `common_name` (TEXT, not null)
- `scientific_name` (TEXT, not null)
- Taxonomy: `kingdom`, `phylum`, `class`, `taxonomic_order`, `family`, `genus`, `species`, `authorship` (all TEXT), `synonyms` (TEXT[])
- Conservation: `conservation_status` (TEXT, check in `['CR','EN','VU','NT','LC','DD']`), `endemic` (BOOLEAN, default `false`), `invasive` (BOOLEAN, default `false`)
- Basics: `description` (TEXT, not null), `key_facts` (TEXT[])
- Ecology: `habitat`, `diet`, `behavior`, `reproduction` (TEXT), `ecosystem_services` (TEXT[]), `phenology` (TEXT), `interactions` (TEXT[])
- Plant-specific: `growth_form`, `leaf_type`, `flowering_period` (TEXT), `ethnobotanical_uses` (TEXT[])
- Animal-specific: `mobility`, `activity_pattern`, `size`, `weight`, `lifespan` (TEXT)
- Population: `population_trend` (TEXT), `threats` (TEXT[]), `conservation_actions` (TEXT[]), `legal_protection` (TEXT[]), `reference_sources` (TEXT[])
- Media: `image_urls` (TEXT[], not null, default `{}`)
- AR: `ar_model_url` (TEXT), `ar_model_scale` (DECIMAL, default `1.0`), `ar_model_rotation` (JSONB, default `{x:0,y:0,z:0}`), `ar_pattern_url` (TEXT), `ar_marker_image_url` (TEXT), `ar_viewer_html` (TEXT), `audio_url` (TEXT)
- Timestamps: `created_at` (TIMESTAMPTZ, not null, default `now()`), `updated_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: category, conservation_status, endemic, invasive, `ar_model_url` (partial), `ar_pattern_url` (partial), `audio_url` (partial), `image_urls` (GIN), `synonyms` (GIN), `threats` (GIN)
- RLS: Public read; admins manage

**Table: `public.species_sites` — Species ↔ Sites link (M:N)**
- `id` (UUID, PK, default `gen_random_uuid()`)
- `species_id` (TEXT, not null, references `public.species(id)`, on delete cascade)
- `site_id` (TEXT, not null, references `public.sites(id)`, on delete cascade)
- `highlight` (BOOLEAN, not null, default `false`)
- `created_at` (TIMESTAMPTZ, not null, default `now()`)
- Constraints: `UNIQUE(species_id, site_id)`
- Indexes: `idx_species_sites_species_id`, `idx_species_sites_site_id`, `idx_species_sites_highlight`
- RLS: Public read; admins manage

**Table: `public.distribution_records` — Observations**
- `id` (UUID, PK, default `gen_random_uuid()`)
- `species_id` (TEXT, not null, references `public.species(id)`, on delete cascade)
- `site_id` (TEXT, references `public.sites(id)`, on delete set null)
- `observer_name` (TEXT), `observer_email` (TEXT)
- `observation_date` (DATE, not null)
- `latitude` (DECIMAL(10,8)), `longitude` (DECIMAL(11,8))
- `abundance_estimate` (TEXT)
- `notes` (TEXT)
- `media_urls` (TEXT[], default `{}`)
- `verified` (BOOLEAN, not null, default `false`)
- `created_at` (TIMESTAMPTZ, not null, default `now()`), `updated_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: species_id, site_id, observation_date, verified, lat+lng
- RLS: Public can view verified; authenticated can insert; admins manage

**Table: `public.media_assets` — Centralized media**
- `id` (UUID, PK, default `gen_random_uuid()`)
- `filename` (TEXT, not null), `original_filename` (TEXT, not null)
- `file_path` (TEXT, not null), `file_url` (TEXT, not null)
- `file_size` (BIGINT, not null)
- `mime_type` (TEXT, not null)
- `media_type` (TEXT, not null, check in `['image','video','audio','model','document']`)
- `alt_text` (TEXT), `caption` (TEXT)
- `species_id` (TEXT, references `public.species(id)`, on delete set null)
- `site_id` (TEXT, references `public.sites(id)`, on delete set null)
- `uploaded_by` (UUID, references `auth.users(id)`, on delete set null)
- `is_public` (BOOLEAN, not null, default `true`)
- `created_at` (TIMESTAMPTZ, not null, default `now()`), `updated_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: species_id, site_id, uploaded_by, media_type, is_public
- RLS: Public view where `is_public=true`; authenticated can insert; owner update; admins manage

**Table: `public.feedback` — User feedback**
- `id` (UUID, PK, default `gen_random_uuid()`)
- `user_id` (UUID, references `auth.users(id)`, on delete set null)
- `email` (TEXT)
- `message` (TEXT, not null)
- `user_agent` (TEXT), `url` (TEXT), `ip_address` (INET)
- `is_read` (BOOLEAN, not null, default `false`)
- `created_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: user_id, email, is_read, created_at
- RLS: Anyone can insert; admins manage

**Table: `public.analytics_events` — Usage analytics**
- `id` (UUID, PK, default `gen_random_uuid()`)
- `event_type` (TEXT, not null)
- `event_data` (JSONB)
- `user_id` (UUID, references `auth.users(id)`, on delete set null)
- `session_id` (TEXT)
- `url` (TEXT), `user_agent` (TEXT), `ip_address` (INET)
- `created_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: event_type, user_id, session_id, created_at, `event_data` (GIN)
- RLS: Admins manage only

**Table: `public.performance_metrics` — App performance**
- `id` (UUID, PK, default `gen_random_uuid()`)
- `metric_type` (TEXT, not null)
- `value` (DECIMAL, not null)
- `metadata` (JSONB)
- `url` (TEXT), `user_agent` (TEXT)
- `created_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: metric_type, created_at, `metadata` (GIN)
- RLS: Admins manage only

**Table: `public.team_members` — Team profiles**
- `id` (UUID, PK, default `gen_random_uuid()`)
- `name` (TEXT, not null)
- `role` (TEXT, not null)
- `bio` (TEXT)
- `email` (TEXT)
- `avatar_url` (TEXT)
- `social_links` (JSONB)
- `is_active` (BOOLEAN, not null, default `true`)
- `sort_order` (INTEGER, not null, default `0`)
- `created_at` (TIMESTAMPTZ, not null, default `now()`), `updated_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: is_active, sort_order
- RLS: Public can view active; admins manage

**Table: `public.activity_log` — Admin audit trail**
- `id` (UUID, PK, default `gen_random_uuid()`)
- `admin_id` (UUID, references `public.admins(id)`, on delete set null)
- `action_type` (TEXT, not null)
- `entity_type` (TEXT, not null)
- `entity_id` (TEXT)
- `action_details` (JSONB)
- `ip_address` (INET), `user_agent` (TEXT)
- `created_at` (TIMESTAMPTZ, not null, default `now()`)
- Indexes: admin_id, action_type, entity_type, created_at
- RLS: Admins can view; system/authenticated can insert

---

**Relationships**
- `admins.id` ↔ `auth.users.id` (1:1)
- `profiles.id` ↔ `auth.users.id` (1:1)
- `species_sites.species_id` ↔ `species.id` (M:N via link table)
- `species_sites.site_id` ↔ `sites.id`
- `distribution_records.species_id` ↔ `species.id` (N:1)
- `distribution_records.site_id` ↔ `sites.id` (N:1, nullable)
- `media_assets.species_id` ↔ `species.id` (N:1, nullable)
- `media_assets.site_id` ↔ `sites.id` (N:1, nullable)
- `media_assets.uploaded_by` ↔ `auth.users.id`
- `feedback.user_id` ↔ `auth.users.id`
- `activity_log.admin_id` ↔ `admins.id`

**Triggers**
- Function: `update_updated_at_column()` — sets `NEW.updated_at = now()`
- Applied BEFORE UPDATE to: `admins`, `profiles`, `sites`, `species`, `distribution_records`, `media_assets`, `team_members`

**Row Level Security (RLS) Summary**
- Enabled on all tables in `public`
- Common policies:
  - Public read on `sites`, `species`, `species_sites`, active `team_members`
  - Public insert on `feedback`
  - Authenticated insert on `distribution_records`, `media_assets`
  - Admin-only management on analytics, performance, activity log
  - User-scoped select/update where applicable (e.g., `profiles`, `admins`)

**Storage Buckets (Supabase `storage.buckets`)**
- `species-models` (public=true, limit 50MB, mime: `model/gltf-binary`, `application/octet-stream`)
- `species-images` (public=true, limit 5MB, mime: `image/jpeg`, `image/png`, `image/webp`)
- `species-audio` (public=true, limit 10MB, mime: `audio/mpeg`, `audio/mp3`, `audio/wav`, `audio/ogg`)
- `site-media` (public=true, limit 10MB, mime: `image/jpeg`, `image/png`, `video/mp4`)
- `ar-patterns` (public=true, limit ~1MB, mime: `text/plain`, `application/octet-stream`)
- `ar-markers` (public=true, limit ~2MB, mime: `image/jpeg`, `image/png`, `image/jpg`)
- Storage object RLS: Public SELECT per bucket; authenticated INSERT; admins DELETE

**Utility Functions**
- `get_species_count_by_category(category_filter TEXT DEFAULT NULL)` → rows of `(category, count)`
- `get_conservation_status_summary()` → rows of `(status, count)` ordered by IUCN severity
- `search_species(search_term TEXT, limit_count INTEGER DEFAULT 50)` → ranked species search results

**Indexes (Overview)**
- B-tree on common filter fields (e.g., `type`, `category`, dates)
- Partial indexes on nullable AR/media fields for `species`
- GIN indexes on arrays and JSONB (`image_urls`, `synonyms`, `threats`, `event_data`, `metadata`, `tags`)

**Notes**
- Designed for Supabase with comprehensive RLS
- Use UUIDs for identity; TEXT IDs for domain entities where human-readable keys are beneficial
- Triggers maintain `updated_at`; consider app-side upserts to avoid race conditions
- Validate MIME types and size limits against bucket configs when uploading