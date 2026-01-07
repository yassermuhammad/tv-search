import { useState } from 'react'
import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { getShowById } from '../services/tvmazeApi'
import { getMovieById } from '../services/tmdbApi'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import HeroSection from '../components/shared/HeroSection'
import TVShowsTab from '../components/search/TVShowsTab'
import MoviesTab from '../components/search/MoviesTab'
import { useModal } from '../hooks/useModal'
import { MEDIA_TYPES } from '../models/constants'

/**
 * Home page component - Main search interface for TV shows and movies
 * Features:
 * - Tab-based navigation between TV Shows and Movies
 * - Search functionality with debouncing
 * - Modal for viewing detailed information
 * - Hero section with welcome message
 */
const Home = () => {
  const [activeTab, setActiveTab] = useState(0)
  const modal = useModal()

  /**
   * Handles clicking on a TV show
   * Fetches full show details and opens modal
   */
  const handleShowClick = async (show) => {
    modal.setLoading(true)
    modal.openModal(show, MEDIA_TYPES.SHOW)
    
    try {
      const fullDetails = await getShowById(show.id)
      modal.setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching show details:', err)
      // Keep the basic show data if detailed fetch fails
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles clicking on a movie
   * Fetches full movie details and opens modal
   */
  const handleMovieClick = async (movie) => {
    modal.setLoading(true)
    modal.openModal(movie, MEDIA_TYPES.MOVIE)
    
    try {
      const fullDetails = await getMovieById(movie.id)
      modal.setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching movie details:', err)
      // Keep the basic movie data if detailed fetch fails
    } finally {
      modal.setLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <Header />

      <Container maxW="container.xl">
        {/* Hero section */}
        <HeroSection />

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
            <TabPanel px={0}>
              <TVShowsTab onShowClick={handleShowClick} />
            </TabPanel>

            <TabPanel px={0}>
              <MoviesTab onMovieClick={handleMovieClick} />
            </TabPanel>
          </TabPanels>
        </Tabs>
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

export default Home
