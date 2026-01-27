import { Box, Container, Center, Spinner, Text } from '@chakra-ui/react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getMovieById, getTVShowById } from '../services/tmdbApi'
import { getShowById } from '../services/tvmazeApi'
import { adaptTMDBShowToTVMaze } from '../utils/tmdbAdapter'
import DetailModal from '../components/DetailModal'
import SEO from '../components/seo/SEO'
import { useModal } from '../hooks/useModal'
import { MEDIA_TYPES } from '../models/constants'
import { getMovieStructuredData, getTVShowStructuredData } from '../utils/seoHelpers'

/**
 * Share page component
 * Handles shared links and automatically opens the detail modal
 * 
 * URL format: /share/:type/:id?title=...
 * - type: 'movie' or 'show'
 * - id: Movie or TV show ID (TMDB ID for movies, TMDB or TVMaze ID for shows)
 * - title: Optional title for display
 */
const Share = () => {
  const { type, id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const modal = useModal()
  const hasFetched = useRef(false)
  const [itemData, setItemData] = useState(null)

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched.current) return
    
    const fetchAndOpenModal = async () => {
      if (!type || !id) {
        // Invalid URL, redirect to home
        navigate('/')
        return
      }

      hasFetched.current = true
      modal.setLoading(true)

      try {
        if (type === MEDIA_TYPES.MOVIE) {
          // Fetch movie details from TMDB
          const movie = await getMovieById(parseInt(id))
          setItemData(movie)
          modal.openModal(movie, MEDIA_TYPES.MOVIE)
          modal.setSelectedItem(movie)
        } else if (type === MEDIA_TYPES.SHOW) {
          // Try TMDB first (for TMDB shows)
          try {
            const tmdbShow = await getTVShowById(parseInt(id))
            // Adapt TMDB show to TVMaze format
            const adaptedShow = adaptTMDBShowToTVMaze(tmdbShow)
            setItemData(tmdbShow)
            modal.openModal(adaptedShow, MEDIA_TYPES.SHOW)
            modal.setSelectedItem(adaptedShow)
          } catch (tmdbError) {
            // If TMDB fails, try TVMaze
            try {
              const tvmazeShow = await getShowById(parseInt(id))
              setItemData(tvmazeShow)
              modal.openModal(tvmazeShow, MEDIA_TYPES.SHOW)
              modal.setSelectedItem(tvmazeShow)
            } catch (tvmazeError) {
              console.error('Error fetching show:', { tmdbError, tvmazeError })
              // Redirect to home if both fail
              navigate('/')
            }
          }
        } else {
          // Invalid type, redirect to home
          navigate('/')
        }
      } catch (error) {
        console.error('Error fetching item:', error)
        // Redirect to home on error
        navigate('/')
      } finally {
        modal.setLoading(false)
      }
    }

    fetchAndOpenModal()
  }, [type, id, navigate])

  /**
   * Handles closing the modal
   * Redirects to home page
   */
  const handleCloseModal = () => {
    modal.closeModal()
    navigate('/')
  }

  /**
   * Handles clicking on similar items
   */
  const handleItemClick = async (item, itemType) => {
    modal.setLoading(true)
    modal.openModal(item, itemType)

    try {
      if (itemType === MEDIA_TYPES.MOVIE) {
        const fullDetails = await getMovieById(item.id)
        modal.setSelectedItem(fullDetails)
      } else if (itemType === MEDIA_TYPES.SHOW) {
        if (item._tmdbData) {
          modal.setSelectedItem(item)
        } else {
          const fullDetails = await getShowById(item.id)
          modal.setSelectedItem(fullDetails)
        }
      }
    } catch (err) {
      console.error(`Error fetching ${itemType} details:`, err)
    } finally {
      modal.setLoading(false)
    }
  }

  const title = searchParams.get('title') || itemData?.title || itemData?.name || 'Item'
  const shareUrl = `${window.location.origin}/tv-search/share/${type}/${id}?title=${encodeURIComponent(title)}`
  const shareText = itemData?.overview || itemData?.summary || `Check out this ${type === MEDIA_TYPES.MOVIE ? 'movie' : 'TV show'}: ${title}`
  
  // Generate structured data
  const structuredData = itemData
    ? type === MEDIA_TYPES.MOVIE
      ? getMovieStructuredData(itemData)
      : getTVShowStructuredData(itemData)
    : null
  
  const itemImage = itemData?.poster_path
    ? `https://image.tmdb.org/t/p/w500${itemData.poster_path}`
    : itemData?.image?.medium || 'https://yassermuhammad.github.io/tv-search/icon-512x512.png'

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title={`${title} - ${type === MEDIA_TYPES.MOVIE ? 'Movie' : 'TV Show'} Details`}
        description={shareText}
        image={itemImage}
        type={type === MEDIA_TYPES.MOVIE ? 'video.movie' : 'video.tv_show'}
        url={shareUrl}
        structuredData={structuredData}
      />
      <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6, lg: 8 }}>
        <Center minH="50vh">
          <Box textAlign="center">
            <Spinner size="xl" color="netflix.500" thickness="4px" mb={4} />
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={{ base: 'md', md: 'lg' }}>
              Loading {title}...
            </Text>
          </Box>
        </Center>
      </Container>

      {/* Detail Modal */}
      <DetailModal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        item={modal.selectedItem}
        type={modal.itemType}
        isLoading={modal.loadingDetails}
        onItemClick={handleItemClick}
      />
    </Box>
  )
}

export default Share

