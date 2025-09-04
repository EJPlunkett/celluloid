import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseUrl, supabaseKey } from '../lib/supabase'

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
  const [profile, setProfile] = useState(null) // Add profile state
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState(null)

  // Initialize session ID for anonymous users - moved outside useEffect
  const initializeSession = () => {
    let storedSessionId = localStorage.getItem('celluloid_session_id')
    if (!storedSessionId) {
      storedSessionId = generateSessionId()
      localStorage.setItem('celluloid_session_id', storedSessionId)
    }
    setSessionId(storedSessionId)
  }

  // Fetch user profile data
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  useEffect(() => {

    // Get initial session
    const getSession = async () => {
      console.log('Getting session...')
      
      // Force loading to false after 8 seconds as backup
      const timeoutId = setTimeout(() => {
        console.log('Timeout: forcing loading to false - auth call hung')
        setLoading(false)
      }, 8000)
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        clearTimeout(timeoutId) // Clear timeout if we succeed
        console.log('Session result:', session)
        setUser(session?.user ?? null)
        
        // Fetch profile if user exists
        if (session?.user) {
          console.log('Fetching profile for user:', session.user.id)
          const profileData = await fetchProfile(session.user.id)
          console.log('Profile result:', profileData)
          setProfile(profileData)
        }
        
        // Always initialize session ID (needed for anonymous users)
        initializeSession()
        
        console.log('Setting loading to false')
        setLoading(false)
      } catch (error) {
        clearTimeout(timeoutId)
        console.error('Error in getSession:', error)
        setUser(null)
        setProfile(null)
        initializeSession()
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        
        // Set timeout for auth state changes too
        const timeoutId = setTimeout(() => {
          console.log('Auth state change timeout - forcing loading false')
          setLoading(false)
        }, 8000)
        
        try {
          setUser(session?.user ?? null)
          
          // Fetch profile for new user, clear profile on logout
          if (session?.user) {
            const profileData = await fetchProfile(session.user.id)
            setProfile(profileData)
          } else {
            setProfile(null)
          }
          
          // If user logs out, ensure we still have a session ID for anonymous usage
          if (event === 'SIGNED_OUT') {
            initializeSession()
          }
          
          clearTimeout(timeoutId)
          setLoading(false)
        } catch (error) {
          console.error('Error in auth state change:', error)
          clearTimeout(timeoutId)
          setLoading(false)
        }
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
    
    // If signup successful, create profile and trigger watchlist merge
    if (data.user && !error) {
      // Create profile record
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            watching_region: userData.watchingRegion
          })
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      } catch (profileError) {
        console.error('Error creating profile:', profileError)
      }

      // Trigger watchlist merge if we have a session
      if (sessionId) {
        try {
          await mergeAnonymousWatchlist(data.user.id, sessionId)
        } catch (mergeError) {
          console.error('Error merging anonymous watchlist:', mergeError)
          // Don't fail the signup, just log the error
        }
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
    try {
      // First, upsert the anon_watchlist_items entry
      const itemResponse = await fetch(`${supabaseUrl}/rest/v1/anon_watchlist_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'x-cbd-session-id': sessionId,
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({
          session_id: sessionId,
          movie_id: movie.movie_id,
          like_count: 1,
          first_liked_at: new Date().toISOString(),
          last_liked_at: new Date().toISOString(),
          status: 'liked'
        })
      })

      if (!itemResponse.ok) {
        const error = await itemResponse.text()
        throw new Error(`Failed to save watchlist item: ${error}`)
      }

      const anonItem = await itemResponse.json()

      // Then, add the source entry
      const sourceResponse = await fetch(`${supabaseUrl}/rest/v1/anon_watchlist_sources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'x-cbd-session-id': sessionId,
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({
          session_id: sessionId,
          movie_id: movie.movie_id,
          source: source,
          source_value: sourceValue,
          created_at: new Date().toISOString()
        })
      })

      if (!sourceResponse.ok) {
        const error = await sourceResponse.text()
        throw new Error(`Failed to save watchlist source: ${error}`)
      }

      const sourceData = await sourceResponse.json()

      return { success: true, anonItem, sourceData }
    } catch (error) {
      console.error('Error in addToAnonymousWatchlist:', error)
      throw error
    }
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
    profile, // Add profile to context value
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