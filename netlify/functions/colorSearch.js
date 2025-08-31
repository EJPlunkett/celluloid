import { createClient } from '@supabase/supabase-js'

console.log('Color Search Function version: 2025-simple-working')

const supabase = createClient(
  'https://yrzugdmatddwypzdirhz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Convert hex color to LAB color space
function hexToLab(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

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

  const x = (rXyz * 0.4124 + gXyz * 0.3576 + bXyz * 0.1805) / 95.047
  const y = (rXyz * 0.2126 + gXyz * 0.7152 + bXyz * 0.0722) / 100.000
  const z = (rXyz * 0.0193 + gXyz * 0.1192 + bXyz * 0.9505) / 108.883

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

// Calculate color difference
function deltaE(lab1, lab2) {
  const deltaL = lab1[0] - lab2[0]
  const deltaA = lab1[1] - lab2[1]
  const deltaB = lab1[2] - lab2[2]
  
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB)
}

// Find minimum color distance
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

// Simple palette similarity
function calculatePaletteSimilarity(palette1, palette2) {
  if (!palette1 || !palette2) return 0
  
  const colors1 = palette1.split(',').map(c => c.trim())
  const colors2 = palette2.split(',').map(c => c.trim())
  
  let totalSimilarity = 0
  let comparisons = 0
  
  for (const color1 of colors1) {
    if (!color1.startsWith('#')) continue
    
    let minDistance = Infinity
    
    try {
      const lab1 = hexToLab(color1)
      
      for (const color2 of colors2) {
        if (!color2.startsWith('#')) continue
        
        const lab2 = hexToLab(color2)
        const distance = deltaE(lab1, lab2)
        if (distance < minDistance) {
          minDistance = distance
        }
      }
      
      if (minDistance !== Infinity) {
        totalSimilarity += Math.max(0, 100 - minDistance)
        comparisons++
      }
    } catch (error) {
      console.error('Error in palette similarity:', error)
    }
  }
  
  return comparisons > 0 ? totalSimilarity / comparisons : 0
}

// Search by single color
async function searchByColor(targetHex) {
  try {
    console.log('Searching for color:', targetHex)
    
    const { data: movies, error } = await supabase
      .from('celluloid_film_data')
      .select('*')
      .not('hex_codes', 'is', null)
      .neq('hex_codes', '')
    
    if (error) throw new Error(`Database error: ${error.message}`)
    if (!movies) return { success: false, results: [] }
    
    const moviesWithDistance = movies.map(movie => {
      const distance = findMinColorDistance(targetHex, movie.hex_codes)
      return {
        ...movie,
        similarity_score: Math.max(0, 100 - distance)
      }
    }).filter(movie => movie.similarity_score > 0)
    
    moviesWithDistance.sort((a, b) => b.similarity_score - a.similarity_score)
    const results = moviesWithDistance.slice(0, 7)
    
    console.log('Found', results.length, 'color matches')
    return { success: true, results }
    
  } catch (error) {
    console.error('Color search error:', error)
    return { success: false, results: [], error: error.message }
  }
}

// Search by palette
async function searchByPalette(exactMovieId, paletteHexCodes) {
  try {
    console.log('Searching palette for movie:', exactMovieId)
    
    // Get exact movie
    const { data: exactMovie, error: exactError } = await supabase
      .from('celluloid_film_data')
      .select('*')
      .eq('movie_id', exactMovieId)
      .single()
    
    if (exactError) throw new Error(`Exact movie error: ${exactError.message}`)
    console.log('Found exact movie:', exactMovie.movie_title)
    
    // Get other movies
    const { data: allMovies, error: allError } = await supabase
      .from('celluloid_film_data')
      .select('*')
      .not('hex_codes', 'is', null)
      .neq('hex_codes', '')
      .neq('movie_id', exactMovieId)
    
    if (allError) throw new Error(`Database error: ${allError.message}`)
    if (!allMovies) return { success: true, results: [exactMovie] }
    
    // Calculate similarities
    const moviesWithSimilarity = allMovies.map(movie => ({
      ...movie,
      similarity_score: calculatePaletteSimilarity(exactMovie.hex_codes, movie.hex_codes)
    })).filter(movie => movie.similarity_score > 0)
    
    moviesWithSimilarity.sort((a, b) => b.similarity_score - a.similarity_score)
    const similarMovies = moviesWithSimilarity.slice(0, 6)
    
    const results = [exactMovie, ...similarMovies]
    console.log('Palette search complete:', results.length, 'movies')
    
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