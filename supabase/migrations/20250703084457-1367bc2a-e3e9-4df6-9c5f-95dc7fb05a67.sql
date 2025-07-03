-- Update existing posts by admin to use random usernames
UPDATE public.posts 
SET display_username = (
  (ARRAY['Silent', 'Brave', 'Curious', 'Gentle', 'Swift', 'Wise', 'Kind', 'Bold', 'Calm', 'Bright'])[floor(random() * 10 + 1)::int] || 
  (ARRAY['Eagle', 'Wolf', 'Bear', 'Lion', 'Tiger', 'Fox', 'Owl', 'Hawk', 'Dolphin', 'Whale'])[floor(random() * 10 + 1)::int] || 
  floor(random() * 1000)::text
)
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bpavan2023@gmail.com') 
AND display_username IS NULL;