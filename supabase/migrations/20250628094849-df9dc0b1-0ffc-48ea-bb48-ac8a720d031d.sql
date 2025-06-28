
-- Create posts table first
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  country TEXT,
  category TEXT,
  stage TEXT,
  status TEXT CHECK (status IN ('Completed', 'In Progress', 'Planning')),
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  classification TEXT,
  classification_confidence DECIMAL(3,2),
  classified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all posts" 
  ON public.posts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create posts" 
  ON public.posts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
  ON public.posts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.posts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a table to store post replies/comments
CREATE TABLE public.post_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for post_replies
ALTER TABLE public.post_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all post replies" 
  ON public.post_replies 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create post replies" 
  ON public.post_replies 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own post replies" 
  ON public.post_replies 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own post replies" 
  ON public.post_replies 
  FOR DELETE 
  USING (auth.uid() = user_id);
