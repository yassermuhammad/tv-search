import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Heading,
  Divider,
  Link,
  SimpleGrid,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { ExternalLinkIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import {
  getImageUrl,
  getMovieWatchProviders,
  getTVWatchProviders,
  searchTVShow,
} from '../services/tmdbApi'
import { getShowSeasons, getSeasonEpisodes } from '../services/tvmazeApi'

const DetailModal = ({ isOpen, onClose, item, type, isLoading }) => {
  const modalBg = '#1a1a1a'
  const textColor = 'rgba(255, 255, 255, 0.9)'
  const [watchProviders, setWatchProviders] = useState(null)
  const [loadingProviders, setLoadingProviders] = useState(false)
  const [seasons, setSeasons] = useState([])
  const [loadingSeasons, setLoadingSeasons] = useState(false)
  const [episodesBySeason, setEpisodesBySeason] = useState({})
  const [loadingEpisodes, setLoadingEpisodes] = useState({})
  const [expandedSeasons, setExpandedSeasons] = useState(new Set())

  // Fetch watch providers when modal opens
  useEffect(() => {
    const fetchWatchProviders = async () => {
      if (!isOpen || !item || isLoading) {
        setWatchProviders(null)
        return
      }

      setLoadingProviders(true)
      try {
        if (type === 'movie' && item.id) {
          // For movies, use TMDB ID directly
          const providers = await getMovieWatchProviders(item.id)
          setWatchProviders(providers)
        } else if (type === 'show' && item.name) {
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
      if (!isOpen || !item || isLoading || type !== 'show' || !item.id) {
        setSeasons([])
        setEpisodesBySeason({})
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

  // Fetch episodes for a season when expanded
  const fetchEpisodesForSeason = async (seasonId, seasonNumber) => {
    if (episodesBySeason[seasonId]) {
      // Already loaded
      return
    }

    setLoadingEpisodes(prev => ({ ...prev, [seasonId]: true }))
    try {
      const episodesData = await getSeasonEpisodes(seasonId)
      setEpisodesBySeason(prev => ({ ...prev, [seasonId]: episodesData }))
    } catch (error) {
      console.error('Error fetching episodes:', error)
      setEpisodesBySeason(prev => ({ ...prev, [seasonId]: [] }))
    } finally {
      setLoadingEpisodes(prev => ({ ...prev, [seasonId]: false }))
    }
  }

  const toggleSeason = (seasonId, seasonNumber) => {
    const newExpanded = new Set(expandedSeasons)
    if (newExpanded.has(seasonId)) {
      newExpanded.delete(seasonId)
    } else {
      newExpanded.add(seasonId)
      fetchEpisodesForSeason(seasonId, seasonNumber)
    }
    setExpandedSeasons(newExpanded)
  }

  // Get watch providers for US (or fallback to any available country)
  const getAvailablePlatforms = () => {
    if (!watchProviders) return null

    // Try US first, then any available country
    const usProviders = watchProviders.US
    if (usProviders) {
      return {
        flatrate: usProviders.flatrate || [],
        buy: usProviders.buy || [],
        rent: usProviders.rent || [],
      }
    }

    // Fallback to first available country
    const firstCountry = Object.keys(watchProviders)[0]
    if (firstCountry) {
      return {
        flatrate: watchProviders[firstCountry].flatrate || [],
        buy: watchProviders[firstCountry].buy || [],
        rent: watchProviders[firstCountry].rent || [],
      }
    }

    return null
  }

  const platforms = getAvailablePlatforms()

  // Strip HTML from summary
  const stripHtml = (html) => {
    if (!html) return 'No description available'
    return html.replace(/<[^>]*>/g, '').trim() || 'No description available'
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  // Format rating
  const formatRating = (rating) => {
    if (!rating) return null
    return typeof rating === 'number' ? rating.toFixed(1) : rating
  }

  // Get status color for TV shows
  const getStatusColor = (status) => {
    if (!status) return 'gray'
    switch (status) {
      case 'Running':
        return 'green'
      case 'Ended':
        return 'red'
      case 'To Be Determined':
        return 'yellow'
      default:
        return 'gray'
    }
  }

  if (!item) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent bg={modalBg} maxH="90vh" border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="8px">
        <ModalHeader borderBottom="1px solid rgba(255, 255, 255, 0.1)" pb={4}>
          <HStack spacing={4} align="center">
            <Heading size="lg" color="white" fontWeight="bold">{type === 'movie' ? item.title : item.name}</Heading>
            {type === 'show' && item.status && (
              <Badge colorScheme={getStatusColor(item.status)} fontSize="sm" px={2} py={1}>{item.status}</Badge>
            )}
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="white" _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }} />
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
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Image */}
              <Box>
                {type === 'movie' ? (
                  item.poster_path ? (
                    <Image
                      src={getImageUrl(item.poster_path)}
                      alt={item.title}
                      borderRadius="md"
                      fallback={
                        <Box
                          width="100%"
                          height="400px"
                          bg="gray.200"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="md"
                        >
                          <Text color="gray.500">No Image Available</Text>
                        </Box>
                      }
                    />
                  ) : (
                    <Box
                      width="100%"
                      height="400px"
                      bg="gray.200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                    >
                      <Text color="gray.500">No Image Available</Text>
                    </Box>
                  )
                ) : (
                  item.image?.original || item.image?.medium ? (
                    <Image
                      src={item.image.original || item.image.medium}
                      alt={item.name}
                      borderRadius="md"
                      fallback={
                        <Box
                          width="100%"
                          height="400px"
                          bg="gray.200"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="md"
                        >
                          <Text color="gray.500">No Image Available</Text>
                        </Box>
                      }
                    />
                  ) : (
                    <Box
                      width="100%"
                      height="400px"
                      bg="gray.200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                    >
                      <Text color="gray.500">No Image Available</Text>
                    </Box>
                  )
                )}
              </Box>

              {/* Basic Info */}
              <VStack align="stretch" spacing={4}>
                {/* Rating */}
                {(type === 'movie' ? item.vote_average : item.rating?.average) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>
                      Rating
                    </Text>
                    <Badge
                      bg="rgba(234, 179, 8, 0.2)"
                      color="yellow.400"
                      fontSize="lg"
                      p={2}
                      borderRadius="4px"
                      fontWeight="bold"
                    >
                      ⭐ {formatRating(
                        type === 'movie' ? item.vote_average : item.rating.average
                      )}/10
                    </Badge>
                  </Box>
                )}

                {/* Genres */}
                {((type === 'movie' && item.genres) || (type === 'show' && item.genres)) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>
                      Genres
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {(type === 'movie' ? item.genres : item.genres)?.map((genre) => (
                        <Badge
                          key={genre.id || genre}
                          bg="rgba(255, 255, 255, 0.1)"
                          color="rgba(255, 255, 255, 0.8)"
                          fontSize="sm"
                          px={2}
                          py={1}
                          borderRadius="4px"
                        >
                          {genre.name || genre}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                )}

                {/* Release/Premiere Date */}
                {(type === 'movie' ? item.release_date : item.premiered) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      {type === 'movie' ? 'Release Date' : 'Premiere Date'}
                    </Text>
                    <Text color={textColor}>
                      {formatDate(type === 'movie' ? item.release_date : item.premiered)}
                    </Text>
                  </Box>
                )}

                {/* End Date (for shows) */}
                {type === 'show' && item.ended && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      End Date
                    </Text>
                    <Text color={textColor}>{formatDate(item.ended)}</Text>
                  </Box>
                )}

                {/* Runtime */}
                {(type === 'movie' ? item.runtime : item.runtime || item.averageRuntime) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      Runtime
                    </Text>
                    <Text color={textColor}>
                      {type === 'movie'
                        ? `${item.runtime} minutes`
                        : `${item.runtime || item.averageRuntime} minutes per episode`}
                    </Text>
                  </Box>
                )}

                {/* Type (for shows) */}
                {type === 'show' && item.type && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      Type
                    </Text>
                    <Text color={textColor}>{item.type}</Text>
                  </Box>
                )}

                {/* Language */}
                {(type === 'movie' ? item.original_language : item.language) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      Language
                    </Text>
                    <Text color={textColor} textTransform="uppercase">
                      {type === 'movie' ? item.original_language : item.language}
                    </Text>
                  </Box>
                )}

                {/* Network/Production Company */}
                {type === 'show' && (item.network || item.webChannel) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      Network
                    </Text>
                    <Text color={textColor}>
                      {item.network?.name || item.webChannel?.name}
                      {item.network?.country && ` • ${item.network.country.name}`}
                    </Text>
                  </Box>
                )}

                {/* Production Companies (for movies) */}
                {type === 'movie' && item.production_companies && item.production_companies.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      Production Companies
                    </Text>
                    <Text color={textColor}>
                      {item.production_companies.map((company) => company.name).join(', ')}
                    </Text>
                  </Box>
                )}

                {/* Schedule (for shows) */}
                {type === 'show' && item.schedule && item.schedule.days && item.schedule.days.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      Schedule
                    </Text>
                    <Text color={textColor}>
                      {item.schedule.days.join(', ')}
                      {item.schedule.time && ` at ${item.schedule.time}`}
                    </Text>
                  </Box>
                )}

                {/* Budget/Revenue (for movies) */}
                {type === 'movie' && (item.budget || item.revenue) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      Box Office
                    </Text>
                    <VStack align="stretch" spacing={1}>
                      {item.budget > 0 && (
                        <Text color={textColor}>
                          Budget: ${item.budget.toLocaleString()}
                        </Text>
                      )}
                      {item.revenue > 0 && (
                        <Text color={textColor}>
                          Revenue: ${item.revenue.toLocaleString()}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                )}
              </VStack>
            </SimpleGrid>

            <Divider borderColor="rgba(255, 255, 255, 0.1)" />

            {/* Description/Overview */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={3}>
                {type === 'movie' ? 'Overview' : 'Summary'}
              </Text>
              <Text color={textColor} lineHeight="tall">
                {type === 'movie'
                  ? item.overview || 'No description available'
                  : stripHtml(item.summary)}
              </Text>
            </Box>

            {/* Watch Providers / Streaming Platforms */}
            {(loadingProviders || platforms) && (
              <Box>
                <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={3}>
                  Where to Watch
                </Text>
                {loadingProviders ? (
                  <HStack spacing={2}>
                    <Spinner size="sm" color="blue.500" />
                    <Text color={textColor} fontSize="sm">Loading streaming platforms...</Text>
                  </HStack>
                ) : platforms ? (
                  <VStack align="stretch" spacing={4}>
                    {/* Streaming (Subscription) */}
                    {platforms.flatrate && platforms.flatrate.length > 0 && (
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>
                          Stream
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          {platforms.flatrate.map((provider) => (
                            <Badge
                              key={provider.provider_id}
                              colorScheme="green"
                              variant="subtle"
                              fontSize="sm"
                              p={2}
                            >
                              {provider.provider_name}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>
                    )}

                    {/* Buy */}
                    {platforms.buy && platforms.buy.length > 0 && (
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>
                          Buy
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          {platforms.buy.map((provider) => (
                            <Badge
                              key={provider.provider_id}
                              colorScheme="blue"
                              variant="subtle"
                              fontSize="sm"
                              p={2}
                            >
                              {provider.provider_name}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>
                    )}

                    {/* Rent */}
                    {platforms.rent && platforms.rent.length > 0 && (
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>
                          Rent
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          {platforms.rent.map((provider) => (
                            <Badge
                              key={provider.provider_id}
                              colorScheme="purple"
                              variant="subtle"
                              fontSize="sm"
                              p={2}
                            >
                              {provider.provider_name}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>
                    )}

                    {!platforms.flatrate?.length &&
                      !platforms.buy?.length &&
                      !platforms.rent?.length && (
                        <Text color={textColor} fontSize="sm" fontStyle="italic">
                          No streaming information available
                        </Text>
                      )}
                  </VStack>
                ) : (
                  <Text color={textColor} fontSize="sm" fontStyle="italic">
                    Streaming information not available
                  </Text>
                )}
              </Box>
            )}

            {/* Seasons and Episodes (TV Shows only) */}
            {type === 'show' && (
              <>
                <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                <Box>
                  <Heading size="md" color="white" mb={4}>
                    Seasons & Episodes
                  </Heading>
                  {loadingSeasons ? (
                    <Center py={8}>
                      <VStack spacing={2}>
                        <Spinner size="md" color="netflix.500" />
                        <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                          Loading seasons...
                        </Text>
                      </VStack>
                    </Center>
                  ) : seasons.length > 0 ? (
                    <VStack align="stretch" spacing={3}>
                      {seasons.map((season) => {
                        const isExpanded = expandedSeasons.has(season.id)
                        const episodes = episodesBySeason[season.id] || []
                        const isLoadingEp = loadingEpisodes[season.id]

                        return (
                          <Box
                            key={season.id}
                            border="1px solid rgba(255, 255, 255, 0.1)"
                            borderRadius="8px"
                            overflow="hidden"
                            bg="rgba(255, 255, 255, 0.03)"
                            _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
                            transition="all 0.2s"
                          >
                            <Button
                              w="100%"
                              justifyContent="space-between"
                              p={4}
                              bg="transparent"
                              color="white"
                              fontWeight="bold"
                              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                              onClick={() => toggleSeason(season.id, season.number)}
                              borderRadius="0"
                            >
                              <HStack spacing={4}>
                                <Text fontSize="lg">
                                  Season {season.number}
                                </Text>
                                {season.premiereDate && (
                                  <Badge
                                    bg="rgba(255, 255, 255, 0.1)"
                                    color="rgba(255, 255, 255, 0.7)"
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                  >
                                    {new Date(season.premiereDate).getFullYear()}
                                  </Badge>
                                )}
                                {season.episodeOrder && (
                                  <Badge
                                    bg="rgba(255, 255, 255, 0.1)"
                                    color="rgba(255, 255, 255, 0.7)"
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                  >
                                    {season.episodeOrder} episodes
                                  </Badge>
                                )}
                              </HStack>
                              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </Button>

                            {isExpanded && (
                              <Box p={4} pt={0}>
                                {isLoadingEp ? (
                                  <Center py={4}>
                                    <Spinner size="sm" color="netflix.500" />
                                  </Center>
                                ) : episodes.length > 0 ? (
                                  <VStack align="stretch" spacing={2} maxH="400px" overflowY="auto">
                                    {episodes.map((episode) => (
                                      <Box
                                        key={episode.id}
                                        p={3}
                                        bg="rgba(0, 0, 0, 0.3)"
                                        borderRadius="4px"
                                        border="1px solid rgba(255, 255, 255, 0.05)"
                                        _hover={{
                                          bg: 'rgba(0, 0, 0, 0.5)',
                                          borderColor: 'rgba(229, 9, 20, 0.3)',
                                        }}
                                        transition="all 0.2s"
                                      >
                                        <HStack justify="space-between" mb={2}>
                                          <HStack spacing={2}>
                                            <Text
                                              fontSize="sm"
                                              fontWeight="bold"
                                              color="netflix.500"
                                            >
                                              E{episode.number}
                                            </Text>
                                            <Text fontSize="sm" fontWeight="semibold" color="white">
                                              {episode.name || 'Untitled Episode'}
                                            </Text>
                                          </HStack>
                                          {episode.airdate && (
                                            <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
                                              {formatDate(episode.airdate)}
                                            </Text>
                                          )}
                                        </HStack>
                                        {episode.summary && (
                                          <Text
                                            fontSize="xs"
                                            color="rgba(255, 255, 255, 0.7)"
                                            noOfLines={2}
                                            lineHeight="1.4"
                                          >
                                            {stripHtml(episode.summary)}
                                          </Text>
                                        )}
                                        {episode.runtime && (
                                          <Text fontSize="xs" color="rgba(255, 255, 255, 0.5)" mt={1}>
                                            {episode.runtime} min
                                          </Text>
                                        )}
                                      </Box>
                                    ))}
                                  </VStack>
                                ) : (
                                  <Text color="rgba(255, 255, 255, 0.5)" fontSize="sm" py={4}>
                                    No episodes available
                                  </Text>
                                )}
                              </Box>
                            )}
                          </Box>
                        )
                      })}
                    </VStack>
                  ) : (
                    <Text color="rgba(255, 255, 255, 0.5)" fontSize="sm">
                      No seasons information available
                    </Text>
                  )}
                </Box>
              </>
            )}

            <Divider borderColor="rgba(255, 255, 255, 0.1)" />

            {/* External Links */}
            <Box>
              <HStack spacing={4}>
                {type === 'movie' ? (
                  <Link
                    href={`https://www.themoviedb.org/movie/${item.id}`}
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
                {type === 'movie' && item.imdb_id && (
                  <Link
                    href={`https://www.imdb.com/title/${item.imdb_id}`}
                    isExternal
                    color="netflix.500"
                    _hover={{ color: 'netflix.400' }}
                    fontWeight="600"
                  >
                    View on IMDb <ExternalLinkIcon />
                  </Link>
                )}
                {type === 'show' && item.externals?.imdb && (
                  <Link
                    href={`https://www.imdb.com/title/${item.externals.imdb}`}
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

