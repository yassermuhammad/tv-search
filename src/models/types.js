/**
 * Type definitions and models for the application
 * These are JSDoc type definitions for better IDE support and documentation
 */

/**
 * @typedef {Object} Movie
 * @property {number} id - Movie ID from TMDB
 * @property {string} title - Movie title
 * @property {string} overview - Movie description
 * @property {string} [poster_path] - Poster image path
 * @property {string} [backdrop_path] - Backdrop image path
 * @property {number} [vote_average] - Average rating (0-10)
 * @property {number} [vote_count] - Number of votes
 * @property {string} [release_date] - Release date (YYYY-MM-DD)
 * @property {number} [runtime] - Runtime in minutes
 * @property {Array<Genre>} [genres] - Array of genres
 * @property {string} [original_language] - Original language code
 * @property {Array<ProductionCompany>} [production_companies] - Production companies
 * @property {number} [budget] - Production budget
 * @property {number} [revenue] - Box office revenue
 * @property {string} [imdb_id] - IMDb ID
 */

/**
 * @typedef {Object} TVShow
 * @property {number} id - Show ID from TVMaze
 * @property {string} name - Show name
 * @property {string} [summary] - Show description (HTML)
 * @property {Object} [image] - Image object
 * @property {string} [image.medium] - Medium size image URL
 * @property {string} [image.original] - Original size image URL
 * @property {string} [status] - Show status (Running, Ended, etc.)
 * @property {string} [type] - Show type (Scripted, Reality, etc.)
 * @property {string} [language] - Language
 * @property {Array<string>} [genres] - Array of genre names
 * @property {string} [premiered] - Premiere date (YYYY-MM-DD)
 * @property {string} [ended] - End date (YYYY-MM-DD)
 * @property {number} [runtime] - Runtime per episode in minutes
 * @property {number} [averageRuntime] - Average runtime per episode
 * @property {Object} [rating] - Rating object
 * @property {number} [rating.average] - Average rating (0-10)
 * @property {Object} [network] - Network object
 * @property {string} [network.name] - Network name
 * @property {Object} [network.country] - Network country
 * @property {Object} [webChannel] - Web channel object
 * @property {string} [webChannel.name] - Web channel name
 * @property {Object} [schedule] - Schedule object
 * @property {Array<string>} [schedule.days] - Days of the week
 * @property {string} [schedule.time] - Air time
 * @property {Object} [externals] - External IDs
 * @property {string} [externals.imdb] - IMDb ID
 * @property {string} [url] - TVMaze URL
 */

/**
 * @typedef {Object} Genre
 * @property {number} id - Genre ID
 * @property {string} name - Genre name
 */

/**
 * @typedef {Object} ProductionCompany
 * @property {number} id - Company ID
 * @property {string} name - Company name
 * @property {string} [logo_path] - Logo image path
 * @property {string} [origin_country] - Country code
 */

/**
 * @typedef {Object} Season
 * @property {number} id - Season ID
 * @property {number} number - Season number
 * @property {string} [premiereDate] - Premiere date
 * @property {string} [endDate] - End date
 * @property {number} [episodeOrder] - Number of episodes
 */

/**
 * @typedef {Object} Episode
 * @property {number} id - Episode ID
 * @property {number} number - Episode number
 * @property {string} name - Episode name
 * @property {string} [summary] - Episode description (HTML)
 * @property {string} [airdate] - Air date (YYYY-MM-DD)
 * @property {string} [airtime] - Air time
 * @property {number} [runtime] - Runtime in minutes
 */

/**
 * @typedef {Object} WatchProvider
 * @property {number} provider_id - Provider ID
 * @property {string} provider_name - Provider name
 * @property {string} [logo_path] - Logo image path
 */

/**
 * @typedef {Object} WatchProviders
 * @property {Object<string, CountryProviders>} - Country code as key
 */

/**
 * @typedef {Object} CountryProviders
 * @property {Array<WatchProvider>} [flatrate] - Streaming providers
 * @property {Array<WatchProvider>} [buy] - Buy providers
 * @property {Array<WatchProvider>} [rent] - Rent providers
 */

/**
 * @typedef {('movie'|'show')} MediaType
 */

/**
 * @typedef {Object} WatchlistItem
 * @property {number} id - Item ID
 * @property {MediaType} type - Item type ('movie' or 'show')
 * @property {Movie|TVShow} data - Item data
 * @property {string} addedAt - ISO timestamp when added
 */

/**
 * @typedef {Object} SearchResult
 * @property {number} score - Search relevance score
 * @property {TVShow} show - TV show data (for TVMaze search)
 */

/**
 * @typedef {Object} APIError
 * @property {string} message - Error message
 * @property {number} [status] - HTTP status code
 * @property {Error} [error] - Original error object
 */

