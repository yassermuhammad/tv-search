/**
 * Adapter utilities for converting TMDB TV show data to TVMaze format
 * This allows us to reuse ShowCard and other components that expect TVMaze format
 */

/**
 * Converts TMDB TV show data to TVMaze-like format
 * @param {Object} tmdbShow - TV show from TMDB API
 * @returns {Object} TV show in TVMaze-like format
 */
export const adaptTMDBShowToTVMaze = (tmdbShow) => {
  return {
    id: tmdbShow.id,
    name: tmdbShow.name,
    summary: tmdbShow.overview || '',
    image: tmdbShow.poster_path
      ? {
          medium: `https://image.tmdb.org/t/p/w342${tmdbShow.poster_path}`,
          original: `https://image.tmdb.org/t/p/original${tmdbShow.poster_path}`,
        }
      : null,
    status: tmdbShow.status || 'Unknown',
    type: tmdbShow.type || 'Scripted',
    language: tmdbShow.original_language || 'en',
    genres: tmdbShow.genres?.map((g) => (typeof g === 'object' ? g.name : g)) || [],
    premiered: tmdbShow.first_air_date || null,
    ended: tmdbShow.last_air_date || null,
    runtime: tmdbShow.episode_run_time?.[0] || null,
    averageRuntime: tmdbShow.episode_run_time?.[0] || null,
    rating: tmdbShow.vote_average
      ? {
          average: tmdbShow.vote_average,
        }
      : null,
    network: tmdbShow.networks?.[0]
      ? {
          name: tmdbShow.networks[0].name,
          country: tmdbShow.networks[0].origin_country
            ? {
                name: tmdbShow.networks[0].origin_country,
              }
            : null,
        }
      : null,
    webChannel: tmdbShow.networks?.find((n) => n.origin_country === 'US') || null,
    schedule: null,
    externals: {
      imdb: tmdbShow.external_ids?.imdb_id || null,
    },
    url: `https://www.themoviedb.org/tv/${tmdbShow.id}`,
    // Store original TMDB data for later use
    _tmdbData: tmdbShow,
  }
}

/**
 * Converts array of TMDB TV shows to TVMaze-like format
 * @param {Array} tmdbShows - Array of TV shows from TMDB API
 * @returns {Array} Array of TV shows in TVMaze-like format
 */
export const adaptTMDBShowsToTVMaze = (tmdbShows) => {
  return tmdbShows.map(adaptTMDBShowToTVMaze)
}

