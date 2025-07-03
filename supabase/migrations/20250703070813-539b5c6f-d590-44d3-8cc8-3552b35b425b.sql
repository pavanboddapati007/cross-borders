-- Add a policy to allow authenticated users to update like counts on any post
-- This is separate from the main update policy which should remain restrictive
CREATE POLICY "Users can update like counts on any post" 
ON public.posts 
FOR UPDATE 
USING (true)
WITH CHECK (
  -- Only allow updating the likes field, nothing else
  OLD.id = NEW.id AND
  OLD.user_id = NEW.user_id AND
  OLD.title = NEW.title AND
  OLD.content = NEW.content AND
  OLD.country = NEW.country AND
  OLD.category = NEW.category AND
  OLD.stage = NEW.stage AND
  OLD.status = NEW.status AND
  OLD.tags = NEW.tags AND
  OLD.visa_type = NEW.visa_type AND
  OLD.target_country = NEW.target_country AND
  OLD.comments = NEW.comments AND
  OLD.classification = NEW.classification AND
  OLD.classification_confidence = NEW.classification_confidence AND
  OLD.classified_at = NEW.classified_at AND
  OLD.created_at = NEW.created_at
);