import { API_CONFIG } from '../utils/constants'

/**
 * TVMaze API Service
 * Public API - no authentication required
 */
const API_BASE_URL = API_CONFIG.TVMAZE_BASE_URL

/**
 * Search for shows by name
 * @param {string} query - Search query
 * @returns {Promise<Array<SearchResult>>} Array of show results
 */
export const searchShows = async (query) => {
  if (!query || query.trim() === '') {
    return []
  }

  try {
    const response = await fetch(`${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching shows:', error)
    throw error
  }
}

/**
 * Get show details by ID
 * @param {number} showId - Show ID
 * @returns {Promise<TVShow>} Show details
 */
export const getShowById = async (showId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shows/${showId}`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching show:', error)
    throw error
  }
}

/**
 * Get all seasons for a show
 * @param {number} showId - Show ID
 * @returns {Promise<Array<Season>>} Array of seasons
 */
export const getShowSeasons = async (showId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shows/${showId}/seasons`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching seasons:', error)
    throw error
  }
}

/**
 * Get all episodes for a season
 * @param {number} seasonId - Season ID
 * @returns {Promise<Array<Episode>>} Array of episodes
 */
export const getSeasonEpisodes = async (seasonId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/seasons/${seasonId}/episodes`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching episodes:', error)
    throw error
  }
}

