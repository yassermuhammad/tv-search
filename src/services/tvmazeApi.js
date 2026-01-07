const API_BASE_URL = 'https://api.tvmaze.com'

/**
 * Search for shows by name
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of show results
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
 * @returns {Promise<Object>} Show details
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

