import { Box, Container, Heading, SimpleGrid, Button } from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useState, useEffect } from 'react'
import { getSimilarTVShows, getTVShowById } from '../services/tmdbApi'
import { getShowById } from '../services/tvmazeApi'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import ShowCard from '../components/ShowCard'
import LoadingState from '../components/shared/LoadingState'
import EmptyState from '../components/shared/EmptyState'
import SEO from '../components/seo/SEO'
import { useModal } from '../hooks/useModal'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { MEDIA_TYPES } from '../models/constants'
import { GRID_COLUMNS } from '../utils/constants'
import { adaptTMDBShowsToTVMaze } from '../utils/tmdbAdapter'
import { getCollectionPageStructuredData } from '../utils/seoHelpers'

/**
 * Similar TV Shows page with infinite scroll
 * Displays all similar TV shows for a given TV show ID
 */
const SimilarTVShows = () => {
  const { tvId } = useParams()
  const navigate = useNavigate()
  const modal = useModal()
  const [show, setShow] = useState(null)

  // Fetch TV show details for SEO
  useEffect(() => {
    const fetchShow = async () => {
      if (tvId) {
        try {
          const showData = await getTVShowById(parseInt(tvId))
          setShow(showData)
        } catch (error) {
          console.error('Error fetching show for SEO:', error)
        }
      }
    }
    fetchShow()
  }, [tvId])

  // Create fetch function for infinite scroll
  const fetchSimilarTVShows = useCallback(async (page) => {
    if (!tvId) return { results: [], totalPages: 1, page: 1 }
    return await getSimilarTVShows(parseInt(tvId), page)
  }, [tvId])

  const {
    items: tvShows,
    loading,
    loadingMore,
    error,
    hasMore,
    observerTarget,
    loadMore,
  } = useInfiniteScroll(fetchSimilarTVShows)

  // Convert TMDB TV shows to TVMaze format
  const adaptedShows = adaptTMDBShowsToTVMaze(tvShows)

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
   * Handles similar item click from modal
   */
  const handleSimilarItemClick = async (show, itemType) => {
    modal.setLoading(true)
    modal.openModal(show, itemType)

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
    navigate(-1)
  }

  const structuredData = getCollectionPageStructuredData(
    `Similar TV Shows${show ? ` to ${show.name}` : ''}`,
    show
      ? `Discover TV shows similar to ${show.name}. Find recommendations based on ${show.name}.`
      : 'Discover similar TV shows. Find recommendations based on your favorite series.',
    shows
  )

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title={`Similar TV Shows${show ? ` to ${show.name}` : ''}`}
        description={show
          ? `Discover TV shows similar to ${show.name}. Find recommendations based on ${show.name}. Watch trailers, explore cast information, and add to your watchlist.`
          : 'Discover similar TV shows. Find recommendations based on your favorite series.'}
        keywords={`similar TV shows, TV show recommendations, ${show?.name || ''}, similar series, TV show suggestions`}
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
          Similar TV Shows
        </Heading>

        {loading && adaptedShows.length === 0 ? (
          <LoadingState message="Loading similar TV shows..." />
        ) : error ? (
          <EmptyState title="Failed to load similar TV shows" message={error} />
        ) : adaptedShows.length > 0 ? (
          <>
            <SimpleGrid columns={GRID_COLUMNS} spacing={{ base: 4, md: 6 }} mb={8}>
              {adaptedShows.map((show) => (
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
                  <LoadingState message="Loading more TV shows..." />
                ) : (
                  <Button
                    onClick={loadMore}
                    colorScheme="netflix"
                    size="lg"
                    isLoading={loadingMore}
                    loadingText="Loading..."
                  >
                    Load More TV Shows
                  </Button>
                )}
              </Box>
            )}
            {!hasMore && adaptedShows.length > 0 && (
              <Box py={8} textAlign="center">
                <Box color="rgba(255, 255, 255, 0.6)" fontSize="sm">
                  No more TV shows to load ({adaptedShows.length} total)
                </Box>
              </Box>
            )}
          </>
        ) : (
          <EmptyState title="No similar TV shows found" />
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

export default SimilarTVShows

