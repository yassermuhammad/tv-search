import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Divider,
  Link,
  Center,
  Spinner,
  Box,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import {
  getMovieWatchProviders,
  getTVWatchProviders,
  searchTVShow,
  getMovieCredits,
  getTVCredits,
  getMovieVideos,
  getTVVideos,
  getSimilarMovies,
  getSimilarTVShows,
  getMovieContentRatings,
  getTVContentRatings,
} from '../services/tmdbApi'
import { getShowSeasons } from '../services/tvmazeApi'
import { useWatchlist } from '../contexts/WatchlistContext'
import ModalHeader from './modal/ModalHeader'
import MediaInfo from './modal/MediaInfo'
import WatchProviders from './modal/WatchProviders'
import SeasonsList from './modal/SeasonsList'
import CastCrew from './modal/CastCrew'
import TrailerSection from './modal/TrailerSection'
import SimilarContent from './modal/SimilarContent'
import ParentGuide from './modal/ParentGuide'
import { stripHtml } from '../utils/formatters'
import { COLORS } from '../utils/constants'
import { MEDIA_TYPES } from '../models/constants'
import { EXTERNAL_LINKS } from '../utils/constants'

const MODAL_BG_COLOR = COLORS.MODAL_BG
const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Detail modal component for displaying movie/show details
 * Features:
 * - Full media information (poster, rating, genres, etc.)
 * - Watch providers (streaming platforms)
 * - Seasons and episodes (for TV shows)
 * - External links (TMDB, TVMaze, IMDb)
 * - Watchlist management
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Object} props.item - Movie or show item
 * @param {string} props.type - Item type ('movie' or 'show')
 * @param {boolean} props.isLoading - Loading state for initial data fetch
 * @param {Function} props.onItemClick - Callback when a similar item is clicked (optional)
 */
