import { useState, useEffect } from 'react'
import { getUpcomingMovies, getOnTheAirTVShows, discoverMoviesByDateRange } from '../services/tmdbApi'

/**
 * Custom hook for fetching upcoming movies and TV shows
 * @param {string} type - 'all', 'movies', or 'tv-shows'
 * @returns {Object} Object containing upcoming content, loading state, and error
 */
export const useUpcoming = (type = 'all') => {
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [upcomingTVShows, setUpcomingTVShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true)
      setError(null)

      try {
        const promises = []

        if (type === 'all' || type === 'movies') {
          // Fetch upcoming movies (near future) and also discover movies for the rest of the year
          const now = new Date()
          const currentYear = now.getFullYear()
          const endOfYear = `${currentYear}-12-31`
          const startDate = now.toISOString().split('T')[0] // Today's date
          
          // Fetch from upcoming endpoint (near future releases)
          const moviePromises = []
          for (let page = 1; page <= 5; page++) {
            moviePromises.push(getUpcomingMovies(page))
          }
          
          // Also fetch from discover endpoint for the rest of the year
          const discoverPromises = []
          for (let page = 1; page <= 10; page++) {
            discoverPromises.push(discoverMoviesByDateRange(page, startDate, endOfYear))
          }
          
          promises.push(
            Promise.all([...moviePromises, ...discoverPromises]).then((allPages) => {
              // Combine all pages and remove duplicates
              const allMovies = []
              const seenIds = new Set()
              allPages.forEach((pageData) => {
                (pageData.results || []).forEach((movie) => {
                  // Only include movies with release dates in the future
                  if (movie.release_date && !seenIds.has(movie.id)) {
                    const releaseDate = new Date(movie.release_date)
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    releaseDate.setHours(0, 0, 0, 0)
                    
                    // Only include future releases
                    if (releaseDate >= today) {
                      seenIds.add(movie.id)
                      allMovies.push(movie)
                    }
                  }
                })
              })
              return {
                type: 'movies',
                data: allMovies,
              }
            })
          )
        }

        if (type === 'all' || type === 'tv-shows') {
          // Fetch multiple pages to get more results (up to 5 pages = ~100 TV shows)
          const tvPromises = []
          for (let page = 1; page <= 5; page++) {
            tvPromises.push(getOnTheAirTVShows(page))
          }
          promises.push(
            Promise.all(tvPromises).then((pages) => {
              // Combine all pages and remove duplicates
              const allShows = []
              const seenIds = new Set()
              pages.forEach((pageData) => {
                (pageData.results || []).forEach((show) => {
                  if (!seenIds.has(show.id)) {
                    seenIds.add(show.id)
                    allShows.push(show)
                  }
                })
              })
              return {
                type: 'tv-shows',
                data: allShows,
              }
            })
          )
        }

        const results = await Promise.all(promises)

        results.forEach((result) => {
          if (result.type === 'movies') {
            setUpcomingMovies(result.data)
          } else if (result.type === 'tv-shows') {
            setUpcomingTVShows(result.data)
          }
        })
      } catch (err) {
        console.error('Error fetching upcoming content:', err)
        setError(err.message || 'Failed to fetch upcoming content')
      } finally {
        setLoading(false)
      }
    }

    fetchUpcoming()
  }, [type])

  return {
    upcomingMovies,
    upcomingTVShows,
    loading,
    error,
  }
}
