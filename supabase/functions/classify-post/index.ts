
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { postId, title, content, country, category } = await req.json()
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured')
    }

    // Call Groq API for classification
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'compound-beta-mini',
        messages: [
          {
            role: 'system',
            content: `You are an immigration post classifier. Classify the following post into one of these categories:
            
            - immigration_process: General immigration procedures, applications, timelines
            - visa_work: Work visas, employment-based immigration
            - visa_student: Student visas, education-related immigration
            - visa_family: Family-based immigration, spouse visas
            - green_card: Permanent residence applications
            - citizenship: Naturalization, citizenship applications
            - scam_warning: Immigration scams, fraud alerts
            - legal_advice: Legal questions, attorney recommendations
            - document_help: Document preparation, requirements
            - success_story: Positive outcomes, celebrations
            - general_question: General immigration questions
            - off_topic: Not related to immigration
            
            Respond with JSON: {"classification": "category_name", "confidence": 0.95}
            Confidence should be between 0.0 and 1.0.`
          },
          {
            role: 'user',
            content: `Title: ${title}\nContent: ${content}\nCountry: ${country || 'N/A'}\nCategory: ${category || 'N/A'}`
          }
        ],
        temperature: 0.1,
        max_tokens: 100
      })
    })

    const groqData = await groqResponse.json()
    const result = JSON.parse(groqData.choices[0].message.content)

    // Update post in database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabaseClient
      .from('posts')
      .update({
        classification: result.classification,
        classification_confidence: result.confidence,
        classified_at: new Date().toISOString()
      })
      .eq('id', postId)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, classification: result.classification, confidence: result.confidence }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
