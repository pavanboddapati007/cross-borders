-- Ensure proper unique constraint on post_likes table
-- This will prevent users from liking the same post multiple times
ALTER TABLE public.post_likes DROP CONSTRAINT IF EXISTS post_likes_user_id_post_id_key;
ALTER TABLE public.post_likes ADD CONSTRAINT post_likes_user_id_post_id_key UNIQUE (user_id, post_id);

-- Fix like counts for existing posts by updating them to match actual like counts
UPDATE posts 
SET likes = subquery.like_count
FROM (
  SELECT p.id, COUNT(pl.id) as like_count
  FROM posts p
  LEFT JOIN post_likes pl ON p.id = pl.post_id
  GROUP BY p.id
) subquery
WHERE posts.id = subquery.id
AND (posts.likes != subquery.like_count OR posts.likes IS NULL);