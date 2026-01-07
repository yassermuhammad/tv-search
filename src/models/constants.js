/**
 * Model-related constants
 */

/**
 * Media types
 */
export const MEDIA_TYPES = {
  MOVIE: 'movie',
  SHOW: 'show',
}

/**
 * TV Show statuses
 */
export const SHOW_STATUS = {
  RUNNING: 'Running',
  ENDED: 'Ended',
  TO_BE_DETERMINED: 'To Be Determined',
  IN_DEVELOPMENT: 'In Development',
  CANCELLED: 'Cancelled',
}

/**
 * Show types
 */
export const SHOW_TYPE = {
  SCRIPTED: 'Scripted',
  REALITY: 'Reality',
  DOCUMENTARY: 'Documentary',
  NEWS: 'News',
  TALK_SHOW: 'Talk Show',
  VARIETY: 'Variety',
  GAME_SHOW: 'Game Show',
  ANIMATION: 'Animation',
}

/**
 * Watch provider types
 */
export const PROVIDER_TYPE = {
  FLATRATE: 'flatrate', // Streaming/subscription
  BUY: 'buy', // Purchase
  RENT: 'rent', // Rental
}

/**
 * Rating thresholds for color coding
 */
export const RATING_THRESHOLDS = {
  EXCELLENT: 7.0,
  GOOD: 5.0,
  POOR: 0,
}

/**
 * Status color mapping
 */
export const STATUS_COLORS = {
  [SHOW_STATUS.RUNNING]: 'green',
  [SHOW_STATUS.ENDED]: 'red',
  [SHOW_STATUS.TO_BE_DETERMINED]: 'yellow',
  [SHOW_STATUS.IN_DEVELOPMENT]: 'blue',
  [SHOW_STATUS.CANCELLED]: 'gray',
}

/**
 * Provider color schemes
 */
export const PROVIDER_COLORS = {
  [PROVIDER_TYPE.FLATRATE]: 'green',
  [PROVIDER_TYPE.BUY]: 'blue',
  [PROVIDER_TYPE.RENT]: 'purple',
}

