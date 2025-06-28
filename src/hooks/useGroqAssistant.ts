
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGroqAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = async (question: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { question }
      });

      if (error) throw error;
      return data.answer;
    } catch (error) {
      console.error('AI Assistant error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { askQuestion, isLoading };
};
