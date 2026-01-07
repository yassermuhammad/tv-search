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
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import {
  getImageUrl,
  getMovieWatchProviders,
  getTVWatchProviders,
  searchTVShow,
} from '../services/tmdbApi'

const DetailModal = ({ isOpen, onClose, item, type, isLoading }) => {
  const modalBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const [watchProviders, setWatchProviders] = useState(null)
  const [loadingProviders, setLoadingProviders] = useState(false)

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
      <ModalOverlay />
      <ModalContent bg={modalBg} maxH="90vh">
        <ModalHeader>
          <HStack spacing={4} align="center">
            <Heading size="lg">{type === 'movie' ? item.title : item.name}</Heading>
            {type === 'show' && item.status && (
              <Badge colorScheme={getStatusColor(item.status)}>{item.status}</Badge>
            )}
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Center py={12}>
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text color={textColor}>Loading details...</Text>
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
                      colorScheme="yellow"
                      fontSize="lg"
                      p={2}
                    >
                      {formatRating(
                        type === 'movie' ? item.vote_average : item.rating.average
                      )}
                      /10
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
                        <Badge key={genre.id || genre} colorScheme="blue" variant="subtle">
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

            <Divider />

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

            <Divider />

            {/* External Links */}
            <Box>
              <HStack spacing={4}>
                {type === 'movie' ? (
                  <Link
                    href={`https://www.themoviedb.org/movie/${item.id}`}
                    isExternal
                    color="blue.500"
                  >
                    View on TMDB <ExternalLinkIcon />
                  </Link>
                ) : (
                  item.url && (
                    <Link href={item.url} isExternal color="blue.500">
                      View on TVMaze <ExternalLinkIcon />
                    </Link>
                  )
                )}
                {type === 'movie' && item.imdb_id && (
                  <Link
                    href={`https://www.imdb.com/title/${item.imdb_id}`}
                    isExternal
                    color="blue.500"
                  >
                    View on IMDb <ExternalLinkIcon />
                  </Link>
                )}
                {type === 'show' && item.externals?.imdb && (
                  <Link
                    href={`https://www.imdb.com/title/${item.externals.imdb}`}
                    isExternal
                    color="blue.500"
                  >
                    View on IMDb <ExternalLinkIcon />
                  </Link>
                )}
              </HStack>
            </Box>
          </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DetailModal

