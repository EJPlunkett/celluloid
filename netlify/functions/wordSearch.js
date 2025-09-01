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
    
    // Step 4: Build Supabase query
    let query = supabase
      .from('celluloid_film_data')
      .select('movie_id, movie_title, year, hex_codes, aesthetic_summary, synopsis, depicted_decade, letterboxd_link')
    
    // Apply decade filter if specified
    if (decadeFilter) {
      query = query.eq('depicted_decade', decadeFilter)
    }
    
    query = query.limit(300) // Reasonable limit
    
    const { data: movies, error } = await query
    
    if (error) throw new Error(`Database error: ${error.message}`)
    if (!movies || movies.length === 0) {
      console.log('No movies found with current filters')
      return { success: true, results: [] }
    }
    
    console.log(`Found ${movies.length} movies after decade filtering`)
    
    // Step 5: Calculate similarity scores for each movie
    const moviesWithScores = await Promise.all(movies.map(async (movie) => {
      let totalScore = 0
      let scoreCount = 0
      
      // Debug logging for embeddings
      console.log(`Movie ${movie.movie_title}: contextEmbedding exists: ${!!contextEmbedding}, movie.context_embedding type: ${typeof movie.context_embedding}, value: ${movie.context_embedding ? 'has value' : 'null/undefined'}`)
      console.log(`Movie ${movie.movie_title}: aestheticEmbedding exists: ${!!aestheticEmbedding}, movie.embedding type: ${typeof movie.embedding}, value: ${movie.embedding ? 'has value' : 'null/undefined'}`)
      
      // Context similarity
      if (contextEmbedding && movie.context_embedding !== null && movie.context_embedding !== undefined) {
        try {
          const { data: contextSimilarity, error: contextError } = await supabase
            .rpc('words_search_context_similarity', {
              query_embedding: contextEmbedding,
              target_movie_id: movie.movie_id,
              similarity_threshold: 0.1
            })
          
          if (contextError) {
            console.error(`Context RPC error for ${movie.movie_title}:`, contextError)
          } else {
            console.log(`Context RPC success for ${movie.movie_title}:`, contextSimilarity)
          }
          
          if (!contextError && contextSimilarity && contextSimilarity.length > 0) {
            const similarity = contextSimilarity[0].similarity || 0
            totalScore += similarity * 100
            scoreCount++
            console.log(`Context similarity for ${movie.movie_title}: ${similarity}`)
          }
        } catch (error) {
          console.error(`Context similarity error for ${movie.movie_title}:`, error)
        }
      }
      
      // Aesthetic similarity  
      if (aestheticEmbedding && movie.embedding !== null && movie.embedding !== undefined) {
        try {
          const { data: aestheticSimilarity, error: aestheticError } = await supabase
            .rpc('words_search_aesthetic_similarity', {
              query_embedding: aestheticEmbedding,
              target_movie_id: movie.movie_id,
              similarity_threshold: 0.1
            })
          
          if (aestheticError) {
            console.error(`Aesthetic RPC error for ${movie.movie_title}:`, aestheticError)
          } else {
            console.log(`Aesthetic RPC success for ${movie.movie_title}:`, aestheticSimilarity)
          }
          
          if (!aestheticError && aestheticSimilarity && aestheticSimilarity.length > 0) {
            const similarity = aestheticSimilarity[0].similarity || 0
            totalScore += similarity * 100
            scoreCount++
            console.log(`Aesthetic similarity for ${movie.movie_title}: ${similarity}`)
          }
        } catch (error) {
          console.error(`Aesthetic similarity error for ${movie.movie_title}:`, error)
        }
      }
      
      // If no embeddings to compare, but movie matches decade, give it a base score
      if (scoreCount === 0 && decadeFilter) {
        totalScore = 50 // Base score for decade match
        scoreCount = 1
      }
      
      const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0
      
      return {
        ...movie,
        similarity_score: averageScore
      }
    }))
    
    // Step 6: Sort by similarity and ensure uniqueness
    const usedIds = new Set()
    const uniqueMovies = []
    
    const sortedMovies = moviesWithScores
      .filter(movie => movie.similarity_score > 0)
      .sort((a, b) => b.similarity_score - a.similarity_score)
    
    // Add unique movies until we have 7
    for (const movie of sortedMovies) {
      if (uniqueMovies.length >= 7) break
      if (!usedIds.has(movie.movie_id)) {
        uniqueMovies.push(movie)
        usedIds.add(movie.movie_id)
      }
    }
    
    console.log(`Found ${uniqueMovies.length} unique word matches`)
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