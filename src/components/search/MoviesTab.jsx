import { VStack, Alert, AlertIcon } from '@chakra-ui/react'
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
        placeholder="Search for a movie..."
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

      {loading && <LoadingState message="Searching movies..." />}

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
              title="No movies found"
              message="Try searching with a different keyword"
            />
          )}
        </>
      )}

      {!hasSearched && !loading && (
        <EmptyState
          title="Start searching for movies"
          message="Type a movie name in the search box above"
        />
      )}
    </VStack>
  )
}

export default MoviesTab

