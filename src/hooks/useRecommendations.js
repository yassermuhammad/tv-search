import { useState, useEffect } from 'react'
import {
  getMovieRecommendations,
  getTVRecommendations,
  getTrendingMovies,
  getTrendingTVShows,
} from '../services/tmdbApi'
import { MEDIA_TYPES } from '../models/constants'

/**
 * Deduplicate and merge items by ID
 * @param {Array} items - Array of items with id
 * @returns {Array} Deduplicated array
 */
const deduplicateById = (items) => {
  const seen = new Set()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

/**
 * Custom hook for fetching personalized recommendations
 * Uses watchlist items as seeds when available, otherwise falls back to trending items
 * @param {Array} watchlist - User's watchlist items [{ id, type, ... }]
 * @param {Array} trendingMovies - Trending movies (fallback seeds)
 * @param {Array} trendingTVShows - Trending TV shows (fallback seeds)
 * @returns {Object} Recommendations state
 */
export const useRecommendations = (watchlist = [], trendingMovies = [], trendingTVShows = []) => {
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [recommendedTVShows, setRecommendedTVShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('trending') // 'watchlist' | 'trending'

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      setError(null)

      try {
        const seedItems = []
        const excludeIds = new Set()

        // Use watchlist as seeds if available (up to 3 items)
        if (watchlist.length > 0) {
          setSource('watchlist')
          const seeds = watchlist.slice(0, 3)
          seeds.forEach((item) => {
            seedItems.push({ id: item.id, type: item.type })
            excludeIds.add(item.id)
          })
        } else {
          setSource('trending')
          // Fallback: use trending items as seeds
          if (trendingMovies.length > 0) {
            seedItems.push({ id: trendingMovies[0].id, type: MEDIA_TYPES.MOVIE })
            excludeIds.add(trendingMovies[0].id)
          }
          if (trendingTVShows.length > 0) {
            seedItems.push({ id: trendingTVShows[0].id, type: MEDIA_TYPES.SHOW })
            excludeIds.add(trendingTVShows[0].id)
          }
        }

        if (seedItems.length === 0) {
          setRecommendedMovies([])
          setRecommendedTVShows([])
          setLoading(false)
          return
        }

        const allMovies = []
        const allShows = []

        for (const seed of seedItems) {
          try {
            if (seed.type === MEDIA_TYPES.MOVIE) {
              const data = await getMovieRecommendations(seed.id, 1)
              const results = (data.results || []).filter((m) => !excludeIds.has(m.id))
              allMovies.push(...results)
            } else {
              const data = await getTVRecommendations(seed.id, 1)
              const results = (data.results || []).filter((s) => !excludeIds.has(s.id))
              allShows.push(...results)
            }
          } catch (err) {
            console.warn(`Failed to get recommendations for ${seed.type} ${seed.id}:`, err)
          }
        }

        setRecommendedMovies(deduplicateById(allMovies).slice(0, 20))
        setRecommendedTVShows(deduplicateById(allShows).slice(0, 20))
      } catch (err) {
        setError('Failed to load recommendations')
        console.error('Error fetching recommendations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [
    JSON.stringify(watchlist.slice(0, 3).map((w) => ({ id: w.id, type: w.type }))),
    trendingMovies[0]?.id ?? 0,
    trendingTVShows[0]?.id ?? 0,
  ])

  return {
    recommendedMovies,
    recommendedTVShows,
    loading,
    error,
    source, // 'watchlist' | 'trending'
  }
}
