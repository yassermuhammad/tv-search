/**
 * Filter-related constants and enums
 * Used for advanced search filtering functionality
 */

/**
 * Sort options for search results
 */
export const SORT_OPTIONS = {
  POPULARITY_DESC: 'popularity.desc',
  POPULARITY_ASC: 'popularity.asc',
  RELEASE_DATE_DESC: 'release_date.desc',
  RELEASE_DATE_ASC: 'release_date.asc',
  VOTE_AVERAGE_DESC: 'vote_average.desc',
  VOTE_AVERAGE_ASC: 'vote_average.asc',
  TITLE_ASC: 'title.asc',
  TITLE_DESC: 'title.desc',
}

/**
 * Sort option labels for display
 */
export const SORT_LABELS = {
  [SORT_OPTIONS.POPULARITY_DESC]: 'Popularity (High to Low)',
  [SORT_OPTIONS.POPULARITY_ASC]: 'Popularity (Low to High)',
  [SORT_OPTIONS.RELEASE_DATE_DESC]: 'Release Date (Newest)',
  [SORT_OPTIONS.RELEASE_DATE_ASC]: 'Release Date (Oldest)',
  [SORT_OPTIONS.VOTE_AVERAGE_DESC]: 'Rating (High to Low)',
  [SORT_OPTIONS.VOTE_AVERAGE_ASC]: 'Rating (Low to High)',
  [SORT_OPTIONS.TITLE_ASC]: 'Title (A-Z)',
  [SORT_OPTIONS.TITLE_DESC]: 'Title (Z-A)',
}

/**
 * Default sort option
 */
export const DEFAULT_SORT = SORT_OPTIONS.POPULARITY_DESC

/**
 * Minimum and maximum years for year range filter
 */
export const YEAR_RANGE = {
  MIN: 1900,
  MAX: new Date().getFullYear() + 1, // Include next year for upcoming releases
}

/**
 * Minimum and maximum rating values
 */
export const RATING_RANGE = {
  MIN: 0,
  MAX: 10,
  STEP: 0.5,
}

/**
 * Default minimum rating filter
 */
export const DEFAULT_MIN_RATING = 0

/**
 * Common languages for filtering
 */
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'th', name: 'Thai' },
]

/**
 * Default language filter
 */
export const DEFAULT_LANGUAGE = 'en'

/**
 * Common countries for filtering
 */
export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'RU', name: 'Russia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'PL', name: 'Poland' },
]

/**
 * Default filter state
 */
export const DEFAULT_FILTERS = {
  genres: [],
  yearFrom: null,
  yearTo: null,
  minRating: DEFAULT_MIN_RATING,
  language: DEFAULT_LANGUAGE,
  country: null,
  sortBy: DEFAULT_SORT,
}

