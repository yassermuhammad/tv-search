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
 * Get TV show details by ID
 * @param {number} tvId - TV Show ID
 * @returns {Promise<TVShow>} TV show details
 */
export const getTVShowById = async (tvId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching TV show:', error)
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

/**
 * Get trending movies
 * @param {string} timeWindow - Time window: 'day' or 'week' (default: 'day')
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Object with results array and pagination info
 */
export const getTrendingMovies = async (timeWindow = 'day', page = 1) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=en-US&page=${page}`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      results: data.results || [],
      totalPages: data.total_pages || 1,
      page: data.page || 1,
    }
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    throw error
  }
}

/**
 * Get trending TV shows
 * @param {string} timeWindow - Time window: 'day' or 'week' (default: 'day')
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Object with results array and pagination info
 */
export const getTrendingTVShows = async (timeWindow = 'day', page = 1) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/trending/tv/${timeWindow}?api_key=${API_KEY}&language=en-US&page=${page}`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      results: data.results || [],
      totalPages: data.total_pages || 1,
      page: data.page || 1,
    }
  } catch (error) {
    console.error('Error fetching trending TV shows:', error)
    throw error
  }
}

/**
 * Get popular movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Object with results array and pagination info
 */
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      results: data.results || [],
      totalPages: data.total_pages || 1,
      page: data.page || 1,
    }
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    throw error
  }
}

/**
 * Get popular TV shows
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Object with results array and pagination info
 */
export const getPopularTVShows = async (page = 1) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      results: data.results || [],
      totalPages: data.total_pages || 1,
      page: data.page || 1,
    }
  } catch (error) {
    console.error('Error fetching popular TV shows:', error)
    throw error
  }
}

/**
 * Get movie credits (cast and crew)
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Object with cast and crew arrays
 */
export const getMovieCredits = async (movieId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      cast: data.cast || [],
      crew: data.crew || [],
    }
  } catch (error) {
    console.error('Error fetching movie credits:', error)
    throw error
  }
}

/**
 * Get TV show credits (cast and crew)
 * @param {number} tvId - TV Show ID
 * @returns {Promise<Object>} Object with cast and crew arrays
 */
export const getTVCredits = async (tvId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tv/${tvId}/credits?api_key=${API_KEY}&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      cast: data.cast || [],
      crew: data.crew || [],
    }
  } catch (error) {
    console.error('Error fetching TV credits:', error)
    throw error
  }
}

/**
 * Get movie videos (trailers, teasers, etc.)
 * @param {number} movieId - Movie ID
 * @returns {Promise<Array>} Array of video objects
 */
export const getMovieVideos = async (movieId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error fetching movie videos:', error)
    throw error
  }
}

/**
 * Get TV show videos (trailers, teasers, etc.)
 * @param {number} tvId - TV Show ID
 * @returns {Promise<Array>} Array of video objects
 */
export const getTVVideos = async (tvId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error fetching TV videos:', error)
    throw error
  }
}

/**
 * Get similar movies
 * @param {number} movieId - Movie ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Object with results array and pagination info
 */
export const getSimilarMovies = async (movieId, page = 1) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=${page}`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      results: data.results || [],
      totalPages: data.total_pages || 1,
      page: data.page || 1,
    }
  } catch (error) {
    console.error('Error fetching similar movies:', error)
    throw error
  }
}

/**
 * Get similar TV shows
 * @param {number} tvId - TV Show ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Object with results array and pagination info
 */
export const getSimilarTVShows = async (tvId, page = 1) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tv/${tvId}/similar?api_key=${API_KEY}&language=en-US&page=${page}`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      results: data.results || [],
      totalPages: data.total_pages || 1,
      page: data.page || 1,
    }
  } catch (error) {
    console.error('Error fetching similar TV shows:', error)
    throw error
  }
}

/**
 * Get movies from a collection
 * @param {number} collectionId - Collection ID
 * @returns {Promise<Array>} Array of movies in the collection
 */
export const getCollectionMovies = async (collectionId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/collection/${collectionId}?api_key=${API_KEY}&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.parts || []
  } catch (error) {
    console.error('Error fetching collection movies:', error)
    return []
  }
}

