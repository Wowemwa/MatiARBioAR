# 📋 MatiARBio Database Setup Checklist

**Database Name:** MatiARBio  
**Database Password:** Rey21  
**Date:** November 16, 2025

Follow this checklist in order. Check off each item as you complete it.

---

## Phase 1: Supabase Project Setup

- [ ] **1.1** Log into Supabase Dashboard (https://supabase.com/dashboard)
- [ ] **1.2** Confirm MatiARBio project is created
- [ ] **1.3** Note your project URL: `https://_____________.supabase.co`
- [ ] **1.4** Go to Settings > API
- [ ] **1.5** Copy Project URL (save it)
- [ ] **1.6** Copy anon public key (save it)

---

## Phase 2: Database Schema Setup

- [ ] **2.1** Open Supabase SQL Editor
- [ ] **2.2** Create new query
- [ ] **2.3** Open file: `NEW_DATABASE_SETUP.sql`
- [ ] **2.4** Copy entire content (Ctrl+A, Ctrl+C)
- [ ] **2.5** Paste into SQL Editor
- [ ] **2.6** Click "Run" button
- [ ] **2.7** Wait for "Success" message
- [ ] **2.8** Verify no error messages

---

## Phase 3: Verify Database Creation

- [ ] **3.1** Open new query in SQL Editor
- [ ] **3.2** Open file: `VERIFY_DATABASE.sql`
- [ ] **3.3** Copy and paste into SQL Editor
- [ ] **3.4** Run the verification script
- [ ] **3.5** Check that all tables show ✅
- [ ] **3.6** Check that RLS is ✅ Enabled for all tables
- [ ] **3.7** Check that extensions are installed

---

## Phase 4: Storage Buckets

- [ ] **4.1** Go to Storage in Supabase Dashboard
- [ ] **4.2** Click "New bucket"
- [ ] **4.3** Create bucket: `media` (Public: YES)
- [ ] **4.4** Create bucket: `ar-models` (Public: YES)
- [ ] **4.5** Set up policies for media bucket:
  - [ ] Add "Public read access" policy
  - [ ] Add "Authenticated users can upload" policy
  - [ ] Add "Admin can delete" policy
- [ ] **4.6** Set up policies for ar-models bucket:
  - [ ] Add "Public read access" policy
  - [ ] Add "Authenticated users can upload" policy
  - [ ] Add "Admin can delete" policy

---

## Phase 5: Create Admin User

- [ ] **5.1** Go to Authentication > Users
- [ ] **5.2** Click "Add user" > "Create new user"
- [ ] **5.3** Enter email: ________________________
- [ ] **5.4** Enter password: ________________________
- [ ] **5.5** Check "Auto Confirm User"
- [ ] **5.6** Click "Create user"
- [ ] **5.7** Copy User UID: ________________________

---

## Phase 6: Add Admin to Database

- [ ] **6.1** Go to SQL Editor
- [ ] **6.2** Create new query
- [ ] **6.3** Run this command (your credentials are already filled in):
  ```sql
  INSERT INTO public.admins (id, email, role)
  VALUES ('07a3cfb7-a762-40f1-9ae4-cbbb8666abe3', 'rey.loremia@dorsu.edu.ph', 'super_admin');
  ```
- [ ] **6.4** Verify "Success" message
- [ ] **6.5** Run query to verify: `SELECT * FROM public.admins;`
- [ ] **6.6** Confirm your admin user appears

---

## Phase 7: Update Application Configuration

- [ ] **7.1** Open `.env.local` file in project root
- [ ] **7.2** Replace `VITE_SUPABASE_URL` with new project URL
- [ ] **7.3** Replace `VITE_SUPABASE_ANON_KEY` with new anon key
- [ ] **7.4** Verify `VITE_ADMIN_PASS` is still `Rey21`
- [ ] **7.5** Save the file

---

## Phase 8: Test the Connection

- [ ] **8.1** Stop dev server (Ctrl+C in terminal)
- [ ] **8.2** Start dev server: `npm run dev`
- [ ] **8.3** Wait for server to start
- [ ] **8.4** Open browser to local URL
- [ ] **8.5** Navigate to admin login page
- [ ] **8.6** Try logging in with admin credentials
- [ ] **8.7** Verify successful login
- [ ] **8.8** Check admin panel loads correctly

---

## Phase 9: Final Verification

- [ ] **9.1** All tables are empty (no old data)
- [ ] **9.2** Admin user can log in
- [ ] **9.3** Admin panel is accessible
- [ ] **9.4** No console errors in browser
- [ ] **9.5** Application connects to new database

---

## Phase 10: Documentation & Cleanup

- [ ] **10.1** Document your new credentials securely
- [ ] **10.2** Back up `.env.local` file
- [ ] **10.3** Set up database backups in Supabase
- [ ] **10.4** Review security settings
- [ ] **10.5** Update team with new database info

---

## 🎉 Setup Complete!

Your MatiARBio database is now ready to use!

**Next Steps:**
- [ ] Import/add your biodiversity data
- [ ] Test all application features
- [ ] Configure email templates (optional)
- [ ] Set up monitoring and alerts
- [ ] Train team on admin panel

---

## 📝 Notes & Issues

Use this space to note any issues or special configurations:

```
_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________
```

---

## 🆘 Troubleshooting Reference

**Can't connect:**
→ Check `.env.local` values
→ Restart dev server
→ Verify Supabase project is active

**Admin login fails:**
→ Verify admin exists in Authentication
→ Check admin is in `admins` table
→ Verify email matches exactly

**Storage errors:**
→ Check buckets are public
→ Verify storage policies are set
→ Check authentication status

---

**Setup Date:** ________________  
**Completed By:** ________________  
**Verified By:** ________________  

✅ **All phases complete and verified**
