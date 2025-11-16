# Quick Reference: Update Environment Variables

## 🔧 What You Need to Update

After setting up your new **MatiARBio** database, update these files:

### File: `.env.local`

**Current Configuration:**
```env
VITE_SUPABASE_URL=https://vxfimfqycdjzehxlhzcd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4ZmltZnF5Y2RqemVoeGxoemNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODgwMzYsImV4cCI6MjA3ODg2NDAzNn0._QyqEDrcKoqQOowViavF0kGR4R_FSmRr-VU3UIpVSDs
VITE_ADMIN_PASS=Rey21
```

**New (MatiARBio Database):**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR-NEW-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-NEW-ANON-KEY-FROM-DASHBOARD

# Admin access configuration
VITE_ADMIN_PASS=Rey21
```

## 📍 Where to Find New Values

### 1. Get Project URL and Anon Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **MatiARBio** project
3. Click **Settings** (gear icon) > **API**
4. Copy:
   - **Project URL** → Replace `VITE_SUPABASE_URL`
   - **anon public** key → Replace `VITE_SUPABASE_ANON_KEY`

### 2. Update the File

1. Open `.env.local` in your project root
2. Replace the values with your new database credentials
3. Save the file
4. Restart your dev server: `npm run dev`

## ✅ Verification Checklist

After updating:

- [ ] New `VITE_SUPABASE_URL` is set
- [ ] New `VITE_SUPABASE_ANON_KEY` is set
- [ ] `VITE_ADMIN_PASS` is still `Rey21`
- [ ] Development server restarted
- [ ] Can load the application
- [ ] Can log in as admin

## 🚨 Common Mistakes

❌ **Don't forget to:**
- Restart your dev server after changing `.env.local`
- Run the SQL schema setup script first
- Create your admin user in Supabase Auth
- Add the admin to the `admins` table

✅ **Remember:**
- Keep `.env.local` file secure
- Never commit `.env.local` to git
- The password `Rey21` is your database password and admin panel password

## 🔄 Full Setup Order

1. ✅ Create new Supabase project (MatiARBio)
2. ✅ Run `NEW_DATABASE_SETUP.sql` in SQL Editor
3. ✅ Create storage buckets (media, ar-models)
4. ✅ Set up storage policies
5. ✅ Create admin user in Authentication
6. ✅ Add admin to `admins` table
7. ✅ Update `.env.local` with new credentials ← **YOU ARE HERE**
8. ✅ Restart dev server
9. ✅ Test admin login

---

**Quick Command to Restart Dev Server:**
```powershell
# Press Ctrl+C to stop current server, then:
npm run dev
```
