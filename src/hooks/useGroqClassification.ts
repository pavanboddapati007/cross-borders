
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGroqClassification = () => {
  const [isClassifying, setIsClassifying] = useState(false);

  const classifyPost = async (postId: string, title: string, content: string, country?: string, category?: string) => {
    setIsClassifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('classify-post', {
        body: { postId, title, content, country, category }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Classification error:', error);
      throw error;
    } finally {
      setIsClassifying(false);
    }
  };

  return { classifyPost, isClassifying };
};
