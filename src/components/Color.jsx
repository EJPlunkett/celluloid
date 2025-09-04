import { useState, useEffect } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import { supabase } from '../lib/supabase'

function Color() {
  // Predefined color palette
  const colorPalette = [
    '#cf6f47', '#c4c8ab', '#89734c', '#deaa6b', '#543855',
    '#ffa384', '#b5e5cf', '#3d5b59', '#b99095', '#ede7dc',
    '#dcd2cc', '#ccafa5', '#bdc3cb', '#f29367', '#a98ab0',
    '#efede4', '#8fa259', '#303a22', '#706563', '#fbc00e',
    '#928e2a', '#dc4731', '#fff3d9', '#b8390e', '#3b0918'
  ]

  // Function to get random color from palette
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colorPalette.length)
    return colorPalette[randomIndex]
  }

  const [navOpen, setNavOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(getRandomColor())
  const [isRolling, setIsRolling] = useState(false)
  const [currentPalette, setCurrentPalette] = useState([])
  const [moviePalettes, setMoviePalettes] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [colorSearching, setColorSearching] = useState(false)
  const [paletteSearching, setPaletteSearching] = useState(false)
  const navigation = useNavigation()

  // Fetch movie color palettes from Supabase
  useEffect(() => {
    fetchMoviePalettes()
  }, [])

  const fetchMoviePalettes = async () => {
    try {
      console.log('Attempting to fetch movie palettes...')
      
      const { data, error } = await supabase
        .from('celluloid_film_data')
        .select('movie_id, movie_title, hex_codes')
        .not('hex_codes', 'is', null)
        .neq('hex_codes', '')
        .limit(500) // Increase from 100 to 500 for more variety

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      if (!data || data.length === 0) {
        console.log('No data returned from Supabase')
        return
      }

      console.log(`Found ${data.length} movies with hex codes`)
      
      // Process the data to parse hex_codes string into arrays
      const processedData = data.map(movie => {
        const colorArray = movie.hex_codes ? 
          movie.hex_codes.split(',').map(color => color.trim()) : []
        
        return {
          ...movie,
          colorArray
        }
      }).filter(movie => movie.colorArray.length >= 5) // Only keep movies with at least 5 colors
      
      console.log(`Processed ${processedData.length} movies with 5+ colors`)
      setMoviePalettes(processedData)
      
    } catch (error) {
      console.error('Error fetching movie palettes:', error)
    }
  }

  const rollDice = () => {
    if (moviePalettes.length === 0) {
      console.error('No movie palettes available')
      return
    }

    setIsRolling(true)
    setSelectedMovie(null) // Clear previous selection
    setCurrentPalette([]) // Clear previous palette
    
    // Create rolling animation effect with better randomization
    let rollCount = 0
    const maxRolls = 15 + Math.floor(Math.random() * 10) // Random number of rolls between 15-25
    
    const rollInterval = setInterval(() => {
      // Better randomization - use crypto.getRandomValues if available
      const randomIndex = crypto.getRandomValues ? 
        crypto.getRandomValues(new Uint32Array(1))[0] % moviePalettes.length :
        Math.floor(Math.random() * moviePalettes.length)
        
      const randomMovie = moviePalettes[randomIndex]
      const palette = randomMovie.colorArray.slice(0, 5) // Take first 5 colors
      setCurrentPalette(palette)
      rollCount++

      if (rollCount >= maxRolls) {
        clearInterval(rollInterval)
        
        // Small delay before final selection to ensure different from last animation frame
        setTimeout(() => {
          setIsRolling(false)
          
          // Final selection with additional randomization
          const finalIndex = crypto.getRandomValues ? 
            crypto.getRandomValues(new Uint32Array(1))[0] % moviePalettes.length :
            Math.floor(Math.random() * moviePalettes.length)
          const finalMovie = moviePalettes[finalIndex]
          const finalPalette = finalMovie.colorArray.slice(0, 5)
          
          setSelectedMovie(finalMovie)
          setCurrentPalette(finalPalette)
          console.log('Final selection:', finalMovie.movie_title, finalPalette)
        }, 100)
      }
    }, 100 + rollCount * 5) // Gradually slow down the rolling
  }

  const handlePaletteSubmit = async () => {
    if (selectedMovie && !paletteSearching) {
      setPaletteSearching(true)
      console.log('Selected movie palette:', selectedMovie)
      
      try {
        // Call the colorSearch API for palette matching
        const response = await fetch('/.netlify/functions/colorSearch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            searchType: 'palette',
            movieId: selectedMovie.movie_id,
            hexCodes: selectedMovie.hex_codes,
            timestamp: Date.now()
          })
        })
        
        const results = await response.json()
        
        if (results.success && results.results.length > 0) {
          // Navigate to cards page with the results
          navigation.goToCards({ 
            type: 'palette',
            results: results.results
          })
        } else {
          console.error('Palette search failed:', results)
          setPaletteSearching(false) // Reset state on failure
          alert('Search failed. Please try again.') // User feedback
        }
      } catch (error) {
        console.error('Error calling palette search:', error)
        setPaletteSearching(false) // Reset state on error
        alert('Network error. Please try again.') // User feedback
      }
    }
  }

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value.toUpperCase())
  }

  const handleSubmit = async (colorToUse = null) => {
    // Use passed color or current selectedColor
    const targetColor = colorToUse || selectedColor
    
    if (!colorSearching) {
      setColorSearching(true)
      console.log('Selected color:', targetColor)
      
      try {
        // Call the colorSearch API for single color matching
        const response = await fetch('/.netlify/functions/colorSearch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            searchType: 'color',
            color: targetColor,
            timestamp: Date.now()
          })
        })
        
        const results = await response.json()
        
        if (results.success && results.results.length > 0) {
          // Navigate to cards page with the results
          navigation.goToCards({ 
            color: targetColor,
            results: results.results
          })
        } else {
          console.error('Color search failed:', results)
          setColorSearching(false) // Reset state on failure
          alert('Search failed. Please try again.') // User feedback
        }
      } catch (error) {
        console.error('Error calling color search:', error)
        setColorSearching(false) // Reset state on error
        alert('Network error. Please try again.') // User feedback
      }
    }
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
            font-family: 'Blanka';
            src: url('/BLANKA.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
          }
          
          input[type="color"] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            cursor: pointer;
            outline: none;
            padding: 0;
            box-sizing: border-box;
            background-color: transparent;
          }
          input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 0;
            border: none;
            border-radius: 50%;
            box-shadow: none;
          }
          input[type="color"]::-webkit-color-swatch {
            border: none;
            border-radius: 50%;
            box-shadow: none;
            min-height: 60px;
            min-width: 60px;
          }
          input[type="color"]::-moz-color-swatch {
            border: none;
            border-radius: 50%;
          }
          
          /* Mobile Safari specific fix */
          @media screen and (-webkit-min-device-pixel-ratio: 1) {
            input[type="color"]::-webkit-color-swatch-wrapper {
              padding: 0 !important;
              border: none !important;
            }
            input[type="color"]::-webkit-color-swatch {
              border: none !important;
              box-shadow: none !important;
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
            10% { transform: translateX(-4px) translateY(-2px) rotate(-5deg); }
            20% { transform: translateX(4px) translateY(2px) rotate(4deg); }
            30% { transform: translateX(-3px) translateY(3px) rotate(-3deg); }
            40% { transform: translateX(3px) translateY(-1px) rotate(6deg); }
            50% { transform: translateX(-2px) translateY(2px) rotate(-4deg); }
            60% { transform: translateX(2px) translateY(-3px) rotate(3deg); }
            70% { transform: translateX(-2px) translateY(1px) rotate(-2deg); }
            80% { transform: translateX(2px) translateY(-1px) rotate(5deg); }
            90% { transform: translateX(-1px) translateY(2px) rotate(-3deg); }
          }
          
          .dice-rolling {
            animation: shake 0.4s infinite;
          }
          
          .color-swatch {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            transition: transform 0.2s ease;
          }
          
          .color-palette {
            display: flex;
            gap: 15px;
            justify-content: center;
            align-items: center;
            margin: 10px 0;
          }
          
          .search-button {
            width: 150px;
            height: 40px;
            background: #000;
            color: #fff;
            border: none;
            border-radius: 25px;
            font-family: 'Blanka', sans-serif;
            font-size: 16px;
            font-weight: 400;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .search-button:hover:not(:disabled) {
            background: #333;
            transform: translateY(-1px);
          }
          
          .search-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }
          
          .search-button.searching {
            background: #666;
            animation: pulse 1.5s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
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
          src="/Color Header.png" 
          alt="Header" 
          style={{
            display: 'block',
            maxWidth: '480px',
            width: '100%',
            height: 'auto',
            margin: '25px auto 10px auto'
          }}
        />

        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: '0 0 15px 0',
          color: '#000',
          textAlign: 'center'
        }}>
          Pick a shade that draws your eye or roll the dice for a palette pulled from the archive. Every color connects back to real design choices on screen, linking you to films that share the same visual tone.
        </p>

        {/* Original Color Picker Section */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: 400,
          fontStyle: 'italic',
          marginBottom: '15px',
          color: '#000',
          textAlign: 'center'
        }}>
          Pick a Color to Discover
        </h3>

        <section style={{ 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px'
        }}>
          <input 
            type="color"
            id="colorPicker"
            value={selectedColor}
            onChange={handleColorChange}
            aria-label="Color Picker"
            disabled={colorSearching}
          />
          <span 
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '2px solid #000',
              backgroundColor: '#fff',
              fontWeight: 600,
              fontFamily: 'monospace, monospace',
              minWidth: '100px',
              userSelect: 'text',
              textAlign: 'center'
            }}
          >
            {selectedColor}
          </span>
        </section>

        <button
          onClick={() => handleSubmit(document.getElementById('colorPicker').value)}
          disabled={colorSearching}
          className={colorSearching ? 'search-button searching' : ''}
          style={{
            marginBottom: '5px',
            width: '150px',
            height: colorSearching ? '40px' : 'auto',
            background: colorSearching ? '#000' : 'transparent',
            border: 'none',
            cursor: colorSearching ? 'not-allowed' : 'pointer',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: colorSearching ? 0.6 : 1,
            borderRadius: colorSearching ? '25px' : '0',
            color: colorSearching ? '#fff' : 'transparent',
            fontFamily: colorSearching ? "'Blanka', sans-serif" : 'inherit',
            fontSize: colorSearching ? '16px' : 'inherit',
            textTransform: colorSearching ? 'uppercase' : 'none',
            letterSpacing: colorSearching ? '1px' : 'normal'
          }}
        >
          {colorSearching ? 'SEARCHING' : (
            <img 
              src="/Submit Button.png" 
              alt="Submit"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain'
              }}
            />
          )}
        </button>

        {/* Dice Rolling Section */}
        <section style={{
          marginTop: '5px',
          paddingTop: '0px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 400,
            fontStyle: 'italic',
            marginBottom: '20px',
            color: '#000'
          }}>
            Roll to Reveal a Palette
          </h3>

          {/* Dice Button */}
          <button
            onClick={rollDice}
            disabled={isRolling || moviePalettes.length === 0 || paletteSearching}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: (isRolling || paletteSearching) ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              opacity: (isRolling || paletteSearching) ? 0.7 : 1,
              transition: 'opacity 0.3s ease',
              width: '100px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Roll dice for random movie palette"
          >
            <img 
              src="/dice.png" 
              alt="Dice" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              className={isRolling ? 'dice-rolling' : ''}
            />
          </button>

          {/* Color Palette Display */}
          {currentPalette.length > 0 && (
            <div className="color-palette">
              {currentPalette.map((color, index) => (
                <div
                  key={index}
                  className="color-swatch"
                  style={{
                    backgroundColor: color,
                    transform: isRolling ? 'scale(0.9)' : 'scale(1)'
                  }}
                  title={color}
                />
              ))}
            </div>
          )}

          {/* Submit Button for Palette */}
          {selectedMovie && !isRolling && (
            <button
              onClick={handlePaletteSubmit}
              disabled={paletteSearching}
              className={paletteSearching ? 'search-button searching' : ''}
              style={{
                marginTop: '20px',
                width: '150px',
                height: paletteSearching ? '40px' : 'auto',
                background: paletteSearching ? '#000' : 'transparent',
                border: 'none',
                cursor: paletteSearching ? 'not-allowed' : 'pointer',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                opacity: paletteSearching ? 0.6 : 1,
                borderRadius: paletteSearching ? '25px' : '0',
                color: paletteSearching ? '#fff' : 'transparent',
                fontFamily: paletteSearching ? "'Blanka', sans-serif" : 'inherit',
                fontSize: paletteSearching ? '16px' : 'inherit',
                textTransform: paletteSearching ? 'uppercase' : 'none',
                letterSpacing: paletteSearching ? '1px' : 'normal'
              }}
            >
              {paletteSearching ? 'SEARCHING' : (
                <img 
                  src="/Submit Button.png" 
                  alt="Submit"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain'
                  }}
                />
              )}
            </button>
          )}

          {/* Loading/Error States */}
          {isRolling && (
            <p style={{
              fontSize: '16px',
              color: '#666',
              marginTop: '10px'
            }}>
              Rolling to match you with a movie palette…
            </p>
          )}

          {moviePalettes.length === 0 && !isRolling && (
            <div style={{
              fontSize: '14px',
              color: '#999',
              marginTop: '10px',
              textAlign: 'center'
            }}>
              <p>Unable to load movie palettes.</p>
              <p>Check console for errors.</p>
            </div>
          )}
        </section>
      </main>

      {/* Navigation Overlay - keeping your existing navigation */}
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
            navigation.goToSupport()
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
            src="/Support Header.png" 
            alt="Support" 
            style={{
              height: '25px',
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

export default Color