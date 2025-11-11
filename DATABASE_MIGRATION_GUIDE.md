# Database Migration Guide

## Apply These Migrations to Your Supabase Database

Execute these SQL commands in your Supabase SQL Editor (in order):

### 1. Add Name and Rating Columns to Feedback Table

```sql
-- Add name and rating columns to feedback table
ALTER TABLE public.feedback 
ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Anonymous',
ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5);

-- Update existing records to have default values
UPDATE public.feedback 
SET name = 'Anonymous' 
WHERE name IS NULL;

UPDATE public.feedback 
SET rating = 5 
WHERE rating IS NULL;
```

### 2. Update Feedback Policies

```sql
-- Drop old policy that required authentication
DROP POLICY IF EXISTS "feedback_insert_authenticated" ON public.feedback;

-- Create new policy allowing anonymous submissions
CREATE POLICY "feedback_insert_all" ON public.feedback 
FOR INSERT 
WITH CHECK (true);

-- Add delete policy for admins
DROP POLICY IF EXISTS "feedback_delete_admin" ON public.feedback;
CREATE POLICY "feedback_delete_admin" ON public.feedback 
FOR DELETE 
USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
```

## Verification

After running the migrations, verify:

1. **Check columns exist:**
```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'feedback' 
AND table_schema = 'public';
```

2. **Check policies:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'feedback';
```

## Expected Result

You should see:
- ✅ `name` column (TEXT, default 'Anonymous')
- ✅ `rating` column (INTEGER, default 5, CHECK constraint 1-5)
- ✅ `feedback_insert_all` policy (allows anonymous INSERT)
- ✅ `feedback_delete_admin` policy (allows admin DELETE)
- ✅ `feedback_select_admin` policy (allows admin SELECT)
- ✅ `feedback_update_admin` policy (allows admin UPDATE)

## Testing

1. **Test anonymous feedback submission:**
   - Go to your website
   - Click the feedback button (floating icon)
   - Fill in name, message, rating
   - Submit without being logged in
   - Should succeed ✅

2. **Test admin feedback viewing:**
   - Login as admin
   - Go to Admin Dashboard → User Feedbacks
   - Should see all submitted feedbacks ✅

3. **Test admin feedback deletion:**
   - Select a feedback
   - Click delete
   - Should successfully delete from database ✅
