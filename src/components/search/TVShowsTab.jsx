import { VStack, Alert, AlertIcon } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
    <VStack spacing={{ base: 4, md: 8 }} align="stretch">
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search.placeholderShows')}
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
              title={t('search.noShowsFound')}
              message={t('search.tryDifferentKeyword')}
            />
          )}
        </>
      )}

      {!hasSearched && !loading && (
        <EmptyState
          title={t('search.startSearchingShows')}
          message={t('search.searchHintShows')}
        />
      )}
    </VStack>
  )
}

export default TVShowsTab

