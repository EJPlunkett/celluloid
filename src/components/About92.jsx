import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'

// Define the custom font for signature only
const fontFace = `
  @font-face {
    font-family: 'TheArtistScript';
    src: url('/TheArtistScript.otf') format('opentype');
    font-display: swap;
  }
`

function About() {
  const [navOpen, setNavOpen] = useState(false)
  const navigation = useNavigation()

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fontFace }} />
      <div style={{
        margin: 0,
        padding: 0,
        height: '100%',
        backgroundColor: '#f6f5f3',
        overflowX: 'hidden',
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
          height: 'auto',
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
          margin: '0 auto 60px',
          padding: '0 20px',
          flexGrow: 1,
          textAlign: 'center'
        }}>
          <img 
            src="/About Header.png" 
            alt="About Header" 
            style={{
              width: '100%',
              maxWidth: '480px',
              height: 'auto',
              display: 'block',
              marginTop: '20px',
              marginBottom: '5px'
            }}
          />
          
          <p style={{
            fontWeight: 300,
            fontSize: '16px',
            lineHeight: 1.6,
            margin: '0 0 20px 0',
            padding: 0,
            whiteSpace: 'pre-wrap',
            color: '#000',
            textAlign: 'center'
          }}>
            <em>Celluloid by Design</em> is a platform for discovering film through its aesthetics. Instead of relying on genre or storyline, movies here are catalogued by the qualities that define how they look: their colors, their settings, and their atmosphere. By organizing film through these elements, the site creates a different way of exploring cinema, one that makes aesthetic connections visible and usable.
          </p>

          <img 
            src="/Portrait.png" 
            alt="Emily Plunkett" 
            style={{
              width: '100%',
              maxWidth: '480px',
              height: 'auto',
              display: 'block',
              margin: '5px auto 5px'
            }}
          />
          
          <p style={{
            fontSize: '14px',
            fontWeight: 300,
            margin: '0 0 20px 0',
            fontStyle: 'italic',
            color: '#000',
            textAlign: 'center'
          }}>
            Photo of me channeling the vibe of Working Girl (1988) on the Staten Island Ferry.
          </p>

          <p style={{
            fontWeight: 300,
            fontSize: '16px',
            lineHeight: 1.6,
            margin: '0 0 20px 0',
            padding: 0,
            whiteSpace: 'pre-wrap',
            color: '#000',
            textAlign: 'center'
          }}>
            The framework comes from my background in schema and process design. I have spent years building systems that connect scattered elements and make sense of messy stories and signals, and I wanted to see what would happen if I applied that same practice to cinema. Each entry follows a consistent structure designed to capture the details that make a film distinct and make those details searchable. It is not driven by algorithms or opaque rules, but by a framework that gives aesthetics a structure you can navigate.
          </p>

          <p style={{
            fontWeight: 300,
            fontSize: '16px',
            lineHeight: 1.6,
            margin: '0 0 10px 0',
            padding: 0,
            whiteSpace: 'pre-wrap',
            color: '#000',
            textAlign: 'center'
          }}>
            This project is also about re-engaging with cinema on a personal level. I grew up in a VHS store, surrounded by shelves of films that shaped how I saw the world. Working on this has resurfaced so many titles I had forgotten by name but not by aesthetic. I still remembered the airy lofts, the tenement apartments, the clothes and the sets, even when the stories had faded. Now I can connect those same aesthetics to films I had never seen before. With my watchlist locked in, I am on the ride with you, and I invite you to join me on Instagram as we watch them all.
          </p>

          <p style={{
            fontWeight: 300,
            fontSize: '16px',
            lineHeight: 1.6,
            margin: '0 0 30px 0',
            padding: 0,
            whiteSpace: 'pre-wrap',
            color: '#000',
            textAlign: 'center'
          }}>
            <span style={{
              fontFamily: "'TheArtistScript', cursive",
              fontSize: '35px'
            }}>
              Emily Plunkett
            </span>
            <br />
            <span style={{ fontStyle: 'italic' }}>
              Creator
            </span>
          </p>

          <p style={{
            fontWeight: 300,
            fontSize: '16px',
            lineHeight: 1.6,
            margin: '0 0 30px 0',
            color: '#000',
            textAlign: 'center'
          }}>
            <strong><em>Celluloid by Design</em> is in <strong>Beta</strong>.</strong><br />
            Features are still being refined and recommendations tuned, and your thoughts can help shape what's next. Share{' '}
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSc__ZiaismoxmtX95FJDJTPX9iE-jGixhOWzpGAoba0TVBspQ/viewform" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#000', textDecoration: 'underline' }}
            >
              <strong>anonymous feedback</strong>
            </a>{' '}
            anytime. By using this site, you agree to our{' '}
            <button 
              onClick={() => {
                navigation.goToTerms()
                // Small delay to ensure page loads before scrolling
                setTimeout(() => {
                  const element = document.getElementById('terms-of-service')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }, 100)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'underline',
                background: 'transparent',
                border: 'none',
                fontSize: '16px',
                fontWeight: 300,
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'Arial, sans-serif'
              }}
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button 
              onClick={() => {
                navigation.goToTerms()
                // Small delay to ensure page loads before scrolling
                setTimeout(() => {
                  const element = document.getElementById('privacy-policy')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }, 100)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'underline',
                background: 'transparent',
                border: 'none',
                fontSize: '16px',
                fontWeight: 300,
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'Arial, sans-serif'
              }}
            >
              Privacy Policy
            </button>.
          </p>

          <p style={{
            fontWeight: 300,
            fontSize: '16px',
            lineHeight: 1.6,
            margin: '0 0 60px 0',
            color: '#000',
            textAlign: 'center'
          }}>
            Questions or just want to say hi?<br />
            Drop me a line at{' '}
            <a 
              href="mailto:hello@celluloidbydesign.com"
              style={{ color: '#000', textDecoration: 'underline' }}
            >
              hello@celluloidbydesign.com
            </a>{' '}
            or connect and follow with the links below.
          </p>

          <div style={{
            textAlign: 'center',
            marginBottom: '60px',
            fontSize: 0
          }}>
            <a 
              href="https://www.linkedin.com/in/emily-plunkett-1b512915a/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                fontSize: '16px',
                margin: '0 12px',
                cursor: 'pointer',
                verticalAlign: 'middle',
                display: 'inline-block'
              }}
            >
              <img 
                src="/LinkedIn Icon.png" 
                alt="LinkedIn" 
                style={{ width: '32px', height: '32px', display: 'block' }}
              />
            </a>
            <a 
              href="https://www.instagram.com/celluloidbydesign/?igsh=YnU3Z2JmMDZhMmJo&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                fontSize: '16px',
                margin: '0 12px',
                cursor: 'pointer',
                verticalAlign: 'middle',
                display: 'inline-block'
              }}
            >
              <img 
                src="/Instagram Icon.png" 
                alt="Instagram" 
                style={{ width: '32px', height: '32px', display: 'block' }}
              />
            </a>
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
          background: '#f6f5f3'
        }}>
          <span style={{ fontStyle: 'italic' }}>© 2025 Celluloid by Design</span>
        </footer>
      </div>
    </>
  )
}

export default About