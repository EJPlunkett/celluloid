import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Initialize clients
const supabase = createClient(
  'https://yrzugdmatddwypzdirhz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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
    console.log('GPT preprocessed result:', preprocessed)
    
    // Step 2: Generate embedding for aesthetic keywords
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: preprocessed.aesthetic_keywords,
      encoding_format: 'float'
    })
    
    console.log('Generated embedding, length:', embeddingResponse.data[0].embedding.length)
    
    const queryEmbedding = embeddingResponse.data[0].embedding
    
    // Step 3: Vector similarity search
    console.log('Calling match_movies with threshold:', 0.01)
    const { data: movies, error } = await supabase.rpc('match_movies', {
      query_embedding: queryEmbedding,
      match_threshold: 0.001,
      match_count: limit * 6
    })
    
    console.log('Database response - movies found:', movies ? movies.length : 0)
    console.log('Database error:', error)
    
    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }
    
    // Step 4: Apply additional time filtering if needed
    let filteredMovies = movies
    
    if (preprocessed.time_filters.mentioned_decades.length > 0) {
      console.log('Applying decade filtering for:', preprocessed.time_filters.mentioned_decades)
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
      console.log('After decade filtering - movies remaining:', filteredMovies.length)
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
    
    console.log('Final results count:', results.length)
    
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