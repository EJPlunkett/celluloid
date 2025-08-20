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
You are a movie expert helping users find NYC films from a database of ~1,500 films.

Analyze the user's input and determine the best search approach:

**Search Types:**
- "aesthetic": Visual descriptions → vector search
- "thematic": Subjects/topics/actors/directors → database filtering  
- "hybrid": Both visual + thematic → combine approaches

**When to use THEMATIC:**
- Single words about subjects/topics: "cocaine", "mafia", "drugs", "finance"
- Actor/director names: "Robert De Niro", "Scorsese"
- Film genres: "crime films", "romantic comedies"
- Cultural topics: "wall street", "nightlife", "punk"

**When to use AESTHETIC:**
- Visual descriptions: "neon lighting", "rainy streets", "golden hour"
- Cinematography terms: "gritty", "atmospheric", "moody"
- Color/texture descriptions: "dark shadows", "bright colors"

**Examples:**
- "cocaine" → thematic (find cocaine-related movies)
- "mafia" → thematic (find mafia movies)
- "Robert De Niro" → thematic (find his movies)
- "neon lighting" → aesthetic (find movies with that visual style)
- "rainy 1970s grit" → aesthetic (visual description + time filter)

User input: "{USER_INPUT}"

**For thematic searches:** Recommend 8-12 iconic NYC films with exact titles/years
**For aesthetic searches:** Extract specific visual keywords + time periods
**For hybrid:** Do both

Respond in JSON:
{
  "search_type": "aesthetic" | "thematic" | "hybrid",
  "search_criteria": {
    "recommended_movies": [{"title": "Movie Title", "year": 1985}]
  },
  "aesthetic_keywords": "visual description when needed",
  "time_filters": {
    "mentioned_decades": ["1970s", "1980s"]
  },
  "confidence": 0.95
}
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
      results = await performAestheticSearch(
        preprocessed.aesthetic_keywords, 
        limit, 
        preprocessed.time_filters
      )
      
    } else if (preprocessed.search_type === 'thematic') {
      // Pure thematic search by title + year
      results = await performThematicSearch(preprocessed.search_criteria.recommended_movies, limit)
      
    } else if (preprocessed.search_type === 'hybrid') {
      // Hybrid: aesthetic search filtered by thematic criteria
      results = await performHybridSearch(
        preprocessed.aesthetic_keywords, 
        preprocessed.search_criteria.recommended_movies, 
        limit,
        preprocessed.time_filters
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

async function performAestheticSearch(aestheticKeywords, limit, timeFilters = null) {
  console.log('Performing aesthetic search for:', aestheticKeywords)
  console.log('Time filters:', timeFilters)
  
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
  
  // Apply decade filtering if specified
  let filteredMovies = movies || []
  
  if (timeFilters && timeFilters.mentioned_decades && timeFilters.mentioned_decades.length > 0) {
    console.log('Applying decade filtering for:', timeFilters.mentioned_decades)
    filteredMovies = movies.filter(movie => {
      const decades = timeFilters.mentioned_decades
      
      // Check if any mentioned decade appears in the movie's depicted_decade field
      // Handle comma-separated values like "1960s, 1970s"
      const movieDecades = movie.depicted_decade ? movie.depicted_decade.split(',').map(d => d.trim()) : []
      
      const depictedMatch = decades.some(searchDecade => 
        movieDecades.includes(searchDecade)
      )
      
      return depictedMatch
    })
    console.log('After decade filtering - movies remaining:', filteredMovies.length)
  }
  
  return formatResults(filteredMovies.slice(0, limit))
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
  // Extract the original user query concept for better aesthetic translation
  const movieTitles = recommendedMovies.map(m => m.title).join(', ')
  
  try {
    const fallbackResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `I searched for movies related to a specific theme, but the exact titles weren't found in the database. The recommended movies were: ${movieTitles}
        
        Based on this theme, generate specific aesthetic/visual keywords that capture the distinctive cinematic style of this genre. Think about:
        - Unique lighting styles (neon, harsh, warm, etc.)
        - Color palettes (gold, mirrors, shadows, etc.) 
        - Settings and environments (clubs, offices, streets, etc.)
        - Textures and materials (leather, glass, marble, etc.)
        - Mood and atmosphere (glamorous, gritty, sleek, etc.)
        
        Be SPECIFIC to this theme - avoid generic crime/drama aesthetics.
        
        Examples:
        - Cocaine/drugs → "neon nightclub lighting, mirror surfaces, champagne bubbles, sleek wealth, strobe lights, luxury excess"
        - Wall Street → "glass towers, marble lobbies, power suits, champagne culture, corporate gleam"
        - Punk → "harsh fluorescent lighting, torn textures, urban decay, graffiti walls"
        
        Respond with only the specific aesthetic keywords for this theme:`
      }]
    })
    
    return fallbackResponse.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating fallback keywords:', error)
    // More specific default fallbacks
    const titles = movieTitles.toLowerCase()
    if (titles.includes('cocaine') || titles.includes('drug')) {
      return 'neon nightclub lighting, mirror surfaces, champagne bubbles, sleek wealth, strobe lights, luxury excess, glass surfaces'
    }
    if (titles.includes('wall street') || titles.includes('finance')) {
      return 'glass towers, marble lobbies, power suits, champagne culture, corporate gleam, expensive restaurants'
    }
    if (titles.includes('crime') || titles.includes('gangster') || titles.includes('mafia')) {
      return 'dark wood paneling, leather interiors, dimly lit restaurants, expensive suits, dramatic shadows'
    }
    return 'urban environments, dramatic cinematography, rich textures, atmospheric lighting'
  }
}

async function performHybridSearch(aestheticKeywords, recommendedMovies, limit, timeFilters = null) {
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
  return await performAestheticSearch(aestheticKeywords, limit, timeFilters)
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