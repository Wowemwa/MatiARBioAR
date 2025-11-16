# 🚀 Quick Start - MatiARBio Database Setup

## Current Configuration

**Project URL:** `https://vxfimfqycdjzehxlhzcd.supabase.co`  
**Database:** MatiARBio  
**Status:** Clean installation ready

## ⚡ 5-Step Setup

### 1. Run Setup Script
1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → MatiARBio project
2. Open **SQL Editor**
3. Copy and paste the contents of `setup.sql`
4. Click **Run** (or Ctrl+Enter)
5. Wait for success message

### 2. Verify Installation
1. In SQL Editor, create new query
2. Copy and paste the contents of `verify.sql`
3. Run the script
4. Check that all tables show ✅

### 3. Create Storage Buckets
1. Go to **Storage** in dashboard
2. Create bucket: `media` (Public: ✅)
3. Create bucket: `ar-models` (Public: ✅)

### 4. Create Admin User
1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your email and password
4. Check **Auto Confirm User**
5. Copy the User UUID

### 5. Add Admin to Database
Run this in SQL Editor (your credentials are already filled in):
```sql
INSERT INTO public.admins (id, email, role)
VALUES ('07a3cfb7-a762-40f1-9ae4-cbbb8666abe3', 'rey.loremia@dorsu.edu.ph', 'super_admin');
```

## ✅ Test Connection

The `.env.local` file has already been updated with the new credentials:
- VITE_SUPABASE_URL: ✅ Configured
- VITE_SUPABASE_ANON_KEY: ✅ Configured

Restart your dev server:
```powershell
npm run dev
```

Then test the admin login at your application's admin panel.

## 📚 Documentation Files

- **README.md** - Full setup documentation
- **MIGRATION_GUIDE.md** - Detailed step-by-step guide
- **CHECKLIST.md** - Printable checklist
- **STRUCTURE.md** - Database structure overview
- **COMMANDS.md** - SQL command reference
- **verify.sql** - Verification script
- **setup.sql** - Main setup script

## 🆘 Need Help?

1. Check **MIGRATION_GUIDE.md** for troubleshooting
2. Run **verify.sql** to check database status
3. Review **STRUCTURE.md** to understand the schema

---

**Setup Time:** ~10-15 minutes  
**Database:** MatiARBio  
**Ready to go!** 🎉
