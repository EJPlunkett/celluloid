import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import Navigation from '../components/Navigation'

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
              marginTop: '35px',
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
            <em>Celluloid by Design</em> is a platform for discovering film through its aesthetics. Instead of relying on genre or storyline, movies here are catalogued by the qualities that define how they look: their colors, their settings, and their atmosphere. The archive begins with New York City films, a landscape that has shaped cinematic style for decades. By organizing them through these elements, the site offers a new way of exploring cinema, making aesthetic connections visible and usable.
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

        <Navigation navOpen={navOpen} setNavOpen={setNavOpen} />

        <footer style={{
          fontSize: '14px',
          color: '#000',
          textAlign: 'center',
          padding: '20px',
          userSelect: 'none',
          background: '#f6f5f3'
        }}>
         <span>© 2025 Celluloid by Design <span style={{ opacity: 0.8 }}>(BETA)</span></span>
        </footer>
      </div>
    </>
  )
}

export default About