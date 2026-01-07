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
  useColorModeValue,
  IconButton,
  useColorMode,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
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
  const [itemType, setItemType] = useState(null) // 'show' or 'movie'
  const [loadingDetails, setLoadingDetails] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()

  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, gray.800)'
  )

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
      // Fetch full show details
      const fullDetails = await getShowById(show.id)
      setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching show details:', err)
      // Fallback to the show data we already have
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
      // Fetch full movie details (to get genres, runtime, etc.)
      const fullDetails = await getMovieById(movie.id)
      setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching movie details:', err)
      // Fallback to the movie data we already have
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
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchQuery, activeTab, performShowSearch, performMovieSearch])

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={8}>
        {/* Color Mode Toggle - Top Right */}
        <Flex justify="flex-end" mb={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
          />
        </Flex>

        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} py={8}>
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              textAlign="center"
            >
              TV Shows & Movies Search
            </Heading>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Discover your next favorite show or movie
            </Text>
          </VStack>

          {/* Tabs for TV Shows and Movies */}
          <Tabs
            index={activeTab}
            onChange={setActiveTab}
            colorScheme="blue"
            variant="enclosed"
          >
            <TabList>
              <Tab>TV Shows</Tab>
              <Tab>Movies</Tab>
            </TabList>

            <TabPanels>
              {/* TV Shows Tab */}
              <TabPanel px={0}>
                <VStack spacing={8} align="stretch">
                  {/* Search Input */}
                  <Box>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search for a TV show or series..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        bg="white"
                        _dark={{ bg: 'gray.700' }}
                        focusBorderColor="blue.500"
                      />
                    </InputGroup>
                  </Box>

                  {/* Error Message */}
                  {error && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  {/* Loading State */}
                  {loading && (
                    <Center py={12}>
                      <VStack spacing={4}>
                        <Spinner size="xl" color="blue.500" thickness="4px" />
                        <Text color="gray.600">Searching shows...</Text>
                      </VStack>
                    </Center>
                  )}

                  {/* Results */}
                  {!loading && hasSearched && (
                    <>
                      {shows.length > 0 ? (
                        <>
                          <Text fontSize="lg" fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
                            Found {shows.length} {shows.length === 1 ? 'show' : 'shows'}
                          </Text>
                          <SimpleGrid
                            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                            spacing={6}
                          >
                            {shows.map((show) => (
                              <ShowCard
                                key={show.id}
                                show={show}
                                onClick={() => handleShowClick(show)}
                              />
                            ))}
                          </SimpleGrid>
                        </>
                      ) : (
                        <Center py={12}>
                          <VStack spacing={4}>
                            <Text fontSize="xl" color="gray.600" _dark={{ color: 'gray.400' }}>
                              No shows found
                            </Text>
                            <Text color="gray.500" textAlign="center">
                              Try searching with a different keyword
                            </Text>
                          </VStack>
                        </Center>
                      )}
                    </>
                  )}

                  {/* Initial State */}
                  {!hasSearched && !loading && (
                    <Center py={12}>
                      <VStack spacing={4}>
                        <Text fontSize="xl" color="gray.600" _dark={{ color: 'gray.400' }}>
                          Start searching for TV shows
                        </Text>
                        <Text color="gray.500" textAlign="center">
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
                  <Box>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search for a movie..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        bg="white"
                        _dark={{ bg: 'gray.700' }}
                        focusBorderColor="purple.500"
                      />
                    </InputGroup>
                  </Box>

                  {/* Error Message */}
                  {error && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  {/* Loading State */}
                  {loading && (
                    <Center py={12}>
                      <VStack spacing={4}>
                        <Spinner size="xl" color="purple.500" thickness="4px" />
                        <Text color="gray.600">Searching movies...</Text>
                      </VStack>
                    </Center>
                  )}

                  {/* Results */}
                  {!loading && hasSearched && (
                    <>
                      {movies.length > 0 ? (
                        <>
                          <Text fontSize="lg" fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
                            Found {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
                          </Text>
                          <SimpleGrid
                            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                            spacing={6}
                          >
                            {movies.map((movie) => (
                              <MovieCard
                                key={movie.id}
                                movie={movie}
                                onClick={() => handleMovieClick(movie)}
                              />
                            ))}
                          </SimpleGrid>
                        </>
                      ) : (
                        <Center py={12}>
                          <VStack spacing={4}>
                            <Text fontSize="xl" color="gray.600" _dark={{ color: 'gray.400' }}>
                              No movies found
                            </Text>
                            <Text color="gray.500" textAlign="center">
                              Try searching with a different keyword
                            </Text>
                          </VStack>
                        </Center>
                      )}
                    </>
                  )}

                  {/* Initial State */}
                  {!hasSearched && !loading && (
                    <Center py={12}>
                      <VStack spacing={4}>
                        <Text fontSize="xl" color="gray.600" _dark={{ color: 'gray.400' }}>
                          Start searching for movies
                        </Text>
                        <Text color="gray.500" textAlign="center">
                          Type a movie name in the search box above
                        </Text>
                      </VStack>
                    </Center>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
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

