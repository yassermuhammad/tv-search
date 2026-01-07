import { Box, Heading, HStack, Button, SimpleGrid } from '@chakra-ui/react'
import { useState } from 'react'
import { useTrending } from '../../hooks/useTrending'
import MovieCard from '../MovieCard'
import LoadingState from '../shared/LoadingState'
import EmptyState from '../shared/EmptyState'
import { GRID_COLUMNS, ANIMATION_DELAYS } from '../../utils/constants'

/**
 * Trending Movies tab component
 * Displays trending movies with day/week toggle
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onMovieClick - Callback when movie is clicked
 */
const TrendingMoviesTab = ({ onMovieClick }) => {
  const [timeWindow, setTimeWindow] = useState('day')
  const { trendingMovies, loading, error } = useTrending(timeWindow)

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
          Trending Movies
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
        <LoadingState message="Loading trending movies..." />
      ) : error ? (
        <EmptyState title="Failed to load trending movies" message={error} />
      ) : trendingMovies.length > 0 ? (
        <SimpleGrid columns={GRID_COLUMNS} spacing={{ base: 4, md: 6 }}>
          {trendingMovies.map((movie, index) => (
            <Box
              key={movie.id}
              sx={{
                animation: `fadeIn 0.6s ease-out ${index * ANIMATION_DELAYS.CARD_STAGGER}s both`,
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <EmptyState title="No trending movies found" />
      )}
    </Box>
  )
}

export default TrendingMoviesTab

