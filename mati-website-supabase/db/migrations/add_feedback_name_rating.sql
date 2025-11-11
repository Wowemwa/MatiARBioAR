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
