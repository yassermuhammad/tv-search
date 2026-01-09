import { VStack, Alert, AlertIcon } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { searchMovies } from '../../services/tmdbApi'
import { useSearch } from '../../hooks/useSearch'
import SearchInput from '../shared/SearchInput'
import ResultsGrid from '../shared/ResultsGrid'
import EmptyState from '../shared/EmptyState'
import LoadingState from '../shared/LoadingState'
import MovieCard from '../MovieCard'
import { SEARCH_DEBOUNCE_DELAY } from '../../utils/constants'

/**
 * Movies search tab component
 * @param {Object} props - Component props
 * @param {Function} props.onMovieClick - Callback when a movie is clicked
 */
const MoviesTab = ({ onMovieClick }) => {
  const { t } = useTranslation()
  const {
    query,
    setQuery,
    results: movies,
    loading,
    error,
    hasSearched,
  } = useSearch(searchMovies, SEARCH_DEBOUNCE_DELAY)

  return (
    <VStack spacing={{ base: 4, md: 8 }} align="stretch">
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search.placeholderMovies')}
      />

      {error && (
        <Alert
          status="error"
          borderRadius="md"
          bg="rgba(229, 9, 20, 0.2)"
          border="1px solid"
          borderColor="netflix.500"
        >
          <AlertIcon />
          {error}
        </Alert>
      )}

      {loading && <LoadingState message={t('common.loading')} />}

      {!loading && hasSearched && (
        <>
          {movies.length > 0 ? (
            <ResultsGrid
              items={movies}
              renderItem={(movie) => (
                <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
              )}
              itemType="movies"
            />
          ) : (
            <EmptyState
              title={t('search.noMoviesFound')}
              message={t('search.tryDifferentKeyword')}
            />
          )}
        </>
      )}

      {!hasSearched && !loading && (
        <EmptyState
          title={t('search.startSearchingMovies')}
          message={t('search.searchHintMovies')}
        />
      )}
    </VStack>
  )
}

export default MoviesTab

