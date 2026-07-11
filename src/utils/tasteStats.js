/**
 * Taste statistics utilities
 * Computes an aggregate "taste profile" from a user's watchlist so it can be
 * rendered into a shareable card.
 */

import { MEDIA_TYPES } from '../models/constants'
import { API_CONFIG } from './constants'

/**
 * Static TMDB genre id -> name map (movie + TV combined).
 * Used to resolve `genre_ids` on list-shaped items that don't include
 * a full `genres` array. Names are stable across TMDB.
 */
const TMDB_GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  // TV-specific ids
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
}

/**
 * Maps a dominant genre to a fun persona i18n key.
 * The value is the suffix used under `tasteCard.personas.<key>`.
 */
const GENRE_PERSONA_KEY = {
  Action: 'action',
  'Action & Adventure': 'action',
  Adventure: 'adventure',
  Animation: 'animation',
  Comedy: 'comedy',
  Crime: 'crime',
  Documentary: 'documentary',
  Drama: 'drama',
  Family: 'family',
  Fantasy: 'fantasy',
  History: 'history',
  Horror: 'horror',
  Music: 'music',
  Mystery: 'mystery',
  Romance: 'romance',
  'Science Fiction': 'sciFi',
  'Sci-Fi & Fantasy': 'sciFi',
  Thriller: 'thriller',
  War: 'war',
  'War & Politics': 'war',
  Western: 'western',
  Reality: 'reality',
}

/**
 * Extracts genre names from a single item's data object.
 * Handles TVMaze string arrays, TMDB `genres` object arrays, TMDB `genre_ids`
 * number arrays, and nested `_tmdbData`.
 * @param {Object} data - Watchlist item data
 * @returns {Array<string>} Genre names
 */
const extractGenreNames = (data) => {
  if (!data) return []

  let genres = data.genres
  if ((!genres || genres.length === 0) && data._tmdbData?.genres) {
    genres = data._tmdbData.genres
  }

  const names = []

  if (Array.isArray(genres)) {
    genres.forEach((genre) => {
      if (typeof genre === 'string') names.push(genre)
      else if (genre && typeof genre === 'object' && genre.name) names.push(genre.name)
    })
  }

  // Fall back to genre_ids when no resolved genre names are available
  if (names.length === 0) {
    const ids = data.genre_ids || data._tmdbData?.genre_ids
    if (Array.isArray(ids)) {
      ids.forEach((id) => {
        const name = TMDB_GENRE_MAP[id]
        if (name) names.push(name)
      })
    }
  }

  return names
}

/**
 * Gets a numeric rating (0-10) from an item, supporting TMDB and TVMaze shapes.
 * @param {Object} data - Item data
 * @returns {number|null} Rating or null
 */
const extractRating = (data) => {
  if (!data) return null
  if (typeof data.vote_average === 'number' && data.vote_average > 0) {
    return data.vote_average
  }
  const tvmazeRating = data.rating?.average
  if (typeof tvmazeRating === 'number' && tvmazeRating > 0) {
    return tvmazeRating
  }
  return null
}

/**
 * Gets a release year from an item, supporting TMDB and TVMaze shapes.
 * @param {Object} data - Item data
 * @returns {number|null} Four-digit year or null
 */
const extractYear = (data) => {
  if (!data) return null
  const dateStr =
    data.release_date || data.first_air_date || data.premiered || data._tmdbData?.first_air_date
  if (!dateStr) return null
  const year = parseInt(String(dateStr).slice(0, 4), 10)
  return Number.isFinite(year) ? year : null
}

/**
 * Gets a poster image URL from an item, supporting TMDB and TVMaze shapes.
 * @param {Object} data - Item data
 * @returns {string|null} Poster URL or null
 */
const extractPoster = (data) => {
  if (!data) return null
  const path = data.poster_path || data._tmdbData?.poster_path
  if (path) return `${API_CONFIG.TMDB_IMAGE_BASE_URL}${path}`
  return data.image?.original || data.image?.medium || null
}

/**
 * Gets a display title from an item.
 * @param {Object} data - Item data
 * @returns {string} Title
 */
const extractTitle = (data) => {
  if (!data) return ''
  return data.title || data.name || data.original_title || data.original_name || ''
}

/**
 * Computes a taste profile from a watchlist.
 *
 * @param {Array<{id: number, type: string, data: Object}>} watchlist - Watchlist items
 * @returns {{
 *   totalCount: number,
 *   movieCount: number,
 *   showCount: number,
 *   topGenres: Array<{name: string, count: number, percent: number}>,
 *   topGenre: string|null,
 *   personaKey: string,
 *   avgRating: number|null,
 *   topRatedTitle: string|null,
 *   topDecade: string|null,
 *   posters: Array<string>,
 *   isEmpty: boolean,
 * }} Taste profile
 */
export const computeTasteProfile = (watchlist = []) => {
  const items = Array.isArray(watchlist) ? watchlist : []

  const movieCount = items.filter((i) => i.type === MEDIA_TYPES.MOVIE).length
  const showCount = items.filter((i) => i.type === MEDIA_TYPES.SHOW).length

  const genreCounts = new Map()
  const decadeCounts = new Map()
  const ratings = []
  let topRated = { title: null, rating: -1 }
  const posterCandidates = []

  items.forEach((item) => {
    const data = item?.data
    if (!data) return

    extractGenreNames(data).forEach((name) => {
      genreCounts.set(name, (genreCounts.get(name) || 0) + 1)
    })

    const rating = extractRating(data)
    if (rating !== null) {
      ratings.push(rating)
      if (rating > topRated.rating) {
        topRated = { title: extractTitle(data), rating }
      }
    }

    const year = extractYear(data)
    if (year) {
      const decade = `${Math.floor(year / 10) * 10}s`
      decadeCounts.set(decade, (decadeCounts.get(decade) || 0) + 1)
    }

    const poster = extractPoster(data)
    if (poster) {
      posterCandidates.push({ poster, rating: rating ?? 0 })
    }
  })

  const totalGenreMentions = Array.from(genreCounts.values()).reduce((a, b) => a + b, 0)

  const topGenres = Array.from(genreCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percent: totalGenreMentions > 0 ? Math.round((count / totalGenreMentions) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 5)

  const topGenre = topGenres.length > 0 ? topGenres[0].name : null
  const personaKey = (topGenre && GENRE_PERSONA_KEY[topGenre]) || 'default'

  const avgRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null

  const topDecade =
    Array.from(decadeCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  const posters = posterCandidates
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map((p) => p.poster)

  return {
    totalCount: items.length,
    movieCount,
    showCount,
    topGenres,
    topGenre,
    personaKey,
    avgRating,
    topRatedTitle: topRated.title,
    topDecade,
    posters,
    isEmpty: items.length === 0,
  }
}
