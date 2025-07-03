-- Fix comment counts for existing posts by updating them to match actual reply counts
UPDATE posts 
SET comments = subquery.reply_count
FROM (
  SELECT p.id, COUNT(pr.id) as reply_count
  FROM posts p
  LEFT JOIN post_replies pr ON p.id = pr.post_id
  GROUP BY p.id
) subquery
WHERE posts.id = subquery.id
AND posts.comments != subquery.reply_count;