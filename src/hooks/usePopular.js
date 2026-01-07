import { useState, useEffect } from 'react'
import { getPopularMovies, getPopularTVShows } from '../services/tmdbApi'

/**
 * Custom hook for fetching popular content
 * @param {number} page - Page number (default: 1)
 * @returns {Object} Popular content state
 */
export const usePopular = (page = 1) => {
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTVShows, setPopularTVShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true)
      setError(null)

      try {
        const [movies, shows] = await Promise.all([
          getPopularMovies(page),
          getPopularTVShows(page),
        ])
        
        setPopularMovies(movies)
        setPopularTVShows(shows)
      } catch (err) {
        setError('Failed to load popular content')
        console.error('Error fetching popular content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPopular()
  }, [page])

  return {
    popularMovies,
    popularTVShows,
    loading,
    error,
  }
}

