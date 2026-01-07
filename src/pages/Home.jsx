import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  SimpleGrid,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Heading,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { searchShows, getShowById } from '../services/tvmazeApi'
import { searchMovies, getMovieById } from '../services/tmdbApi'
import ShowCard from '../components/ShowCard'
import MovieCard from '../components/MovieCard'
import DetailModal from '../components/DetailModal'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemType, setItemType] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Debounced search function for TV Shows
  const performShowSearch = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setShows([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const results = await searchShows(query)
      setShows(results.map((item) => item.show))
    } catch (err) {
      setError('Failed to search shows. Please try again.')
      setShows([])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search function for Movies
  const performMovieSearch = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setMovies([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const results = await searchMovies(query)
      setMovies(results)
    } catch (err) {
      setError('Failed to search movies. Please try again.')
      setMovies([])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle opening modal for TV shows
  const handleShowClick = async (show) => {
    setLoadingDetails(true)
    setIsModalOpen(true)
    setItemType('show')
    
    try {
      const fullDetails = await getShowById(show.id)
      setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching show details:', err)
      setSelectedItem(show)
    } finally {
      setLoadingDetails(false)
    }
  }

  // Handle opening modal for movies
  const handleMovieClick = async (movie) => {
    setLoadingDetails(true)
    setIsModalOpen(true)
    setItemType('movie')
    
    try {
      const fullDetails = await getMovieById(movie.id)
      setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching movie details:', err)
      setSelectedItem(movie)
    } finally {
      setLoadingDetails(false)
    }
  }

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
    setItemType(null)
  }

  // Reset search when switching tabs
  useEffect(() => {
    setSearchQuery('')
    setShows([])
    setMovies([])
    setHasSearched(false)
    setError(null)
  }, [activeTab])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 0) {
        performShowSearch(searchQuery)
      } else {
        performMovieSearch(searchQuery)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, activeTab, performShowSearch, performMovieSearch])

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      {/* Netflix-style header with gradient overlay */}
      <Box
        position="relative"
        bgGradient="linear(to-b, rgba(0,0,0,0.7), transparent)"
        pb={8}
        pt={4}
      >
        <Container maxW="container.xl">
          {/* Top bar with logo */}
          <Flex justify="flex-start" align="center" mb={8}>
            <Heading
              as="h1"
              size="xl"
              color="netflix.500"
              fontWeight="900"
              letterSpacing="tight"
              sx={{
                animation: 'fadeIn 0.6s ease-out',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              STREAMSPOT
            </Heading>
          </Flex>

          {/* Hero section */}
          {!hasSearched && (
            <VStack
              spacing={6}
              py={12}
              textAlign="center"
              sx={{
                animation: 'fadeIn 0.8s ease-out',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Heading
                as="h2"
                size="3xl"
                color="white"
                fontWeight="900"
                letterSpacing="tight"
                lineHeight="1.2"
              >
                Find Your Next Binge
              </Heading>
              <Text fontSize="xl" color="rgba(255, 255, 255, 0.8)" maxW="600px">
                Search and discover TV shows and movies
              </Text>
            </VStack>
          )}
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* Tabs for TV Shows and Movies */}
        <Tabs
          index={activeTab}
          onChange={setActiveTab}
          variant="netflix"
          colorScheme="netflix"
        >
          <TabList mb={8} borderBottom="none">
            <Tab fontSize="20px" px={6} py={4}>TV Shows</Tab>
            <Tab fontSize="20px" px={6} py={4}>Movies</Tab>
          </TabList>

          <TabPanels>
            {/* TV Shows Tab */}
            <TabPanel px={0}>
              <VStack spacing={8} align="stretch">
                {/* Search Input */}
                <Box
                  sx={{
                    animation: 'slideIn 0.5s ease-out',
                    '@keyframes slideIn': {
                      from: { opacity: 0, transform: 'translateX(-20px)' },
                      to: { opacity: 1, transform: 'translateX(0)' },
                    },
                  }}
                >
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none" h="100%">
                      <SearchIcon color="rgba(255, 255, 255, 0.5)" boxSize={5} />
                    </InputLeftElement>
                    <Input
                      variant="netflix"
                      placeholder="Search for a TV show or series..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      size="lg"
                      h="56px"
                      fontSize="18px"
                    />
                  </InputGroup>
                </Box>

                {/* Error Message */}
                {error && (
                  <Alert status="error" borderRadius="md" bg="rgba(229, 9, 20, 0.2)" border="1px solid" borderColor="netflix.500">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                {/* Loading State */}
                {loading && (
                  <Center py={20}>
                    <VStack spacing={4}>
                      <Spinner size="xl" color="netflix.500" thickness="4px" speed="0.8s" />
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize="lg">Searching shows...</Text>
                    </VStack>
                  </Center>
                )}

                {/* Results */}
                {!loading && hasSearched && (
                  <Box
                    sx={{
                      animation: 'fadeIn 0.6s ease-out',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(20px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    {shows.length > 0 ? (
                      <>
                        <Text fontSize="2xl" fontWeight="bold" color="white" mb={6}>
                          Found {shows.length} {shows.length === 1 ? 'show' : 'shows'}
                        </Text>
                        <SimpleGrid
                          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                          spacing={6}
                        >
                          {shows.map((show, index) => (
                            <Box
                              key={show.id}
                              sx={{
                                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                                '@keyframes fadeIn': {
                                  from: { opacity: 0, transform: 'translateY(20px)' },
                                  to: { opacity: 1, transform: 'translateY(0)' },
                                },
                              }}
                            >
                              <ShowCard
                                show={show}
                                onClick={() => handleShowClick(show)}
                              />
                            </Box>
                          ))}
                        </SimpleGrid>
                      </>
                    ) : (
                      <Center py={20}>
                        <VStack spacing={4}>
                          <Text fontSize="2xl" color="rgba(255, 255, 255, 0.7)" fontWeight="600">
                            No shows found
                          </Text>
                          <Text color="rgba(255, 255, 255, 0.5)" textAlign="center" fontSize="lg">
                            Try searching with a different keyword
                          </Text>
                        </VStack>
                      </Center>
                    )}
                  </Box>
                )}

                {/* Initial State */}
                {!hasSearched && !loading && (
                  <Center py={20}>
                    <VStack spacing={4}>
                      <Text fontSize="2xl" color="rgba(255, 255, 255, 0.7)" fontWeight="600">
                        Start searching for TV shows
                      </Text>
                      <Text color="rgba(255, 255, 255, 0.5)" textAlign="center" fontSize="lg">
                        Type a show name in the search box above
                      </Text>
                    </VStack>
                  </Center>
                )}
              </VStack>
            </TabPanel>

            {/* Movies Tab */}
            <TabPanel px={0}>
              <VStack spacing={8} align="stretch">
                {/* Search Input */}
                <Box
                  sx={{
                    animation: 'slideIn 0.5s ease-out',
                    '@keyframes slideIn': {
                      from: { opacity: 0, transform: 'translateX(-20px)' },
                      to: { opacity: 1, transform: 'translateX(0)' },
                    },
                  }}
                >
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none" h="100%">
                      <SearchIcon color="rgba(255, 255, 255, 0.5)" boxSize={5} />
                    </InputLeftElement>
                    <Input
                      variant="netflix"
                      placeholder="Search for a movie..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      size="lg"
                      h="56px"
                      fontSize="18px"
                    />
                  </InputGroup>
                </Box>

                {/* Error Message */}
                {error && (
                  <Alert status="error" borderRadius="md" bg="rgba(229, 9, 20, 0.2)" border="1px solid" borderColor="netflix.500">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                {/* Loading State */}
                {loading && (
                  <Center py={20}>
                    <VStack spacing={4}>
                      <Spinner size="xl" color="netflix.500" thickness="4px" speed="0.8s" />
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize="lg">Searching movies...</Text>
                    </VStack>
                  </Center>
                )}

                {/* Results */}
                {!loading && hasSearched && (
                  <Box
                    sx={{
                      animation: 'fadeIn 0.6s ease-out',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(20px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    {movies.length > 0 ? (
                      <>
                        <Text fontSize="2xl" fontWeight="bold" color="white" mb={6}>
                          Found {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
                        </Text>
                        <SimpleGrid
                          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                          spacing={6}
                        >
                          {movies.map((movie, index) => (
                            <Box
                              key={movie.id}
                              sx={{
                                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                                '@keyframes fadeIn': {
                                  from: { opacity: 0, transform: 'translateY(20px)' },
                                  to: { opacity: 1, transform: 'translateY(0)' },
                                },
                              }}
                            >
                              <MovieCard
                                movie={movie}
                                onClick={() => handleMovieClick(movie)}
                              />
                            </Box>
                          ))}
                        </SimpleGrid>
                      </>
                    ) : (
                      <Center py={20}>
                        <VStack spacing={4}>
                          <Text fontSize="2xl" color="rgba(255, 255, 255, 0.7)" fontWeight="600">
                            No movies found
                          </Text>
                          <Text color="rgba(255, 255, 255, 0.5)" textAlign="center" fontSize="lg">
                            Try searching with a different keyword
                          </Text>
                        </VStack>
                      </Center>
                    )}
                  </Box>
                )}

                {/* Initial State */}
                {!hasSearched && !loading && (
                  <Center py={20}>
                    <VStack spacing={4}>
                      <Text fontSize="2xl" color="rgba(255, 255, 255, 0.7)" fontWeight="600">
                        Start searching for movies
                      </Text>
                      <Text color="rgba(255, 255, 255, 0.5)" textAlign="center" fontSize="lg">
                        Type a movie name in the search box above
                      </Text>
                    </VStack>
                  </Center>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        type={itemType}
        isLoading={loadingDetails}
      />
    </Box>
  )
}

export default Home
