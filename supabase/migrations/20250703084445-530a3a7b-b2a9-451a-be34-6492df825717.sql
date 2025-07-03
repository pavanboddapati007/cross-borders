-- Update existing posts by admin to use random usernames
UPDATE public.posts 
SET display_username = CASE 
  WHEN id = (SELECT id FROM public.posts WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bpavan2023@gmail.com') ORDER BY created_at LIMIT 1) THEN 'MigrationExpert'
  ELSE (
    ARRAY['Silent', 'Brave', 'Curious', 'Gentle', 'Swift', 'Wise', 'Kind', 'Bold', 'Calm', 'Bright'][floor(random() * 10 + 1)] || 
    ARRAY['Eagle', 'Wolf', 'Bear', 'Lion', 'Tiger', 'Fox', 'Owl', 'Hawk', 'Dolphin', 'Whale'][floor(random() * 10 + 1)] || 
    floor(random() * 1000)::text
  )
END
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bpavan2023@gmail.com') 
AND display_username IS NULL;