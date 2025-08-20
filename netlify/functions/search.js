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

// Updated GPT preprocessing prompt
const preprocessingPrompt = `
You are a movie expert helping users find NYC films. Analyze the user's input for:

1. **Aesthetic elements** (lighting, colors, mood, cinematography, settings, visual style)
2. **Thematic elements** (actors, directors, genres, specific films, character types)

Determine search type:
- **"aesthetic"**: Only visual descriptions → use vector search
- **"thematic"**: Only actors/directors/genres/films → use database filtering  
- **"hybrid"**: Both aesthetic AND thematic → combine both approaches

User input: "{USER_INPUT}"

Examples:
- "neon-lit nightclub scenes with Robert De Niro" → hybrid
- "gritty Scorsese cinematography" → hybrid  
- "Robert De Niro films" → thematic
- "sleazy crime movies" → thematic
- "neon nightclub lighting" → aesthetic
- "mafia films" → thematic

For thematic/hybrid searches, recommend specific NYC movies with exact titles and release years for precise database matching. Focus on films actually shot in or set in New York City.

Extract all relevant elements for the search type detected.

Respond in this exact JSON format:
{
  "search_type": "aesthetic" | "thematic" | "hybrid",
  "search_criteria": {
    "recommended_movies": [
      {"title": "Movie Title", "year": 1985}
    ]
  },
  "aesthetic_keywords": "visual description when aesthetic elements present",
  "confidence": 0.95
}

Rules:
- For aesthetic searches: focus on visual/cinematic elements only
- For thematic searches: recommend 5-10 specific NYC movies with exact titles and years
- For hybrid searches: do both - provide movie recommendations AND aesthetic keywords
- Always include confidence score 0-1 based on how clear the input is
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
    
    let results = []
    
    // Step 2: Execute search based on type
    if (preprocessed.search_type === 'aesthetic') {
      // Pure aesthetic vector search
      results = await performAestheticSearch(preprocessed.aesthetic_keywords, limit)
      
    } else if (preprocessed.search_type === 'thematic') {
      // Pure thematic search by title + year
      results = await performThematicSearch(preprocessed.search_criteria.recommended_movies, limit)
      
    } else if (preprocessed.search_type === 'hybrid') {
      // Hybrid: aesthetic search filtered by thematic criteria
      results = await performHybridSearch(
        preprocessed.aesthetic_keywords, 
        preprocessed.search_criteria.recommended_movies, 
        limit
      )
    }
    
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

async function performAestheticSearch(aestheticKeywords, limit) {
  console.log('Performing aesthetic search for:', aestheticKeywords)
  
  // Generate embedding for aesthetic keywords
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: aestheticKeywords,
    encoding_format: 'float'
  })
  
  const queryEmbedding = embeddingResponse.data[0].embedding
  
  // Vector similarity search
  const { data: movies, error } = await supabase.rpc('match_movies', {
    query_embedding: queryEmbedding,
    match_threshold: 0.001,
    match_count: limit * 5
  })
  
  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }
  
  console.log('Aesthetic search found:', movies ? movies.length : 0, 'movies')
  
  return formatResults(movies.slice(0, limit))
}

async function performThematicSearch(recommendedMovies, limit) {
  console.log('Performing thematic search for movies:', recommendedMovies)
  
  if (!recommendedMovies || recommendedMovies.length === 0) {
    console.log('No recommended movies provided')
    return []
  }
  
  // Build query to find movies by title + year
  let query = supabase
    .from('celluloid_film_data')
    .select('*')
  
  // Create OR conditions for each recommended movie
  const conditions = recommendedMovies.map(movie => 
    `and(movie_title.ilike.%${movie.title}%,year.eq.${movie.year})`
  ).join(',')
  
  if (conditions) {
    query = query.or(conditions)
  }
  
  const { data: movies, error } = await query.limit(limit * 2)
  
  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }
  
  console.log('Thematic search found:', movies ? movies.length : 0, 'movies')
  
  return formatResults(movies.slice(0, limit))
}

async function performHybridSearch(aestheticKeywords, recommendedMovies, limit) {
  console.log('Performing hybrid search')
  console.log('Aesthetic keywords:', aestheticKeywords)
  console.log('Recommended movies:', recommendedMovies)
  
  // If we have specific movie recommendations, start with those
  if (recommendedMovies && recommendedMovies.length > 0) {
    const thematicResults = await performThematicSearch(recommendedMovies, limit)
    
    // If we got enough results from thematic search, return those
    if (thematicResults.length >= limit * 0.7) {
      console.log('Using thematic results for hybrid search')
      return thematicResults.slice(0, limit)
    }
  }
  
  // Otherwise, fall back to aesthetic search
  console.log('Falling back to aesthetic search for hybrid')
  return await performAestheticSearch(aestheticKeywords, limit)
}

function formatResults(movies) {
  if (!movies) return []
  
  return movies.map(movie => ({
    movie_id: movie.movie_id,
    movie_title: movie.movie_title,
    year: movie.year,
    aesthetic_summary: movie.aesthetic_summary,
    depicted_decade: movie.depicted_decade,
    hex_codes: movie.hex_codes,
    letterboxd_link: movie.letterboxd_link,
    similarity_score: movie.similarity || null
  }))
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