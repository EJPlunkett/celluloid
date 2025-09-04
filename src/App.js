import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home_Construction from './components/Home_Construction'
import Match from './components/Match'
import About from './components/About92'
import Color from './components/Color92'
import Create from './components/Create92'
import Cards from './components/Cards92'
import Login from './components/Login92'
import Donate from './components/Donate'     // Keep the old one
import Support from './components/Support'   // Add the new one
import Surprise from './components/Surprise92'
import Terms from './components/Terms92'
import Vibes from './components/Vibes92'
import Watchlist from './components/Watchlist92'
import Words from './components/Words92'
import Welcome from './components/Welcome'
import SearchTestPage from './components/SearchTestPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home_Construction />} />
          <Route path="/match" element={<Match />} />
          <Route path="/about" element={<About />} />
          <Route path="/color" element={<Color />} />
          <Route path="/create" element={<Create />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donate" element={<Donate />} />       {/* Keep existing */}
          <Route path="/support" element={<Support />} />     {/* Add new one */}
          <Route path="/surprise" element={<Surprise />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/vibes" element={<Vibes />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/words" element={<Words />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/test" element={<SearchTestPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App