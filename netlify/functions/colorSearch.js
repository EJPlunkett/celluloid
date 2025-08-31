import { createClient } from '@supabase/supabase-js'

console.log('Color Search Function version: 2025-database-computation')

const supabase = createClient(
  'https://yrzugdmatddwypzdirhz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Search by single color using database function
async function searchByColor(targetHex) {
  try {
    console.log('Searching for color using database function:', targetHex)
    
    const { data: results, error } = await supabase
      .rpc('find_similar_colors', {
        target_color: targetHex,
        search_limit: 7
      })
    
    if (error) {
      throw new Error(`Database function error: ${error.message}`)
    }
    
    if (!results || results.length === 0) {
      console.log('No color matches found for:', targetHex)
      return { 
        success: false, 
        results: [], 
        error: `No movies found with colors similar to ${targetHex}. Try a different color.` 
      }
    }
    
    console.log('Found', results.length, 'color matches via database function')
    return { success: true, results }
    
  } catch (error) {
    console.error('Color search error:', error)
    return { success: false, results: [], error: error.message }
  }
}

// Search by palette using database function
async function searchByPalette(exactMovieId, paletteHexCodes) {
  try {
    console.log('Searching palette using database function for movie:', exactMovieId)
    
    // Get the exact movie first
    const { data: exactMovie, error: exactError } = await supabase
      .from('celluloid_film_data')
      .select('movie_id, movie_title, year, hex_codes, aesthetic_summary, synopsis, depicted_decade, letterboxd_link')
      .eq('movie_id', exactMovieId)
      .single()
    
    if (exactError) {
      throw new Error(`Error fetching exact movie: ${exactError.message}`)
    }
    
    console.log('Found exact movie:', exactMovie.movie_title)
    
    // Get similar movies using database function
    const { data: similarMovies, error: similarError } = await supabase
      .rpc('find_similar_palette', {
        target_movie_id: exactMovieId,
        search_limit: 6
      })
    
    if (similarError) {
      console.error('Similar movies error:', similarError)
      // If similarity search fails, just return the exact movie
      return { success: true, results: [exactMovie] }
    }
    
    // Combine exact movie + similar movies
    const results = [
      { ...exactMovie, similarity_score: 100 }, // Exact movie always first
      ...(similarMovies || [])
    ]
    
    console.log('Palette search complete:', results.length, 'movies (1 exact + ' + (similarMovies?.length || 0) + ' similar)')
    
    return { success: true, results }
    
  } catch (error) {
    console.error('Palette search error:', error)
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
    const { searchType, color, movieId, hexCodes } = JSON.parse(event.body)
    
    let results
    if (searchType === 'color' && color) {
      results = await searchByColor(color)
    } else if (searchType === 'palette' && movieId) {
      results = await searchByPalette(movieId, hexCodes)
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid parameters' })
      }
    }
    
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