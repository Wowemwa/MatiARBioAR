# Mati City Biodiversity Database Setup

This guide will help you set up a complete Supabase database for the Mati City Biodiversity website.

## Prerequisites

1. A Supabase account (free at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Supabase CLI (optional, for advanced operations)

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `mati-biodiversity` (or your choice)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to your users
4. Wait for the project to be created (this takes a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy these values:
   - Project URL
   - Project API Key (anon/public key)

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root (next to `.env.example`):

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 4: Set Up the Database Schema

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the entire contents of `db/schema.sql`
3. Click "Run" to execute the SQL

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Push the schema
supabase db push
```

## Step 5: Seed Initial Data

1. In the SQL Editor, run the contents of `db/seed.sql`
2. This will populate your database with:
   - Sample biodiversity sites (Mount Hamiguitan, Pujada Bay)
   - Sample species data
   - Team member information
   - Sample feedback and analytics

## Step 6: Create Admin User

You need to create at least one admin user for accessing the admin panel:

1. In Supabase Dashboard, go to Authentication → Users
2. Click "Add User"
3. Create a user with:
   - Email: Your admin email
   - Password: Choose a secure password
   - Auto-confirm the user
4. Copy the User ID (UUID) from the user details

5. In SQL Editor, run this to make the user an admin:

```sql
INSERT INTO public.admins (id, email, role)
VALUES ('your-user-uuid-here', 'your-admin-email@example.com', 'super_admin');
```

## Step 7: Set Up Storage (Optional)

If you want to allow file uploads (images, documents):

1. In Supabase Dashboard, go to Storage
2. Create a new bucket called `media`
3. Set it to public if you want public access to uploaded files
4. In SQL Editor, run the storage policy from the schema file

## Step 8: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try logging into the admin panel:
   - Click the admin trigger (usually a secret button)
   - Use the admin email and password you created

3. Test feedback submission:
   - Use the feedback button on any page
   - Check that feedback appears in the admin panel

## Database Schema Overview

### Core Tables

- **admins**: Admin user accounts with role-based access
- **profiles**: User profiles for all authenticated users
- **sites**: Biodiversity hotspots/sites
- **species**: Species information with taxonomy
- **species_sites**: Many-to-many relationship between species and sites
- **distribution_records**: Specific observation records
- **media_assets**: Images, videos, and other media files
- **feedback**: User feedback submissions
- **analytics_events**: Website usage analytics
- **performance_metrics**: Performance monitoring data
- **team_members**: Team/staff information
- **activity_log**: Admin action logging

### Security Features

- **Row Level Security (RLS)**: All tables have RLS enabled
- **Admin-only access**: Sensitive operations require admin privileges
- **Public read access**: Biodiversity data is publicly readable
- **Authenticated uploads**: File uploads require authentication

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that your `.env.local` file exists and has the correct values
   - Make sure the variable names match exactly

2. **"Admin login fails"**
   - Verify the user exists in `auth.users`
   - Check that the user ID is in the `admins` table
   - Ensure the email/password are correct

3. **"Permission denied" errors**
   - Check that RLS policies are correctly applied
   - Verify the user has the required permissions

4. **"Table doesn't exist"**
   - Make sure you ran the schema.sql file successfully
   - Check for any SQL errors during schema creation

### Getting Help

- Check the Supabase documentation: https://supabase.com/docs
- Review the SQL logs in Supabase Dashboard → Database → Logs
- Check browser console for JavaScript errors

## Next Steps

Once your database is set up:

1. **Customize the data**: Replace sample data with real biodiversity information
2. **Add more species**: Use the species table structure to add more entries
3. **Configure storage**: Set up file upload policies for media
4. **Set up monitoring**: Configure analytics and performance tracking
5. **Add more admins**: Create additional admin accounts as needed

## Backup and Maintenance

- **Regular backups**: Supabase handles automatic backups
- **Monitor usage**: Check the dashboard for database usage and performance
- **Update schemas**: Use migrations for schema changes in production
- **Security**: Regularly rotate API keys and review access policies

---

For questions or issues, check the project documentation or create an issue in the repository.

5. Start the server:
   ```
   npm run start
   ```

## Usage
- Access the application through the configured server URL.
- Use the API endpoints defined in the `src/api/` directory for authentication, user management, profile handling, post management, and media uploads.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.