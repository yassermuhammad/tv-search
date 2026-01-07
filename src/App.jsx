import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Watchlist from './pages/Watchlist'
import Search from './pages/Search'
import TrendingMovies from './pages/TrendingMovies'
import TrendingTVShows from './pages/TrendingTVShows'
import PopularMovies from './pages/PopularMovies'
import PopularTVShows from './pages/PopularTVShows'

/**
 * Main App component
 * Sets up routing for the application
 * 
 * Routes:
 * - "/" - Home page with trending/popular content
 * - "/search" - Dedicated search page for TV shows and movies
 * - "/watchlist" - User's saved shows and movies
 * - "/trending/movies" - All trending movies with infinite scroll
 * - "/trending/tv-shows" - All trending TV shows with infinite scroll
 * - "/popular/movies" - All popular movies with infinite scroll
 * - "/popular/tv-shows" - All popular TV shows with infinite scroll
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
        <Route path="/trending/movies" element={<TrendingMovies />} />
        <Route path="/trending/tv-shows" element={<TrendingTVShows />} />
        <Route path="/popular/movies" element={<PopularMovies />} />
        <Route path="/popular/tv-shows" element={<PopularTVShows />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

