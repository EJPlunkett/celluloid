import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigation } from '../hooks/useNavigation'

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
  }
]

function Cards() {
  const [navOpen, setNavOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [popcornRotation, setPopcornRotation] = useState(0)
  const [movies, setMovies] = useState([])
  const [currentMovie, setCurrentMovie] = useState(null)
  const [showSynopsis, setShowSynopsis] = useState(false)
  const cardStackRef = useRef(null)
  const location = useLocation()
  const navigation = useNavigation()

  const inputData = location.state || { type: 'surprise', value: 'random selection' }
  const maxCards = 10

  // Prevent body scrolling on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    
    return () => {
      // Cleanup when component unmounts
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [])

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
    }
  ]

  useEffect(() => {
    if (inputData.results && inputData.results.length > 0) {
      setMovies(inputData.results)
    } else {
      setMovies(sampleMovies)
    }
  }, [inputData.results]) // Only depend on inputData.results, not the entire inputData object

  useEffect(() => {
    if (movies.length > 0) {
      if (currentIndex < maxCards) {
        const movieToShow = movies[currentIndex % movies.length]
        setCurrentMovie(movieToShow)
        setShowWatchlist(false)
        setShowSynopsis(false)
      } else {
        setShowWatchlist(true)
      }
    }
  }, [currentIndex, movies.length]) // Remove maxCards from dependencies since it's constant

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const swipeLeft = () => {
    if (currentIndex < maxCards) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const swipeRight = () => {
    if (currentIndex < maxCards) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleTouchStart = (e) => {
    const flipButton = e.target.closest('.flip-button')
    if (flipButton) {
      return
    }
    setTouchStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
  }

  const handleTouchEnd = (e) => {
    if (!isDragging) return
    setIsDragging(false)
    
    const touchEndX = e.changedTouches[0].clientX
    const diffX = touchEndX - touchStartX
    
    if (Math.abs(diffX) > 80) {
      if (diffX > 0) {
        swipeRight()
      } else {
        swipeLeft()
      }
    }
  }

  const jigglePopcorn = (e) => {
    e.preventDefault()
    setPopcornRotation(15)
    setTimeout(() => {
      setPopcornRotation(-15)
      setTimeout(() => {
        setPopcornRotation(0)
        setTimeout(() => {
          navigation.goToWatchlist()
        }, 200)
      }, 200)
    }, 200)
  }

  const handleGoExplore = () => {
    navigation.goToMatch()
  }

  const toggleFlip = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('FLIP BUTTON CLICKED - showSynopsis before:', showSynopsis)
    setShowSynopsis(prev => !prev)
  }

  if (movies.length === 0 || (!currentMovie && !showWatchlist)) {
    return (
      <div style={{
        margin: 0,
        backgroundColor: '#f6f5f3',
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '18px', color: '#000' }}>
          Loading movies...
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
      position: 'relative',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
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

      <nav style={{
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
      }}>
        <button onClick={() => { navigation.goToMatch(); setNavOpen(false) }} style={{ display: 'block', marginTop: '20px', marginBottom: '16px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img src="/Match By.png" alt="Match By" style={{ height: '30px', width: 'auto', maxWidth: '280px', cursor: 'pointer', display: 'block', objectFit: 'contain' }} />
        </button>
        <ul style={{ listStyle: 'disc inside', paddingLeft: 0, marginTop: 0, marginBottom: '30px', fontWeight: 400, fontSize: '18px' }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToVibes(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>Describe a Vibe</button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToColor(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>Pick a Color</button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToWords(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>Choose Keywords</button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToSurprace(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>Surprise Me</button>
          </li>
        </ul>

        <button onClick={() => { navigation.goToWatchlist(); setNavOpen(false) }} style={{ display: 'block', marginBottom: '16px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img src="/Watchlist.png" alt="Watchlist" style={{ height: '30px', width: 'auto', maxWidth: '280px', cursor: 'pointer', display: 'block', objectFit: 'contain' }} />
        </button>
        <ul style={{ listStyle: 'disc inside', paddingLeft: 0, marginTop: 0, marginBottom: '30px', fontWeight: 400, fontSize: '18px' }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToCreate(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>Create Account</button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => { navigation.goToLogin(); setNavOpen(false) }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: '18px', fontWeight: 400, padding: 0, textAlign: 'left' }}>Sign In</button>
          </li>
        </ul>

        <button onClick={() => { navigation.goToAbout(); setNavOpen(false) }} style={{ display: 'block', marginBottom: '16px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img src="/About.png" alt="About" style={{ height: '30px', width: 'auto', maxWidth: '280px', cursor: 'pointer', display: 'block', objectFit: 'contain' }} />
        </button>
        
        <button onClick={() => { navigation.goToDonate(); setNavOpen(false) }} style={{ display: 'block', marginBottom: '16px', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img src="/donate menu.png" alt="Donate" style={{ height: '24px', width: 'auto', maxWidth: '280px', cursor: 'pointer', display: 'block', objectFit: 'contain' }} />
        </button>
      </nav>

      <main style={{
        position: 'absolute',
        top: '80px', // Increased from 70px to ensure clearance
        left: 0,
        right: 0,
        bottom: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '5px'
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
              height: 'calc(100vh - 160px)',
              maxHeight: '580px',
              minHeight: '500px',
              position: 'relative',
              padding: '16px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease',
              cursor: 'grab',
              touchAction: 'pan-y'
            }}
            onMouseDown={() => document.body.style.cursor = 'grabbing'}
            onMouseUp={() => document.body.style.cursor = 'grab'}
          >
            <div style={{
              flex: 1,
              borderRadius: '20px',
              border: '2px solid #f6f5f3',
              padding: '60px 20px 24px 20px', // Increased top padding from 24px to 60px
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
                justifyContent: 'flex-start', // Changed from 'center' to 'flex-start'
                flexGrow: 1,
                gap: '16px',
                overflow: 'hidden',
                paddingTop: '20px' // Add some top padding for visual balance
              }}>
                <h1 style={{
                  color: '#f6f5f3',
                  margin: 0,
                  fontSize: '1.8em',
                  fontWeight: 700,
                  flexShrink: 0 // Prevent title from shrinking
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
                  minHeight: '120px', // Reserve minimum space for text content
                  display: 'flex',
                  alignItems: 'flex-start', // Align text to top of reserved space
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
            <button onClick={jigglePopcorn} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '20px' }}>
              <img src="/popcorn.png" alt="Popcorn" style={{ width: '100px', height: 'auto', cursor: 'pointer', transition: 'transform 0.2s ease', transform: `rotate(${popcornRotation}deg)` }} />
            </button>
            <p style={{
              fontWeight: 'normal',
              fontSize: '18px',
              marginBottom: '50px',
              color: '#000',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              Watchlist complete, curated by your {inputData.type}.{'\n'}Tap the popcorn to view your movies, or click below to explore more vibes.
            </p>
            <button onClick={handleGoExplore} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
              <img src="/GoButton.png" alt="Go Button" style={{ width: '160px', height: 'auto', cursor: 'pointer' }} />
            </button>
          </div>
        )}
      </main>

      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        fontSize: '14px',
        color: '#000',
        textAlign: 'center',
        padding: '10px 20px',
        background: '#f6f5f3',
        fontStyle: 'italic',
        zIndex: 1100
      }}>
        <span>© 2025 Celluloid by Design</span>
      </footer>
    </div>
  )
}

export default Cards