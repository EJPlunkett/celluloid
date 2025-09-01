import { createClient } from '@supabase/supabase-js'

console.log('Word Search Function version: 2025-working-version')

const supabase = createClient(
  'https://yrzugdmatddwypzdirhz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings'

// Function to get embeddings from OpenAI
async function getEmbedding(text) {
  try {
    const response = await fetch(OPENAI_EMBEDDING_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-large'
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error('Embedding error:', error)
    throw error
  }
}

// Function to classify keywords using OpenAI
async function classifyKeywords(keywords) {
  const prompt = `Classify these keywords into three categories:
1. DECADE - Years, decades, time periods (e.g., "1980s", "seventies", "2000s", "eighties")
2. AESTHETIC - Visual style, cinematography, color, texture, mood descriptors (e.g., "neon", "grainy", "noir", "pastel", "gritty")  
3. CONTEXT - Themes, settings, subject matter, genre elements, plot elements (e.g., "crime", "mafia", "corporate", "tenement")

Keywords: ${keywords.join(', ')}

Return as JSON only, no other text:
{
  "decade": ["word1", "word2"],
  "aesthetic": ["word3", "word4"], 
  "context": ["word5", "word6"]
}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI Classification API error: ${response.status}`)
    }

    const data = await response.json()
    const classification = JSON.parse(data.choices[0].message.content.trim())
    
    console.log('Classification result:', classification)
    return classification
  } catch (error) {
    console.error('Classification error:', error)
    // Fallback to basic decade detection if classification fails
    const decades = keywords.filter(word => 
      /19[0-9]0s|20[0-9]0s|fifties|sixties|seventies|eighties|nineties|2000s/i.test(word)
    )
    return {
      decade: decades,
      aesthetic: keywords.filter(word => !decades.includes(word)).slice(0, Math.ceil(keywords.length / 2)),
      context: keywords.filter(word => !decades.includes(word)).slice(Math.ceil(keywords.length / 2))
    }
  }
}

// Convert decade words to database format
function normalizeDecade(decadeWord) {
  const decadeMap = {
    'fifties': '1950s',
    'sixties': '1960s', 
    'seventies': '1970s',
    'eighties': '1980s',
    'nineties': '1990s',
    '2000s': '2000s',
    '1950s': '1950s',
    '1960s': '1960s',
    '1970s': '1970s', 
    '1980s': '1980s',
    '1990s': '1990s'
  }
  
  const normalized = decadeMap[decadeWord.toLowerCase()]
  console.log(`Normalized decade "${decadeWord}" to "${normalized}"`)
  return normalized
}

// Search function
async function searchByWords(keywords) {
  try {
    console.log('Searching for keywords:', keywords)
    
    // Step 1: Classify keywords
    const classification = await classifyKeywords(keywords)
    console.log('Keywords classified:', classification)
    
    // Step 2: Handle decades (strict filtering)
    let decadeFilter = null
    if (classification.decade && classification.decade.length > 0) {
      // Take the first decade mentioned and normalize it
      const firstDecade = classification.decade[0]
      decadeFilter = normalizeDecade(firstDecade)
      
      if (!decadeFilter) {
        console.log('Invalid decade specified, ignoring decade filter')
      } else {
        console.log('Using decade filter:', decadeFilter)
      }
    }
    
    // Step 3: Create embedding queries
    let contextEmbedding = null
    let aestheticEmbedding = null
    
    if (classification.context && classification.context.length > 0) {
      const contextQuery = classification.context.join(' ')
      console.log('Creating context embedding for:', contextQuery)
      contextEmbedding = await getEmbedding(contextQuery)
    }
    
    if (classification.aesthetic && classification.aesthetic.length > 0) {
      const aestheticQuery = classification.aesthetic.join(' ')
      console.log('Creating aesthetic embedding for:', aestheticQuery)
      aestheticEmbedding = await getEmbedding(aestheticQuery)
    }
    
    // Step 4: Use the single RPC function to get movies with similarity scores
    const { data: movies, error } = await supabase
      .rpc('search_movies_with_embeddings', {
        decade_filter: decadeFilter,
        context_query_embedding: contextEmbedding,
        aesthetic_query_embedding: aestheticEmbedding,
        similarity_threshold: 0.01, // Lower threshold for better results
        result_limit: 7
      })
    
    if (error) throw new Error(`RPC error: ${error.message}`)
    if (!movies || movies.length === 0) {
      console.log('No movies found with current search parameters')
      return { success: true, results: [] }
    }
    
    console.log(`Found ${movies.length} movies with similarity scores`)
    
    // Step 5: Log similarity scores for debugging
    movies.forEach(movie => {
      console.log(`${movie.movie_title}: context_similarity=${movie.context_similarity}, aesthetic_similarity=${movie.aesthetic_similarity}, combined_score=${movie.combined_score}`)
    })
    
    // Step 6: Convert to expected format and ensure uniqueness
    const usedIds = new Set()
    const uniqueMovies = []
    
    for (const movie of movies) {
      if (uniqueMovies.length >= 7) break
      if (!usedIds.has(movie.movie_id)) {
        uniqueMovies.push({
          movie_id: movie.movie_id,
          movie_title: movie.movie_title,
          year: movie.year,
          hex_codes: movie.hex_codes,
          aesthetic_summary: movie.aesthetic_summary,
          synopsis: movie.synopsis,
          depicted_decade: movie.depicted_decade,
          letterboxd_link: movie.letterboxd_link,
          similarity_score: movie.combined_score * 100 // Convert to 0-100 scale
        })
        usedIds.add(movie.movie_id)
      }
    }
    
    console.log(`Returning ${uniqueMovies.length} unique word matches`)
    return { success: true, results: uniqueMovies }
    
  } catch (error) {
    console.error('Word search error:', error)
    return { success: false, results: [], error: error.message }
  }
}

// Netlify handler
export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }
  
  try {
    const { keywords } = JSON.parse(event.body)
    
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Keywords array is required' })
      }
    }
    
    const results = await searchByWords(keywords)
    
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