import { API_CONFIG } from '../utils/constants'

/**
 * TMDB API Service
 * Free API key can be obtained from https://www.themoviedb.org/settings/api
 * Set via environment variable: VITE_TMDB_API_KEY
 */
const API_BASE_URL = API_CONFIG.TMDB_BASE_URL
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '1f54bd990f1cdfb230adb312546d765d'
const IMAGE_BASE_URL = API_CONFIG.TMDB_IMAGE_BASE_URL

/**
 * Search for movies by name
 * @param {string} query - Search query
 * @returns {Promise<Array<Movie>>} Array of movie results
 */
export const searchMovies = async (query) => {
  if (!query || query.trim() === '') {
    return []
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error searching movies:', error)
    throw error
  }
}

/**
 * Get movie details by ID
 * @param {number} movieId - Movie ID
 * @returns {Promise<Movie>} Movie details
 */
export const getMovieById = async (movieId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching movie:', error)
    throw error
  }
}

/**
 * Get full image URL
 * @param {string} path - Image path from TMDB
 * @returns {string} Full image URL
 */
export const getImageUrl = (path) => {
  if (!path) return null
  return `${IMAGE_BASE_URL}${path}`
}

/**
 * Get watch providers (streaming platforms) for a movie
 * @param {number} movieId - Movie ID
 * @returns {Promise<WatchProviders>} Watch providers data
 */
export const getMovieWatchProviders = async (movieId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || {}
  } catch (error) {
    console.error('Error fetching movie watch providers:', error)
    throw error
  }
}

/**
 * Get watch providers (streaming platforms) for a TV show
 * @param {number} tvId - TV Show ID
 * @returns {Promise<WatchProviders>} Watch providers data
 */
export const getTVWatchProviders = async (tvId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tv/${tvId}/watch/providers?api_key=${API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || {}
  } catch (error) {
    console.error('Error fetching TV watch providers:', error)
    throw error
  }
}

/**
 * Search for TV show by name to get TMDB ID
 * @param {string} query - TV show name
 * @returns {Promise<TVShow|null>} First matching TV show or null
 */
export const searchTVShow = async (query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results && data.results.length > 0 ? data.results[0] : null
  } catch (error) {
    console.error('Error searching TV show:', error)
    return null
  }
}

