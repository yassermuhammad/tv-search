import { Box, Container, Heading, SimpleGrid, Button } from '@chakra-ui/react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getMovieById, getTVShowById, getMovieGenres, getTVGenres, discoverMoviesByGenre, discoverTVShowsByGenre } from '../services/tmdbApi'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import MovieCard from '../components/MovieCard'
import ShowCard from '../components/ShowCard'
import LoadingState from '../components/shared/LoadingState'
import EmptyState from '../components/shared/EmptyState'
import SEO from '../components/seo/SEO'
import { useModal } from '../hooks/useModal'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { adaptTMDBShowsToTVMaze } from '../utils/tmdbAdapter'
import { MEDIA_TYPES } from '../models/constants'

/**
 * Genre browse page
 * - /genre - Landing page with genre grid (movies and TV)
 * - /genre/movies/:genreId - Movies for a genre
 * - /genre/tv-shows/:genreId - TV shows for a genre
 */
const Genre = () => {
  const { t } = useTranslation()
  const { genreId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const pathname = location.pathname
  const type = pathname.includes('/tv-shows/') ? 'tv-shows' : pathname.includes('/movies/') ? 'movies' : null
  const modal = useModal()

  const [movieGenres, setMovieGenres] = useState([])
  const [tvGenres, setTVGenres] = useState([])
  const [genresLoading, setGenresLoading] = useState(true)
  const [genreName, setGenreName] = useState('')

  const isLanding = !genreId && !type
  const isMovies = type === 'movies'
  const isTVShows = type === 'tv-shows'

  // Fetch genre lists for landing page
  useEffect(() => {
    if (!isLanding) return

    const fetchGenres = async () => {
      setGenresLoading(true)
      try {
        const [movies, tv] = await Promise.all([getMovieGenres(), getTVGenres()])
        setMovieGenres(movies)
        setTVGenres(tv)
      } catch (err) {
        console.error('Error fetching genres:', err)
      } finally {
        setGenresLoading(false)
      }
    }

    fetchGenres()
  }, [isLanding])

  // Resolve genre name when viewing a specific genre
  useEffect(() => {
    if (isLanding || !genreId) return

    const fetchGenreName = async () => {
      try {
        const genres = isMovies ? await getMovieGenres() : await getTVGenres()
        const genre = genres.find((g) => g.id === parseInt(genreId, 10))
        setGenreName(genre?.name || '')
      } catch (err) {
        console.error('Error fetching genre name:', err)
      }
    }

    fetchGenreName()
  }, [genreId, isMovies, isLanding])

  // Create fetch function for infinite scroll (no-op when on landing page)
  const fetchByGenre = useCallback(
    async (page) => {
      if (isLanding || !genreId) {
        return { results: [], totalPages: 1, page: 1 }
      }
      if (isMovies) {
        return await discoverMoviesByGenre(parseInt(genreId, 10), page)
      }
      return await discoverTVShowsByGenre(parseInt(genreId, 10), page)
    },
    [genreId, isMovies, isLanding]
  )

  const {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    observerTarget,
    loadMore,
  } = useInfiniteScroll(fetchByGenre, { initialPage: 1 })

  const movies = isMovies ? items : []
  const tvShows = isTVShows ? adaptTMDBShowsToTVMaze(items) : []

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

  const handleShowClick = async (show) => {
    modal.setLoading(true)
    modal.openModal(show, MEDIA_TYPES.SHOW)
    try {
      const fullDetails = await getTVShowById(show.id)
      const adaptedShow = adaptTMDBShowsToTVMaze([fullDetails])[0]
      adaptedShow._tmdbData = fullDetails
      modal.setSelectedItem(adaptedShow)
    } catch (err) {
      console.error('Error fetching show details:', err)
    } finally {
      modal.setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/genre')
  }

  const handleGenreClick = (genre, mediaType) => {
    navigate(`/genre/${mediaType}/${genre.id}`)
  }

  if (isLanding) {
    return (
      <Box minH="100vh" bg="#141414" position="relative">
        <SEO
          title={t('genre.title')}
          description={t('genre.subtitle')}
          keywords="genres, movie genres, TV genres, browse by genre, action, comedy, drama, horror"
        />
        <Header showBackButton onBack={() => navigate('/')} />

        <Container
          maxW="container.xl"
          py={{ base: 4, md: 8 }}
          px={{ base: 4, md: 6, lg: 8 }}
        >
          <Heading
            size={{ base: 'lg', md: 'xl' }}
            color="white"
            fontWeight="bold"
            mb={2}
          >
            {t('genre.title')}
          </Heading>
          <Box color="gray.400" mb={{ base: 4, md: 6 }} fontSize="md">
            {t('genre.subtitle')}
          </Box>

          {genresLoading ? (
            <LoadingState message={t('common.loading')} />
          ) : (
            <>
              <Heading size="md" color="white" mb={4} fontWeight="600">
                {t('genre.movieGenres')}
              </Heading>
              <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={3} mb={8}>
                {movieGenres.map((genre) => (
                  <Box
                    key={`movie-${genre.id}`}
                    as="button"
                    p={4}
                    bg="gray.800"
                    borderRadius="md"
                    color="white"
                    textAlign="left"
                    fontWeight="500"
                    _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
                    transition="all 0.2s"
                    onClick={() => handleGenreClick(genre, 'movies')}
                  >
                    {genre.name}
                  </Box>
                ))}
              </SimpleGrid>

              <Heading size="md" color="white" mb={4} fontWeight="600">
                {t('genre.tvGenres')}
              </Heading>
              <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={3}>
                {tvGenres.map((genre) => (
                  <Box
                    key={`tv-${genre.id}`}
                    as="button"
                    p={4}
                    bg="gray.800"
                    borderRadius="md"
                    color="white"
                    textAlign="left"
                    fontWeight="500"
                    _hover={{ bg: 'gray.700', transform: 'scale(1.02)' }}
                    transition="all 0.2s"
                    onClick={() => handleGenreClick(genre, 'tv-shows')}
                  >
                    {genre.name}
                  </Box>
                ))}
              </SimpleGrid>
            </>
          )}
        </Container>
      </Box>
    )
  }

  // Genre content page (movies or TV shows)
  const pageTitle = genreName
    ? `${genreName} ${isMovies ? t('watchlist.movies') : t('watchlist.tvShows')}`
    : t('genre.title')

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title={`${pageTitle} - WatchPedia`}
        description={`Browse ${genreName} ${isMovies ? 'movies' : 'TV shows'}. Discover the best ${genreName.toLowerCase()} content.`}
        keywords={`${genreName}, ${genreName} movies, ${genreName} TV shows, ${genreName} films`}
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
          {genreName} {isMovies ? t('watchlist.movies') : t('watchlist.tvShows')}
        </Heading>

        {loading && items.length === 0 ? (
          <LoadingState
            message={
              isMovies ? t('pages.loadingPopularMovies') : t('pages.loadingPopularTVShows')
            }
          />
        ) : error ? (
          <EmptyState
            title={
              isMovies ? t('pages.failedToLoadPopularMovies') : t('pages.failedToLoadPopularTVShows')
            }
            message={error}
          />
        ) : (isMovies ? movies : tvShows).length > 0 ? (
          <>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} spacing={{ base: 4, md: 6 }} mb={8}>
              {isMovies
                ? movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => handleMovieClick(movie)}
                    />
                  ))
                : tvShows.map((show) => (
                    <ShowCard
                      key={show.id}
                      show={show}
                      onClick={() => handleShowClick(show)}
                    />
                  ))}
            </SimpleGrid>

            {hasMore && (
              <Box ref={observerTarget} py={8} textAlign="center" minH="100px">
                {loadingMore ? (
                  <LoadingState
                    message={
                      isMovies ? t('pages.loadingMoreMovies') : t('pages.loadingMoreTVShows')
                    }
                  />
                ) : (
                  <Button
                    onClick={loadMore}
                    colorScheme="netflix"
                    size="lg"
                    isLoading={loadingMore}
                    loadingText={t('common.loading')}
                  >
                    {isMovies ? t('pages.loadMoreMovies') : t('pages.loadMoreTVShows')}
                  </Button>
                )}
              </Box>
            )}
            {!hasMore && items.length > 0 && (
              <Box py={8} textAlign="center">
                <Box color="rgba(255, 255, 255, 0.6)" fontSize="sm">
                  {t('pages.noMoreMovies')} ({items.length} {t('pages.total')})
                </Box>
              </Box>
            )}
          </>
        ) : (
          <EmptyState
            title={
              isMovies ? t('pages.noPopularMoviesFound') : t('pages.noPopularTVShowsFound')
            }
          />
        )}
      </Container>

      <DetailModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        item={modal.selectedItem}
        type={modal.itemType}
        isLoading={modal.loadingDetails}
      />
    </Box>
  )
}

export default Genre
