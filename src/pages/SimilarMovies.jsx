import { Box, Container, Heading, SimpleGrid, Button } from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useState, useEffect } from 'react'
import { getMovieById, getSimilarMovies } from '../services/tmdbApi'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import MovieCard from '../components/MovieCard'
import LoadingState from '../components/shared/LoadingState'
import EmptyState from '../components/shared/EmptyState'
import SEO from '../components/seo/SEO'
import { useModal } from '../hooks/useModal'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { MEDIA_TYPES } from '../models/constants'
import { GRID_COLUMNS } from '../utils/constants'
import { getCollectionPageStructuredData } from '../utils/seoHelpers'

/**
 * Similar Movies page with infinite scroll
 * Displays all similar movies for a given movie ID
 */
const SimilarMovies = () => {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const modal = useModal()
  const [movie, setMovie] = useState(null)

  // Fetch movie details for SEO
  useEffect(() => {
    const fetchMovie = async () => {
      if (movieId) {
        try {
          const movieData = await getMovieById(parseInt(movieId))
          setMovie(movieData)
        } catch (error) {
          console.error('Error fetching movie for SEO:', error)
        }
      }
    }
    fetchMovie()
  }, [movieId])

  // Create fetch function for infinite scroll
  const fetchSimilarMovies = useCallback(async (page) => {
    if (!movieId) return { results: [], totalPages: 1, page: 1 }
    return await getSimilarMovies(parseInt(movieId), page)
  }, [movieId])

  const {
    items: movies,
    loading,
    loadingMore,
    error,
    hasMore,
    observerTarget,
    loadMore,
  } = useInfiniteScroll(fetchSimilarMovies)

  /**
   * Handles clicking on a movie
   */
  const handleMovieClick = async (movie) => {
    modal.setLoading(true)
    modal.openModal(movie, MEDIA_TYPES.MOVIE)

    try {
      const fullDetails = await getMovieById(movie.id)
      modal.setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching movie details:', err)
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles similar item click from modal
   */
  const handleSimilarItemClick = async (movie, itemType) => {
    modal.setLoading(true)
    modal.openModal(movie, itemType)

    try {
      const fullDetails = await getMovieById(movie.id)
      modal.setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching movie details:', err)
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles back navigation
   */
  const handleBack = () => {
    navigate(-1)
  }

  const structuredData = getCollectionPageStructuredData(
    `Similar Movies${movie ? ` to ${movie.title}` : ''}`,
    movie
      ? `Discover movies similar to ${movie.title}. Find recommendations based on ${movie.title}.`
      : 'Discover similar movies. Find recommendations based on your favorite films.',
    movies
  )

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title={`Similar Movies${movie ? ` to ${movie.title}` : ''}`}
        description={movie
          ? `Discover movies similar to ${movie.title}. Find recommendations based on ${movie.title}. Watch trailers, explore cast information, and add to your watchlist.`
          : 'Discover similar movies. Find recommendations based on your favorite films.'}
        keywords={`similar movies, movie recommendations, ${movie?.title || ''}, similar films, movie suggestions`}
        structuredData={structuredData}
      />
      <Header showBackButton onBack={handleBack} />

      <Container
        maxW="container.xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        <Heading
          size={{ base: 'lg', md: 'xl' }}
          color="white"
          fontWeight="bold"
          mb={{ base: 4, md: 6 }}
        >
          Similar Movies
        </Heading>

        {loading && movies.length === 0 ? (
          <LoadingState message="Loading similar movies..." />
        ) : error ? (
          <EmptyState title="Failed to load similar movies" message={error} />
        ) : movies.length > 0 ? (
          <>
            <SimpleGrid columns={GRID_COLUMNS} spacing={{ base: 4, md: 6 }} mb={8}>
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                />
              ))}
            </SimpleGrid>

            {/* Infinite scroll trigger */}
            {hasMore && (
              <Box ref={observerTarget} py={8} textAlign="center" minH="100px">
                {loadingMore ? (
                  <LoadingState message="Loading more movies..." />
                ) : (
                  <Button
                    onClick={loadMore}
                    colorScheme="netflix"
                    size="lg"
                    isLoading={loadingMore}
                    loadingText="Loading..."
                  >
                    Load More Movies
                  </Button>
                )}
              </Box>
            )}
            {!hasMore && movies.length > 0 && (
              <Box py={8} textAlign="center">
                <Box color="rgba(255, 255, 255, 0.6)" fontSize="sm">
                  No more movies to load ({movies.length} total)
                </Box>
              </Box>
            )}
          </>
        ) : (
          <EmptyState title="No similar movies found" />
        )}
      </Container>

      {/* Detail Modal */}
      <DetailModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        item={modal.selectedItem}
        type={modal.itemType}
        isLoading={modal.loadingDetails}
        onItemClick={handleSimilarItemClick}
      />
    </Box>
  )
}

export default SimilarMovies

