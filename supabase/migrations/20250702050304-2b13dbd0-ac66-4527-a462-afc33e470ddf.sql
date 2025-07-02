
-- Add foreign key relationship between posts and profiles
ALTER TABLE public.posts 
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Ensure the post_replies foreign key exists (in case the previous migration didn't apply)
ALTER TABLE public.post_replies 
DROP CONSTRAINT IF EXISTS post_replies_user_id_fkey;

ALTER TABLE public.post_replies 
ADD CONSTRAINT post_replies_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
