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
} from '../services/tmdbApi'
import { getShowSeasons } from '../services/tvmazeApi'
import { useWatchlist } from '../contexts/WatchlistContext'
import ModalHeader from './modal/ModalHeader'
import MediaInfo from './modal/MediaInfo'
import WatchProviders from './modal/WatchProviders'
import SeasonsList from './modal/SeasonsList'
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
 */
const DetailModal = ({ isOpen, onClose, item, type, isLoading }) => {
  const [watchProviders, setWatchProviders] = useState(null)
  const [loadingProviders, setLoadingProviders] = useState(false)
  const [seasons, setSeasons] = useState([])
  const [loadingSeasons, setLoadingSeasons] = useState(false)

  // Fetch watch providers when modal opens
  useEffect(() => {
    const fetchWatchProviders = async () => {
      if (!isOpen || !item || isLoading) {
        setWatchProviders(null)
        return
      }

      setLoadingProviders(true)
      try {
        if (type === MEDIA_TYPES.MOVIE && item.id) {
          // For movies, use TMDB ID directly
          const providers = await getMovieWatchProviders(item.id)
          setWatchProviders(providers)
        } else if (type === MEDIA_TYPES.SHOW && item.name) {
          // For TV shows from TVMaze, search TMDB first
          const tmdbShow = await searchTVShow(item.name)
          if (tmdbShow && tmdbShow.id) {
            const providers = await getTVWatchProviders(tmdbShow.id)
            setWatchProviders(providers)
          } else {
            setWatchProviders(null)
          }
        }
      } catch (error) {
        console.error('Error fetching watch providers:', error)
        setWatchProviders(null)
      } finally {
        setLoadingProviders(false)
      }
    }

    fetchWatchProviders()
  }, [isOpen, item, type, isLoading])

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

  if (!item) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent
        bg={MODAL_BG_COLOR}
        maxH="90vh"
        border="1px solid rgba(255, 255, 255, 0.1)"
        borderRadius="8px"
      >
        <ModalHeader item={item} type={type} />
        <ModalCloseButton
          color="white"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
          top="16px"
          right="16px"
        />
        <ModalBody>
          {isLoading ? (
            <Center py={12}>
              <VStack spacing={4}>
                <Spinner size="xl" color="netflix.500" thickness="4px" />
                <Text color="rgba(255, 255, 255, 0.7)">Loading details...</Text>
              </VStack>
            </Center>
          ) : (
            <VStack spacing={6} align="stretch">
              {/* Hero Section with Image and Basic Info */}
              <MediaInfo item={item} type={type} />

              <Divider borderColor="rgba(255, 255, 255, 0.1)" />

              {/* Description/Overview */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" color={TEXT_COLOR} mb={3}>
                  {type === MEDIA_TYPES.MOVIE ? 'Overview' : 'Summary'}
                </Text>
                <Text color={TEXT_COLOR} lineHeight="tall">
                  {type === MEDIA_TYPES.MOVIE
                    ? item.overview || 'No description available'
                    : stripHtml(item.summary)}
                </Text>
              </Box>

              {/* Watch Providers / Streaming Platforms */}
              {(loadingProviders || watchProviders) && (
                <WatchProviders
                  watchProviders={watchProviders}
                  loading={loadingProviders}
                />
              )}

              {/* Seasons and Episodes (TV Shows only) */}
              {type === MEDIA_TYPES.SHOW && (
                <>
                  <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                  <SeasonsList seasons={seasons} loading={loadingSeasons} />
                </>
              )}

              <Divider borderColor="rgba(255, 255, 255, 0.1)" />

              {/* External Links */}
              <Box>
                <HStack spacing={4}>
                  {type === MEDIA_TYPES.MOVIE ? (
                    <Link
                      href={EXTERNAL_LINKS.TMDB_MOVIE(item.id)}
                      isExternal
                      color="netflix.500"
                      _hover={{ color: 'netflix.400' }}
                      fontWeight="600"
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

        <ModalFooter borderTop="1px solid rgba(255, 255, 255, 0.1)" pt={4}>
          <Button
            bg="netflix.500"
            color="white"
            _hover={{ bg: 'netflix.600' }}
            onClick={onClose}
            fontWeight="bold"
            px={8}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DetailModal
