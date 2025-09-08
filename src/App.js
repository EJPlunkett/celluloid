import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home_Construction from './components/Home_Construction'
import Home from './components/Home'
import Match from './components/Match'
import About from './components/About'
import Color from './components/Color'
import Create from './components/Create'
import Cards from './components/Cards'
import Login from './components/Login'
import Donate from './components/Donate'     
import Support from './components/Support'   
import Surprise from './components/Surprise'
import Terms from './components/Terms'
import Vibes from './components/Vibes'
import Watchlist from './components/Watchlist'
import Words from './components/Words'
import Welcome from './components/Welcome'
import SearchTestPage from './components/SearchTestPage'
import Reset from './components/Reset'
import SmartPWAInstall from './components/SmartPWAInstall'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SmartPWAInstall />
        <Routes>
          <Route path="/" element={<Home_Construction />} />
          <Route path="/home" element={<Home />} />
          <Route path="/match" element={<Match />} />
          <Route path="/about" element={<About />} />
          <Route path="/color" element={<Color />} />
          <Route path="/create" element={<Create />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donate" element={<Donate />} />       
          <Route path="/support" element={<Support />} />     
          <Route path="/surprise" element={<Surprise />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/vibes" element={<Vibes />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/words" element={<Words />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/test" element={<SearchTestPage />} />
          <Route path="/reset" element={<Reset />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App