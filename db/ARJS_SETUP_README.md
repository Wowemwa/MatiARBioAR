# Database Setup - AR.js Migration

## Quick Setup Guide

This guide helps you migrate your existing database or set up a new one with AR.js support.

---

## 🆕 New Database Setup

If you're setting up a fresh database:

```sql
-- 1. Run main setup (creates all tables)
\i db/setup.sql

-- 2. Setup admin user
\i db/setup-admin.sql

-- 3. Setup storage policies
\i db/setup-storage.sql
```

Then create storage buckets in Supabase Dashboard:
- `ar-patterns` (public: true)
- `ar-markers` (public: true)
- `species-models` (public: true)

---

## 🔄 Existing Database Migration

If you have an existing database:

### Step 1: Backup Current Data

```sql
-- Create backup of species table
CREATE TABLE species_backup AS SELECT * FROM public.species;

-- Verify backup
SELECT COUNT(*) FROM species_backup;
```

### Step 2: Run Migration Script

```sql
-- This adds new columns and indexes
\i db/migrate-to-arjs.sql
```

### Step 3: Create Storage Buckets

Go to Supabase Dashboard > Storage:
1. Click "Create Bucket"
2. Name: `ar-patterns`, Public: Yes
3. Click "Create Bucket"
4. Name: `ar-markers`, Public: Yes
5. Verify `species-models` exists (create if needed)

### Step 4: Apply Storage Policies

```sql
-- This sets up permissions for new buckets
\i db/setup-storage.sql
```

### Step 5: Verify Migration

```sql
-- Check new columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'species' 
  AND table_schema = 'public'
  AND column_name LIKE 'ar_%'
ORDER BY ordinal_position;

-- Expected output:
-- ar_model_url        | text    | YES | NULL
-- ar_model_scale      | numeric | YES | 1.0
-- ar_model_rotation   | jsonb   | YES | '{"x": 0, "y": 0, "z": 0}'
-- ar_pattern_url      | text    | YES | NULL
-- ar_marker_image_url | text    | YES | NULL
-- ar_viewer_html      | text    | YES | NULL
```

### Step 6: Test Upload

1. Login to admin panel
2. Edit a species
3. Try uploading:
   - Test .glb file
   - Test .patt file
   - Test .png marker image
4. Save and verify URLs are stored

---

## 🗂️ Database Scripts Reference

### `setup.sql`
**Purpose**: Complete database setup for new installations  
**When**: Fresh database setup  
**Contains**:
- All table definitions
- Indexes
- RLS policies
- Functions
- Triggers

### `migrate-to-arjs.sql`
**Purpose**: Migrate existing database to AR.js  
**When**: Updating existing database  
**Contains**:
- ALTER TABLE statements
- New column additions
- Index creation
- Comments

### `setup-admin.sql`
**Purpose**: Create admin user  
**When**: After creating auth user in dashboard  
**Contains**:
- Admin insertion logic
- Verification queries
- Instructions

### `setup-storage.sql`
**Purpose**: Configure storage buckets and policies  
**When**: After creating buckets in dashboard  
**Contains**:
- Storage policies
- Bucket documentation
- File structure guide

---

## 📋 Migration Checklist

### Pre-Migration
- [ ] Backup current database
- [ ] Document current species count
- [ ] Note any custom modifications
- [ ] Test admin login

### Migration
- [ ] Run migration script
- [ ] Create storage buckets
- [ ] Apply storage policies
- [ ] Verify new columns exist

### Post-Migration
- [ ] Test admin panel access
- [ ] Upload test files
- [ ] Verify storage URLs
- [ ] Test AR viewer
- [ ] Update documentation

### Validation
- [ ] All species data intact
- [ ] Old AR models still accessible
- [ ] New uploads work correctly
- [ ] Public access to markers works
- [ ] Admin permissions correct

---

## 🔧 Configuration

### Environment Variables

Already configured in `.env.local`:

```env
VITE_SUPABASE_URL=https://zbgyhlvtypauqwqwzmyh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_ADMIN_UID=99485cec-feff-4fe3-ba24-df72e729ea42
```

