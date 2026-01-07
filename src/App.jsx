import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Watchlist from './pages/Watchlist'

/**
 * Main App component
 * Sets up routing for the application
 * 
 * Routes:
 * - "/" - Home page with search functionality
 * - "/watchlist" - User's saved shows and movies
 * 
 * @returns {JSX.Element} App component
 */
function App() {
  // Get base path from window location for GitHub Pages
  const basePath = import.meta.env.BASE_URL || '/'
  
  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

