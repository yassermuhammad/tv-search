import { useState, useEffect } from 'react'
import { getPopularMovies, getPopularTVShows } from '../services/tmdbApi'

/**
 * Custom hook for fetching popular content
 * @param {number} page - Page number (default: 1)
 * @param {string|null} region - Region code (e.g. 'US') or 'WW' / null for worldwide
 * @returns {Object} Popular content state
 */
export const usePopular = (page = 1, region = null) => {
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTVShows, setPopularTVShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const effectiveRegion = region && region !== 'WW' ? region : null

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true)
      setError(null)

      try {
        const [moviesData, showsData] = await Promise.all([
          getPopularMovies(page, effectiveRegion),
          getPopularTVShows(page, effectiveRegion),
        ])
        
        setPopularMovies(moviesData.results || moviesData)
        setPopularTVShows(showsData.results || showsData)
      } catch (err) {
        setError('Failed to load popular content')
        console.error('Error fetching popular content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPopular()
  }, [page, effectiveRegion])

  return {
    popularMovies,
    popularTVShows,
    loading,
    error,
  }
}

