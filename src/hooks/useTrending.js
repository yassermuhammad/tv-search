import { useState, useEffect } from 'react'
import { getTrendingMovies, getTrendingTVShows } from '../services/tmdbApi'

/**
 * Custom hook for fetching trending content
 * @param {string} timeWindow - Time window: 'day' or 'week' (default: 'day')
 * @returns {Object} Trending content state
 */
export const useTrending = (timeWindow = 'day') => {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingTVShows, setTrendingTVShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      setError(null)

      try {
        const [moviesData, showsData] = await Promise.all([
          getTrendingMovies(timeWindow),
          getTrendingTVShows(timeWindow),
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
  }, [timeWindow])

  return {
    trendingMovies,
    trendingTVShows,
    loading,
    error,
  }
}

