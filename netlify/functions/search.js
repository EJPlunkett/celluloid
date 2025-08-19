import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Initialize clients
const supabase = createClient(
  'https://yrzugdmatddwypzdirhz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyenVnZG1hdGRkd3lwemRpcmh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ1MjU3OCwiZXhwIjoyMDcxMDI4NTc4fQ.luT8IAW2c-hFiInxDzLOcgbWqbt-px_HK9ddyv_iah0'
)

const openai = new OpenAI({
  apiKey: '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' 
})

// GPT preprocessing prompt
const preprocessingPrompt = `
You are helping users find NYC movies based on aesthetic descriptions. 

Analyze the user's input and extract:
1. Aesthetic/visual keywords (moods, styles, cinematography, themes)
2. Time periods mentioned (decades for either when movie was MADE or SET)
3. Any specific visual elements (colors, locations, lighting, etc.)

User input: "{USER_INPUT}"

Respond in this exact JSON format:
{
  "aesthetic_keywords": "cleaned aesthetic description for vector search",
  "time_filters": {
    "mentioned_decades": ["1970s", "1980s"],
    "match_release_year": true,
    "match_depicted_decade": true
  },
  "confidence": 0.95
}

Rules:
- aesthetic_keywords: Clean, searchable text focusing on visual/mood elements
- mentioned_decades: Extract any decades mentioned (1920s, 1930s, etc.)
- match_release_year: true if decades should filter by when movie was made
- match_depicted_decade: true if decades should filter by when movie is set
- If decade context is unclear, set both to true
- confidence: 0-1 based on how clear the input is
`

async function searchMovies(userInput, limit = 10) {
  try {
    console.log('Processing user input:', userInput)
    
    // Step 1: GPT preprocessing
    const preprocessResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: preprocessingPrompt.replace('{USER_INPUT}', userInput)
      }],
      response_format: { type: 'json_object' }
    })
    
    const preprocessed = JSON.parse(preprocessResponse.choices[0].message.content)
    console.log('Preprocessed query:', preprocessed)
    
    // Step 2: Generate embedding for aesthetic keywords
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: preprocessed.aesthetic_keywords,
      encoding_format: 'float'
    })
    
    const queryEmbedding = embeddingResponse.data[0].embedding
    
    // Step 3: Vector similarity search
    const { data: movies, error } = await supabase.rpc('match_movies', {
      query_embedding: queryEmbedding,
      match_threshold: 0.1,
      match_count: limit * 2
    })
    
    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }
    
    // Step 4: Apply additional time filtering if needed
    let filteredMovies = movies
    
    if (preprocessed.time_filters.mentioned_decades.length > 0) {
      filteredMovies = movies.filter(movie => {
        const decades = preprocessed.time_filters.mentioned_decades
        
        // Check release year
        let releaseMatch = false
        if (preprocessed.time_filters.match_release_year) {
          releaseMatch = decades.some(decade => {
            const startYear = parseInt(decade.replace('s', ''))
            const endYear = startYear + 9
            return movie.year >= startYear && movie.year <= endYear
          })
        }
        
        // Check depicted decade
        let depictedMatch = false
        if (preprocessed.time_filters.match_depicted_decade) {
          depictedMatch = decades.includes(movie.depicted_decade)
        }
        
        // Return true if either match (OR logic)
        return releaseMatch || depictedMatch || preprocessed.time_filters.mentioned_decades.length === 0
      })
    }
    
    // Step 5: Return top results
    const results = filteredMovies.slice(0, limit).map(movie => ({
      movie_id: movie.movie_id,
      movie_title: movie.movie_title,
      year: movie.year,
      aesthetic_summary: movie.aesthetic_summary,
      depicted_decade: movie.depicted_decade,
      hex_codes: movie.hex_codes,
      letterboxd_link: movie.letterboxd_link,
      similarity_score: movie.similarity,
      match_reason: {
        aesthetic_match: preprocessed.aesthetic_keywords,
        time_period_match: preprocessed.time_filters.mentioned_decades,
        confidence: preprocessed.confidence
      }
    }))
    
    return {
      success: true,
      results,
      query_info: preprocessed
    }
    
  } catch (error) {
    console.error('Search error:', error)
    return {
      success: false,
      error: error.message,
      results: []
    }
  }
}

// Netlify Function Handler
export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }
  
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }
  
  try {
    const { userInput, limit } = JSON.parse(event.body)
    
    if (!userInput) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userInput is required' })
      }
    }
    
    const results = await searchMovies(userInput, limit || 10)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results)
    }
    
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}