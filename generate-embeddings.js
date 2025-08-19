import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Initialize clients
const supabase = createClient(
  'https://yrzugdmatddwypzdirhz.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyenVnZG1hdGRkd3lwemRpcmh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ1MjU3OCwiZXhwIjoyMDcxMDI4NTc4fQ.luT8IAW2c-hFiInxDzLOcgbWqbt-px_HK9ddyv_iah0'
)

const openai = new OpenAI({
  apiKey: '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' 
})

async function generateEmbeddings() {
  try {
    console.log('Starting embedding generation...')
    
    // 1. Fetch all movies from Supabase
    const { data: movies, error: fetchError } = await supabase
      .from('celluloid_film_data')
      .select('movie_id, aesthetic_summary')
      .is('embedding', null) // Only process movies without embeddings
    
    if (fetchError) {
      throw new Error(`Error fetching movies: ${fetchError.message}`)
    }
    
    console.log(`Found ${movies.length} movies to process`)
    
    // 2. Process movies in batches to avoid rate limits
    const BATCH_SIZE = 10
    let processed = 0
    
    for (let i = 0; i < movies.length; i += BATCH_SIZE) {
      const batch = movies.slice(i, i + BATCH_SIZE)
      
      console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(movies.length/BATCH_SIZE)}`)
      
      // Generate embeddings for this batch
      const embeddingPromises = batch.map(async (movie) => {
        try {
          const response = await openai.embeddings.create({
            model: 'text-embedding-3-large',
            input: movie.aesthetic_summary,
            encoding_format: 'float'
          })
          
          const embedding = response.data[0].embedding
          
          // Update movie with embedding
          const { error: updateError } = await supabase
            .from('celluloid_film_data')
            .update({ embedding })
            .eq('movie_id', movie.movie_id)
          
          if (updateError) {
            console.error(`Error updating movie ${movie.movie_id}:`, updateError.message)
            return { success: false, id: movie.movie_id, error: updateError.message }
          }
          
          processed++
          console.log(`✅ Processed movie ${movie.movie_id} (${processed}/${movies.length})`)
          return { success: true, id: movie.movie_id }
          
        } catch (error) {
          console.error(`Error processing movie ${movie.movie_id}:`, error.message)
          return { success: false, id: movie.movie_id, error: error.message }
        }
      })
      
      // Wait for batch to complete
      await Promise.all(embeddingPromises)
      
      // Small delay to be nice to APIs
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log('✨ All embeddings generated successfully!')
    console.log(`Processed ${processed} movies`)
    
  } catch (error) {
    console.error('Fatal error:', error.message)
  }
}

// Run the script
generateEmbeddings()