import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Function version tracker to ensure deployment
console.log('Function version: 2024-parser-update')

// Initialize clients
const supabase = createClient(
  'https://yrzugdmatddwypzdirhz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// System prompt for the parser
const systemPrompt = `
You are a parser for a film discovery engine called *Celluloid by Design*.
Users provide free-text descriptions of the kind of movie they want.
Convert their input into strict JSON aligned with the database schema.

Schema:
{
  "depicted_decade": [],
  "context_embedding": [],
  "aesthetic_embedding": [],
  "people_tags": [
    {
      "raw": "",
      "canonical": "",
      "confidence": 0.0
    }
  ],
  "reference_titles": [],
  "overlap_notes": [
    {
      "token": "",
      "mapped_to": ["context", "aesthetic"],
      "reason": ""
    }
  ]
}

Field Rules:
- depicted_decade: always a clean decade string ("1970s", "1980s", "1990s"). 
  Normalize "early/late" or a single year (e.g. 1995) into its decade.
- context_embedding: locations, neighborhoods, boroughs, landmarks, venues, themes, genres, story elements, plot fragments.
- aesthetic_embedding: cinematic style, lighting, colors, textures, wardrobe, weather, atmosphere, camera feel.
- people_tags: fuzzy match actor/director references. Include raw, canonical, confidence (0–1).
- reference_titles: if a movie is explicitly named, capture "Title (Year)".
- overlap_notes: if a token belongs in both context and aesthetic, include in both arrays and record an entry explaining why.
- Use lowercase-hyphenated slugs for all tags.
- Do not hallucinate. If unclear, leave arrays empty or assign low confidence.
- Always return valid JSON only.

Examples:
USER: "Graffiti-smeared subway cars, flickering fluorescents, shadows stretching across tiled stations"
OUTPUT:
{
  "depicted_decade": [],
  "context_embedding": ["subway", "underground-transit"],
  "aesthetic_embedding": ["graffiti-covered", "flickering-fluorescent-lighting", "dramatic-shadows", "tiled-surfaces"],
  "people_tags": [],
  "reference_titles": [],
  "overlap_notes": [
    {
      "token": "subway",
      "mapped_to": ["context", "aesthetic"],
      "reason": "subway is both a NYC location and creates specific underground visual atmosphere"
    }
  ]
}

USER: "scorsese energy, grimy blocks near times square, sodium lights, late 70s"
OUTPUT:
{
  "depicted_decade": ["1970s"],
  "context_embedding": ["times-square", "midtown-nyc", "street-level"],
  "aesthetic_embedding": ["grimy", "sodium-vapor-lighting"],
  "people_tags": [
    {
      "raw": "scorsese",
      "canonical": "Martin Scorsese",
      "confidence": 0.95
    }
  ],
  "reference_titles": [],
  "overlap_notes": []
}

USER: "films that look like Party Girl, I want to feel like I'm in a 90s house party"
OUTPUT:
{
  "depicted_decade": ["1990s"],
  "context_embedding": ["house-party", "downtown-nyc"],
  "aesthetic_embedding": ["chaotic-wardrobe", "club-lighting", "crowded-dancefloor"],
  "people_tags": [],
  "reference_titles": ["Party Girl (1995)"],
  "overlap_notes": []
}
`;

// Parser function
async function parseQuery(userInput) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput }
    ],
    response_format: { type: "json_object" }
  });
  return JSON.parse(completion.choices[0].message.content);
}

// Helper function to build embedding queries from parsed data
function buildEmbeddingQueries(parsed) {
  // Build context query
  let contextTerms = [...parsed.context_embedding];
  
  // Add people to context
  if (parsed.people_tags.length > 0) {
    const peopleNames = parsed.people_tags
      .filter(p => p.confidence > 0.7)
      .map(p => p.canonical.toLowerCase().replace(/\s+/g, '-'));
    contextTerms.push(...peopleNames);
  }
  
  // Build aesthetic query  
  let aestheticTerms = [...parsed.aesthetic_embedding];
  
  // Enhance overlapping terms based on context
  parsed.overlap_notes.forEach(note => {
    if (note.mapped_to.includes('context')) {
      contextTerms.push(`${note.token}-setting`);  // "loft-setting"
    }
    if (note.mapped_to.includes('aesthetic')) {
      aestheticTerms.push(`${note.token}-visual`);  // "loft-visual"
    }
  });
  
  return {
    contextQuery: contextTerms.join(' '),
    aestheticQuery: aestheticTerms.join(' ')
  };
}

