import { useState, useEffect } from 'react'
import { getTrendingMovies, getTrendingTVShows } from '../services/tmdbApi'

/**
 * Custom hook for fetching trending content
 * @param {string} timeWindow - Time window: 'day' or 'week' (default: 'day')
 * @param {string|null} region - Region code (e.g. 'US') or 'WW' / null for worldwide
 * @returns {Object} Trending content state
 */
export const useTrending = (timeWindow = 'day', region = null) => {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingTVShows, setTrendingTVShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const effectiveRegion = region && region !== 'WW' ? region : null

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      setError(null)

      try {
        const [moviesData, showsData] = await Promise.all([
          getTrendingMovies(timeWindow, 1, effectiveRegion),
          getTrendingTVShows(timeWindow, 1, effectiveRegion),
        ])
        
        setTrendingMovies(moviesData.results || moviesData)
        setTrendingTVShows(showsData.results || showsData)
      } catch (err) {
        setError('Failed to load trending content')
        console.error('Error fetching trending content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [timeWindow, effectiveRegion])

  return {
    trendingMovies,
    trendingTVShows,
    loading,
    error,
  }
}

