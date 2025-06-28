
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
    const { question } = await req.json()
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured')
    }

    // Get relevant posts and replies from database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: posts } = await supabaseClient
      .from('posts')
      .select(`
        id, title, content, classification, country, category, stage, status,
        post_replies(content)
      `)
      .limit(20)

    // Create context from posts and replies
    const context = posts?.map(post => {
      const replies = post.post_replies?.map((r: any) => r.content).join(' ') || ''
      return `Post: ${post.title}\nContent: ${post.content}\nClassification: ${post.classification || 'N/A'}\nReplies: ${replies}\n---`
    }).join('\n') || ''

    // Call Groq API
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
            content: `You are an AI Immigration Assistant. Answer questions about immigration using the provided context from real user experiences and your knowledge.
            
            If the context contains relevant information, prioritize that. If not, use your general immigration knowledge.
            Always be helpful, accurate, and include a disclaimer that this is general information and users should consult with immigration attorneys for personalized advice.
            
            Context from user posts and replies:
            ${context}`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    const groqData = await groqResponse.json()
    const answer = groqData.choices[0].message.content

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
