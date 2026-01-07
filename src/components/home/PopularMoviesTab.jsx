import { Box, Heading } from '@chakra-ui/react'
import { usePopular } from '../../hooks/usePopular'
import MovieCard from '../MovieCard'
import LoadingState from '../shared/LoadingState'
import EmptyState from '../shared/EmptyState'
import HorizontalScrollRow from '../shared/HorizontalScrollRow'

/**
 * Popular Movies tab component
 * Displays popular movies
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onMovieClick - Callback when movie is clicked
 */
const PopularMoviesTab = ({ onMovieClick }) => {
  const { popularMovies, loading, error } = usePopular()

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
        Popular Movies
      </Heading>

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading popular movies..." />
      ) : error ? (
        <EmptyState title="Failed to load popular movies" message={error} />
      ) : popularMovies.length > 0 ? (
        <HorizontalScrollRow
          items={popularMovies}
          renderItem={(movie) => (
            <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
          )}
          spacing="16px"
        />
      ) : (
        <EmptyState title="No popular movies found" />
      )}
    </Box>
  )
}

export default PopularMoviesTab

