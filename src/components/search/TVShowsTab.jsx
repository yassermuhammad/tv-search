import { VStack, Alert, AlertIcon } from '@chakra-ui/react'
import { searchShows } from '../../services/tvmazeApi'
import { useSearch } from '../../hooks/useSearch'
import SearchInput from '../shared/SearchInput'
import ResultsGrid from '../shared/ResultsGrid'
import EmptyState from '../shared/EmptyState'
import LoadingState from '../shared/LoadingState'
import ShowCard from '../ShowCard'
import { SEARCH_DEBOUNCE_DELAY } from '../../utils/constants'

/**
 * TV Shows search tab component
 * @param {Object} props - Component props
 * @param {Function} props.onShowClick - Callback when a show is clicked
 */
const TVShowsTab = ({ onShowClick }) => {
  const performShowSearch = async (query) => {
    const results = await searchShows(query)
    return results.map((item) => item.show)
  }

  const {
    query,
    setQuery,
    results: shows,
    loading,
    error,
    hasSearched,
  } = useSearch(performShowSearch, SEARCH_DEBOUNCE_DELAY)

  return (
    <VStack spacing={8} align="stretch">
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a TV show or series..."
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

      {loading && <LoadingState message="Searching shows..." />}

      {!loading && hasSearched && (
        <>
          {shows.length > 0 ? (
            <ResultsGrid
              items={shows}
              renderItem={(show) => (
                <ShowCard show={show} onClick={() => onShowClick(show)} />
              )}
              itemType="shows"
            />
          ) : (
            <EmptyState
              title="No shows found"
              message="Try searching with a different keyword"
            />
          )}
        </>
      )}

      {!hasSearched && !loading && (
        <EmptyState
          title="Start searching for TV shows"
          message="Type a show name in the search box above"
        />
      )}
    </VStack>
  )
}

export default TVShowsTab

