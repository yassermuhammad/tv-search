/**
 * SEO Helper Functions
 * Utilities for generating structured data and SEO metadata
 */

const BASE_URL = 'https://yassermuhammad.github.io/tv-search'

/**
 * Generate Website structured data
 */
export const getWebsiteStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WatchPedia',
    alternateName: 'WatchPedia - TV Shows & Movies Search',
    url: BASE_URL,
    description: 'Discover and search for your favorite TV shows and movies. Find trending content, popular titles, watch trailers, and manage your watchlist.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WatchPedia',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/icon-512x512.png`,
      },
    },
  }
}

/**
 * Generate Movie structured data
 */
export const getMovieStructuredData = (movie) => {
  if (!movie) return null

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `${BASE_URL}/icon-512x512.png`

  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title || movie.name,
    description: movie.overview || movie.summary,
    image: imageUrl,
    datePublished: movie.release_date || movie.first_air_date,
    aggregateRating: movie.vote_average
      ? {
          '@type': 'AggregateRating',
          ratingValue: movie.vote_average,
          bestRating: '10',
          worstRating: '0',
          ratingCount: movie.vote_count || 0,
        }
      : undefined,
    genre: movie.genres?.map((g) => (typeof g === 'object' ? g.name : g)) || [],
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    url: `${BASE_URL}/share/movie/${movie.id}`,
  }
}

/**
 * Generate TV Show structured data
 */
export const getTVShowStructuredData = (show) => {
  if (!show) return null

  const imageUrl = show.poster_path || show.image?.medium
    ? show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : show.image.medium
    : `${BASE_URL}/icon-512x512.png`

  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.name,
    description: show.overview || show.summary,
    image: imageUrl,
    datePublished: show.first_air_date || show.premiered,
    aggregateRating: show.vote_average
      ? {
          '@type': 'AggregateRating',
          ratingValue: show.vote_average,
          bestRating: '10',
          worstRating: '0',
          ratingCount: show.vote_count || 0,
        }
      : undefined,
    genre: show.genres?.map((g) => (typeof g === 'object' ? g.name : g)) || [],
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    url: `${BASE_URL}/share/show/${show.id}`,
  }
}

/**
 * Generate Person structured data
 */
export const getPersonStructuredData = (person) => {
  if (!person) return null

  const imageUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : `${BASE_URL}/icon-512x512.png`

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    description: person.biography,
    image: imageUrl,
    birthDate: person.birthday,
    deathDate: person.deathday || undefined,
    birthPlace: person.place_of_birth
      ? {
          '@type': 'Place',
          name: person.place_of_birth,
        }
      : undefined,
    jobTitle: person.known_for_department,
    url: `${BASE_URL}/person/${person.id}`,
  }
}

/**
 * Generate BreadcrumbList structured data
 */
export const getBreadcrumbStructuredData = (items) => {
  if (!items || items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate Organization structured data
 */
export const getOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WatchPedia',
    url: BASE_URL,
    logo: `${BASE_URL}/icon-512x512.png`,
    description: 'Your ultimate guide to TV shows and movies. Discover trending content, popular titles, and manage your watchlist.',
    sameAs: [
      // Add social media links when available
      // 'https://twitter.com/watchpedia',
      // 'https://facebook.com/watchpedia',
    ],
  }
}

/**
 * Generate CollectionPage structured data for listing pages
 */
export const getCollectionPageStructuredData = (title, description, items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    about: {
      '@type': 'ItemList',
      numberOfItems: items?.length || 0,
      itemListElement: items?.slice(0, 10).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': item.media_type === 'movie' ? 'Movie' : 'TVSeries',
          name: item.title || item.name,
          url: `${BASE_URL}/share/${item.media_type === 'movie' ? 'movie' : 'show'}/${item.id}`,
        },
      })) || [],
    },
  }
}
