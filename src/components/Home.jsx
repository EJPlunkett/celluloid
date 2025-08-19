import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleGoClick = () => {
    navigate('/match')
  }

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
        margin: '40px auto 20px',
        padding: '0 20px',
        textAlign: 'center'
      }}>
        <img 
          src="/Header Logo.png" 
          alt="Celluloid by Design Logo" 
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
          marginBottom: '60px',
          color: '#000'
        }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div 
          style={{
            width: '20px',
            height: '20px',
            borderBottom: '3px solid #000',
            borderRight: '3px solid #000',
            transform: 'rotate(45deg)',
            margin: '0 auto 40px',
            position: 'relative'
          }}
          aria-hidden="true"
        ></div>
        <button
          onClick={handleGoClick}
          style={{
            display: 'block',
            width: 'fit-content',
            maxWidth: '190px',
            height: '40px',
            margin: '0 auto 40px',
            textAlign: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <img 
            src="/GoButton.png" 
            alt="Give It a Go Button" 
            style={{
              height: '100%',
              width: 'auto',
              display: 'block'
            }}
          />
        </button>
      </div>
      <footer style={{
        fontSize: '14px',
        color: '#000',
        textAlign: 'center',
        margin: '40px 20px 20px',
        userSelect: 'none'
      }}>
        © 2025 Celluloid by Design<br />
        <span style={{
          marginTop: '8px',
          fontStyle: 'italic',
          color: '#000',
          display: 'inline-block'
        }}>
          Conceptualized and crafted by Emily Plunkett
        </span>
      </footer>
    </div>
  )
}

export default Home