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
You are a movie expert helping users find NYC films. You have access to a database of approximately 1,500 movies that were filmed in or prominently feature New York City.

Analyze the user's input for:
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

IMPORTANT: For thematic searches, recommend movies that are:
1. **Definitely filmed in or set in NYC** (not Miami, Las Vegas, etc.)
2. **Likely to be in a comprehensive NYC film database**
3. **Well-known films from major studios or acclaimed indie films**
4. **Recommend 8-12 movies** to increase chances of database matches

Focus on iconic NYC films, major studio releases, and critically acclaimed movies rather than obscure or non-NYC films.

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
- For thematic searches: recommend 8-12 specific NYC movies with exact titles and years
- For hybrid searches: do both - provide movie recommendations AND aesthetic keywords
- Always include confidence score 0-1 based on how clear the input is
- Prioritize famous NYC films that would definitely be in a film database
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
  
  // FALLBACK: If we don't have enough results, try aesthetic search
  if (!movies || movies.length < Math.max(3, limit * 0.3)) {
    console.log('Thematic search returned too few results, falling back to aesthetic search')
    
    // Create aesthetic keywords based on the thematic query
    const fallbackKeywords = await createFallbackAestheticKeywords(recommendedMovies)
    console.log('Generated fallback aesthetic keywords:', fallbackKeywords)
    
    return await performAestheticSearch(fallbackKeywords, limit)
  }
  
  return formatResults(movies.slice(0, limit))
}

async function createFallbackAestheticKeywords(recommendedMovies) {
  // Extract themes/genres from the movie titles to create aesthetic keywords
  const movieTitles = recommendedMovies.map(m => m.title).join(', ')
  
  try {
    const fallbackResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `These movies were recommended for a thematic search but not found in the database: ${movieTitles}. 
        
        Generate aesthetic/visual keywords that capture the typical cinematographic style and visual mood of films in this genre/theme. Focus on lighting, colors, settings, atmosphere, and visual style that would be found in similar movies.
        
        Respond with only the aesthetic keywords, no other text.`
      }]
    })
    
    return fallbackResponse.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating fallback keywords:', error)
    // Default fallback based on common themes
    if (movieTitles.toLowerCase().includes('crime') || movieTitles.toLowerCase().includes('gangster')) {
      return 'dark shadows, urban nightlife, dramatic lighting, gritty atmosphere'
    }
    return 'urban environments, dramatic cinematography, rich textures, atmospheric lighting'
  }
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