# 🔧 Database Quick Commands Reference

Quick SQL commands for common operations in your MatiARBio database.

## 📋 Table of Contents
- [Admin Management](#admin-management)
- [Data Queries](#data-queries)
- [Maintenance](#maintenance)
- [Debugging](#debugging)
- [Analytics](#analytics)

---

## Admin Management

### Create Admin User
```sql
-- First, create the user in Supabase Authentication Dashboard
-- Then add them to admins table:

INSERT INTO public.admins (id, email, role) 
VALUES ('USER-UUID-FROM-AUTH', 'admin@example.com', 'super_admin');
```

### List All Admins
```sql
SELECT 
  a.id,
  a.email,
  a.role,
  a.last_login_at,
  a.created_at
FROM public.admins a
ORDER BY a.created_at DESC;
```

### Update Admin Role
```sql
UPDATE public.admins 
SET role = 'super_admin' 
WHERE email = 'admin@example.com';
```

### Remove Admin Access
```sql
DELETE FROM public.admins 
WHERE email = 'admin@example.com';
-- Note: This doesn't delete the auth user, just removes admin privileges
```

---

## Data Queries

### Count All Records
```sql
SELECT 
  'Sites' as table_name, COUNT(*) as count FROM public.sites
UNION ALL
SELECT 'Species', COUNT(*) FROM public.species
UNION ALL
SELECT 'Distribution Records', COUNT(*) FROM public.distribution_records
UNION ALL
SELECT 'Media Assets', COUNT(*) FROM public.media_assets
UNION ALL
SELECT 'Team Members', COUNT(*) FROM public.team_members
UNION ALL
SELECT 'Feedback', COUNT(*) FROM public.feedback
ORDER BY table_name;
```

### List All Sites
```sql
SELECT 
  id,
  name,
  type,
  city,
  province,
  lat,
  lng
FROM public.sites
ORDER BY name;
```

### List All Species
```sql
SELECT 
  id,
  common_name,
  scientific_name,
  category,
  conservation_status,
  endemic
FROM public.species
ORDER BY common_name;
```

### Find Endemic Species
```sql
SELECT 
  common_name,
  scientific_name,
  conservation_status,
  ARRAY_LENGTH(image_urls, 1) as image_count
FROM public.species
WHERE endemic = true
ORDER BY common_name;
```

### Find Endangered Species
```sql
SELECT 
  common_name,
  scientific_name,
  conservation_status
FROM public.species
WHERE conservation_status IN ('CR', 'EN', 'VU')
ORDER BY 
  CASE conservation_status
    WHEN 'CR' THEN 1
    WHEN 'EN' THEN 2
    WHEN 'VU' THEN 3
  END,
  common_name;
```

### Species by Site
```sql
SELECT 
  s.name as site_name,
  sp.common_name,
  sp.scientific_name,
  ss.is_highlight
FROM public.species_sites ss
JOIN public.sites s ON ss.site_id = s.id
JOIN public.species sp ON ss.species_id = sp.id
WHERE s.id = 'YOUR-SITE-ID'
ORDER BY ss.is_highlight DESC, sp.common_name;
```

### Sites by Species
```sql
SELECT 
  sp.common_name,
  s.name as site_name,
  s.type,
  s.city
FROM public.species_sites ss
JOIN public.sites s ON ss.site_id = s.id
JOIN public.species sp ON ss.species_id = sp.id
WHERE sp.id = 'YOUR-SPECIES-ID'
ORDER BY s.name;
```

---

## Maintenance

### Update All Updated_At Timestamps
```sql
-- Sites
UPDATE public.sites SET updated_at = NOW();

-- Species
UPDATE public.species SET updated_at = NOW();

-- Team Members
UPDATE public.team_members SET updated_at = NOW();
```

### Mark All Feedback as Read
```sql
UPDATE public.feedback 
SET is_read = true 
WHERE is_read = false;
```

### Delete Old Analytics Events (older than 90 days)
```sql
DELETE FROM public.analytics_events 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Delete Old Performance Metrics (older than 30 days)
```sql
DELETE FROM public.performance_metrics 
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Find Orphaned Media Assets
```sql
-- Media not linked to any species or site
SELECT 
  id,
  type,
  url
FROM public.media_assets
WHERE species_id IS NULL AND site_id IS NULL;
```

---

## Debugging

### Check RLS Status
```sql
SELECT 
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅ Enabled' ELSE '❌ Disabled' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### List All Policies
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Count Policies Per Table
```sql
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC, tablename;
```

### Check Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Find Slow Queries (requires pg_stat_statements extension)
```sql
SELECT 
  calls,
  total_time / calls as avg_time_ms,
  query
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY total_time DESC
LIMIT 10;
```

---

## Analytics

### Feedback Summary
```sql
SELECT 
  AVG(rating) as avg_rating,
  COUNT(*) as total_feedback,
  COUNT(*) FILTER (WHERE is_read = false) as unread_count
FROM public.feedback;
```

### Feedback by Rating
```sql
SELECT 
  rating,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM public.feedback
GROUP BY rating
ORDER BY rating DESC;
```

### Recent Feedback (last 7 days)
```sql
SELECT 
  name,
  email,
  message,
  rating,
  created_at
FROM public.feedback
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Event Summary (last 30 days)
```sql
SELECT 
  event_type,
  COUNT(*) as count
FROM public.analytics_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY event_type
ORDER BY count DESC;
```

### Daily Active Users (last 7 days)
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as unique_sessions
FROM public.analytics_events
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Admin Activity Log (last 24 hours)
```sql
SELECT 
  al.action_type,
  al.entity_type,
  al.entity_id,
  a.email as admin_email,
  al.created_at
FROM public.activity_log al
JOIN public.admins a ON al.admin_id = a.id
WHERE al.created_at > NOW() - INTERVAL '24 hours'
ORDER BY al.created_at DESC;
```

### Performance Metrics Summary
```sql
SELECT 
  metric_type,
  AVG(value) as avg_value,
  MIN(value) as min_value,
  MAX(value) as max_value,
  COUNT(*) as sample_count
FROM public.performance_metrics
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY metric_type
ORDER BY metric_type;
```

---

## Data Export

### Export All Sites as JSON
```sql
SELECT json_agg(s) 
FROM (
  SELECT * FROM public.sites ORDER BY name
) s;
```

### Export All Species as JSON
```sql
SELECT json_agg(sp) 
FROM (
  SELECT * FROM public.species ORDER BY common_name
) sp;
```

### Export Site with Species
```sql
SELECT 
  s.*,
  (
    SELECT json_agg(sp)
    FROM public.species sp
    JOIN public.species_sites ss ON sp.id = ss.species_id
    WHERE ss.site_id = s.id
  ) as species
FROM public.sites s
WHERE s.id = 'YOUR-SITE-ID';
```

---

## Data Import Examples

### Insert Sample Site
```sql
INSERT INTO public.sites (
  id, name, type, city, province, lat, lng, summary, description, designation, stewardship
) VALUES (
  'pujada-bay',
  'Pujada Bay',
  'marine',
  'Mati',
  'Davao Oriental',
  6.9551,
  126.2172,
  'A pristine bay with rich marine biodiversity',
  'Pujada Bay is a protected seascape known for its coral reefs, seagrass beds, and diverse marine life.',
  'Protected Seascape',
  'Department of Environment and Natural Resources'
);
```

### Insert Sample Species
```sql
INSERT INTO public.species (
  id, category, common_name, scientific_name, description, 
  conservation_status, endemic, habitat
) VALUES (
  'philippine-eagle',
  'fauna',
  'Philippine Eagle',
  'Pithecophaga jefferyi',
  'The Philippine Eagle is one of the largest and most powerful eagles in the world.',
  'CR',
  true,
  'Primary and secondary forests'
);
```

### Link Species to Site
```sql
INSERT INTO public.species_sites (species_id, site_id, is_highlight)
VALUES ('philippine-eagle', 'mt-hamiguitan', true);
```

---

## Backup Commands

### Create Manual Backup (run in terminal with psql)
```bash
# Full database backup
pg_dump -h [host] -U postgres -d postgres > backup_$(date +%Y%m%d).sql

# Schema only
pg_dump -h [host] -U postgres -d postgres --schema-only > schema_$(date +%Y%m%d).sql

# Data only
pg_dump -h [host] -U postgres -d postgres --data-only > data_$(date +%Y%m%d).sql
```

### Restore from Backup
```bash
psql -h [host] -U postgres -d postgres < backup_20251116.sql
```

---

## Common Patterns

### Search Species by Name (case-insensitive)
```sql
SELECT * FROM public.species
WHERE 
  LOWER(common_name) LIKE LOWER('%search-term%') 
  OR LOWER(scientific_name) LIKE LOWER('%search-term%');
```

### Find Sites in a Province
```sql
SELECT * FROM public.sites
WHERE province = 'Davao Oriental'
ORDER BY city, name;
```

### Get Media for Species
```sql
SELECT * FROM public.media_assets
WHERE species_id = 'YOUR-SPECIES-ID'
ORDER BY type, created_at DESC;
```

### Active Team Members
```sql
SELECT * FROM public.team_members
WHERE is_active = true
ORDER BY sort_order, name;
```

---

## Quick Checks

### Verify Database is Empty
```sql
-- Should return 0 for all tables (except maybe admins)
SELECT 
  (SELECT COUNT(*) FROM public.sites) as sites,
  (SELECT COUNT(*) FROM public.species) as species,
  (SELECT COUNT(*) FROM public.team_members) as team_members,
  (SELECT COUNT(*) FROM public.feedback) as feedback,
  (SELECT COUNT(*) FROM public.admins) as admins;
```

### Check Last Activity
```sql
SELECT 
  'Sites' as table_name, MAX(created_at) as last_created FROM public.sites
UNION ALL
SELECT 'Species', MAX(created_at) FROM public.species
UNION ALL
SELECT 'Feedback', MAX(created_at) FROM public.feedback
UNION ALL
SELECT 'Analytics', MAX(created_at) FROM public.analytics_events
ORDER BY last_created DESC NULLS LAST;
```

---

## 💡 Tips

1. **Always test queries on a backup first** if modifying data
2. **Use transactions** for bulk operations:
   ```sql
   BEGIN;
   -- Your queries here
   COMMIT; -- or ROLLBACK if something goes wrong
   ```
3. **Check row counts** before deleting:
   ```sql
   SELECT COUNT(*) FROM table WHERE condition; -- Check first
   DELETE FROM table WHERE condition; -- Then delete
   ```
4. **Use LIMIT** when testing queries:
   ```sql
   SELECT * FROM large_table LIMIT 10;
   ```

---

**Quick Reference Version:** 1.0  
**Last Updated:** November 16, 2025  
**Database:** MatiARBio  
