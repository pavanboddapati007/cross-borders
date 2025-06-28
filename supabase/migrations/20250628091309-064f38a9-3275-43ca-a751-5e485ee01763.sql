
-- Add username column to profiles table
ALTER TABLE public.profiles ADD COLUMN username TEXT;

-- Create unique index for usernames (case-insensitive)
CREATE UNIQUE INDEX profiles_username_unique ON public.profiles (LOWER(username));

-- Update the handle_new_user function to generate random usernames
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  random_username TEXT;
  attempt_count INTEGER := 0;
  max_attempts INTEGER := 10;
BEGIN
  -- Generate a random username
  LOOP
    -- Create random username components
    random_username := (
      ARRAY['Silent', 'Brave', 'Curious', 'Gentle', 'Swift', 'Wise', 'Kind', 'Bold',
            'Calm', 'Bright', 'Free', 'Noble', 'Quick', 'Loyal', 'Proud', 'Strong',
            'Happy', 'Lucky', 'Smart', 'Cool', 'Warm', 'Fresh', 'Clear', 'Sharp']
    )[floor(random() * 24 + 1)] || 
    (
      ARRAY['Eagle', 'Wolf', 'Bear', 'Lion', 'Tiger', 'Fox', 'Owl', 'Hawk',
            'Dolphin', 'Whale', 'Shark', 'Turtle', 'Penguin', 'Falcon', 'Raven', 'Swan',
            'Mountain', 'River', 'Ocean', 'Forest', 'Valley', 'Storm', 'Thunder', 'Lightning',
            'Star', 'Moon', 'Sun', 'Cloud', 'Wind', 'Fire', 'Ice', 'Stone']
    )[floor(random() * 32 + 1)] || 
    floor(random() * 1000)::text;
    
    -- Check if username already exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE LOWER(username) = LOWER(random_username)) THEN
      EXIT;
    END IF;
    
    attempt_count := attempt_count + 1;
    IF attempt_count >= max_attempts THEN
      -- If we can't find a unique username, add a UUID suffix
      random_username := random_username || '_' || substr(gen_random_uuid()::text, 1, 8);
      EXIT;
    END IF;
  END LOOP;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, username)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    random_username
  );
  RETURN new;
END;
$$;
