import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LoadingState from './components/shared/LoadingState'
import AnalyticsTracker from './components/shared/AnalyticsTracker'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Watchlist = lazy(() => import('./pages/Watchlist'))
const Search = lazy(() => import('./pages/Search'))
const TrendingMovies = lazy(() => import('./pages/TrendingMovies'))
const TrendingTVShows = lazy(() => import('./pages/TrendingTVShows'))
const PopularMovies = lazy(() => import('./pages/PopularMovies'))
const PopularTVShows = lazy(() => import('./pages/PopularTVShows'))
const SimilarMovies = lazy(() => import('./pages/SimilarMovies'))
const SimilarTVShows = lazy(() => import('./pages/SimilarTVShows'))
const Share = lazy(() => import('./pages/Share'))
const Person = lazy(() => import('./pages/Person'))

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
 * - "/share/:type/:id" - Share page that opens detail modal
 * 
 * @returns {JSX.Element} App component
 */
function App() {
  // Get base path from window location for GitHub Pages
  const basePath = import.meta.env.BASE_URL || '/'

  return (
    <BrowserRouter 
      basename={basePath}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <AnalyticsTracker />
      <Suspense fallback={<LoadingState message="Loading..." />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/trending/movies" element={<TrendingMovies />} />
          <Route path="/trending/tv-shows" element={<TrendingTVShows />} />
          <Route path="/popular/movies" element={<PopularMovies />} />
          <Route path="/popular/tv-shows" element={<PopularTVShows />} />
          <Route path="/similar/movies/:movieId" element={<SimilarMovies />} />
          <Route path="/similar/tv-shows/:tvId" element={<SimilarTVShows />} />
          <Route path="/person/:personId" element={<Person />} />
          <Route path="/share/:type/:id" element={<Share />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

