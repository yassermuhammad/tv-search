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
        pb={{ base: 4, md: 8 }}
        pt={{ base: 3, md: 4 }}
        px={{ base: 4, md: 0 }}
      >
        <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
          <Flex
            justify="space-between"
            align={{ base: 'flex-start', sm: 'center' }}
            mb={{ base: 4, md: 8 }}
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 3, sm: 0 }}
          >
            <HStack spacing={{ base: 2, md: 4 }} align="center" flex={1}>
              <Button
                leftIcon={<ChevronLeftIcon />}
                onClick={() => navigate('/')}
                variant="ghost"
                color="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                size={{ base: 'sm', md: 'md' }}
                display={{ base: 'none', sm: 'flex' }}
              >
                Back
              </Button>
              <VStack align={{ base: 'flex-start', sm: 'flex-start' }} spacing={1}>
                <Heading
                  as="h1"
                  size={{ base: 'lg', md: 'xl' }}
                  color="netflix.500"
                  fontWeight="900"
                  letterSpacing="tight"
                  fontSize={{ base: '20px', sm: '24px', md: '28px' }}
                >
                  My Watchlist
                </Heading>
                <Text
                  color="rgba(255, 255, 255, 0.7)"
                  fontSize={{ base: 'sm', md: 'md' }}
                >
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
                size={{ base: 'sm', md: 'md' }}
                fontSize={{ base: 'xs', md: 'sm' }}
                w={{ base: '100%', sm: 'auto' }}
              >
                Clear All
              </Button>
            )}
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6, lg: 8 }}>
        {watchlist.length === 0 ? (
          <EmptyState
            title="Your watchlist is empty"
            message="Start adding shows and movies to your watchlist!"
          />
        ) : (
          <Tabs variant="netflix" colorScheme="netflix">
            <TabList mb={{ base: 4, md: 8 }} borderBottom="none">
              <Tab
                fontSize={{ base: '16px', md: '20px' }}
                px={{ base: 4, md: 6 }}
                py={{ base: 3, md: 4 }}
              >
                TV Shows
                {shows.length > 0 && (
                  <Badge
                    ml={2}
                    bg="netflix.500"
                    color="white"
                    borderRadius="full"
                    px={{ base: 1.5, md: 2 }}
                    fontSize={{ base: '10px', md: 'xs' }}
                  >
                    {shows.length}
                  </Badge>
                )}
              </Tab>
              <Tab
                fontSize={{ base: '16px', md: '20px' }}
                px={{ base: 4, md: 6 }}
                py={{ base: 3, md: 4 }}
              >
                Movies
                {movies.length > 0 && (
                  <Badge
                    ml={2}
                    bg="netflix.500"
                    color="white"
                    borderRadius="full"
                    px={{ base: 1.5, md: 2 }}
                    fontSize={{ base: '10px', md: 'xs' }}
                  >
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
