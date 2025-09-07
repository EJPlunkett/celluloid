import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigation } from '../hooks/useNavigation'
import Navigation from '../components/Navigation'

function Watchlist() {
  const [navOpen, setNavOpen] = useState(false)
  const [expandedMovies, setExpandedMovies] = useState(new Set())
  const [groupingType, setGroupingType] = useState('Input Type')
  const [watchlistData, setWatchlistData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { user, fetchWatchlist, updateWatchedStatus, removeFromWatchlist } = useAuth()
  const navigation = useNavigation()

  const groupingOptions = [
    'Input Type',
    'Depicted Decade', 
    'Release Decade',
    'Match Month',
    'Match Count'
  ]

  useEffect(() => {
    loadWatchlist()
  }, [user])

  const loadWatchlist = async () => {
    try {
      setLoading(true)
      const data = await fetchWatchlist()
      setWatchlistData(data)
      setError(null)
    } catch (err) {
      setError('Failed to load watchlist')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleWatchedToggle = async (movieId, currentStatus) => {
    if (!user) return // Only available for authenticated users
    
    try {
      await updateWatchedStatus(movieId, !currentStatus)
      // Refresh the watchlist
      await loadWatchlist()
    } catch (err) {
      console.error('Failed to update watched status:', err)
    }
  }

  const handleRemoveMovie = async (movieId) => {
    try {
      await removeFromWatchlist(movieId)
      // Refresh the watchlist
      await loadWatchlist()
    } catch (err) {
      console.error('Failed to remove movie:', err)
    }
  }

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const toggleMovie = (movieId) => {
    setExpandedMovies(prev => {
      const newSet = new Set(prev)
      if (newSet.has(movieId)) {
        newSet.delete(movieId)
      } else {
        newSet.add(movieId)
      }
      return newSet
    })
  }

  // Helper functions to handle different data structures
  const getMovieId = (movie) => {
    if (user) {
      return movie.movies.movie_id
    } else {
      return movie.celluloid_film_data ? movie.celluloid_film_data.movie_id : movie.movie_id
    }
  }

  const getMovieData = (movie) => {
    if (user) {
      return movie.movies
    } else {
      return movie.celluloid_film_data || {}
    }
  }

  // Group movies based on selected grouping type
  const groupMovies = (movies, type) => {
    const groups = {}

    movies.forEach(movie => {
      let groupKeys = []
      
      switch (type) {
        case 'Input Type':
          // For Input Type, movie can appear in multiple groups
          const sources = user ? movie.liked_movie_sources : movie.anon_watchlist_sources
          sources.forEach(source => {
            const key = source.source.charAt(0).toUpperCase() + source.source.slice(1)
            if (!groups[key]) groups[key] = []
            groups[key].push({ ...movie, currentSource: source })
          })
          return

        case 'Depicted Decade':
          const movieData = getMovieData(movie)
          groupKeys = [movieData.depicted_decade || 'Unknown']
          break

        case 'Release Decade':
          const movieData2 = getMovieData(movie)
          if (movieData2.year) {
            const decade = Math.floor(movieData2.year / 10) * 10
            groupKeys = [`${decade}s`]
          } else {
            groupKeys = ['Unknown']
          }
          break

        case 'Match Month':
          const date = new Date(movie.first_liked_at)
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                             'July', 'August', 'September', 'October', 'November', 'December']
          groupKeys = [monthNames[date.getMonth()]]
          break

        case 'Match Count':
          const count = movie.like_count
          const countWords = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
          groupKeys = [count <= 10 ? countWords[count] : `${count} times`]
          break

        default:
          groupKeys = ['All']
      }

      groupKeys.forEach(key => {
        if (!groups[key]) groups[key] = []
        // For non-Input Type groupings, include all sources
        const sources = user ? movie.liked_movie_sources : movie.anon_watchlist_sources
        groups[key].push({ ...movie, allSources: sources })
      })
    })

    return groups
  }

  const renderColorSwatch = (hexCode) => {
    // Handle multiple colors separated by commas
    if (hexCode.includes(',')) {
      const colors = hexCode.split(',').map(c => c.trim())
      return (
        <div style={{ display: 'flex', gap: '2px' }}>
          {colors.map((color, index) => (
            <div
              key={index}
              style={{
                height: '1em',
                width: '1em',
                borderRadius: '2px',
                backgroundColor: color,
                border: '1px solid #ccc'
              }}
            />
          ))}
        </div>
      )
    } else {
      return (
        <div
          style={{
            height: '1em',
            width: '1em',
            borderRadius: '2px',
            backgroundColor: hexCode,
            border: '1px solid #ccc'
          }}
        />
      )
    }
  }

  const renderBasedOn = (movie, groupingType) => {
    if (groupingType === 'Input Type' && movie.currentSource) {
      // For Input Type grouping, show only the current source
      const source = movie.currentSource
      return (
        <div style={{ marginBottom: '8px' }}>
          <strong>Based on {source.source.charAt(0).toUpperCase() + source.source.slice(1)}: </strong>
          {source.source === 'color' ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {renderColorSwatch(source.source_value)}
            </span>
          ) : (
            <span>"{source.source_value}"</span>
          )}
        </div>
      )
    } else if (movie.allSources) {
      // For other groupings, show all sources
      return movie.allSources.map((source, index) => (
        <div key={index} style={{ marginBottom: '8px' }}>
          <strong>Based on {source.source.charAt(0).toUpperCase() + source.source.slice(1)}: </strong>
          {source.source === 'color' ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {renderColorSwatch(source.source_value)}
            </span>
          ) : (
            <span>"{source.source_value}"</span>
          )}
        </div>
      ))
    }
    return null
  }

  const renderMovieItem = (movie) => {
    const isExpanded = expandedMovies.has(getMovieId(movie))
    const movieData = getMovieData(movie)
    
    return (
      <li key={`${getMovieId(movie)}-${movie.currentSource?.source || 'all'}`} 
          style={{ marginBottom: '15px', background: 'transparent', transition: 'all 0.3s ease' }}>
        <div 
          onClick={() => toggleMovie(getMovieId(movie))}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 0',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            marginRight: '12px',
            width: 0,
            height: 0,
            borderLeft: '8px solid #000',
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            transition: 'all 0.3s ease',
            transformOrigin: '25% 50%',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
          }}></div>
          <span style={{ fontWeight: 500, color: '#000', marginRight: '8px' }}>
            {movieData.movie_title}
          </span>
          <span style={{ color: '#666', fontWeight: 'normal' }}>({movieData.year})</span>
        </div>

        <div style={{
          maxHeight: isExpanded ? 'none' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease, padding 0.4s ease, margin 0.4s ease',
          background: 'transparent',
          marginLeft: '28px',
          padding: isExpanded ? '12px 0 8px 0' : '0',
          marginBottom: isExpanded ? '8px' : '0'
        }}>
          {movieData.aesthetic_summary && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Aesthetic: </strong>
              <span style={{ fontStyle: 'italic' }}>{movieData.aesthetic_summary}</span>
            </div>
          )}
          
          {movieData.synopsis && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Synopsis: </strong>
              <span style={{ fontStyle: 'italic' }}>{movieData.synopsis}</span>
            </div>
          )}

          {renderBasedOn(movie, groupingType)}

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '8px', 
            marginTop: '12px',
            fontSize: '14px'
          }}>
            {movieData.letterboxd_link && (
              <a
                href={movieData.letterboxd_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  color: '#000',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Letterboxd
              </a>
            )}

            {user && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleWatchedToggle(getMovieId(movie), movie.watched)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: movie.watched ? '#22c55e' : '#666',
                  fontSize: '14px',
                  textAlign: 'left',
                  padding: 0,
                  fontWeight: 'bold'
                }}
              >
                ✔ Watched
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveMovie(getMovieId(movie))
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#000',
                fontSize: '14px',
                textAlign: 'left',
                padding: 0,
                fontWeight: 'bold'
              }}
            >
              ✖ Remove
            </button>
          </div>
        </div>
      </li>
    )
  }

  const groupedMovies = groupMovies(watchlistData, groupingType)

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f6f5f3'
      }}>
        Loading watchlist...
      </div>
    )
  }

  return (
    <div style={{
      margin: 0,
      padding: 0,
      height: '100%',
      backgroundColor: '#f6f5f3',
      overflowX: 'hidden',
      scrollBehavior: 'smooth',
      fontFamily: 'Arial, sans-serif',
      color: '#000',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <style>
        {`
          @font-face {
            font-family: 'BLANKA';
            src: url('/BLANKA.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}
      </style>

      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        background: 'transparent',
        position: 'relative',
        zIndex: 1100
      }}>
        <button 
          onClick={toggleNav}
          style={{
            position: 'absolute',
            top: '13px',
            left: '13px',
            width: '36px',
            height: '30px',
            cursor: 'pointer',
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'transparent',
            borderRadius: '6px',
            boxShadow: 'none',
            border: 'none',
            padding: 0
          }}
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
        >
          <span style={{
            display: 'block',
            height: '4px',
            background: '#000',
            borderRadius: '2px',
            width: '100%',
            transition: 'all 0.3s ease'
          }}></span>
          <span style={{
            display: 'block',
            height: '4px',
            background: '#000',
            borderRadius: '2px',
            width: '100%',
            transition: 'all 0.3s ease'
          }}></span>
          <span style={{
            display: 'block',
            height: '4px',
            background: '#000',
            borderRadius: '2px',
            width: '100%',
            transition: 'all 0.3s ease'
          }}></span>
        </button>
      </header>

      <main style={{
        maxWidth: '480px',
        margin: '0 auto 40px',
        padding: '0 20px',
        flexGrow: 1,
        textAlign: 'center'
      }}>
        <img 
          src="/movies.png" 
          alt="Header" 
          style={{
            display: 'block',
            maxWidth: '480px',
            width: '100%',
            height: 'auto',
            margin: '25px auto 0px auto'
          }}
        />

        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: 0,
          color: '#000',
          whiteSpace: 'normal',
          textAlign: 'center'
        }}>
          {!user ? (
            <>
              <em>Your aesthetic, your archive.</em><br /><br />
              <button 
                onClick={() => navigation.goToLogin()}
                style={{
                  backgroundColor: '#000',
                  color: '#f6f5f3',
                  textDecoration: 'none',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                Sign In
              </button> or{' '}
              <button 
                onClick={() => navigation.goToCreate()}
                style={{
                  backgroundColor: '#000',
                  color: '#f6f5f3',
                  textDecoration: 'none',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                Create An Account
              </button><br />
              to save your curated watchlist.
            </>
          ) : (
            <em>Your aesthetic, your archive.</em>
          )}
        </p>

        {error && (
          <div style={{ 
            color: '#ef4444', 
            textAlign: 'center', 
            margin: '20px 0' 
          }}>
            {error}
          </div>
        )}

        {watchlistData.length === 0 && !loading ? (
          <div style={{ 
            textAlign: 'center', 
            margin: '40px 0',
            color: '#666',
            fontStyle: 'italic'
          }}>
            Your watchlist is empty. Start exploring to add some movies!
          </div>
        ) : (
          <>
            {/* Grouping Selector */}
            <div style={{
              marginTop: user ? '30px' : '20px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 500,
                color: '#000'
              }}>
                Group by:
              </label>
              <select
                value={groupingType}
                onChange={(e) => setGroupingType(e.target.value)}
                style={{
                  padding: '8px 16px',
                  border: '2px solid #000',
                  borderRadius: '50px',
                  backgroundColor: '#f6f5f3',
                  fontSize: '16px',
                  fontFamily: 'Arial, sans-serif',
                  cursor: 'pointer',
                  minWidth: '200px'
                }}
              >
                {groupingOptions.map(option => (
                  <option 
                    key={option} 
                    value={option}
                    style={{
                      backgroundColor: '#000',
                      color: '#fff',
                      padding: '8px'
                    }}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Movie Groups */}
            {Object.entries(groupedMovies).map(([groupName, movies]) => (
              <div key={groupName} style={{
                marginBottom: '40px',
                textAlign: 'left'
              }}>
                <h2 style={{
                  fontFamily: "'BLANKA', Arial, sans-serif",
                  fontSize: '24px',
                  fontWeight: 'normal',
                  marginBottom: '15px',
                  color: '#000',
                  borderBottom: '2px solid #000',
                  paddingBottom: '5px',
                  letterSpacing: '0.5px'
                }}>
                  {groupName}
                </h2>
                <ul style={{
                  listStyle: 'none',
                  paddingLeft: 0,
                  margin: 0
                }}>
                  {movies.map(renderMovieItem)}
                </ul>
              </div>
            ))}
          </>
        )}
      </main>

      <Navigation navOpen={navOpen} setNavOpen={setNavOpen} />

      <footer style={{
        fontSize: '14px',
        color: '#000',
        textAlign: 'center',
        padding: '20px',
        userSelect: 'none',
        background: '#f6f5f3',
        fontStyle: 'italic',
        position: 'static',
        width: 'auto',
        bottom: 'auto',
        left: 'auto',
        opacity: 1,
        pointerEvents: 'auto',
        transition: 'none',
        zIndex: 'auto'
      }}>
        <span>© 2025 Celluloid by Design <span style={{ opacity: 0.5, fontStyle: 'normal' }}>(BETA)</span></span>
      </footer>
    </div>
  )
}

export default Watchlist