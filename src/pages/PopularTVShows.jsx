import { Box, Container, Heading, SimpleGrid, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getShowById } from '../services/tvmazeApi'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import ShowCard from '../components/ShowCard'
import LoadingState from '../components/shared/LoadingState'
import EmptyState from '../components/shared/EmptyState'
import SEO from '../components/seo/SEO'
import { useModal } from '../hooks/useModal'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { getPopularTVShows } from '../services/tmdbApi'
import { adaptTMDBShowsToTVMaze } from '../utils/tmdbAdapter'
import { MEDIA_TYPES } from '../models/constants'
import { GRID_COLUMNS } from '../utils/constants'
import { getCollectionPageStructuredData } from '../utils/seoHelpers'

/**
 * Popular TV Shows page with infinite scroll
 * Displays all popular TV shows with pagination
 */
const PopularTVShows = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const modal = useModal()

  // Create fetch function for infinite scroll
  const fetchPopularTVShows = useCallback(async (page) => {
    const data = await getPopularTVShows(page)
    // Convert TMDB format to TVMaze format
    return {
      ...data,
      results: adaptTMDBShowsToTVMaze(data.results || []),
    }
  }, [])

  const {
    items: shows,
    loading,
    loadingMore,
    error,
    hasMore,
    observerTarget,
    loadMore,
  } = useInfiniteScroll(fetchPopularTVShows)

  /**
   * Handles clicking on a TV show
   */
  const handleShowClick = async (show) => {
    modal.setLoading(true)
    modal.openModal(show, MEDIA_TYPES.SHOW)

    try {
      if (show._tmdbData) {
        modal.setSelectedItem(show)
      } else {
        const fullDetails = await getShowById(show.id)
        modal.setSelectedItem(fullDetails)
      }
    } catch (err) {
      console.error('Error fetching show details:', err)
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles back navigation
   */
  const handleBack = () => {
    navigate('/')
  }

  const structuredData = getCollectionPageStructuredData(
    t('pages.popularTVShows'),
    'Discover popular TV shows. Browse the most watched and highly rated series. Watch trailers, explore cast information, and add to your watchlist.',
    shows
  )

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title="Popular TV Shows"
        description="Discover popular TV shows. Browse the most watched and highly rated series. Watch trailers, explore cast information, and add to your watchlist."
        keywords="popular TV shows, best TV shows, top TV shows, highly rated TV shows, most watched TV shows, TV show recommendations"
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
          {t('pages.popularTVShows')}
        </Heading>

        {loading && shows.length === 0 ? (
          <LoadingState message={t('pages.loadingPopularTVShows')} />
        ) : error ? (
          <EmptyState title={t('pages.failedToLoadPopularTVShows')} message={error} />
        ) : shows.length > 0 ? (
          <>
            <SimpleGrid columns={GRID_COLUMNS} spacing={{ base: 4, md: 6 }} mb={8}>
              {shows.map((show) => (
                <ShowCard
                  key={show.id}
                  show={show}
                  onClick={() => handleShowClick(show)}
                />
              ))}
            </SimpleGrid>

            {/* Infinite scroll trigger */}
            {hasMore && (
              <Box ref={observerTarget} py={8} textAlign="center" minH="100px">
                {loadingMore ? (
                  <LoadingState message={t('pages.loadingMoreTVShows')} />
                ) : (
                  <Button
                    onClick={loadMore}
                    colorScheme="netflix"
                    size="lg"
                    isLoading={loadingMore}
                    loadingText={t('common.loading')}
                  >
                    {t('pages.loadMoreTVShows')}
                  </Button>
                )}
              </Box>
            )}
            {!hasMore && shows.length > 0 && (
              <Box py={8} textAlign="center">
                <Box color="rgba(255, 255, 255, 0.6)" fontSize="sm">
                  {t('pages.noMoreTVShows')} ({shows.length} {t('pages.total')})
                </Box>
              </Box>
            )}
          </>
        ) : (
          <EmptyState title={t('pages.noPopularTVShowsFound')} />
        )}
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

export default PopularTVShows

