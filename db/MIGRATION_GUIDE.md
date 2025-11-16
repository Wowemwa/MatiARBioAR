# New Database Setup Guide for MatiARBio

This guide will help you set up your new clean Supabase database named **MatiARBio** with password **Rey21**.

## 📋 Prerequisites

- New Supabase project created with name: **MatiARBio**
- Database password: **Rey21**
- Access to Supabase Dashboard

## 🚀 Step-by-Step Setup

### Step 1: Access Your New Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **MatiARBio** project
3. Note down your project details:
   - **Project URL**: `https://[your-project-ref].supabase.co`
   - **Project Reference ID**: Found in your project URL

### Step 2: Get Your API Keys

1. In your Supabase Dashboard, go to **Project Settings** (gear icon)
2. Click on **API** in the left sidebar
3. Copy the following keys:
   - **Project URL**: `https://[your-project-ref].supabase.co`
   - **anon public key**: A long JWT token (starts with `eyJ...`)

### Step 3: Run the Database Schema

1. In Supabase Dashboard, go to **SQL Editor** (lightning icon in sidebar)
2. Click **New Query**
3. Open the file `NEW_DATABASE_SETUP.sql` in this directory
4. Copy the entire contents
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for the script to complete (should show "Success" message)

### Step 4: Set Up Storage Buckets

1. In Supabase Dashboard, go to **Storage** (folder icon in sidebar)
2. Click **New bucket**

#### Create "media" bucket:
- **Name**: `media`
- **Public**: ✅ Check this box
- Click **Create bucket**

#### Create "ar-models" bucket:
- **Name**: `ar-models`
- **Public**: ✅ Check this box
- Click **Create bucket**

### Step 5: Configure Storage Policies

For each bucket, set up these policies:

#### For "media" bucket:
1. Click on the **media** bucket
2. Go to **Policies** tab
3. Add these policies:

**Policy 1: Public Read**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
```

**Policy 3: Admin Delete**
```sql
CREATE POLICY "Admin can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' AND 
  auth.uid() IN (SELECT id FROM public.admins)
);
```

#### For "ar-models" bucket:
Repeat the same policies, replacing `'media'` with `'ar-models'`

### Step 6: Create Your First Admin User

1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Fill in:
   - **Email**: Your admin email (e.g., `admin@mati.gov.ph`)
   - **Password**: Create a secure password
   - **Auto Confirm User**: ✅ Check this box
4. Click **Create user**
5. Copy the **User UID** (it looks like: `12345678-1234-1234-1234-123456789abc`)

### Step 7: Add Admin to Database

1. Go back to **SQL Editor**
2. Run this query (replace with your actual values):

```sql
INSERT INTO public.admins (id, email, role)
VALUES ('07a3cfb7-a762-40f1-9ae4-cbbb8666abe3', 'rey.loremia@dorsu.edu.ph', 'super_admin');
```Example:
```sql
INSERT INTO public.admins (id, email, role) 
VALUES ('12345678-1234-1234-1234-123456789abc', 'admin@mati.gov.ph', 'super_admin');
```

### Step 8: Update Your Application Configuration

Update your `.env.local` file with the new credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://[your-new-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc[your-new-anon-key]

# Admin access configuration
VITE_ADMIN_PASS=Rey21
```

### Step 9: Test the Connection

1. Stop your development server if it's running (Ctrl+C in terminal)
2. Start it again:
   ```powershell
   npm run dev
   ```
3. Open your application in the browser
4. Try to log in as admin with your new credentials

## 🗄️ Database Tables Created

Your new database includes these tables:

### Core Tables:
- **admins** - Admin user management
- **profiles** - User profiles
- **sites** - Biodiversity hotspot locations
- **species** - Flora and fauna species information
- **species_sites** - Many-to-many relationship between species and sites

### Supporting Tables:
- **distribution_records** - Species observation records
- **media_assets** - Images, videos, AR models
- **feedback** - User feedback submissions
- **analytics_events** - User interaction tracking
- **performance_metrics** - Application performance data
- **team_members** - Team member information
- **activity_log** - Admin action audit trail

## 🔒 Security Features

The database includes:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Public read access for public data (sites, species)
- ✅ Admin-only write access for content management
- ✅ Anonymous feedback submission
- ✅ Authenticated user profiles
- ✅ Audit logging for admin actions

## 📊 Indexes Created

Performance indexes have been added for:
- Foreign key relationships
- Commonly queried fields (category, status, location)
- Array columns (using GIN indexes)
- Date/time columns

## 🔄 Next Steps

After completing the setup:

1. **Verify the connection** - Test your application
2. **Add data** - Start adding your biodiversity data through the admin panel
3. **Configure authentication** - Set up email templates in Supabase if needed
4. **Set up backups** - Configure automatic backups in Supabase settings
5. **Monitor usage** - Check the Supabase Dashboard for usage metrics

## ❓ Troubleshooting

### Can't connect to database
- Verify your `.env.local` file has the correct URL and API key
- Make sure you've restarted your development server
- Check that the Supabase project is active in the dashboard

### Admin login not working
- Verify the admin user exists in **Authentication** > **Users**
- Check that the user ID was added to the `admins` table
- Ensure the email matches exactly in both places

### Storage upload errors
- Verify storage buckets are created and set to public
- Check that storage policies are properly configured
- Ensure authenticated users have upload permissions

## 📝 Important Notes

- **Keep your database password secure**: Don't share the password `Rey21` publicly
- **Back up regularly**: Enable automatic backups in Supabase settings
- **Monitor usage**: Free tier has limits, monitor in dashboard
- **Update policies as needed**: Adjust RLS policies based on your requirements

## 🆘 Need Help?

If you encounter any issues:
1. Check the Supabase logs in the Dashboard
2. Review the RLS policies in the Table Editor
3. Verify all environment variables are correct
4. Check the browser console for errors

---

**Database Setup Complete! 🎉**

Your MatiARBio database is now ready to use with a clean, empty schema and proper security configuration.
