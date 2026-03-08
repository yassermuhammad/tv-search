import { Box, Container, Divider, VStack, Button, HStack, Text, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getShowById } from '../services/tvmazeApi'
import { getMovieById, getRandomContent, getTVShowById } from '../services/tmdbApi'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import HeroSection from '../components/shared/HeroSection'
import ContentRow from '../components/home/ContentRow'
import MovieCard from '../components/MovieCard'
import ShowCard from '../components/ShowCard'
import NotificationPermission from '../components/shared/NotificationPermission'
import SEO from '../components/seo/SEO'
import { useModal } from '../hooks/useModal'
import { useTrending } from '../hooks/useTrending'
import { usePopular } from '../hooks/usePopular'
import { useRegion } from '../contexts/RegionContext'
import { MEDIA_TYPES } from '../models/constants'
import { adaptTMDBShowsToTVMaze } from '../utils/tmdbAdapter'
import { getWebsiteStructuredData } from '../utils/seoHelpers'
import { testNotification, hasNotificationPermission } from '../services/notificationService'

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
  const toast = useToast()
  const { region } = useRegion()
  const [trendingTimeWindow, setTrendingTimeWindow] = useState('day')
  const [isRandomLoading, setIsRandomLoading] = useState(false)
  const [isTestingNotification, setIsTestingNotification] = useState(false)
  
  const structuredData = getWebsiteStructuredData()
  
  // Fetch trending and popular content (region-aware)
  const {
    trendingMovies,
    trendingTVShows: trendingTVShowsTMDB,
    loading: trendingLoading,
    error: trendingError,
  } = useTrending(trendingTimeWindow, region)

  const {
    popularMovies,
    popularTVShows: popularTVShowsTMDB,
    loading: popularLoading,
    error: popularError,
  } = usePopular(1, region)

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

  /**
   * Handles clicking the random button
   * Fetches a random movie or TV show and opens it in the modal
   */
  const handleRandomClick = async () => {
    setIsRandomLoading(true)
    try {
      // Randomly choose between movie and TV show
      const randomType = Math.random() > 0.5 ? 'movie' : 'tv'
      const randomContent = await getRandomContent(randomType)
      
      if (!randomContent) {
        throw new Error('No random content found')
      }

      if (randomType === 'movie') {
        await handleMovieClick(randomContent)
      } else {
        // For TV shows, fetch full details from TMDB first
        const fullDetails = await getTVShowById(randomContent.id)
        // Adapt TMDB format to TVMaze format for compatibility
        const adaptedShow = adaptTMDBShowsToTVMaze([fullDetails])[0]
        // Store full TMDB data for use in modal
        adaptedShow._tmdbData = fullDetails
        await handleShowClick(adaptedShow)
      }
    } catch (error) {
      console.error('Error fetching random content:', error)
      // You could show a toast notification here
    } finally {
      setIsRandomLoading(false)
    }
  }

  /**
   * Handles testing notification
   * Schedules a REAL DEVICE NOTIFICATION after 10 seconds (not just a toast)
   */
  const handleTestNotification = async () => {
    if (!hasNotificationPermission()) {
      toast({
        title: 'Permission Required',
        description: 'Please enable notifications first using the banner above.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    setIsTestingNotification(true)
    try {
      toast({
        title: '📱 Device Notification Scheduled',
        description: 'You will receive a REAL device notification in 10 seconds. Keep this tab open! The notification will appear in your system notifications.',
        status: 'info',
        duration: 6000,
        isClosable: true,
      })

      // Schedule the real device notification
      await testNotification(10)
      
      // Note: The notification itself is the confirmation - no need for another toast
      // The device notification will appear in the system notification area
      console.log('Device notification sent - check your system notifications!')
    } catch (error) {
      console.error('Error testing notification:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to send device notification. Make sure notifications are enabled in your browser settings.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsTestingNotification(false)
    }
  }

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title="WatchPedia - Discover Trending Movies & TV Shows"
        description="Discover trending movies and TV shows. Browse popular content, watch trailers, explore cast information, and manage your watchlist. Your ultimate entertainment guide."
        keywords="trending movies, trending TV shows, popular movies, popular TV shows, watchlist, entertainment, streaming, movie database, TV show database"
        structuredData={structuredData}
      />
      <Header />

      <Container
        maxW="container.xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        {/* Notification Permission Banner */}
        <NotificationPermission />

        {/* Test Notification Button */}
        {hasNotificationPermission() && (
          <Box mb={4}>
            <HStack 
              spacing={3} 
              p={{ base: 3, md: 4 }} 
              bg="rgba(59, 130, 246, 0.1)" 
              borderRadius="md" 
              border="1px solid rgba(59, 130, 246, 0.3)"
              flexWrap="wrap"
              flexDirection={{ base: 'column', md: 'row' }}
              align={{ base: 'stretch', md: 'center' }}
            >
              <VStack align={{ base: 'stretch', md: 'flex-start' }} spacing={1} flex={1} minW="200px">
                <Text fontSize={{ base: 'sm', md: 'sm' }} color="rgba(255, 255, 255, 0.9)" fontWeight="medium">
                  🧪 Test Device Notifications
                </Text>
                <Text fontSize="xs" color="rgba(255, 255, 255, 0.7)">
                  Click to receive a REAL device notification (system/browser notification) in 10 seconds. This will appear in your device's notification center, not just in the app.
                </Text>
              </VStack>
              <Button
                size={{ base: 'md', md: 'sm' }}
                colorScheme="blue"
                variant="outline"
                onClick={handleTestNotification}
                isLoading={isTestingNotification}
                loadingText="Scheduling..."
                flexShrink={0}
                width={{ base: '100%', md: 'auto' }}
                minW={{ base: 'auto', md: '150px' }}
              >
                Test Device Notification
              </Button>
            </HStack>
          </Box>
        )}

        {/* Hero section */}
        <HeroSection 
          onRandomClick={handleRandomClick}
          isRandomLoading={isRandomLoading}
        />

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
