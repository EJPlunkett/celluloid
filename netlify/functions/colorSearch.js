import { createClient } from '@supabase/supabase-js'

// Function version tracker
console.log('Color Search Function version: 2025-color-matching')

// Initialize Supabase client
const supabase = createClient(
  'https://yrzugdmatddwypzdirhz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Convert hex color to LAB color space for perceptual color comparison
function hexToLab(hex) {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  // Convert RGB to XYZ
  const toXyz = (c) => {
    if (c > 0.04045) {
      return Math.pow((c + 0.055) / 1.055, 2.4)
    } else {
      return c / 12.92
    }
  }

  const rXyz = toXyz(r) * 100
  const gXyz = toXyz(g) * 100
  const bXyz = toXyz(b) * 100

  // Observer = 2°, Illuminant = D65
  const x = (rXyz * 0.4124 + gXyz * 0.3576 + bXyz * 0.1805) / 95.047
  const y = (rXyz * 0.2126 + gXyz * 0.7152 + bXyz * 0.0722) / 100.000
  const z = (rXyz * 0.0193 + gXyz * 0.1192 + bXyz * 0.9505) / 108.883

  // Convert XYZ to LAB
  const toLabSpace = (t) => {
    if (t > 0.008856) {
      return Math.pow(t, 1/3)
    } else {
      return (7.787 * t) + (16/116)
    }
  }

  const fx = toLabSpace(x)
  const fy = toLabSpace(y)
  const fz = toLabSpace(z)

  const L = (116 * fy) - 16
  const A = 500 * (fx - fy)
  const B = 200 * (fy - fz)

  return [L, A, B]
}

// Calculate Delta E (color difference) between two LAB colors
function deltaE(lab1, lab2) {
  const deltaL = lab1[0] - lab2[0]
  const deltaA = lab1[1] - lab2[1]
  const deltaB = lab1[2] - lab2[2]
  
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB)
}

// Find the minimum color distance between a target color and a movie's palette
function findMinColorDistance(targetHex, movieHexCodes) {
  if (!movieHexCodes) return Infinity
  
  const targetLab = hexToLab(targetHex)
  const movieColors = movieHexCodes.split(',').map(color => color.trim())
  
  let minDistance = Infinity
  
  for (const movieColor of movieColors) {
    if (movieColor.startsWith('#')) {
      try {
        const movieLab = hexToLab(movieColor)
        const distance = deltaE(targetLab, movieLab)
        if (distance < minDistance) {
          minDistance = distance
        }
      } catch (error) {
        console.error('Error processing color:', movieColor, error)
      }
    }
  }
  
  return minDistance
}

// Calculate similarity between two color palettes
function calculatePaletteSimilarity(palette1, palette2) {
  if (!palette1 || !palette2) return 0
  
  const colors1 = Array.isArray(palette1) ? palette1 : palette1.split(',').map(c => c.trim())
  const colors2 = Array.isArray(palette2) ? palette2 : palette2.split(',').map(c => c.trim())
  
  let totalSimilarity = 0
  let comparisons = 0
  
  // Compare each color in palette1 to the closest color in palette2
  for (const color1 of colors1) {
    if (!color1.startsWith('#')) continue
    
    let minDistance = Infinity
    const lab1 = hexToLab(color1)
    
    for (const color2 of colors2) {
      if (!color2.startsWith('#')) continue
      
      try {
        const lab2 = hexToLab(color2)
        const distance = deltaE(lab1, lab2)
        if (distance < minDistance) {
          minDistance = distance
        }
      } catch (error) {
        console.error('Error comparing colors:', color1, color2, error)
      }
    }
    
    if (minDistance !== Infinity) {
      // Convert distance to similarity (lower distance = higher similarity)
      totalSimilarity += Math.max(0, 100 - minDistance)
      comparisons++
    }
  }
  
  return comparisons > 0 ? totalSimilarity / comparisons : 0
}

// Search for movies by single color
async function searchByColor(targetHex) {
  try {
    console.log('Searching for movies similar to color:', targetHex)
    
    // Fetch all movies with hex codes (limit for performance)
    const { data: movies, error } = await supabase
      .from('celluloid_film_data')
      .select('*')
      .not('hex_codes', 'is', null)
      .neq('hex_codes', '')
      .limit(1000) // Limit to 1000 movies for better performance
    
    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }
    
    if (!movies || movies.length === 0) {
      return { success: false, results: [], error: 'No movies with color data found' }
    }
    
    // Calculate color distances for all movies
    const moviesWithDistance = movies.map(movie => {
      const distance = findMinColorDistance(targetHex, movie.hex_codes)
      return {
        ...movie,
        color_distance: distance,
        similarity_score: Math.max(0, 100 - distance)
      }
    }).filter(movie => movie.color_distance !== Infinity)
    
    // Sort by color similarity (smallest distance = most similar)
    moviesWithDistance.sort((a, b) => a.color_distance - b.color_distance)
    
    // Return top 7 matches (ensure we always try to get 7)
    const results = moviesWithDistance.slice(0, 7).map(movie => formatMovieResult(movie, movie.similarity_score))
    
    console.log('Color search returning', results.length, 'matches out of', moviesWithDistance.length, 'candidates')
    
    return { success: true, results }
    
  } catch (error) {
    console.error('Color search error:', error)
    return { success: false, results: [], error: error.message }
  }
}

