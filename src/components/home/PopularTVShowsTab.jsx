import { Box, Heading } from '@chakra-ui/react'
import { usePopular } from '../../hooks/usePopular'
import ShowCard from '../ShowCard'
import LoadingState from '../shared/LoadingState'
import EmptyState from '../shared/EmptyState'
import { adaptTMDBShowsToTVMaze } from '../../utils/tmdbAdapter'
import HorizontalScrollRow from '../shared/HorizontalScrollRow'

/**
 * Popular TV Shows tab component
 * Displays popular TV shows
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onShowClick - Callback when show is clicked
 */
const PopularTVShowsTab = ({ onShowClick }) => {
  const { popularTVShows: popularTVShowsTMDB, loading, error } = usePopular()
  
  // Convert TMDB format to TVMaze format for compatibility
  const popularTVShows = adaptTMDBShowsToTVMaze(popularTVShowsTMDB)

  return (
    <Box px={{ base: 0, md: 0 }}>
      {/* Header */}
      <Heading
        size={{ base: 'md', md: 'lg' }}
        color="white"
        fontWeight="600"
        mb={{ base: 4, md: 6 }}
        fontSize={{ base: '20px', md: '24px' }}
      >
        Popular TV Shows
      </Heading>

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading popular TV shows..." />
      ) : error ? (
        <EmptyState title="Failed to load popular TV shows" message={error} />
      ) : popularTVShows.length > 0 ? (
        <HorizontalScrollRow
          items={popularTVShows}
          renderItem={(show) => (
            <ShowCard show={show} onClick={() => onShowClick(show)} />
          )}
          spacing="16px"
        />
      ) : (
        <EmptyState title="No popular TV shows found" />
      )}
    </Box>
  )
}

export default PopularTVShowsTab

