# 🗄️ New Database Setup - Complete Package

## Overview

This package contains everything you need to set up your new **MatiARBio** Supabase database with a clean, empty schema ready for your biodiversity data.

**Database Details:**
- **Name:** MatiARBio
- **Password:** Rey21
- **Status:** Clean installation (no data)
- **Purpose:** Biodiversity information system with AR features

---

## 📚 Documentation Files

### 1. **NEW_DATABASE_SETUP.sql** ⭐ MAIN SCRIPT
   - Complete database schema
   - All 12 tables with proper structure
   - Row Level Security policies
   - Functions and triggers
   - Indexes for performance
   - **ACTION:** Run this in Supabase SQL Editor

### 2. **NEW_DATABASE_MIGRATION_GUIDE.md** 📖 DETAILED GUIDE
   - Step-by-step setup instructions
   - Screenshots and explanations
   - Storage bucket configuration
   - Admin user creation
   - Troubleshooting section
   - **USE FOR:** First-time setup reference

### 3. **SETUP_CHECKLIST.md** ✅ QUICK REFERENCE
   - Printable checklist format
   - Phase-by-phase tasks
   - Checkboxes for tracking progress
   - Notes section for issues
   - **USE FOR:** Following along during setup

### 4. **UPDATE_ENV_QUICK_REFERENCE.md** 🔧 CONFIG GUIDE
   - Environment variable updates
   - Where to find new credentials
   - Common mistakes to avoid
   - Verification steps
   - **USE FOR:** Updating .env.local file

### 5. **VERIFY_DATABASE.sql** 🔍 VERIFICATION SCRIPT
   - Automated database checks
   - Table existence verification
   - RLS status check
   - Policy count verification
   - Row count check
   - **USE FOR:** After running main setup script

---

## 🚀 Quick Start (5-Minute Version)

If you're experienced with Supabase:

1. ✅ Open Supabase Dashboard → MatiARBio project
2. ✅ SQL Editor → Paste `NEW_DATABASE_SETUP.sql` → Run
3. ✅ Storage → Create `media` and `ar-models` buckets (public)
4. ✅ Authentication → Create admin user → Copy UUID
5. ✅ SQL Editor → Add admin to `admins` table
6. ✅ Update `.env.local` with new URL and anon key
7. ✅ `npm run dev` → Test login

**Done!** 🎉

---

## 📋 Detailed Setup (Follow This Order)

### Step 1: Review Documentation (5 min)
- [ ] Read this README
- [ ] Open `SETUP_CHECKLIST.md` for reference

### Step 2: Run Database Setup (10 min)
- [ ] Log into Supabase Dashboard
- [ ] Open SQL Editor
- [ ] Copy/paste `NEW_DATABASE_SETUP.sql`
- [ ] Execute the script
- [ ] Check for success message

### Step 3: Verify Installation (5 min)
- [ ] Open new SQL Editor query
- [ ] Copy/paste `VERIFY_DATABASE.sql`
- [ ] Execute verification script
- [ ] Review results (all should be ✅)

### Step 4: Create Storage (5 min)
- [ ] Go to Storage in Dashboard
- [ ] Create `media` bucket (public)
- [ ] Create `ar-models` bucket (public)
- [ ] Set up policies (see migration guide)

### Step 5: Create Admin User (5 min)
- [ ] Authentication → Add user
- [ ] Copy the User UUID
- [ ] SQL Editor → Insert into admins table
- [ ] Verify admin exists

### Step 6: Update Application (5 min)
- [ ] Open `.env.local`
- [ ] Update VITE_SUPABASE_URL
- [ ] Update VITE_SUPABASE_ANON_KEY
- [ ] Save file
- [ ] Restart dev server

### Step 7: Test Everything (5 min)
- [ ] Open application
- [ ] Try admin login
- [ ] Check admin panel
- [ ] Verify no errors

**Total Time: ~40 minutes**

---

## 🗂️ Database Structure

Your new database includes these tables:

### **Core Content Tables**
1. **sites** - Biodiversity hotspot locations
   - Geographic data (lat/lng, elevation)
   - Site types (marine, terrestrial, freshwater)
   - Visitor information

2. **species** - Flora and fauna information
   - Taxonomy (kingdom → species)
   - Conservation status
   - Physical characteristics
   - AR model support

