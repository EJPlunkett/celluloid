import { useState, useRef } from 'react'
import { useNavigation } from '../hooks/useNavigation'

function Words() {
  const [navOpen, setNavOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [notification, setNotification] = useState('')
  const inputRef = useRef(null)
  const navigation = useNavigation()

  const maxTags = 7

  const words = [
    // Decade Tags
    "1950s", "1960s", "1970s", "1980s", "1990s", "2000s",
    
    // Core Aesthetic Descriptors
    "grainy", "golden", "smokey", "gritty", "pastel", "harsh", "electric", "minimal",
    "muted", "bloody", "neon", "raw", "glossy", "saturated", "rain-soaked", "shadowy",
    "cold", "dark", "bold", "bright", "soft", "vivid", "colorful", "warm", "worn",
    "sharp", "surreal", "textured", "vibrant", "stylized", "hazy", "monochrome",
    "industrial", "eerie", "nostalgic", "cozy",
    
    // Conceptual / Contextual Adjectives
    "corporate", "glamorous", "noir", "edgy", "geometric", "polished", "dingy", 
    "decaying", "murky", "exaggerated", "editorial", "dusty", "seedy", "overcast",
    "couture", "airy", "campy", "avant-garde", "symmetrical", "festive", "midcentury",
    
    // NYC Urban Texture & Setting Terms
    "loft", "stoop-side", "tenement", "brownstone", "concrete", "cluttered",
    "chalky", "fluorescent", "velvety", "metallic", "wintry", "payphone", "bodega", "subway-platform"
  ]

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const addTag = (word) => {
    if (selectedTags.length >= maxTags) {
      setNotification("Word limit reached. Submit to proceed.")
      return
    }
    if (!selectedTags.includes(word)) {
      setSelectedTags([...selectedTags, word])
      setNotification("")
    }
  }

  const removeTag = (word) => {
    setSelectedTags(selectedTags.filter(tag => tag !== word))
    setNotification("")
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const inputVal = inputValue.trim().toLowerCase()
      if (inputVal && !selectedTags.includes(inputVal)) {
        if (selectedTags.length >= maxTags) {
          setNotification("Word limit reached. Submit to proceed.")
          return
        }
        setSelectedTags([...selectedTags, inputVal])
        setInputValue('')
        setNotification("")
      }
    }
  }

  const handleSubmit = () => {
    if (selectedTags.length === 0) {
      alert('Please select at least one word!')
      return
    }
    console.log('Selected words:', selectedTags)
    // Navigate to cards page with the selected words
    navigation.goToCards({ words: selectedTags })
  }

  const handleNotificationClick = () => {
    if (notification && selectedTags.length > 0) {
      handleSubmit()
    }
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const remainingWords = maxTags - selectedTags.length

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
      minHeight: '100vh'
    }}>
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
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <img 
          src="/Words Header.png" 
          alt="Words Header" 
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
          whiteSpace: 'normal',
          textAlign: 'center'
        }}>
          Select from the words provided or type in your own. Combining 3 to 7 creates a thread that guides the system, pulling together films defined by the details you choose.
        </p>

        {notification && (
          <div 
            onClick={handleNotificationClick}
            style={{
              maxWidth: '480px',
              margin: '10px auto 0 auto',
              backgroundColor: '#000',
              color: '#f6f5f3',
              fontWeight: 'normal',
              fontSize: '14px',
              textAlign: 'center',
              display: 'block',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
          >
            {notification}
          </div>
        )}

        {/* Input Box with Pills Inside */}
        <div 
          onClick={focusInput}
          style={{
            border: '2px solid #000',
            borderRadius: '15px',
            padding: '8px 12px',
            minHeight: '48px',
            maxWidth: '480px',
            margin: '20px auto 10px auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px',
            boxSizing: 'border-box',
            background: '#fff',
            cursor: 'text'
          }}
        >
          {/* Selected Tags as Pills Inside the Box */}
          {selectedTags.map((tag, index) => (
            <span 
              key={index}
              style={{
                background: '#000',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '14px',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {tag}
              <span 
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(tag)
                }}
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  userSelect: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    removeTag(tag)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Remove ${tag}`}
              >
                ×
              </span>
            </span>
          ))}
          
          {/* Input Field */}
          <input 
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type or select words..."
            style={{
              flex: 1,
              border: 'none',
              fontSize: '16px',
              padding: '6px 8px',
              outline: 'none',
              fontStyle: inputValue ? 'normal' : 'italic',
              color: inputValue ? '#000' : '#666',
              minWidth: '140px',
              background: 'transparent'
            }}
            onFocus={(e) => {
              e.target.style.color = '#000'
              e.target.style.fontStyle = 'normal'
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.style.color = '#666'
                e.target.style.fontStyle = 'italic'
              }
            }}
          />
        </div>

        {/* Word Count */}
        <div style={{
          fontSize: '14px',
          color: '#666',
          margin: '10px 0 20px 0',
          textAlign: 'center'
        }}>
          {selectedTags.length > 0 ? (
            `${selectedTags.length} of ${maxTags} words selected${remainingWords > 0 ? ` (${remainingWords} more available)` : ''}`
          ) : (
            `Select up to ${maxTags} words`
          )}
        </div>

        {/* Word List */}
        <ul style={{
          maxWidth: '480px',
          margin: '0 auto 30px auto',
          paddingLeft: 0,
          listStyle: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
          {words.map((word, index) => {
            const isSelected = selectedTags.includes(word)
            const isDisabled = selectedTags.length >= maxTags && !isSelected
            
            return (
              <li key={index} style={{ margin: 0 }}>
                <span
                  onClick={() => !isDisabled && addTag(word)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                      e.preventDefault()
                      addTag(word)
                    }
                  }}
                  tabIndex={isDisabled ? -1 : 0}
                  role="button"
                  aria-disabled={isDisabled}
                  style={{
                    background: isSelected ? '#666' : '#000',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    cursor: isDisabled ? 'not-allowed' : (isSelected ? 'default' : 'pointer'),
                    userSelect: 'none',
                    transition: 'background-color 0.2s ease',
                    display: 'inline-block',
                    opacity: isDisabled ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.target.style.background = '#444'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.target.style.background = '#000'
                    }
                  }}
                >
                  {word}
                </span>
              </li>
            )
          })}
        </ul>

        <button
          onClick={handleSubmit}
          disabled={selectedTags.length === 0}
          style={{
            margin: '30px auto 0 auto',
            width: '150px',
            height: 'auto',
            background: 'transparent',
            border: 'none',
            cursor: selectedTags.length === 0 ? 'not-allowed' : 'pointer',
            display: 'block',
            opacity: selectedTags.length === 0 ? 0.5 : 1,
            pointerEvents: selectedTags.length === 0 ? 'none' : 'auto'
          }}
        >
          <img 
            src="/Submit Button.png" 
            alt="Submit Button" 
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </button>
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
        fontStyle: 'italic'
      }}>
        <span>© 2025 Celluloid by Design</span>
      </footer>
    </div>
  )
}

export default Words