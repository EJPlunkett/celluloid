import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigation } from '../hooks/useNavigation'
// No import needed - will call Netlify function directly

function Cards() {
  const [navOpen, setNavOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [popcornRotation, setPopcornRotation] = useState(0)
  const [movies, setMovies] = useState([])
  const [currentMovie, setCurrentMovie] = useState(null)
  const [showSynopsis, setShowSynopsis] = useState(false)
  const [loading, setLoading] = useState(false)
  const cardStackRef = useRef(null)
  const location = useLocation()
  const navigation = useNavigation()

  // Get the passed data from navigation
  const inputData = location.state || { type: 'surprise', value: 'random selection' }

  // DEBUG: Log the input data
  console.log('Cards component inputData:', inputData)

  const maxCards = 7

  // Sample movies fallback (for non-vibe searches until you implement other search types)
  const sampleMovies = [
    { 
      movie_id: "sample1",
      movie_title: "Liquid Sky", 
      year: "1982", 
      depicted_decade: "1980s", 
      aesthetic_summary: "Neon-drenched punk surrealism with harsh primary colors, stark geometric makeup, and crystalline sci-fi textures creating an alien downtown art scene",
      synopsis: "A bizarre alien entity feeds on the endorphins produced during sexual climax, targeting New Wave club kids in 1980s New York."
    },
    { 
      movie_id: "sample2",
      movie_title: "Desperately Seeking Susan", 
      year: "1985", 
      depicted_decade: "1980s", 
      aesthetic_summary: "Vibrant downtown bohemian chaos with layered vintage textures, warm golden lighting, and eclectic thrift-store maximalism",
      synopsis: "A bored housewife becomes entangled in a case of mistaken identity after following personal ads in 1980s New York."
    },
    { 
      movie_id: "sample3",
      movie_title: "Basquiat", 
      year: "1996", 
      depicted_decade: "1980s", 
      aesthetic_summary: "Raw artistic authenticity with paint-splattered loft spaces, warm amber gallery lighting, and gritty creative disorder",
      synopsis: "The meteoric rise and tragic fall of Jean-Michel Basquiat, from homeless graffiti artist to international art world darling."
    },
    { 
      movie_id: "sample4",
      movie_title: "After Hours", 
      year: "1985", 
      depicted_decade: "1980s", 
      aesthetic_summary: "Surreal nocturnal nightmare with harsh fluorescent whites, deep shadow contrasts, and claustrophobic urban maze aesthetics",
      synopsis: "A computer programmer's night out in SoHo turns into a surreal nightmare of missed connections and escalating paranoia."
    },
    { 
      movie_id: "sample5",
      movie_title: "Party Girl", 
      year: "1995", 
      depicted_decade: "1990s", 
      aesthetic_summary: "Glossy club-kid excess with strobing dance floor lights, metallic fashion textures, and high-energy nightlife glamour",
      synopsis: "A hedonistic party girl finds purpose when she discovers a love for the Dewey Decimal System while working at the library."
    }
  ]

  // Initialize movies based on input type
  useEffect(() => {
    async function loadMovies() {
      setLoading(true)
      console.log('Cards useEffect - processing inputData:', inputData)
      
      try {
        // Handle color-based searches
        if (inputData.color) {
          console.log('Processing single color search:', inputData.color)
          const response = await fetch('/.netlify/functions/colorSearch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              searchType: 'color',
              color: inputData.color
            })
          })
          const colorResults = await response.json()
          
          if (colorResults.success && colorResults.results.length > 0) {
            console.log('Color search successful:', colorResults.results)
            setMovies(colorResults.results)
          } else {
            console.error('Color search failed:', colorResults)
            setMovies([]) // Don't fall back to sample movies
          }
        }
        // Handle palette-based searches  
        else if (inputData.type === 'palette' && inputData.movieId) {
          console.log('Processing palette search for movie:', inputData.movieId)
          const response = await fetch('/.netlify/functions/colorSearch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              searchType: 'palette',
              movieId: inputData.movieId,
              hexCodes: inputData.hexCodes
            })
          })
          const paletteResults = await response.json()
          
          if (paletteResults.success && paletteResults.results.length > 0) {
            console.log('Palette search successful:', paletteResults.results)
            setMovies(paletteResults.results)
          } else {
            console.error('Palette search failed:', paletteResults)
            setMovies([]) // Don't fall back to sample movies
          }
        }
        // Handle existing vibe/word search results
        else if (inputData.results && inputData.results.length > 0) {
          console.log('Using existing search results:', inputData.results)
          setMovies(inputData.results)
        }
        // Fallback to sample movies
        else {
          console.log('Using sample movies fallback')
          setMovies(sampleMovies)
        }
      } catch (error) {
        console.error('Error loading movies:', error)
        setMovies(sampleMovies)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [inputData])

  // Update current movie when index changes
  useEffect(() => {
    console.log('Current index:', currentIndex, 'Movies length:', movies.length, 'Max cards:', maxCards)
    
    // Only proceed if we have movies
    if (movies.length > 0) {
      if (currentIndex < maxCards) {
        const movieToShow = movies[currentIndex % movies.length]
        console.log('Setting current movie:', movieToShow)
        setCurrentMovie(movieToShow)
        setShowWatchlist(false)
        setShowSynopsis(false)
      } else {
        console.log('Showing watchlist - reached max cards')
        setShowWatchlist(true)
      }
    } else {
      console.log('No movies available yet')
    }
  }, [currentIndex, movies, maxCards])

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const swipeLeft = () => {
    if (currentIndex < maxCards) {
      console.log('Swiping left - incrementing index from', currentIndex)
      setCurrentIndex(prev => prev + 1)
    }
  }

  const swipeRight = () => {
    if (currentIndex < maxCards) {
      console.log('Swiping right - incrementing index from', currentIndex)
      setCurrentIndex(prev => prev + 1)
    }
  }

  // Enhanced touch handlers with visual feedback
  const handleTouchStart = (e) => {
    const flipButton = e.target.closest('.flip-button')
    if (flipButton) {
      return
    }
    setTouchStartX(e.touches[0].clientX)
    setIsDragging(true)
    setDragOffset(0)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    
    const currentX = e.touches[0].clientX
    const diffX = currentX - touchStartX
    setDragOffset(diffX)
  }

  const handleTouchEnd = (e) => {
    if (!isDragging) return
    setIsDragging(false)
    
    const touchEndX = e.changedTouches[0].clientX
    const diffX = touchEndX - touchStartX
    
    if (Math.abs(diffX) > 80) {
      // Animate card off screen before switching
      setDragOffset(diffX > 0 ? 400 : -400)
      
      setTimeout(() => {
        if (diffX > 0) {
          swipeRight()
        } else {
          swipeLeft()
        }
        setDragOffset(0)
      }, 300)
    } else {
      // Snap back to center
      setDragOffset(0)
    }
  }

  const toggleFlip = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('FLIP BUTTON CLICKED - showSynopsis before:', showSynopsis)
    setShowSynopsis(prev => !prev)
  }

  const jigglePopcorn = (e) => {
    e.preventDefault()
    
    // Start the jiggle animation
    setPopcornRotation(15)
    setTimeout(() => {
      setPopcornRotation(-15)
      setTimeout(() => {
        setPopcornRotation(0)
        setTimeout(() => {
          // After animation completes, navigate to watchlist
          navigation.goToWatchlist()
        }, 200)
      }, 200)
    }, 200)
  }

  const handleGoExplore = () => {
    navigation.goToMatch()
  }

  // Handle loading state
  if (loading || (movies.length === 0 || (!currentMovie && !showWatchlist))) {
    console.log('Showing loading state - loading:', loading, 'movies.length:', movies.length, 'currentMovie:', currentMovie, 'showWatchlist:', showWatchlist)
    return (
      <div style={{
        margin: 0,
        backgroundColor: '#f6f5f3',
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'fixed',
        width: '100vw',
        top: 0,
        left: 0
      }}>
        <div style={{
          fontSize: '18px',
          color: '#000'
        }}>
          {loading ? 'Finding your perfect matches...' : 'Loading movies...'}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      margin: 0,
      backgroundColor: '#f6f5f3',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
      position: 'fixed',
      height: '100vh',
      width: '100vw',
      top: 0,
      left: 0
    }}>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        height: '60px',
        pointerEvents: 'none'
      }}>
        <button 
          onClick={toggleNav}
          style={{
            pointerEvents: 'auto',
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

      {/* Navigation Overlay */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '100vh',
          backgroundColor: '#f6f5f3',
          border: '10px solid #000',
          borderRadius: '0 20px 20px 0',
          boxSizing: 'border-box',
          transform: navOpen ? 'translateX(0)' : 'translateX(calc(-100% - 20px))',
          transition: 'transform 0.3s ease',
          zIndex: 1050,
          padding: '20px 20px 40px 40px',
          overflowY: 'auto'
        }}
        aria-hidden={!navOpen}
      >
        <button onClick={() => { navigation.goToMatch(); setNavOpen(false) }} style={{ display: 'block', marginTop: '20px', marginBottom: '16px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img 
            src="/Match By.png" 
            alt="Match By" 
            style={{
              height: '30px',
              width: 'auto',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </button>
        <ul style={{
          listStyle: 'disc inside',
          paddingLeft: 0,
          marginTop: 0,
          marginBottom: '30px',
          fontWeight: 400,
          fontSize: '18px'
        }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToVibes(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>
              Describe a Vibe
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToColor(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>
              Pick a Color
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToWords(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>
              Choose Keywords
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToSurprise(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>
              Surprise Me
            </button>
          </li>
        </ul>

        <button onClick={() => { navigation.goToWatchlist(); setNavOpen(false) }} style={{ display: 'block', marginBottom: '16px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img 
            src="/Watchlist.png" 
            alt="Watchlist" 
            style={{
              height: '30px',
              width: 'auto',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </button>
        <ul style={{
          listStyle: 'disc inside',
          paddingLeft: 0,
          marginTop: 0,
          marginBottom: '30px',
          fontWeight: 400,
          fontSize: '18px'
        }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToCreate(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>
              Create Account
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToLogin(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>
              Sign In
            </button>
          </li>
        </ul>

        <button onClick={() => { navigation.goToAbout(); setNavOpen(false) }} style={{ display: 'block', marginBottom: '16px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img 
            src="/About.png" 
            alt="About" 
            style={{
              height: '30px',
              width: 'auto',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </button>
        
        <button onClick={() => { navigation.goToDonate(); setNavOpen(false) }} style={{ display: 'block', marginBottom: '16px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img 
            src="/donate menu.png" 
            alt="Donate" 
            style={{
              height: '24px',
              width: 'auto',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </button>
      </nav>

      {/* Main Content */}
      <main style={{
        position: 'fixed',
        top: '60px',
        left: 0,
        right: 0,
        bottom: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {!showWatchlist ? (
          <div 
            ref={cardStackRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              backgroundColor: '#000',
              borderRadius: '24px',
              width: '90vw',
              maxWidth: '400px',
              height: 'calc(100vh - 120px)',
              maxHeight: '600px',
              minHeight: '400px',
              position: 'relative',
              padding: '16px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
              transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
              opacity: Math.abs(dragOffset) > 150 ? 0.5 : 1,
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none'
            }}
            onMouseDown={() => document.body.style.cursor = 'grabbing'}
            onMouseUp={() => document.body.style.cursor = 'grab'}
          >
            <div style={{
              flex: 1,
              borderRadius: '20px',
              border: '2px solid #f6f5f3',
              padding: '60px 20px 24px 20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 0
            }}>
              <div style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                flexGrow: 1,
                gap: '16px',
                overflow: 'hidden',
                paddingTop: '80px'
              }}>
                <h1 style={{
                  color: '#f6f5f3',
                  margin: 0,
                  fontSize: '1.8em',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {currentMovie?.movie_title || currentMovie?.title} ({currentMovie?.year})
                </h1>
                <div style={{
                  color: '#f6f5f3',
                  margin: 0,
                  fontSize: '1.1em',
                  fontWeight: 'normal',
                  fontStyle: showSynopsis ? 'normal' : 'italic',
                  lineHeight: 1.5,
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center'
                }}>
                  <p style={{ margin: 0 }}>
                    {showSynopsis ? 
                      (currentMovie?.synopsis || 'Synopsis not available') : 
                      (currentMovie?.aesthetic_summary || currentMovie?.desc)
                    }
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '16px',
                flexShrink: 0,
                gap: '12px'
              }}>
                <button
                  className="flip-button"
                  onClick={toggleFlip}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    zIndex: 1000
                  }}
                >
                  <img 
                    src="/flip.png"
                    alt="Flip content" 
                    style={{
                      width: '24px',
                      height: '24px',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease',
                      transform: showSynopsis ? 'rotate(180deg)' : 'rotate(0deg)',
                      pointerEvents: 'none'
                    }}
                  />
                </button>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <div 
                    onClick={swipeLeft}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#f6f5f3',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <img 
                      src="/cross.png" 
                      alt="Dislike" 
                      style={{
                        width: '28px',
                        height: '28px'
                      }}
                    />
                  </div>
                  <div 
                    onClick={swipeRight}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#f6f5f3',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <img 
                      src="/heart.png" 
                      alt="Like" 
                      style={{
                        width: '28px',
                        height: '28px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px 20px 40px',
            maxWidth: '480px',
            margin: '0 auto'
          }}>
            <button
              onClick={jigglePopcorn}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '20px'
              }}
            >
              <img 
                src="/popcorn.png" 
                alt="Popcorn" 
                style={{
                  width: '100px',
                  height: 'auto',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  transform: `rotate(${popcornRotation}deg)`
                }}
              />
            </button>
            <p style={{
              fontWeight: 'normal',
              fontSize: '18px',
              marginBottom: '50px',
              color: '#000',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              Watchlist complete, curated by your {inputData.type === 'palette' ? 'movie palette' : inputData.color ? 'color choice' : inputData.type}.{'\n'}Tap the popcorn to view your movies, or click below to explore more vibes.
            </p>
            <button
              onClick={handleGoExplore}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <img 
                src="/GoButton.png" 
                alt="Go Button" 
                style={{
                  width: '160px',
                  height: 'auto',
                  cursor: 'pointer'
                }}
              />
            </button>
          </div>
        )}
      </main>

      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        fontSize: '12px',
        color: '#000',
        textAlign: 'center',
        padding: '8px 20px',
        background: '#f6f5f3',
        fontStyle: 'italic',
        zIndex: 1100,
        height: '30px',
        boxSizing: 'border-box'
      }}>
        <span>© 2025 Celluloid by Design</span>
      </footer>
    </div>
  )
}

export default Cards