import { Box, Heading, SimpleGrid } from '@chakra-ui/react'
import { usePopular } from '../../hooks/usePopular'
import ShowCard from '../ShowCard'
import LoadingState from '../shared/LoadingState'
import EmptyState from '../shared/EmptyState'
import { adaptTMDBShowsToTVMaze } from '../../utils/tmdbAdapter'
import { GRID_COLUMNS, ANIMATION_DELAYS } from '../../utils/constants'

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
        <SimpleGrid columns={GRID_COLUMNS} spacing={{ base: 4, md: 6 }}>
          {popularTVShows.map((show, index) => (
            <Box
              key={show.id}
              sx={{
                animation: `fadeIn 0.6s ease-out ${index * ANIMATION_DELAYS.CARD_STAGGER}s both`,
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <ShowCard show={show} onClick={() => onShowClick(show)} />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <EmptyState title="No popular TV shows found" />
      )}
    </Box>
  )
}

export default PopularTVShowsTab

