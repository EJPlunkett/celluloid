import { useNavigate } from 'react-router-dom'

export const useNavigation = () => {
  const navigate = useNavigate()

  return {
    goToHome: () => navigate('/'),
    goToMatch: () => navigate('/match'),
    goToAbout: () => navigate('/about'),
    goToColor: () => navigate('/color'),
    goToCreate: () => navigate('/create'),
    goToCards: (data) => navigate('/cards', { state: data }),
    goToLogin: () => navigate('/login'),
    goToDonate: () => navigate('/donate'),
    goToSurprise: () => navigate('/surprise'),
    goToTerms: () => navigate('/terms'),
    goToVibes: () => navigate('/vibes'),
    goToWatchlist: () => navigate('/watchlist'),
    goToWords: () => navigate('/words'),
    goToWelcome: (data) => navigate('/welcome', { state: data }) // ADD THIS LINE
  }
}