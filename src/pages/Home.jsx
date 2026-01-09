import { Box, Container, Divider, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getShowById } from '../services/tvmazeApi'
import { getMovieById } from '../services/tmdbApi'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import HeroSection from '../components/shared/HeroSection'
import ContentRow from '../components/home/ContentRow'
import MovieCard from '../components/MovieCard'
import ShowCard from '../components/ShowCard'
import { useModal } from '../hooks/useModal'
import { useTrending } from '../hooks/useTrending'
import { usePopular } from '../hooks/usePopular'
import { MEDIA_TYPES } from '../models/constants'
import { adaptTMDBShowsToTVMaze } from '../utils/tmdbAdapter'

/**
 * Home page component - Redesigned with Trending/Popular features
 * Features:
 * - Tabbed interface for Trending Movies, Trending TV Shows, Popular Movies, Popular TV Shows
 * - Search functionality
 * - Modal for viewing detailed information
 * - Hero section with welcome message
 */
const Home = () => {
  const { t } = useTranslation()
  const modal = useModal()
  const [trendingTimeWindow, setTrendingTimeWindow] = useState('day')
  
  // Fetch trending and popular content
  const {
    trendingMovies,
    trendingTVShows: trendingTVShowsTMDB,
    loading: trendingLoading,
    error: trendingError,
  } = useTrending(trendingTimeWindow)

  const {
    popularMovies,
    popularTVShows: popularTVShowsTMDB,
    loading: popularLoading,
    error: popularError,
  } = usePopular()

  // Convert TMDB TV shows to TVMaze format for compatibility
  const trendingTVShows = adaptTMDBShowsToTVMaze(trendingTVShowsTMDB)
  const popularTVShows = adaptTMDBShowsToTVMaze(popularTVShowsTMDB)

  /**
   * Handles clicking on a TV show
   * Fetches full show details and opens modal
   */
  const handleShowClick = async (show) => {
    modal.setLoading(true)
    modal.openModal(show, MEDIA_TYPES.SHOW)
    
    try {
      // If it's a TMDB show, try to get details from TVMaze if we have the name
      // Otherwise, use the TMDB data we already have
      if (show._tmdbData) {
        // For TMDB shows, we'll use the data we have
        // In the future, we could fetch full TMDB details
        modal.setSelectedItem(show)
      } else {
        // For TVMaze shows, fetch full details
        const fullDetails = await getShowById(show.id)
        modal.setSelectedItem(fullDetails)
      }
    } catch (err) {
      console.error('Error fetching show details:', err)
      // Keep the basic show data if detailed fetch fails
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles clicking on a movie
   * Fetches full movie details and opens modal
   */
  const handleMovieClick = async (movie) => {
    modal.setLoading(true)
    modal.openModal(movie, MEDIA_TYPES.MOVIE)
    
    try {
      const fullDetails = await getMovieById(movie.id)
      modal.setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching movie details:', err)
      // Keep the basic movie data if detailed fetch fails
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles clicking on a similar item in the detail modal
   * Closes current modal and opens a new one with the similar item
   */
  const handleSimilarItemClick = async (item, itemType) => {
    modal.closeModal()
    // Small delay to allow modal to close smoothly
    setTimeout(() => {
      if (itemType === MEDIA_TYPES.MOVIE) {
        handleMovieClick(item)
      } else {
        handleShowClick(item)
      }
    }, 100)
  }

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <Header />

      <Container
        maxW="container.xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        {/* Hero section */}
        <HeroSection />

        <Divider borderColor="rgba(255, 255, 255, 0.1)" my={{ base: 4, md: 6 }} />

        {/* Content Rows - Horizontal Scrolling */}
        <VStack spacing={0} align="stretch">
          {/* Trending Movies Row */}
          <ContentRow
            title={t('home.trendingMovies')}
            items={trendingMovies}
            renderItem={(movie) => (
              <MovieCard movie={movie} onClick={() => handleMovieClick(movie)} />
            )}
            loading={trendingLoading}
            error={trendingError}
            showTimeWindow
            timeWindow={trendingTimeWindow}
            onTimeWindowChange={setTrendingTimeWindow}
            viewAllPath={`/trending/movies?timeWindow=${trendingTimeWindow}`}
          />

          {/* Trending TV Shows Row */}
          <ContentRow
            title={t('home.trendingTVShows')}
            items={trendingTVShows}
            renderItem={(show) => (
              <ShowCard show={show} onClick={() => handleShowClick(show)} />
            )}
            loading={trendingLoading}
            error={trendingError}
            showTimeWindow
            timeWindow={trendingTimeWindow}
            onTimeWindowChange={setTrendingTimeWindow}
            viewAllPath={`/trending/tv-shows?timeWindow=${trendingTimeWindow}`}
          />

          {/* Popular Movies Row */}
          <ContentRow
            title={t('home.popularMovies')}
            items={popularMovies}
            renderItem={(movie) => (
              <MovieCard movie={movie} onClick={() => handleMovieClick(movie)} />
            )}
            loading={popularLoading}
            error={popularError}
            viewAllPath="/popular/movies"
          />

          {/* Popular TV Shows Row */}
          <ContentRow
            title={t('home.popularTVShows')}
            items={popularTVShows}
            renderItem={(show) => (
              <ShowCard show={show} onClick={() => handleShowClick(show)} />
            )}
            loading={popularLoading}
            error={popularError}
            viewAllPath="/popular/tv-shows"
          />
        </VStack>
      </Container>

      {/* Detail Modal */}
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

export default Home
