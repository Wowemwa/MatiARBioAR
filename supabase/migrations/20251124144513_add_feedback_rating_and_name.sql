-- Add rating and name columns to feedback table
ALTER TABLE public.feedback
ADD COLUMN name TEXT,
ADD COLUMN rating INTEGER CHECK (rating >= 1 AND rating <= 5);
