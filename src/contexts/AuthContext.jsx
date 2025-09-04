import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

// Generate a UUID for anonymous sessions
const generateSessionId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    // Initialize session ID for anonymous users
    const initializeSession = () => {
      let storedSessionId = localStorage.getItem('celluloid_session_id')
      if (!storedSessionId) {
        storedSessionId = generateSessionId()
        localStorage.setItem('celluloid_session_id', storedSessionId)
      }
      setSessionId(storedSessionId)
    }

    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      // Always initialize session ID (needed for anonymous users)
      initializeSession()
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        // If user logs out, ensure we still have a session ID for anonymous usage
        if (event === 'SIGNED_OUT') {
          initializeSession()
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Login function - will need to merge watchlist after successful login
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    // If login successful, trigger watchlist merge
    if (data.user && sessionId) {
      try {
        await mergeAnonymousWatchlist(data.user.id, sessionId)
      } catch (mergeError) {
        console.error('Error merging anonymous watchlist:', mergeError)
        // Don't fail the login, just log the error
      }
    }
    
    return { data, error }
  }

  // Signup function - will need to merge watchlist after successful signup
  const signUp = async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    // If signup successful, trigger watchlist merge
    if (data.user && sessionId) {
      try {
        await mergeAnonymousWatchlist(data.user.id, sessionId)
      } catch (mergeError) {
        console.error('Error merging anonymous watchlist:', mergeError)
        // Don't fail the signup, just log the error
      }
    }
    
    return { data, error }
  }

  // Logout function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Add movie to watchlist (works for both anonymous and authenticated users)
  const addToWatchlist = async (movie, source, sourceValue) => {
    try {
      if (user) {
        // User is logged in - save to user tables
        return await addToUserWatchlist(user.id, movie, source, sourceValue)
      } else {
        // User is anonymous - save to anonymous tables
        return await addToAnonymousWatchlist(sessionId, movie, source, sourceValue)
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      throw error
    }
  }

  // Add to user watchlist
  const addToUserWatchlist = async (userId, movie, source, sourceValue) => {
    // First, upsert the liked_movies entry
    const { data: likedMovie, error: likedError } = await supabase
      .from('liked_movies')
      .upsert({
        user_id: userId,
        movie_id: movie.movie_id,
        like_count: 1,
        first_liked_at: new Date().toISOString(),
        last_liked_at: new Date().toISOString(),
        status: 'liked'
      }, {
        onConflict: 'user_id,movie_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (likedError) throw likedError

    // Then, add the source entry
    const { data: sourceData, error: sourceError } = await supabase
      .from('liked_movie_sources')
      .upsert({
        like_id: likedMovie.id,
        source: source,
        source_value: sourceValue,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'like_id,source,source_value',
        ignoreDuplicates: true
      })

    if (sourceError) throw sourceError

    return { success: true, likedMovie, sourceData }
  }

  // Add to anonymous watchlist
  const addToAnonymousWatchlist = async (sessionId, movie, source, sourceValue) => {
    // First, upsert the anon_watchlist_items entry
    const { data: anonItem, error: anonError } = await supabase
      .from('anon_watchlist_items')
      .upsert({
        session_id: sessionId,
        movie_id: movie.movie_id,
        like_count: 1,
        first_liked_at: new Date().toISOString(),
        last_liked_at: new Date().toISOString(),
        status: 'liked'
      }, {
        onConflict: 'session_id,movie_id',
        ignoreDuplicates: false
      })

    if (anonError) throw anonError

    // Then, add the source entry
    const { data: sourceData, error: sourceError } = await supabase
      .from('anon_watchlist_sources')
      .upsert({
        session_id: sessionId,
        movie_id: movie.movie_id,
        source: source,
        source_value: sourceValue,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'session_id,movie_id,source,source_value',
        ignoreDuplicates: true
      })

    if (sourceError) throw sourceError

    return { success: true, anonItem, sourceData }
  }

  // Merge anonymous watchlist into user account
  const mergeAnonymousWatchlist = async (userId, sessionId) => {
    // Get anonymous watchlist items
    const { data: anonItems, error: anonItemsError } = await supabase
      .from('anon_watchlist_items')
      .select('*')
      .eq('session_id', sessionId)

    if (anonItemsError) throw anonItemsError

    // Get anonymous watchlist sources
    const { data: anonSources, error: anonSourcesError } = await supabase
      .from('anon_watchlist_sources')
      .select('*')
      .eq('session_id', sessionId)

    if (anonSourcesError) throw anonSourcesError

    // Process each anonymous item
    for (const anonItem of anonItems) {
      // Check if user already has this movie
      const { data: existingLike, error: existingError } = await supabase
        .from('liked_movies')
        .select('*')
        .eq('user_id', userId)
        .eq('movie_id', anonItem.movie_id)
        .single()

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError
      }

      let likeId

      if (existingLike) {
        // Update existing entry with merged data
        const { data: updatedLike, error: updateError } = await supabase
          .from('liked_movies')
          .update({
            like_count: existingLike.like_count + anonItem.like_count,
            first_liked_at: new Date(Math.min(
              new Date(existingLike.first_liked_at),
              new Date(anonItem.first_liked_at)
            )).toISOString(),
            last_liked_at: new Date(Math.max(
              new Date(existingLike.last_liked_at),
              new Date(anonItem.last_liked_at)
            )).toISOString()
          })
          .eq('id', existingLike.id)
          .select()
          .single()

        if (updateError) throw updateError
        likeId = existingLike.id
      } else {
        // Create new entry
        const { data: newLike, error: newError } = await supabase
          .from('liked_movies')
          .insert({
            user_id: userId,
            movie_id: anonItem.movie_id,
            like_count: anonItem.like_count,
            first_liked_at: anonItem.first_liked_at,
            last_liked_at: anonItem.last_liked_at,
            status: anonItem.status
          })
          .select()
          .single()

        if (newError) throw newError
        likeId = newLike.id
      }

      // Migrate sources for this movie
      const movieSources = anonSources.filter(source => source.movie_id === anonItem.movie_id)
      for (const source of movieSources) {
        await supabase
          .from('liked_movie_sources')
          .upsert({
            like_id: likeId,
            source: source.source,
            source_value: source.source_value,
            created_at: source.created_at
          }, {
            onConflict: 'like_id,source,source_value',
            ignoreDuplicates: true
          })
      }
    }

    // Clean up anonymous data
    await supabase.from('anon_watchlist_sources').delete().eq('session_id', sessionId)
    await supabase.from('anon_watchlist_items').delete().eq('session_id', sessionId)

    console.log('Anonymous watchlist merged successfully')
  }

  const value = {
    user,
    loading,
    sessionId,
    signIn,
    signUp,
    signOut,
    addToWatchlist
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}