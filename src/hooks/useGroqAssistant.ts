
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGroqAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = async (question: string) => {
    setIsLoading(true);
    try {
      console.log('Calling AI assistant with question:', question);
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { question }
      });

      console.log('AI assistant response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`AI Assistant Error: ${error.message}`);
      }
      
      if (!data || !data.answer) {
        throw new Error('No response received from AI assistant');
      }
      
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
