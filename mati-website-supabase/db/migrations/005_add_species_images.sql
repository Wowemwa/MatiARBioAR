-- Add image_urls column to species table for storing multiple image URLs
ALTER TABLE public.species ADD COLUMN IF NOT EXISTS image_urls TEXT[];