No changes needed for AR.js migration.

### Storage Bucket Settings

**ar-patterns**
- Public: ✅ Yes
- Size Limit: 1 MB
- Allowed MIME: text/plain, application/octet-stream

**ar-markers**
- Public: ✅ Yes
- Size Limit: 2 MB
- Allowed MIME: image/png, image/jpeg, image/jpg

**species-models**
- Public: ✅ Yes
- Size Limit: 50 MB
- Allowed MIME: model/gltf-binary, application/octet-stream

---

## 🆘 Troubleshooting

### Migration Script Fails

**Error**: Column already exists

```sql
-- Check what columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'species';

-- If migration partially ran, it's safe to continue
-- Migration script uses IF NOT EXISTS
```

**Error**: Permission denied

```sql
-- Verify you're logged in as admin
SELECT current_user, session_user;

-- Check admin role
SELECT rolname, rolsuper FROM pg_roles WHERE rolname = current_user;
```

### Storage Bucket Issues

**Error**: Bucket already exists
- This is fine, bucket creation is manual
- Just apply the policies

**Error**: Policy already exists
- Drop the existing policy first:
```sql
DROP POLICY "policy_name" ON storage.objects;
```

### Upload Failures

**Check bucket exists**:
```sql
SELECT * FROM storage.buckets WHERE name IN ('ar-patterns', 'ar-markers', 'species-models');
```

**Check policies applied**:
```sql
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;
```

**Test public access**:
- Upload a file via admin panel
- Copy the URL
- Open in incognito/private window
- Should load without authentication

---

## 🔒 Security Notes

### Row Level Security (RLS)

All tables have RLS enabled. Policies:

**Public Read**:
- species
- sites
- team_members

**Authenticated Write**:
- media uploads
- feedback

**Admin Only**:
- species CRUD
- sites CRUD
- admin management

### Storage Security

**Public Buckets**:
- ar-patterns (read only for public)
- ar-markers (read only for public)
- species-models (read only for public)

**Upload Permissions**:
- Authenticated users can upload
- Only admins can delete

---

## 📊 Database Structure

### Species Table (Updated)

```sql
CREATE TABLE public.species (
  id TEXT PRIMARY KEY,
  -- ... existing columns ...
  
  -- AR.js fields (NEW)
  ar_model_url TEXT,              -- URL to .glb model
  ar_model_scale DECIMAL DEFAULT 1.0,
  ar_model_rotation JSONB DEFAULT '{"x":0,"y":0,"z":0}',
  ar_pattern_url TEXT,            -- URL to .patt file
  ar_marker_image_url TEXT,       -- URL to marker PNG
  ar_viewer_html TEXT,            -- Custom viewer HTML
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage Structure

```
supabase-storage/
├── ar-patterns/
│   └── {species-id}/
│       └── {species-id}.patt
├── ar-markers/
│   └── {species-id}/
│       └── {species-id}-marker.png
└── species-models/
    └── {species-id}/
        └── {species-id}.glb
```

---

## 🎯 Next Steps

After successful migration:

1. **Test System**
   - Login as admin
   - Upload test files
   - Verify AR viewer works

2. **Update Content**
   - Generate markers for existing species
   - Upload pattern files
   - Add marker images

3. **Train Users**
   - Share quick start guide
   - Demonstrate marker generation
   - Practice upload workflow

4. **Monitor**
   - Check storage usage
   - Monitor upload errors
   - Collect user feedback

---

## 📞 Support Resources

- **Implementation Guide**: `AR_JS_IMPLEMENTATION_GUIDE.md`
- **Quick Start**: `AR_JS_QUICK_START.md`
- **Migration Summary**: `MIGRATION_TO_ARJS_SUMMARY.md`
- **Supabase Docs**: https://supabase.com/docs
- **AR.js Docs**: https://ar-js-org.github.io/AR.js-Docs/

---

**Last Updated**: November 18, 2025  
**Database Version**: 2.0 (AR.js)  
**Status**: Ready for Production
