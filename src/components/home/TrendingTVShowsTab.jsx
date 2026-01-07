import { Box, Heading, HStack, Button } from '@chakra-ui/react'
import { useState } from 'react'
import { useTrending } from '../../hooks/useTrending'
import ShowCard from '../ShowCard'
import LoadingState from '../shared/LoadingState'
import EmptyState from '../shared/EmptyState'
import { adaptTMDBShowsToTVMaze } from '../../utils/tmdbAdapter'
import HorizontalScrollRow from '../shared/HorizontalScrollRow'

/**
 * Trending TV Shows tab component
 * Displays trending TV shows with day/week toggle
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onShowClick - Callback when show is clicked
 */
const TrendingTVShowsTab = ({ onShowClick }) => {
  const [timeWindow, setTimeWindow] = useState('day')
  const { trendingTVShows: trendingTVShowsTMDB, loading, error } = useTrending(timeWindow)
  
  // Convert TMDB format to TVMaze format for compatibility
  const trendingTVShows = adaptTMDBShowsToTVMaze(trendingTVShowsTMDB)

  return (
    <Box px={{ base: 0, md: 0 }}>
      {/* Header with time window toggle */}
      <HStack
        justify="space-between"
        align={{ base: 'flex-start', sm: 'center' }}
        mb={{ base: 4, md: 6 }}
        direction={{ base: 'column', sm: 'row' }}
        spacing={{ base: 3, sm: 0 }}
        gap={{ base: 3, sm: 0 }}
      >
        <Heading
          size={{ base: 'md', md: 'lg' }}
          color="white"
          fontWeight="600"
          fontSize={{ base: '20px', md: '24px' }}
        >
          Trending TV Shows
        </Heading>
        <HStack spacing={2} w={{ base: '100%', sm: 'auto' }}>
          <Button
            size={{ base: 'xs', md: 'sm' }}
            variant={timeWindow === 'day' ? 'solid' : 'ghost'}
            colorScheme={timeWindow === 'day' ? 'netflix' : 'gray'}
            onClick={() => setTimeWindow('day')}
            _hover={{
              bg: timeWindow === 'day' ? 'netflix.600' : 'rgba(255, 255, 255, 0.1)',
            }}
            flex={{ base: 1, sm: 'none' }}
            fontSize={{ base: '12px', md: '14px' }}
          >
            Today
          </Button>
          <Button
            size={{ base: 'xs', md: 'sm' }}
            variant={timeWindow === 'week' ? 'solid' : 'ghost'}
            colorScheme={timeWindow === 'week' ? 'netflix' : 'gray'}
            onClick={() => setTimeWindow('week')}
            _hover={{
              bg: timeWindow === 'week' ? 'netflix.600' : 'rgba(255, 255, 255, 0.1)',
            }}
            flex={{ base: 1, sm: 'none' }}
            fontSize={{ base: '12px', md: '14px' }}
          >
            This Week
          </Button>
        </HStack>
      </HStack>

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading trending TV shows..." />
      ) : error ? (
        <EmptyState title="Failed to load trending TV shows" message={error} />
      ) : trendingTVShows.length > 0 ? (
        <HorizontalScrollRow
          items={trendingTVShows}
          renderItem={(show) => (
            <ShowCard show={show} onClick={() => onShowClick(show)} />
          )}
          spacing="16px"
        />
      ) : (
        <EmptyState title="No trending TV shows found" />
      )}
    </Box>
  )
}

export default TrendingTVShowsTab