// Search for movies by palette (exact movie + 6 similar)
async function searchByPalette(exactMovieId, paletteHexCodes) {
  try {
    console.log('Searching for movies similar to palette from movie:', exactMovieId)
    console.log('Looking for exact movie with ID:', exactMovieId)
    
    // First, get the exact movie that was rolled
    const { data: exactMovie, error: exactError } = await supabase
      .from('celluloid_film_data')
      .select('*')
      .eq('movie_id', exactMovieId)
      .single()
    
    if (exactError) {
      console.error('Error fetching exact movie:', exactError)
      throw new Error(`Error fetching exact movie: ${exactError.message}`)
    }
    
    console.log('Found exact movie:', exactMovie.movie_title, 'with colors:', exactMovie.hex_codes)
    
    // Then fetch other movies for comparison (limit for performance)
    const { data: allMovies, error: allError } = await supabase
      .from('celluloid_film_data')
      .select('*')
      .not('hex_codes', 'is', null)
      .neq('hex_codes', '')
      .neq('movie_id', exactMovieId)
      .limit(700) // Limit comparison set for better performance
    
    if (allError) {
      throw new Error(`Database error: ${allError.message}`)
    }
    
    if (!allMovies || allMovies.length === 0) {
      console.log('No other movies found, returning just the exact movie')
      return { 
        success: true, 
        results: [formatMovieResult(exactMovie, 100)] 
      }
    }
    
    console.log('Comparing against', allMovies.length, 'other movies')
    
    // Use the EXACT movie's hex_codes for palette comparison, not the passed palette
    const targetPalette = exactMovie.hex_codes
    
    // Calculate palette similarities with lower threshold to get more results
    const moviesWithSimilarity = allMovies.map(movie => {
      const similarity = calculatePaletteSimilarity(targetPalette, movie.hex_codes)
      return {
        ...movie,
        palette_similarity: similarity
      }
    }).filter(movie => movie.palette_similarity > 10) // Lower threshold - accept movies with at least 10% similarity
    
    // Sort by similarity (highest first)
    moviesWithSimilarity.sort((a, b) => b.palette_similarity - a.palette_similarity)
    
    // If we still don't have enough, lower the threshold further
    if (moviesWithSimilarity.length < 6) {
      console.log('Not enough matches with 10% threshold, trying 5%')
      const moreMovies = allMovies.map(movie => {
        const similarity = calculatePaletteSimilarity(targetPalette, movie.hex_codes)
        return {
          ...movie,
          palette_similarity: similarity
        }
      }).filter(movie => movie.palette_similarity > 5) // Accept movies with at least 5% similarity
      
      moviesWithSimilarity.push(...moreMovies.filter(movie => 
        !moviesWithSimilarity.some(existing => existing.movie_id === movie.movie_id)
      ))
      
      moviesWithSimilarity.sort((a, b) => b.palette_similarity - a.palette_similarity)
    }
    
    // Take up to 6 similar movies (will be fewer if not enough matches exist)
    const finalSimilarMovies = moviesWithSimilarity.slice(0, 6)
    
    console.log('Found', finalSimilarMovies.length, 'movies with color similarity above threshold')
    
    console.log('Top similar movies:', similarMovies.slice(0, 3).map(m => `${m.movie_title} (${m.palette_similarity.toFixed(1)})`))
    
    // Format results: exact movie first, then similar movies
    const results = [
      formatMovieResult(exactMovie, 100), // This should ALWAYS be first
      ...finalSimilarMovies.map(movie => formatMovieResult(movie, movie.palette_similarity))
    ]
    
    console.log('Final results order:', results.map(r => r.movie_title))
    console.log('Returning exactly', results.length, 'movies')
    
    return { success: true, results }
    
  } catch (error) {
    console.error('Palette search error:', error)
    return { success: false, results: [], error: error.message }
  }
}

// Helper function to format movie results consistently
function formatMovieResult(movie, similarityScore = null) {
  return {
    movie_id: movie.movie_id,
    movie_title: movie.movie_title,
    year: movie.year,
    aesthetic_summary: movie.aesthetic_summary,
    synopsis: movie.synopsis,
    depicted_decade: movie.depicted_decade,
    hex_codes: movie.hex_codes,
    letterboxd_link: movie.letterboxd_link,
    similarity_score: similarityScore
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
        body: JSON.stringify({ error: 'Invalid search parameters' })
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results)
    }
    
  } catch (error) {
    console.error('Color search function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}