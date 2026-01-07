import { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Badge,
  Flex,
  Button,
} from '@chakra-ui/react'
import { DeleteIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useWatchlist } from '../contexts/WatchlistContext'
import ShowCard from '../components/ShowCard'
import MovieCard from '../components/MovieCard'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import EmptyState from '../components/shared/EmptyState'
import ResultsGrid from '../components/shared/ResultsGrid'
import { useModal } from '../hooks/useModal'
import { MEDIA_TYPES } from '../models/constants'

/**
 * Watchlist page component
 * Displays user's saved TV shows and movies organized by type
 * Features:
 * - Tabbed view for TV Shows and Movies
 * - Clear all functionality
 * - Modal for viewing details
 */
const Watchlist = () => {
  const { watchlist, getWatchlistByType, clearWatchlist } = useWatchlist()
  const navigate = useNavigate()
  const modal = useModal()

  const shows = getWatchlistByType(MEDIA_TYPES.SHOW)
  const movies = getWatchlistByType(MEDIA_TYPES.MOVIE)

  /**
   * Handles clicking on a TV show from watchlist
   */
  const handleShowClick = (watchlistItem) => {
    modal.setLoading(false)
    modal.openModal(watchlistItem.data, MEDIA_TYPES.SHOW)
  }

  /**
   * Handles clicking on a movie from watchlist
   */
  const handleMovieClick = (watchlistItem) => {
    modal.setLoading(false)
    modal.openModal(watchlistItem.data, MEDIA_TYPES.MOVIE)
  }

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      {/* Header */}
      <Box
        position="relative"
        bgGradient="linear(to-b, rgba(0,0,0,0.7), transparent)"
        pb={8}
        pt={4}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center" mb={8}>
            <HStack spacing={4} align="center">
              <Button
                leftIcon={<ChevronLeftIcon />}
                onClick={() => navigate('/')}
                variant="ghost"
                color="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                size="md"
              >
                Back
              </Button>
              <VStack align="flex-start" spacing={2}>
                <Heading
                  as="h1"
                  size="xl"
                  color="netflix.500"
                  fontWeight="900"
                  letterSpacing="tight"
                >
                  My Watchlist
                </Heading>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize="md">
                  {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} saved
                </Text>
              </VStack>
            </HStack>
            {watchlist.length > 0 && (
              <Button
                leftIcon={<DeleteIcon />}
                onClick={clearWatchlist}
                variant="ghost"
                color="rgba(255, 255, 255, 0.7)"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)', color: 'netflix.500' }}
                size="md"
              >
                Clear All
              </Button>
            )}
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {watchlist.length === 0 ? (
          <EmptyState
            title="Your watchlist is empty"
            message="Start adding shows and movies to your watchlist!"
          />
        ) : (
          <Tabs variant="netflix" colorScheme="netflix">
            <TabList mb={8} borderBottom="none">
              <Tab fontSize="20px" px={6} py={4}>
                TV Shows
                {shows.length > 0 && (
                  <Badge ml={2} bg="netflix.500" color="white" borderRadius="full" px={2}>
                    {shows.length}
                  </Badge>
                )}
              </Tab>
              <Tab fontSize="20px" px={6} py={4}>
                Movies
                {movies.length > 0 && (
                  <Badge ml={2} bg="netflix.500" color="white" borderRadius="full" px={2}>
                    {movies.length}
                  </Badge>
                )}
              </Tab>
            </TabList>

            <TabPanels>
              {/* TV Shows Tab */}
              <TabPanel px={0}>
                {shows.length === 0 ? (
                  <EmptyState
                    title="No TV shows in your watchlist"
                    message="Add TV shows to see them here"
                  />
                ) : (
                  <ResultsGrid
                    items={shows}
                    renderItem={(watchlistItem) => (
                      <ShowCard
                        show={watchlistItem.data}
                        onClick={() => handleShowClick(watchlistItem)}
                      />
                    )}
                    itemType="shows"
                    showCount={false}
                  />
                )}
              </TabPanel>

              {/* Movies Tab */}
              <TabPanel px={0}>
                {movies.length === 0 ? (
                  <EmptyState
                    title="No movies in your watchlist"
                    message="Add movies to see them here"
                  />
                ) : (
                  <ResultsGrid
                    items={movies}
                    renderItem={(watchlistItem) => (
                      <MovieCard
                        movie={watchlistItem.data}
                        onClick={() => handleMovieClick(watchlistItem)}
                      />
                    )}
                    itemType="movies"
                    showCount={false}
                  />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
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

export default Watchlist
