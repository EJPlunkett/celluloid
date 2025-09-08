import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Home_Construction() {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showContinue, setShowContinue] = useState(false)

  const handleGoClick = () => {
    navigate('/match')
  }

  const handleArrowClick = () => {
    setIsExpanded(!isExpanded)
    setShowContinue(false) // Hide continue text when clicked
  }

  // Show continue text after 4 seconds
  useEffect(() => {
    if (!isExpanded) {
      const timer = setTimeout(() => {
        setShowContinue(true)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isExpanded])

  return (
    <div style={{
      margin: 0,
      padding: 0,
      backgroundColor: '#f6f5f3',
      color: '#000',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'space-between'
    }}>
      <div style={{
        maxWidth: '480px',
        margin: isExpanded ? '10px auto 20px' : '40px auto 20px',
        padding: '0 20px',
        textAlign: 'center',
        transition: 'margin 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <img 
          src="/Header Logo.png" 
          alt="Celluloid by Design Logo" 
          style={{
            display: 'block',
            maxWidth: '480px',
            width: '100%',
            height: 'auto',
            margin: '25px auto 20px auto'
          }}
        />
        
        <div style={{
          overflow: 'hidden',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isExpanded ? 'translateY(-100%)' : 'translateY(0)',
          opacity: isExpanded ? 0 : 1,
          marginBottom: isExpanded ? '-150px' : '60px'
        }}>
          <p style={{
            fontWeight: 300,
            fontSize: '16px',
            lineHeight: 1.6,
            color: '#000',
            margin: 0
          }}>
            Celluloid by Design is a new way of discovering film, matching you with movies through their visual language. Cinema is explored not by plot or genre, but through aesthetics: the colors that flood a scene, the design that frames it, and the spaces it inhabits. These elements become the thread that ties films together and guides you toward recommendations curated by design.
          </p>
        </div>

        <div 
          onClick={handleArrowClick}
          style={{
            width: '28px',
            height: '28px',
            borderBottom: '3px solid #000',
            borderRight: '3px solid #000',
            transform: isExpanded ? 'rotate(225deg)' : 'rotate(45deg)',
            margin: isExpanded ? '0 auto 5px' : '0 auto 50px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: isExpanded ? 'none' : 'strongPulse 2s infinite',
            opacity: 0.9,
          }}
          aria-hidden="true"
        />

        {/* Continue text that appears after 4 seconds */}
        {!isExpanded && (
          <div style={{
            fontSize: '12px',
            color: '#000',
            textAlign: 'center',
            opacity: showContinue ? 0.6 : 0,
            transition: 'opacity 1s ease-in-out',
            marginTop: '-30px',
            marginBottom: '40px',
            fontFamily: 'BLANKA, Arial, sans-serif',
            fontWeight: 'normal',
            letterSpacing: '0.5px'
          }}>
            Continue
          </div>
        )}

        <div style={{
          overflow: 'hidden',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isExpanded ? 'translateY(0)' : 'translateY(100%)',
          opacity: isExpanded ? 1 : 0,
          marginBottom: isExpanded ? '40px' : '-60px',
          height: isExpanded ? 'auto' : '0'
        }}>
          <p style={{
            fontWeight: 300,
            fontSize: '16px',
            lineHeight: 1.6,
            color: '#000',
            margin: 0,
            marginBottom: '40px'
          }}>
            The journey begins with New York City, a place whose onscreen design has shaped decades of film. Lofts filled with art, streets pulsing with steam and sirens, and subways lined with orange and yellow seats have carved out entire genres. Together, they make the city a living character in cinema, shifting through time yet always unmistakably New York.
          </p>
          
          <button
            onClick={handleGoClick}
            style={{
              display: 'block',
              width: 'fit-content',
              maxWidth: '190px',
              height: '40px',
              margin: '0 auto',
              textAlign: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <img 
              src="/give-it-a-go-button.png" 
              alt="Give It a Go Button" 
              style={{
                height: '100%',
                width: 'auto',
                display: 'block'
              }}
            />
          </button>
        </div>
      </div>
      
      <footer style={{
        fontSize: '14px',
        color: '#000',
        textAlign: 'center',
        margin: '40px 20px 20px',
        userSelect: 'none'
      }}>
        © 2025 Celluloid by Design <span style={{ opacity: 0.5, fontStyle: 'normal' }}>(BETA)</span><br />
        <span style={{
          marginTop: '8px',
          fontStyle: 'italic',
          color: '#000',
          display: 'inline-block'
        }}>
          Conceptualized and crafted by Emily Plunkett
        </span>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
          @font-face {
            font-family: 'BLANKA';
            src: url('/BLANKA.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
          }
          
          @keyframes strongPulse {
            0%, 100% {
              opacity: 0.9;
            }
            50% {
              opacity: 0.2;
            }
          }
        `
      }} />
    </div>
  )
}

export default Home_Construction