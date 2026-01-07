import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Watchlist from './pages/Watchlist'
import Search from './pages/Search'

/**
 * Main App component
 * Sets up routing for the application
 * 
 * Routes:
 * - "/" - Home page with trending/popular content
 * - "/search" - Dedicated search page for TV shows and movies
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
        <Route path="/search" element={<Search />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