// Dual vector search function
async function performDualVectorSearch(aestheticQuery, contextQuery, peopleTags, decades, limit) {
  try {
    console.log('Performing dual vector search with:');
    console.log('- Aesthetic query:', aestheticQuery);
    console.log('- Context query:', contextQuery);
    console.log('- People tags:', peopleTags);
    console.log('- Decades:', decades);
    
    // Generate embeddings for both queries (if they exist)
    let aestheticEmbedding = null;
    let contextEmbedding = null;
    
    if (aestheticQuery && aestheticQuery.trim()) {
      const aestheticResponse = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: aestheticQuery,
        encoding_format: 'float'
      });
      aestheticEmbedding = aestheticResponse.data[0].embedding;
    }
    
    if (contextQuery && contextQuery.trim()) {
      const contextResponse = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: contextQuery,
        encoding_format: 'float'
      });
      contextEmbedding = contextResponse.data[0].embedding;
    }
    
    // Prepare people slugs
    const peopleSlugArray = peopleTags
      .filter(p => p.confidence > 0.7)
      .map(p => p.canonical.toLowerCase().replace(/\s+/g, '-'));
    
    // Call Supabase function
    const { data: movies, error } = await supabase.rpc('dual_vector_search_movies', {
      decade_filters: decades.length > 0 ? decades : null,
      people_slugs: peopleSlugArray.length > 0 ? peopleSlugArray : null,
      context_query_embedding: contextEmbedding,
      aesthetic_query_embedding: aestheticEmbedding,
      context_weight: contextQuery && aestheticQuery ? 0.5 : 1.0,
      aesthetic_weight: contextQuery && aestheticQuery ? 0.5 : 1.0,
      similarity_threshold: 0.1,
      result_limit: limit * 2 // Get extra results for filtering
    });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    console.log(`Found ${movies?.length || 0} movies`);
    return movies?.slice(0, limit) || [];
    
  } catch (error) {
    console.error('Dual vector search error:', error);
    throw error;
  }
}

// Main search function using parsed query
async function searchMovies(userInput, limit = 10) {
  try {
    console.log('Processing user input:', userInput)
    
    // 1. Parse user input
    const parsed = await parseQuery(userInput);
    console.log('Parsed query:', parsed);
    
    // 2. Build embedding queries
    const { contextQuery, aestheticQuery } = buildEmbeddingQueries(parsed);
    console.log('Context query:', contextQuery);
    console.log('Aesthetic query:', aestheticQuery);
    
    // 3. Perform dual vector search
    const results = await performDualVectorSearch(
      aestheticQuery,
      contextQuery, 
      parsed.people_tags,
      parsed.depicted_decade,
      limit
    );
    
    // 4. Format results
    const formattedResults = formatResults(results);
    
    console.log('Final results count:', formattedResults.length)
    
    return {
      success: true,
      results: formattedResults,
      parsed_query: parsed,
      search_queries: { contextQuery, aestheticQuery }
    };
    
  } catch (error) {
    console.error('Search error:', error)
    return {
      success: false,
      error: error.message,
      results: []
    }
  }
}

function formatResults(movies) {
  if (!movies) return []
  
  return movies.map(movie => ({
    movie_id: movie.movie_id,
    movie_title: movie.movie_title,
    year: movie.year,
    aesthetic_summary: movie.aesthetic_summary,
    synopsis: movie.synopsis, 
    depicted_decade: movie.depicted_decade,
    hex_codes: movie.hex_codes,
    letterboxd_link: movie.letterboxd_link,
    context_similarity: movie.context_similarity || null,
    aesthetic_similarity: movie.aesthetic_similarity || null,
    combined_score: movie.combined_score || null
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