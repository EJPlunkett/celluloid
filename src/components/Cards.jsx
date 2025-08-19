import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigation } from '../hooks/useNavigation'

function Cards() {
  const [navOpen, setNavOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [popcornRotation, setPopcornRotation] = useState(0)
  const cardStackRef = useRef(null)
  const location = useLocation()
  const navigation = useNavigation()

  // Get the passed data from navigation
  const inputData = location.state || { type: 'surprise', value: 'random selection' }

  const maxCards = 15

  const sampleMovies = [
    { title: "Liquid Sky", year: "1982", decade: "1980s", desc: "Neon-drenched punk surrealism with harsh primary colors, stark geometric makeup, and crystalline sci-fi textures creating an alien downtown art scene" },
    { title: "Desperately Seeking Susan", year: "1985", decade: "1980s", desc: "Vibrant downtown bohemian chaos with layered vintage textures, warm golden lighting, and eclectic thrift-store maximalism" },
    { title: "Basquiat", year: "1996", decade: "1980s", desc: "Raw artistic authenticity with paint-splattered loft spaces, warm amber gallery lighting, and gritty creative disorder" },
    { title: "After Hours", year: "1985", decade: "1980s", desc: "Surreal nocturnal nightmare with harsh fluorescent whites, deep shadow contrasts, and claustrophobic urban maze aesthetics" },
    { title: "Party Girl", year: "1995", decade: "1990s", desc: "Glossy club-kid excess with strobing dance floor lights, metallic fashion textures, and high-energy nightlife glamour" },
    { title: "Alphabet City", year: "1984", decade: "1980s", desc: "Gritty street-level realism with weathered brick textures, amber streetlight glow, and shadowy urban decay" },
    { title: "200 Cigarettes", year: "1999", decade: "1980s", desc: "Retro New Year's Eve nostalgia with warm party lighting, vintage costume textures, and celebratory urban energy" },
    { title: "Slaves of New York", year: "1989", decade: "1980s", desc: "Artsy downtown minimalism with stark white gallery spaces, muted fashion palettes, and bohemian creative poverty" },
    { title: "American Psycho", year: "2000", decade: "1980s", desc: "Sterile corporate minimalism with razor-sharp geometric precision, clinical high-end luxury surfaces, and pristine architectural coldness" },
    { title: "The Driller Killer", year: "1979", decade: "1970s", desc: "Raw guerrilla filmmaking with grainy 16mm textures, harsh urban lighting, and gritty street-level documentation" },
    { title: "Cruising", year: "1980", decade: "1970s", desc: "Grimy nocturnal urban underbelly with harsh neon-soaked darkness, claustrophobic dive bar interiors, and sweat-drenched leather textures" },
    { title: "Serendipity", year: "2001", decade: "2000s", desc: "Romantic golden-hour warmth with soft café lighting, cozy winter textures, and whimsical urban charm" },
    { title: "Scrooged", year: "1988", decade: "1980s", desc: "Glitzy corporate excess with blazing television studio artificiality, over-the-top holiday kitsch, and increasingly surreal visual chaos" },
    { title: "The Secret of My Success", year: "1987", decade: "1980s", desc: "Slick corporate glamour with gleaming Manhattan office towers, polished power-suit sophistication, and energetic montage-driven pacing" },
    { title: "Taxi Driver", year: "1976", decade: "1970s", desc: "Neon-soaked urban alienation with steam-hazed streets, amber-filtered cab windows, and the hypnotic glow of Times Square's seedy underbelly" }
  ]

  const [currentMovie, setCurrentMovie] = useState(sampleMovies[0])

  useEffect(() => {
    if (currentIndex < maxCards) {
      setCurrentMovie(sampleMovies[currentIndex % sampleMovies.length])
    } else {
      setShowWatchlist(true)
    }
  }, [currentIndex])

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
    setTouchStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    // Prevent scrolling while swiping
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

  return (
    <div style={{
      margin: 0,
      backgroundColor: '#f6f5f3',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
      position: 'relative',
      height: '100vh',
      height: '100dvh'
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
        <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToMatch() }} style={{ display: 'block', marginTop: '20px', marginBottom: '16px' }}>
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
        </a>
        <ul style={{
          listStyle: 'disc inside',
          paddingLeft: 0,
          marginTop: 0,
          marginBottom: '30px',
          fontWeight: 400,
          fontSize: '18px'
        }}>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToVibes() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Describe a Vibe
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToColor() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Pick a Color
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToWords() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Choose Keywords
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToSurprise() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Surprise Me
            </a>
          </li>
        </ul>

        <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToWatchlist() }} style={{ display: 'block', marginBottom: '16px' }}>
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
        </a>
        <ul style={{
          listStyle: 'disc inside',
          paddingLeft: 0,
          marginTop: 0,
          marginBottom: '30px',
          fontWeight: 400,
          fontSize: '18px'
        }}>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToCreate() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Create Account
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToLogin() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Sign In
            </a>
          </li>
        </ul>

        <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToAbout() }} style={{ display: 'block', marginBottom: '16px' }}>
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
        </a>
        
        <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToDonate() }} style={{ display: 'block', marginBottom: '16px' }}>
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
        </a>
      </nav>

      {/* Main Content */}
      <main style={{
        position: 'absolute',
        top: '70px',
        left: 0,
        right: 0,
        bottom: '70px',
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
              touchAction: 'none'
            }}
            onMouseDown={() => document.body.style.cursor = 'grabbing'}
            onMouseUp={() => document.body.style.cursor = 'grab'}
          >
            <div style={{
              flex: 1,
              borderRadius: '20px',
              border: '2px solid #f6f5f3',
              padding: '24px 20px',
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
                justifyContent: 'center',
                flexGrow: 1,
                gap: '16px',
                overflow: 'hidden'
              }}>
                <h1 style={{
                  color: '#f6f5f3',
                  margin: 0,
                  fontSize: '1.8em',
                  fontWeight: 700
                }}>
                  {currentMovie.title} ({currentMovie.year})
                </h1>
                <h2 style={{
                  color: '#f6f5f3',
                  margin: 0,
                  fontSize: '1.3em',
                  fontWeight: 500
                }}>
                  {currentMovie.decade}
                </h2>
                <p style={{
                  color: '#f6f5f3',
                  margin: 0,
                  fontSize: '1.1em',
                  fontWeight: 'normal',
                  fontStyle: 'italic',
                  lineHeight: 1.5
                }}>
                  {currentMovie.desc}
                </p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingTop: '16px',
                flexShrink: 0
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
              Watchlist complete, curated by your vibe.{'\n'}Tap the popcorn to view your movies, or click below to explore more vibes.
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