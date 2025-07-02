
-- Add missing columns to the posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS visa_type text,
ADD COLUMN IF NOT EXISTS target_country text;
