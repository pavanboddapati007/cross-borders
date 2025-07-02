
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
    console.log('AI Assistant function called')
    
    const requestBody = await req.json()
    console.log('Request body:', requestBody)
    
    const { question } = requestBody
    if (!question) {
      throw new Error('No question provided')
    }
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    console.log('GROQ_API_KEY configured:', !!groqApiKey)
    
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

    // Call Groq API with Llama 3 70B model
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a professional immigration advisor. Provide a clear, step-by-step answer based only on the official US immigration policies. Do not make up information. If unsure, say you don't know.

Always include relevant source links at the end of your response using official government sources such as:
- USCIS.gov (https://www.uscis.gov)
- State Department (https://travel.state.gov)
- Department of Labor (https://www.dol.gov)
- IRS (https://www.irs.gov) for tax-related immigration matters

Context from user posts and replies (use this to understand common user experiences but rely on official policies for advice):
${context}`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    })

    const groqData = await groqResponse.json()
    const answer = groqData.choices[0].message.content

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Assistant error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
