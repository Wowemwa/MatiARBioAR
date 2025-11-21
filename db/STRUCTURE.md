# 📊 MatiARBio Database Structure Overview

## Database Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                     MATI BIODIVERSITY DATABASE                  │
│                         (MatiARBio)                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   auth.users     │         │     admins       │
│  (Supabase)      │◄────────│                  │
├──────────────────┤  FK: id ├──────────────────┤
│ id (UUID)        │         │ id (UUID) PK     │
│ email            │         │ email            │
│ ...              │         │ role             │
└────────┬─────────┘         │ last_login_at    │
         │                   └──────────────────┘
         │
         │ FK: id
         ▼
┌──────────────────┐
│    profiles      │
├──────────────────┤
│ id (UUID) PK     │
│ username         │
│ full_name        │
│ bio              │
│ avatar_url       │
│ is_admin         │
└──────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                    CORE BIODIVERSITY DATA                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│      sites       │         │  species_sites   │         │     species      │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ id (TEXT) PK     │◄────────│ site_id PK,FK    │────────►│ id (TEXT) PK     │
│ name             │         │ species_id PK,FK │         │ category         │
│ type             │         │ is_highlight     │         │ common_name      │
│ barangay         │         └──────────────────┘         │ scientific_name  │
│ city             │                 │                    │ kingdom          │
│ province         │                 │                    │ phylum           │
│ lat, lng         │                 │                    │ class            │
│ elevation_range  │                 │                    │ family           │
│ summary          │                 │                    │ genus            │
│ description      │                 │                    │ conservation_    │
│ features[]       │                 │                    │   status         │
│ tags[]           │                 │                    │ endemic          │
│ image_url        │                 │                    │ description      │
└────────┬─────────┘                 │                    │ habitat          │
         │                           │                    │ key_facts[]      │
         │                           │                    │ image_urls[]     │
         │                           │                    │ ar_model_url     │
         │                           │                    └────────┬─────────┘
         │                           │                             │
         │                           │                             │
         │    ┌──────────────────────┴─────────────────────────────┘
         │    │
         │    ▼
         │  ┌──────────────────────┐
         └─►│ distribution_records │
            ├──────────────────────┤
            │ id (UUID) PK         │
            │ species_id FK        │
            │ site_id FK           │
            │ latitude             │
            │ longitude            │
            │ elevation_m          │
            │ observation_date     │
            │ observer             │
            │ notes                │
            └──────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                      MEDIA & CONTENT                             │
└──────────────────────────────────────────────────────────────────┘

         ┌──────────────┬──────────────┐
         │              │              │
         ▼              ▼              │
┌──────────────────┐ ┌──────────────┐ │
│  media_assets    │ │    sites     │ │
├──────────────────┤ │              │ │
│ id (UUID) PK     │ └──────────────┘ │
│ species_id FK    │                  │
│ site_id FK       │ ┌──────────────┐ │
│ type             │ │   species    │◄┘
│ url              │ └──────────────┘
│ thumbnail_url    │
│ credit           │
│ bucket_name      │
│ file_path        │
│ public           │
└──────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                   USER INTERACTION DATA                          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────┐   ┌─────────────────────┐   ┌────────────────────┐
│    feedback      │   │  analytics_events   │   │ performance_metrics│
├──────────────────┤   ├─────────────────────┤   ├────────────────────┤
│ id (UUID) PK     │   │ id (UUID) PK        │   │ id (UUID) PK       │
│ user_id FK       │   │ event_type          │   │ metric_type        │
│ name             │   │ event_data (JSONB)  │   │ value              │
│ email            │   │ user_id FK          │   │ metadata (JSONB)   │
│ message          │   │ session_id          │   │ url                │
│ rating (1-5)     │   │ url                 │   │ user_agent         │
│ is_read          │   │ user_agent          │   │ created_at         │
│ created_at       │   │ created_at          │   └────────────────────┘
└──────────────────┘   └─────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                    TEAM & ADMIN DATA                             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│  team_members    │         │  activity_log    │
├──────────────────┤         ├──────────────────┤
│ id (UUID) PK     │         │ id (UUID) PK     │
│ name             │         │ admin_id FK      │
│ role             │         │ action_type      │
│ bio              │         │ entity_type      │
│ email            │         │ entity_id        │
│ avatar_url       │         │ details (JSONB)  │
│ social_links     │         │ created_at       │
│ is_active        │         └──────────────────┘
│ sort_order       │                 ▲
└──────────────────┘                 │
                                     │ FK
                            ┌────────┴─────────┐
                            │     admins       │
                            └──────────────────┘
