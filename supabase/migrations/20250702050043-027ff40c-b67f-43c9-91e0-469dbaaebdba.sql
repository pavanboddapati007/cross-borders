
-- Add foreign key relationship between post_replies and profiles
ALTER TABLE public.post_replies 
ADD CONSTRAINT post_replies_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
