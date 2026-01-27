import { useState, useMemo } from 'react'
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
import { useTranslation } from 'react-i18next'
import { useWatchlist } from '../contexts/WatchlistContext'
import ShowCard from '../components/ShowCard'
import MovieCard from '../components/MovieCard'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import EmptyState from '../components/shared/EmptyState'
import ResultsGrid from '../components/shared/ResultsGrid'
import WatchlistGenreFilter from '../components/watchlist/WatchlistGenreFilter'
import SEO from '../components/seo/SEO'
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
  const { t } = useTranslation()
  const { watchlist, getWatchlistByType, clearWatchlist } = useWatchlist()
  const navigate = useNavigate()
  const modal = useModal()

  // Filter state for each tab
  const [selectedMovieGenres, setSelectedMovieGenres] = useState([])
  const [selectedShowGenres, setSelectedShowGenres] = useState([])

  const shows = getWatchlistByType(MEDIA_TYPES.SHOW)
  const movies = getWatchlistByType(MEDIA_TYPES.MOVIE)

  /**
   * Extracts genre names from an item's genres array
   * Handles both string arrays (TVMaze) and object arrays (TMDB)
   * Also checks _tmdbData for TMDB shows
   * @param {Object} itemData - Item data object
   * @returns {Array<string>} Array of genre names
   */
  const extractGenreNames = (itemData) => {
    // Try genres from item data first
    let genres = itemData?.genres
    
    // For TMDB shows, check _tmdbData if genres not found
    if ((!genres || genres.length === 0) && itemData?._tmdbData?.genres) {
      genres = itemData._tmdbData.genres
    }
    
    if (!genres || !Array.isArray(genres)) return []
    
    return genres.map((genre) => {
      if (typeof genre === 'string') return genre
      if (typeof genre === 'object' && genre.name) return genre.name
      return null
    }).filter(Boolean)
  }

  /**
   * Gets unique genres from watchlist items
   * @param {Array} items - Watchlist items
   * @returns {Array<string>} Sorted array of unique genre names
   */
  const getUniqueGenres = (items) => {
    const genreSet = new Set()
    items.forEach((item) => {
      const genres = extractGenreNames(item.data)
      genres.forEach((genre) => genreSet.add(genre))
    })
    return Array.from(genreSet).sort()
  }

  /**
   * Filters items by selected genres
   * @param {Array} items - Watchlist items to filter
   * @param {Array<string>} selectedGenres - Selected genre names
   * @returns {Array} Filtered items
   */
  const filterByGenres = (items, selectedGenres) => {
    if (!selectedGenres || selectedGenres.length === 0) {
      return items
    }
    return items.filter((item) => {
      const itemGenres = extractGenreNames(item.data)
      // Check if any selected genre matches any item genre
      return selectedGenres.some((selectedGenre) =>
        itemGenres.includes(selectedGenre)
      )
    })
  }

  // Get unique genres for each type
  const availableMovieGenres = useMemo(
    () => getUniqueGenres(movies),
    [movies]
  )
  const availableShowGenres = useMemo(
    () => getUniqueGenres(shows),
    [shows]
  )

  // Filter items based on selected genres
  const filteredMovies = useMemo(
    () => filterByGenres(movies, selectedMovieGenres),
    [movies, selectedMovieGenres]
  )
  const filteredShows = useMemo(
    () => filterByGenres(shows, selectedShowGenres),
    [shows, selectedShowGenres]
  )

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
      <SEO
        title="My Watchlist"
        description="Manage your personal watchlist of movies and TV shows. Save your favorite content and never miss what you want to watch."
        keywords="watchlist, saved movies, saved TV shows, my watchlist, personal watchlist, favorite movies, favorite TV shows"
        noindex={true}
      />
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
                {t('common.back')}
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
                  {t('common.myWatchlist')}
                </Heading>
                <Text
                  color="rgba(255, 255, 255, 0.7)"
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  {watchlist.length} {watchlist.length === 1 ? t('watchlist.item') : t('watchlist.items')} {t('watchlist.saved')}
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
                {t('watchlist.clearAll')}
              </Button>
            )}
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6, lg: 8 }}>
        {watchlist.length === 0 ? (
          <EmptyState
            title={t('emptyState.noWatchlistItems')}
            message={t('emptyState.addItems')}
          />
        ) : (
          <Tabs variant="netflix" colorScheme="netflix">
            <TabList mb={{ base: 4, md: 8 }} borderBottom="none">
              <Tab
                fontSize={{ base: '16px', md: '20px' }}
                px={{ base: 4, md: 6 }}
                py={{ base: 3, md: 4 }}
              >
                {t('watchlist.tvShows')}
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
                {t('watchlist.movies')}
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
                    title={t('watchlist.noTVShows')}
                    message={t('watchlist.addTVShows')}
                  />
                ) : (
                  <VStack align="stretch" spacing={4}>
                    {/* Genre Filter */}
                    <WatchlistGenreFilter
                      availableGenres={availableShowGenres}
                      selectedGenres={selectedShowGenres}
                      onChange={setSelectedShowGenres}
                    />

                    {/* Results */}
                    {filteredShows.length === 0 ? (
                      <EmptyState
                        title={t('watchlist.noShowsMatchFilters')}
                        message={t('watchlist.tryDifferentFilters')}
                      />
                    ) : (
                      <ResultsGrid
                        items={filteredShows}
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
                  </VStack>
                )}
              </TabPanel>

              {/* Movies Tab */}
              <TabPanel px={0}>
                {movies.length === 0 ? (
                  <EmptyState
                    title={t('watchlist.noMovies')}
                    message={t('watchlist.addMovies')}
                  />
                ) : (
                  <VStack align="stretch" spacing={4}>
                    {/* Genre Filter */}
                    <WatchlistGenreFilter
                      availableGenres={availableMovieGenres}
                      selectedGenres={selectedMovieGenres}
                      onChange={setSelectedMovieGenres}
                    />

                    {/* Results */}
                    {filteredMovies.length === 0 ? (
                      <EmptyState
                        title={t('watchlist.noMoviesMatchFilters')}
                        message={t('watchlist.tryDifferentFilters')}
                      />
                    ) : (
                      <ResultsGrid
                        items={filteredMovies}
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
                  </VStack>
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
