import { useAuth } from '../contexts/AuthContext'
import { useNavigation } from '../hooks/useNavigation'

const Navigation = ({ navOpen, setNavOpen }) => {
  const { user, profile, loading, signOut } = useAuth()
  const navigation = useNavigation()

  const handleSignOut = async () => {
    try {
      await signOut()
      setNavOpen(false) // Close nav after signing out
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const closeNav = () => setNavOpen(false)

  return (
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
          closeNav()
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
              closeNav()
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
              closeNav()
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
              closeNav()
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
              closeNav()
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
          closeNav()
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
        {loading ? (
          <li style={{ marginBottom: '12px', color: '#666' }}>
            Loading...
          </li>
        ) : user && profile ? (
          // Signed in state
          <>
            <li style={{ marginBottom: '12px', color: '#000' }}>
              {profile.first_name} {profile.last_name}
            </li>
            <li style={{ marginBottom: '12px' }}>
              <button 
                onClick={handleSignOut}
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
                Sign Out
              </button>
            </li>
          </>
        ) : (
          // Signed out state
          <>
            <li style={{ marginBottom: '12px' }}>
              <button 
                onClick={() => {
                  navigation.goToCreate()
                  closeNav()
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
                  closeNav()
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
          </>
        )}
      </ul>

      <button 
        onClick={() => {
          navigation.goToAbout()
          closeNav()
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
          closeNav()
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
  )
}

export default Navigation