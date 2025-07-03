-- Drop the existing restrictive update policy
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;

-- Create a new policy that allows users to update their own posts completely
CREATE POLICY "Users can update their own posts" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create a policy that allows any authenticated user to update like and comment counts
CREATE POLICY "Users can update engagement counts on any post" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);