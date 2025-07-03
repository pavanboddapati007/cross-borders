-- Add display_username field to posts table to allow admin to override usernames
ALTER TABLE public.posts 
ADD COLUMN display_username TEXT;