3. **species_sites** - Links species to sites
   - Many-to-many relationship
   - Highlight flag

### **Data & Media Tables**
4. **distribution_records** - Species observations
5. **media_assets** - Images, videos, AR models

### **User Management Tables**
6. **admins** - Admin user accounts
7. **profiles** - Regular user profiles

### **System Tables**
8. **feedback** - User feedback submissions
9. **analytics_events** - Usage tracking
10. **performance_metrics** - Performance monitoring
11. **team_members** - Team information
12. **activity_log** - Admin action audit trail

---

## 🔒 Security Features

✅ **Row Level Security (RLS)** enabled on all tables  
✅ **Public read** for sites and species  
✅ **Admin-only write** for content management  
✅ **Anonymous feedback** submission allowed  
✅ **Audit logging** for admin actions  
✅ **Secure storage** with bucket policies  

---

## 📊 What You Get

### ✅ Immediate Benefits
- Clean, empty database (no old data)
- Proper security policies configured
- Performance indexes in place
- Automatic triggers for timestamps
- Storage buckets ready for uploads
- Admin authentication system

### ✅ Future-Proof Design
- Scalable structure for growth
- Extensible schema
- Audit trail for compliance
- Analytics ready
- Multi-user support

---

## 🔑 Credentials You Need

Save these somewhere secure:

1. **Supabase Project URL**
   - Where: Settings → API → Project URL
   - Format: `https://[project-ref].supabase.co`
   - Used in: `.env.local` → `VITE_SUPABASE_URL`

2. **Supabase Anon Key**
   - Where: Settings → API → anon public key
   - Format: `eyJhbGc...` (long JWT token)
   - Used in: `.env.local` → `VITE_SUPABASE_ANON_KEY`

3. **Database Password**
   - Value: `Rey21`
   - Used for: Direct database access (rarely needed)

4. **Admin Email & Password**
   - Created in: Authentication → Users
   - Used for: Logging into admin panel

---

## ⚠️ Important Reminders

1. **Restart Dev Server** after changing `.env.local`
2. **Keep credentials secure** - don't commit to git
3. **Set up backups** in Supabase Dashboard
4. **Monitor usage** - free tier has limits
5. **Test thoroughly** before going live

---

## 🆘 Getting Help

### If Something Goes Wrong:

1. **Check the verification script**
   - Run `VERIFY_DATABASE.sql`
   - Look for ❌ or ⚠️ indicators

2. **Review the detailed guide**
   - Open `NEW_DATABASE_MIGRATION_GUIDE.md`
   - Find the troubleshooting section

3. **Check Supabase logs**
   - Dashboard → Logs
   - Look for error messages

4. **Verify environment variables**
   - Open `.env.local`
   - Compare with `UPDATE_ENV_QUICK_REFERENCE.md`

---

## 📝 Post-Setup Tasks

After completing setup:

- [ ] Add your first biodiversity site
- [ ] Upload test species data
- [ ] Test AR features
- [ ] Configure email templates (optional)
- [ ] Set up monitoring alerts
- [ ] Train team members on admin panel
- [ ] Document any custom configurations

---

## 🎯 Success Criteria

You'll know setup is successful when:

✅ No errors in Supabase Dashboard  
✅ All tables visible in Table Editor  
✅ Admin can log in successfully  
✅ Admin panel loads without errors  
✅ Storage buckets are accessible  
✅ Application connects to database  
✅ No console errors in browser  

---

## 📞 Support Resources

- **Supabase Documentation:** https://supabase.com/docs
- **Project Files:** All SQL scripts in this directory
- **Verification Tools:** `VERIFY_DATABASE.sql`
- **Checklists:** `SETUP_CHECKLIST.md`

---

## 🎉 Ready to Begin?

Follow these steps in order:

1. **Read:** `SETUP_CHECKLIST.md`
2. **Run:** `NEW_DATABASE_SETUP.sql`
3. **Verify:** `VERIFY_DATABASE.sql`
4. **Configure:** Update `.env.local`
5. **Test:** Log in as admin

**Good luck with your setup! 🚀**

---

**Created:** November 16, 2025  
**Database:** MatiARBio  
**Version:** 1.0 - Clean Installation  
**Status:** Ready for deployment  
