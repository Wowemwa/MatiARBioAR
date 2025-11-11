-- Migration: Add ar_model_url column to species table for storing AR model URLs (glTF/GLB)
-- This allows each species to have an optional 3D model for AR viewing

ALTER TABLE public.species 
ADD COLUMN IF NOT EXISTS ar_model_url TEXT;

COMMENT ON COLUMN public.species.ar_model_url IS 'URL to AR 3D model file (glTF/GLB format) stored in Supabase Storage';