```

## Table Statistics

| Table | Purpose | Type | Public Read | Admin Write | Anonymous Insert |
|-------|---------|------|-------------|-------------|------------------|
| **admins** | Admin authentication | User Management | ❌ Own only | ❌ Super admin | ❌ |
| **profiles** | User profiles | User Management | ✅ All | ❌ Own only | ❌ |
| **sites** | Biodiversity hotspots | Core Content | ✅ All | ✅ Admins | ❌ |
| **species** | Flora & fauna | Core Content | ✅ All | ✅ Admins | ❌ |
| **species_sites** | Species-location link | Relationships | ✅ All | ✅ Admins | ❌ |
| **distribution_records** | Observations | Data Records | ✅ All | ✅ Admins | ❌ |
| **media_assets** | Images/videos/AR | Media | ✅ Public only | ✅ Admins | ❌ |
| **feedback** | User feedback | User Input | ❌ Own/Admin | ✅ Admins | ✅ Anyone |
| **analytics_events** | Usage tracking | Analytics | ❌ Admin only | ✅ Admins | ✅ Anyone |
| **performance_metrics** | Performance data | Analytics | ❌ Admin only | ✅ Admins | ✅ Anyone |
| **site_visits** | Website visit tracking | Analytics | ❌ Admin only | ✅ Admins | ✅ Anyone |
| **team_members** | Team info | Content | ✅ All | ✅ Admins | ❌ |
| **site_visits** | Website analytics | User Input | ❌ Admin only | ✅ Admins | ✅ Anyone (anon) |

## Column Type Reference

### Common Field Types

| Field Type | Description | Example |
|------------|-------------|---------|
| `UUID` | Unique identifier | `550e8400-e29b-41d4-a716-446655440000` |
| `TEXT` | Variable length text | `"Philippine Eagle"` |
| `DECIMAL` | Decimal numbers | `14.7519` (latitude) |
| `INT4RANGE` | Integer range | `[100,500)` (elevation 100-500m) |
| `TEXT[]` | Array of text | `{"Coral reefs", "Seagrass beds"}` |
| `JSONB` | JSON data | `{"temperature": 28, "humidity": 75}` |
| `TIMESTAMPTZ` | Timestamp with timezone | `2025-11-16 10:30:00+08` |
| `BOOLEAN` | True/false | `true` |
| `INET` | IP address | `192.168.1.1` |

### Special Types

- **Conservation Status**: `DD`, `LC`, `NT`, `VU`, `EN`, `CR`, `EW`, `EX`
- **Site Type**: `marine`, `terrestrial`, `freshwater`, `mixed`
- **Species Category**: `flora`, `fauna`
- **Media Type**: `image`, `video`, `model`, `audio`
- **Admin Role**: `admin`, `super_admin`

## Key Relationships

```
1. ONE admin → MANY activity_log entries
2. ONE site → MANY species (via species_sites)
3. ONE species → MANY sites (via species_sites)
4. ONE species → MANY distribution_records
5. ONE site → MANY distribution_records
6. ONE species → MANY media_assets
7. ONE site → MANY media_assets
8. ONE user → MANY feedback entries
9. ONE user → MANY analytics_events
```

## Indexes for Performance

### Foreign Key Indexes
- `species_sites(species_id)`
- `species_sites(site_id)`
- `distribution_records(species_id)`
- `distribution_records(site_id)`
- `media_assets(species_id)`
- `media_assets(site_id)`

### Query Optimization Indexes
- `species(category)` - Filter by flora/fauna
- `species(conservation_status)` - Filter by threat level
- `species(endemic)` - Find endemic species
- `sites(type)` - Filter by ecosystem type
- `sites(city, province)` - Location queries
- `feedback(is_read)` - Unread feedback
- `analytics_events(event_type)` - Event analysis

### Full-Text & Array Indexes
- `species(image_urls)` GIN index
- `sites(features)` GIN index
- `sites(tags)` GIN index

## Security Policies Summary

### Public Access (Read-Only)
✅ sites (all fields)
✅ species (all fields)
✅ species_sites (all fields)
✅ distribution_records (all fields)
✅ team_members (active only)
✅ profiles (all fields)

### Admin-Only Access
🔒 admins (own record only)
🔒 feedback (all records)
🔒 analytics_events (all records)
🔒 performance_metrics (all records)
🔒 site_visits (all records)
🔒 activity_log (all records)

### Mixed Access
🔓 media_assets (public files visible to all, admin can manage)

### Anonymous Allowed
📝 feedback (insert only)
📝 analytics_events (insert only)
📝 performance_metrics (insert only)
📝 site_visits (insert/update for tracking)

## Storage Buckets

```
📦 media/
   ├── species/
   │   ├── images/
   │   └── videos/
   └── sites/
       └── images/

📦 ar-models/
   ├── species/
   │   └── models/
   └── thumbnails/
```

## Triggers & Functions

| Trigger | Table | Function | Purpose |
|---------|-------|----------|---------|
| `on_auth_user_created` | auth.users | handle_new_user() | Create profile on signup |
| `handle_updated_at_admins` | admins | handle_updated_at() | Update timestamp |
| `handle_updated_at_profiles` | profiles | handle_updated_at() | Update timestamp |
| `handle_updated_at_sites` | sites | handle_updated_at() | Update timestamp |
| `handle_updated_at_species` | species | handle_updated_at() | Update timestamp |
| `handle_updated_at_team_members` | team_members | handle_updated_at() | Update timestamp |
| `track_site_visit` | site_visits | track_site_visit() | Track unique visitors |
| `get_total_visitors` | site_visits | get_total_visitors() | Get visitor count |

## Database Size Estimates

For planning purposes (empty database is ~1MB):

| Data Type | Estimated Size |
|-----------|----------------|
| 1 site record | ~2 KB |
| 1 species record | ~3 KB |
| 1 distribution record | ~0.5 KB |
| 1 media reference | ~0.5 KB |
| 1 feedback | ~1 KB |
| 1 analytics event | ~0.5 KB |
| 1 site visit record | ~0.3 KB |

**Example:** 100 sites + 500 species + 1000 observations + 2000 media = ~3.5 MB (metadata only)

**Note:** Actual media files are stored in Supabase Storage, not in the database.

## Maintenance Recommendations

- 🔄 **Backup**: Daily automatic backups (configured in Supabase)
- 🧹 **Cleanup**: Archive old analytics events monthly
- 📊 **Monitor**: Check slow query log weekly
- 🔒 **Audit**: Review activity_log for security
- 📈 **Optimize**: Analyze query patterns and add indexes as needed

---

**Database Version:** 1.0  
**Created:** November 16, 2025  
**Schema Status:** Production Ready  
**Data Status:** Empty (Clean Installation)  
