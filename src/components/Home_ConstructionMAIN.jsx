function Home_Construction() {
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
          A niche film discovery platform in the works, set to launch early fall 2025.
        </p>
        <img 
          src="/construction.png" 
          alt="Under Construction" 
          style={{
            maxWidth: '480px',
            width: '100%',
            height: 'auto',
            margin: '0 auto 40px',
            display: 'block'
          }}
        />
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
          color: '#000'
        }}>
          Conceptualized and crafted by Emily Plunkett
        </span>
      </footer>
    </div>
  );
}

export default Home_Construction;