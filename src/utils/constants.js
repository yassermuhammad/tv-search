/**
 * Application constants
 */

// Animation constants
export const ANIMATION_DELAYS = {
  CARD_STAGGER: 0.1, // Delay between card animations in seconds
  FADE_IN: 0.6, // Fade in animation duration
  SLIDE_IN: 0.5, // Slide in animation duration
}

// Search constants
export const SEARCH_DEBOUNCE_DELAY = 500 // milliseconds
export const MIN_SEARCH_LENGTH = 1 // Minimum characters for search

// Layout constants
export const GRID_COLUMNS = {
  base: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
}

export const CARD_HEIGHT = '280px'
export const POSTER_HEIGHT = '400px'

// Color constants
export const COLORS = {
  BACKGROUND: '#141414',
  MODAL_BG: '#1a1a1a',
  TEXT_PRIMARY: 'rgba(255, 255, 255, 0.9)',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.7)',
  TEXT_TERTIARY: 'rgba(255, 255, 255, 0.5)',
  NETFLIX_RED: '#E50914',
  NETFLIX_RED_HOVER: '#cc0811',
}

// Legacy exports for backward compatibility
export const MODAL_BG_COLOR = COLORS.MODAL_BG
export const TEXT_COLOR = COLORS.TEXT_PRIMARY

// Storage keys
export const STORAGE_KEYS = {
  WATCHLIST: 'watchpedia-watchlist',
}

// API constants
export const API_CONFIG = {
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  TMDB_IMAGE_BASE_URL_ORIGINAL: 'https://image.tmdb.org/t/p/original',
  TVMAZE_BASE_URL: 'https://api.tvmaze.com',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
}

// External links
export const EXTERNAL_LINKS = {
  TMDB_MOVIE: (id) => `https://www.themoviedb.org/movie/${id}`,
  TMDB_TV: (id) => `https://www.themoviedb.org/tv/${id}`,
  IMDB: (id) => `https://www.imdb.com/title/${id}`,
}

// Date formats
export const DATE_FORMATS = {
  YEAR_ONLY: { year: 'numeric' },
  FULL_DATE: { year: 'numeric', month: 'long', day: 'numeric' },
  LOCALE: 'en-US',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 20,
}

// Validation
export const VALIDATION = {
  MIN_RATING: 0,
  MAX_RATING: 10,
}
