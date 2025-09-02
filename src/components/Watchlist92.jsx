import { useState, useEffect } from 'react'
import { useNavigation } from '../hooks/useNavigation'

function Watchlist() {
  const [navOpen, setNavOpen] = useState(false)
  const [expandedMovies, setExpandedMovies] = useState(new Set())
  const [isSignedIn, setIsSignedIn] = useState(false)
  const navigation = useNavigation()

  // Mock watchlist data - later this will come from Supabase
  const watchlistData = {
    colorMatches: {
      inputDetail: { type: 'color', value: '#4B0082' },
      movies: [
        {
          id: 1,
          title: "Requiem for a Dream",
          year: 2000,
          letterboxdUrl: "https://letterboxd.com/film/requiem-for-a-dream/",
          summary: "A haunting exploration of addiction set against the decaying urban landscape of Brooklyn. Aronofsky's use of deep purples and stark contrasts creates a visual metaphor for descent into darkness, with the city itself becoming a character in this visceral psychological drama."
        },
        {
          id: 2,
          title: "The Royal Tenenbaums",
          year: 2001,
          letterboxdUrl: "https://letterboxd.com/film/the-royal-tenenbaums/",
          summary: "Wes Anderson's whimsical masterpiece transforms NYC's Upper West Side into a storybook realm. Rich burgundies and royal purples dominate the carefully curated palette, creating a nostalgic aesthetic that makes the ordinary feel extraordinary through meticulous symmetry and vintage charm."
        },
        {
          id: 3,
          title: "Midnight Cowboy",
          year: 1969,
          letterboxdUrl: "https://letterboxd.com/film/midnight-cowboy/",
          summary: "A gritty portrait of 1960s Manhattan that captures the city's seedy underbelly through muted purples and shadowy cinematography. The film's aesthetic reflects the loneliness and desperation of urban life, with Times Square's neon glow providing harsh contrast to intimate character moments."
        }
      ]
    },
    vibeMatches: [
      {
        inputDetail: { type: 'text', value: 'Gritty urban romance with neon lights' },
        movies: [
          {
            id: 4,
            title: "Her",
            year: 2013,
            letterboxdUrl: "https://letterboxd.com/film/her/",
            summary: "Spike Jonze creates an intimate vision of near-future LA that feels remarkably like modern NYC. Warm amber glows and soft neon create a romantic urban dreamscape, where technology and human connection blur in beautifully lit apartment spaces and bustling city streets."
          },
          {
            id: 5,
            title: "Lost in Translation",
            year: 2003,
            letterboxdUrl: "https://letterboxd.com/film/lost-in-translation/",
            summary: "Though set in Tokyo, Coppola's neon-soaked meditation on urban isolation perfectly captures the NYC experience. Pink and blue neon reflections create an ethereal atmosphere where two lonely souls connect against the backdrop of a sleepless city's electric energy."
          },
          {
            id: 6,
            title: "Taxi Driver",
            year: 1976,
            letterboxdUrl: "https://letterboxd.com/film/taxi-driver/",
            summary: "Scorsese's iconic vision of 1970s Manhattan as a neon-lit hellscape. The film's aesthetic combines harsh street lighting with the warm glow of diners and porn theaters, creating a romantic yet dangerous urban atmosphere that defined NYC's cinematic identity."
          }
        ]
      },
      {
        inputDetail: { type: 'surprise', value: 'Surprise Me random selection' },
        movies: [
          {
            id: 7,
            title: "Birdman",
            year: 2014,
            letterboxdUrl: "https://letterboxd.com/film/birdman/",
            summary: "Iñárritu transforms Broadway's theater district into a surreal playground of mirrors and harsh fluorescents. The film's claustrophobic aesthetic traps viewers in the labyrinthine backstage world, where reality and performance blur under the unforgiving lights of Manhattan's cultural heart."
          },
          {
            id: 8,
            title: "Frances Ha",
            year: 2012,
            letterboxdUrl: "https://letterboxd.com/film/frances-ha/",
            summary: "Baumbach's black-and-white love letter to Brooklyn captures the borough's creative energy through crisp monochrome cinematography. The aesthetic emphasizes the poetry in everyday moments, from subway rides to apartment parties, creating a timeless portrait of young adulthood in NYC."
          },
          {
            id: 9,
            title: "Do the Right Thing",
            year: 1989,
            letterboxdUrl: "https://letterboxd.com/film/do-the-right-thing/",
            summary: "Spike Lee's Bedford-Stuyvesant becomes a pressure cooker of vibrant colors and sweltering heat. The film's aesthetic uses saturated reds and oranges to visualize racial tension, while the neighborhood's brick walls and fire hydrants become a stage for one of cinema's most powerful urban dramas."
          }
        ]
      }
    ],
    keywordMatches: {
      inputDetail: { type: 'keywords', value: 'minimalist, architectural, contemplative' },
      movies: [
        {
          id: 10,
          title: "The Apartment",
          year: 1960,
          letterboxdUrl: "https://letterboxd.com/film/the-apartment/",
          summary: "Wilder's masterpiece transforms 1960s Manhattan office culture into geometric poetry. The film's aesthetic emphasizes clean lines and vast corporate spaces, where human stories unfold against the backdrop of modernist architecture and the impersonal beauty of mid-century design."
        },
        {
          id: 11,
          title: "Inside Llewyn Davis",
          year: 2013,
          letterboxdUrl: "https://letterboxd.com/film/inside-llewyn-davis/",
          summary: "The Coen Brothers create a contemplative winter portrait of 1960s Greenwich Village. Muted browns and grays reflect the protagonist's melancholy, while the film's restrained aesthetic captures the intimate folk music scene in small clubs and snow-dusted Washington Square."
        }
      ]
    }
  }

  useEffect(() => {
    // Check authentication status - later this will check Supabase auth
    const checkAuth = () => {
      // Mock check - replace with actual Supabase auth check
      const userToken = localStorage.getItem('userToken')
      setIsSignedIn(!!userToken)
    }
    
    checkAuth()
  }, [])

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

  const renderMovieItem = (movie) => {
    const isExpanded = expandedMovies.has(movie.id)
    
    return (
      <li key={movie.id} style={{ marginBottom: '15px', background: 'transparent', transition: 'all 0.3s ease' }}>
        <div 
          onClick={() => toggleMovie(movie.id)}
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
          <a 
            href={movie.letterboxdUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontWeight: 500,
              color: '#000',
              textDecoration: 'none',
              marginRight: '8px'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {movie.title}
          </a>
          <span style={{ color: '#666', fontWeight: 'normal' }}>({movie.year})</span>
        </div>
        <div style={{
          maxHeight: isExpanded ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease, padding 0.4s ease, margin 0.4s ease',
          background: 'transparent',
          marginLeft: '28px',
          padding: isExpanded ? '12px 0 8px 0' : '0',
          marginBottom: isExpanded ? '8px' : '0'
        }}>
          <p style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#555',
            margin: 0,
            fontStyle: 'italic'
          }}>
            {movie.summary}
          </p>
        </div>
      </li>
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
          {!isSignedIn ? (
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

        {/* Color Matches Section */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'left',
          marginTop: isSignedIn ? '30px' : '0'
        }}>
          <h2 style={{
            fontFamily: "'BLANKA', Arial, sans-serif",
            fontSize: '24px',
            fontWeight: 'normal',
            marginBottom: '8px',
            color: '#000',
            borderBottom: '2px solid #000',
            paddingBottom: '5px',
            letterSpacing: '0.5px'
          }}>
            Color Matches
          </h2>
          <div style={{
            fontSize: '16px',
            fontStyle: 'italic',
            color: '#666',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Based on:{' '}
            <div style={{
              height: '1em',
              width: '1em',
              borderRadius: '4px',
              display: 'inline-block',
              backgroundColor: watchlistData.colorMatches.inputDetail.value
            }}></div>
          </div>
          <ul style={{
            listStyle: 'none',
            paddingLeft: 0,
            margin: 0
          }}>
            {watchlistData.colorMatches.movies.map(renderMovieItem)}
          </ul>
        </div>

        {/* Vibe Matches Section */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          <h2 style={{
            fontFamily: "'BLANKA', Arial, sans-serif",
            fontSize: '24px',
            fontWeight: 'normal',
            marginBottom: '8px',
            color: '#000',
            borderBottom: '2px solid #000',
            paddingBottom: '5px',
            letterSpacing: '0.5px'
          }}>
            Vibe Matches
          </h2>
          
          {watchlistData.vibeMatches.map((section, index) => (
            <div key={index}>
              <div style={{
                fontSize: '16px',
                fontStyle: 'italic',
                color: '#666',
                marginBottom: '15px',
                marginTop: index > 0 ? '25px' : '0'
              }}>
                Based on: "{section.inputDetail.value}"
              </div>
              <ul style={{
                listStyle: 'none',
                paddingLeft: 0,
                margin: 0
              }}>
                {section.movies.map(renderMovieItem)}
              </ul>
            </div>
          ))}
        </div>

        {/* Keyword Matches Section */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          <h2 style={{
            fontFamily: "'BLANKA', Arial, sans-serif",
            fontSize: '24px',
            fontWeight: 'normal',
            marginBottom: '8px',
            color: '#000',
            borderBottom: '2px solid #000',
            paddingBottom: '5px',
            letterSpacing: '0.5px'
          }}>
            Keyword Matches
          </h2>
          <div style={{
            fontSize: '16px',
            fontStyle: 'italic',
            color: '#666',
            marginBottom: '15px'
          }}>
            Based on: "{watchlistData.keywordMatches.inputDetail.value}"
          </div>
          <ul style={{
            listStyle: 'none',
            paddingLeft: 0,
            margin: 0
          }}>
            {watchlistData.keywordMatches.movies.map(renderMovieItem)}
          </ul>
        </div>
      </main>

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
          boxShadow: 'none',
          transform: navOpen ? 'translateX(0)' : 'translateX(calc(-100% - 20px))',
          transition: 'transform 0.3s ease',
          zIndex: 1050,
          padding: '20px 20px 40px 40px',
          overflowY: 'auto'
        }}
        aria-hidden={!navOpen}
      >
        <button 
          onClick={() => {
            navigation.goToMatch()
            setNavOpen(false)
          }}
          style={{ 
            display: 'block', 
            marginTop: '20px', 
            marginBottom: '16px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
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
            <button 
              onClick={() => {
                navigation.goToVibes()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Describe a Vibe
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToColor()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Pick a Color
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToWords()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Choose Keywords
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToSurprise()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Surprise Me
            </button>
          </li>
        </ul>

        <button 
          onClick={() => {
            navigation.goToWatchlist()
            setNavOpen(false)
          }}
          style={{ 
            display: 'block', 
            marginBottom: '16px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
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
            <button 
              onClick={() => {
                navigation.goToCreate()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Create Account
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToLogin()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Sign In
            </button>
          </li>
        </ul>

        <button 
          onClick={() => {
            navigation.goToAbout()
            setNavOpen(false)
          }}
          style={{ 
            display: 'block', 
            marginBottom: '16px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
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
        
        <button 
          onClick={() => {
            navigation.goToDonate()
            setNavOpen(false)
          }}
          style={{ 
            display: 'block', 
            marginBottom: '16px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
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
        <span>© 2025 Celluloid by Design</span>
      </footer>
    </div>
  )
}

export default Watchlist