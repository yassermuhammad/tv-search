/**
 * Utility functions to generate watch provider URLs
 * These URLs help users navigate to streaming platforms to watch content
 */

/**
 * Provider URL generators
 * Maps provider IDs to functions that generate URLs
 */
const PROVIDER_URL_GENERATORS = {
  // Netflix
  8: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.netflix.com/search?q=${searchQuery}`
  },
  
  // Amazon Prime Video
  9: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.amazon.com/s?k=${searchQuery}&i=prime-instant-video`
  },
  
  // Disney Plus
  337: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.apps.disneyplus.com/eg/search?search_query=${searchQuery}`
  },
  
  // Hulu
  15: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.hulu.com/search?q=${searchQuery}`
  },
  
  // HBO Max
  384: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.hbomax.com/search?q=${searchQuery}`
  },
  
  // Apple TV Plus
  350: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://tv.apple.com/search?term=${searchQuery}`
  },
  
  // Paramount Plus
  531: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.paramountplus.com/search/?q=${searchQuery}`
  },
  
  // Peacock
  386: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.peacocktv.com/search?q=${searchQuery}`
  },
  
  // YouTube
  192: (title, type) => {
    const searchQuery = encodeURIComponent(`${title} ${type === 'movie' ? 'movie' : 'tv show'}`)
    return `https://www.youtube.com/results?search_query=${searchQuery}`
  },
  
  // Google Play Movies
  3: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://play.google.com/store/search?q=${searchQuery}&c=movies`
  },
  
  // iTunes
  2: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.apple.com/apple-tv-plus/search?q=${searchQuery}`
  },
  
  // Vudu
  7: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.vudu.com/content/search/${searchQuery}`
  },
  
  // Microsoft Store
  68: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.microsoft.com/en-us/store/search?q=${searchQuery}`
  },
  
  // FandangoNOW
  105: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.fandangonow.com/search?q=${searchQuery}`
  },
  
  // AMC+
  528: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.amcplus.com/search?q=${searchQuery}`
  },
  
  // Showtime
  37: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.sho.com/search?q=${searchQuery}`
  },
  
  // Starz
  318: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.starz.com/search?q=${searchQuery}`
  },
  
  // Crunchyroll
  283: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.crunchyroll.com/search?q=${searchQuery}`
  },
  
  // Funimation
  269: (title, type) => {
    const searchQuery = encodeURIComponent(title)
    return `https://www.funimation.com/search?q=${searchQuery}`
  },
}

/**
 * Generates a watch provider URL for a given provider and content
 * @param {number} providerId - Provider ID from TMDB
 * @param {string} providerName - Provider name
 * @param {string} contentTitle - Title of the movie or TV show
 * @param {string} contentType - 'movie' or 'tv'
 * @returns {string|null} URL to the provider's page for this content, or null if not supported
 */
export const getProviderUrl = (providerId, providerName, contentTitle, contentType) => {
  // Check if we have a URL generator for this provider
  if (PROVIDER_URL_GENERATORS[providerId]) {
    return PROVIDER_URL_GENERATORS[providerId](contentTitle, contentType)
  }
  
  // Fallback: Try to create a generic search URL for known providers
  const providerNameLower = providerName.toLowerCase()
  const searchQuery = encodeURIComponent(contentTitle)
  
  // Common patterns for providers we don't have specific generators for
  if (providerNameLower.includes('netflix')) {
    return `https://www.netflix.com/search?q=${searchQuery}`
  }
  if (providerNameLower.includes('amazon') || providerNameLower.includes('prime')) {
    return `https://www.amazon.com/s?k=${searchQuery}&i=prime-instant-video`
  }
  if (providerNameLower.includes('disney')) {
    return `https://www.disneyplus.com/search?q=${searchQuery}`
  }
  if (providerNameLower.includes('hulu')) {
    return `https://www.hulu.com/search?q=${searchQuery}`
  }
  if (providerNameLower.includes('hbo')) {
    return `https://www.hbomax.com/search?q=${searchQuery}`
  }
  if (providerNameLower.includes('apple')) {
    return `https://tv.apple.com/search?term=${searchQuery}`
  }
  
  // If no match, return null (link won't be clickable)
  return null
}
