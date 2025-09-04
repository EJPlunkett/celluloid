import { useState, useRef } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import Navigation from '../components/Navigation'

function Words() {
  const [navOpen, setNavOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [notification, setNotification] = useState('')
  const [isSearching, setIsSearching] = useState(false)
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

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      alert('Please select at least one word!')
      return
    }
    
    if (!isSearching) {
      setIsSearching(true)
      console.log('Selected words:', selectedTags)
      
      try {
        // Call your word search API
        const response = await fetch('/.netlify/functions/wordSearch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keywords: selectedTags,
            timestamp: Date.now()
          })
        })
        
        const results = await response.json()
        
        if (results.success && results.results.length > 0) {
          // Navigate to cards page with the results
          navigation.goToCards({ 
            words: selectedTags,
            results: results.results
          })
        } else {
          console.error('Word search failed:', results)
          setIsSearching(false)
          alert('Search failed. Please try again.')
        }
      } catch (error) {
        console.error('Error calling word search:', error)
        setIsSearching(false)
        alert('Network error. Please try again.')
      }
    }
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
      <style>{`
        @font-face {
          font-family: 'Blanka';
          src: url('/BLANKA.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
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
      `}</style>

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
          disabled={selectedTags.length === 0 || isSearching}
          className={isSearching ? 'search-button searching' : ''}
          style={{
            marginBottom: '5px',
            width: '150px',
            height: isSearching ? '40px' : 'auto',
            background: isSearching ? '#000' : 'transparent',
            border: 'none',
            cursor: isSearching ? 'not-allowed' : (selectedTags.length === 0 ? 'not-allowed' : 'pointer'),
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: isSearching ? 0.6 : (selectedTags.length === 0 ? 0.5 : 1),
            borderRadius: isSearching ? '25px' : '0',
            color: isSearching ? '#fff' : 'transparent',
            fontFamily: isSearching ? "'Blanka', sans-serif" : 'inherit',
            fontSize: isSearching ? '16px' : 'inherit',
            textTransform: isSearching ? 'uppercase' : 'none',
            letterSpacing: isSearching ? '1px' : 'normal'
          }}
        >
          {isSearching ? 'SEARCHING' : (
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
      </main>

      <Navigation navOpen={navOpen} setNavOpen={setNavOpen} />

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