const DetailModal = ({ isOpen, onClose, item, type, isLoading, onItemClick }) => {
  const [watchProviders, setWatchProviders] = useState(null)
  const [loadingProviders, setLoadingProviders] = useState(false)
  const [seasons, setSeasons] = useState([])
  const [loadingSeasons, setLoadingSeasons] = useState(false)
  const [credits, setCredits] = useState({ cast: [], crew: [] })
  const [loadingCredits, setLoadingCredits] = useState(false)
  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [similarItems, setSimilarItems] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)
  const [tmdbId, setTmdbId] = useState(null)
  const [contentRatings, setContentRatings] = useState([])
  const [loadingContentRatings, setLoadingContentRatings] = useState(false)

  // Get TMDB ID for TV shows
  useEffect(() => {
    const getTMDBId = async () => {
      if (!isOpen || !item || isLoading) {
        setTmdbId(null)
        return
      }

      if (type === MEDIA_TYPES.MOVIE && item.id) {
        // For movies, use TMDB ID directly
        setTmdbId(item.id)
      } else if (type === MEDIA_TYPES.SHOW) {
        // For TV shows, check if we have TMDB ID
        if (item._tmdbData?.id) {
          setTmdbId(item._tmdbData.id)
        } else if (item.name) {
          // Search TMDB for TV show
          try {
            const tmdbShow = await searchTVShow(item.name)
            if (tmdbShow && tmdbShow.id) {
              setTmdbId(tmdbShow.id)
            }
          } catch (error) {
            console.error('Error searching TV show:', error)
          }
        }
      }
    }

    getTMDBId()
  }, [isOpen, item, type, isLoading])

  // Fetch watch providers when modal opens
  useEffect(() => {
    const fetchWatchProviders = async () => {
      if (!isOpen || !item || isLoading || !tmdbId) {
        setWatchProviders(null)
        return
      }

      setLoadingProviders(true)
      try {
        if (type === MEDIA_TYPES.MOVIE) {
          const providers = await getMovieWatchProviders(tmdbId)
          setWatchProviders(providers)
        } else if (type === MEDIA_TYPES.SHOW) {
          const providers = await getTVWatchProviders(tmdbId)
          setWatchProviders(providers)
        }
      } catch (error) {
        console.error('Error fetching watch providers:', error)
        setWatchProviders(null)
      } finally {
        setLoadingProviders(false)
      }
    }

    fetchWatchProviders()
  }, [isOpen, item, type, isLoading, tmdbId])

  // Fetch credits (cast and crew)
  useEffect(() => {
    const fetchCredits = async () => {
      if (!isOpen || !item || isLoading || !tmdbId) {
        setCredits({ cast: [], crew: [] })
        return
      }

      setLoadingCredits(true)
      try {
        if (type === MEDIA_TYPES.MOVIE) {
          const creditsData = await getMovieCredits(tmdbId)
          setCredits(creditsData)
        } else if (type === MEDIA_TYPES.SHOW) {
          const creditsData = await getTVCredits(tmdbId)
          setCredits(creditsData)
        }
      } catch (error) {
        console.error('Error fetching credits:', error)
        setCredits({ cast: [], crew: [] })
      } finally {
        setLoadingCredits(false)
      }
    }

    fetchCredits()
  }, [isOpen, item, type, isLoading, tmdbId])

  // Fetch videos (trailers)
  useEffect(() => {
    const fetchVideos = async () => {
      if (!isOpen || !item || isLoading || !tmdbId) {
        setVideos([])
        return
      }

      setLoadingVideos(true)
      try {
        if (type === MEDIA_TYPES.MOVIE) {
          const videosData = await getMovieVideos(tmdbId)
          setVideos(videosData)
        } else if (type === MEDIA_TYPES.SHOW) {
          const videosData = await getTVVideos(tmdbId)
          setVideos(videosData)
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
        setVideos([])
      } finally {
        setLoadingVideos(false)
      }
    }

    fetchVideos()
  }, [isOpen, item, type, isLoading, tmdbId])

  // Fetch seasons when modal opens for TV shows
  useEffect(() => {
    const fetchSeasons = async () => {
      if (!isOpen || !item || isLoading || type !== MEDIA_TYPES.SHOW || !item.id) {
        setSeasons([])
        return
      }

      setLoadingSeasons(true)
      try {
        const seasonsData = await getShowSeasons(item.id)
        setSeasons(seasonsData)
      } catch (error) {
        console.error('Error fetching seasons:', error)
        setSeasons([])
      } finally {
        setLoadingSeasons(false)
      }
    }

    fetchSeasons()
  }, [isOpen, item, type, isLoading])

  // Fetch similar content
  useEffect(() => {
    const fetchSimilar = async () => {
      if (!isOpen || !item || isLoading || !tmdbId) {
        setSimilarItems([])
        return
      }

      setLoadingSimilar(true)
      try {
        let similarData
        if (type === MEDIA_TYPES.MOVIE) {
          similarData = await getSimilarMovies(tmdbId)
          setSimilarItems(similarData.results || [])
        } else if (type === MEDIA_TYPES.SHOW) {
          similarData = await getSimilarTVShows(tmdbId)
          setSimilarItems(similarData.results || [])
        }
      } catch (error) {
        console.error('Error fetching similar content:', error)
        setSimilarItems([])
      } finally {
        setLoadingSimilar(false)
      }
    }

    fetchSimilar()
  }, [isOpen, item, type, isLoading, tmdbId])

  // Fetch content ratings (parent guide)
  useEffect(() => {
    const fetchContentRatings = async () => {
      if (!isOpen || !item || isLoading || !tmdbId) {
        setContentRatings([])
        return
      }

      setLoadingContentRatings(true)
      try {
        if (type === MEDIA_TYPES.MOVIE) {
          const ratings = await getMovieContentRatings(tmdbId)
          setContentRatings(ratings)
        } else if (type === MEDIA_TYPES.SHOW) {
          const ratings = await getTVContentRatings(tmdbId)
          setContentRatings(ratings)
        }
      } catch (error) {
        console.error('Error fetching content ratings:', error)
        setContentRatings([])
      } finally {
        setLoadingContentRatings(false)
      }
    }

    fetchContentRatings()
  }, [isOpen, item, type, isLoading, tmdbId])

  // Handle clicking on similar items
  const handleSimilarItemClick = (similarItem, itemType) => {
    if (onItemClick) {
      onItemClick(similarItem, itemType)
    }
  }

  if (!item) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'xl', md: '4xl' }}
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent
        bg={MODAL_BG_COLOR}
        maxH={{ base: 'calc(100vh - 120px)', md: '90vh' }}
        maxW={{ base: 'calc(100vw - 32px)', md: '4xl' }}
        w={{ base: 'calc(100vw - 32px)', md: 'auto' }}
        border="1px solid rgba(255, 255, 255, 0.1)"
        borderRadius={{ base: '8px', md: '8px' }}
        mt={{ base: '60px', md: 'auto' }}
        mb={{ base: '60px', md: 'auto' }}
        mx={{ base: 4, md: 'auto' }}
      >
        <ModalHeader item={item} type={type} />
        <ModalCloseButton
          color="white"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
          top={{ base: '12px', md: '16px' }}
          right={{ base: '12px', md: '16px' }}
          size={{ base: 'md', md: 'lg' }}
        />
        <ModalBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
          {isLoading ? (
            <Center py={12}>
              <VStack spacing={4}>
                <Spinner size="xl" color="netflix.500" thickness="4px" />
                <Text color="rgba(255, 255, 255, 0.7)">Loading details...</Text>
              </VStack>
            </Center>
          ) : (
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Hero Section with Image and Basic Info */}
              <MediaInfo item={item} type={type} />

              <Divider borderColor="rgba(255, 255, 255, 0.1)" />

              {/* Description/Overview */}
              <Box>
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  fontWeight="semibold"
                  color={TEXT_COLOR}
                  mb={{ base: 2, md: 3 }}
                >
                  {type === MEDIA_TYPES.MOVIE ? 'Overview' : 'Summary'}
                </Text>
                <Text
                  color={TEXT_COLOR}
                  lineHeight="tall"
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  {type === MEDIA_TYPES.MOVIE
                    ? item.overview || 'No description available'
                    : stripHtml(item.summary)}
                </Text>
              </Box>

              {/* Parent Guide Section */}
              {(loadingContentRatings || contentRatings.length > 0) && (
                <>
                  <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                  <ParentGuide
                    contentRatings={contentRatings}
                    loading={loadingContentRatings}
                  />
                </>
              )}

              {/* Trailers Section */}
              {(loadingVideos || videos.length > 0) && (
                <>
                  <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                  <TrailerSection videos={videos} loading={loadingVideos} />
                </>
              )}

              {/* Seasons and Episodes (TV Shows only) */}
              {type === MEDIA_TYPES.SHOW && (
                <>
                  <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                  <SeasonsList seasons={seasons} loading={loadingSeasons} />
                </>
              )}

              {/* Cast and Crew Section */}
              {(loadingCredits || credits.cast.length > 0 || credits.crew.length > 0) && (
                <>
                  <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                  <CastCrew
                    cast={credits.cast}
                    crew={credits.crew}
                    loading={loadingCredits}
                  />
                </>
              )}

              {/* Watch Providers / Streaming Platforms */}
              {(loadingProviders || watchProviders) && (
                <>
                  <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                  <WatchProviders
                    watchProviders={watchProviders}
                    loading={loadingProviders}
                  />
                </>
              )}

              {/* Similar Content Section */}
              {(loadingSimilar || similarItems.length > 0) && (
                <>
                  <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                  <SimilarContent
                    similarItems={similarItems}
                    loading={loadingSimilar}
                    type={type}
                    onItemClick={handleSimilarItemClick}
                    viewAllPath={
                      tmdbId
                        ? type === MEDIA_TYPES.MOVIE
                          ? `/similar/movies/${tmdbId}`
                          : `/similar/tv-shows/${tmdbId}`
                        : null
                    }
                  />
                </>
              )}

              <Divider borderColor="rgba(255, 255, 255, 0.1)" />

              {/* External Links */}
              <Box>
                <HStack
                  spacing={{ base: 2, md: 4 }}
                  flexWrap="wrap"
                  gap={{ base: 2, md: 0 }}
                >
                  {type === MEDIA_TYPES.MOVIE ? (
                    <Link
                      href={EXTERNAL_LINKS.TMDB_MOVIE(item.id)}
                      isExternal
                      color="netflix.500"
                      _hover={{ color: 'netflix.400' }}
                      fontWeight="600"
                      fontSize={{ base: 'sm', md: 'md' }}
                    >
                      View on TMDB <ExternalLinkIcon />
                    </Link>
                  ) : (
                    item.url && (
                      <Link
                        href={item.url}
                        isExternal
                        color="netflix.500"
                        _hover={{ color: 'netflix.400' }}
                        fontWeight="600"
                        fontSize={{ base: 'sm', md: 'md' }}
                      >
                        View on TVMaze <ExternalLinkIcon />
                      </Link>
                    )
                  )}
                  {type === MEDIA_TYPES.MOVIE && item.imdb_id && (
                    <Link
                      href={EXTERNAL_LINKS.IMDB(item.imdb_id)}
                      isExternal
                      color="netflix.500"
                      _hover={{ color: 'netflix.400' }}
                      fontWeight="600"
                      fontSize={{ base: 'sm', md: 'md' }}
                    >
                      View on IMDb <ExternalLinkIcon />
                    </Link>
                  )}
                  {type === MEDIA_TYPES.SHOW && item.externals?.imdb && (
                    <Link
                      href={EXTERNAL_LINKS.IMDB(item.externals.imdb)}
                      isExternal
                      color="netflix.500"
                      _hover={{ color: 'netflix.400' }}
                      fontWeight="600"
                    >
                      View on IMDb <ExternalLinkIcon />
                    </Link>
                  )}
                </HStack>
              </Box>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter
          borderTop="1px solid rgba(255, 255, 255, 0.1)"
          pt={{ base: 3, md: 4 }}
          px={{ base: 4, md: 6 }}
        >
          <Button
            bg="netflix.500"
            color="white"
            _hover={{ bg: 'netflix.600' }}
            onClick={onClose}
            fontWeight="bold"
            px={{ base: 6, md: 8 }}
            w={{ base: '100%', sm: 'auto' }}
            size={{ base: 'md', md: 'lg' }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DetailModal
