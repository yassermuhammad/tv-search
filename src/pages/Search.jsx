import { Box, Container } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { getShowById } from '../services/tvmazeApi'
import { getMovieById } from '../services/tmdbApi'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import SearchSection from '../components/home/SearchSection'
import SEO from '../components/seo/SEO'
import { useModal } from '../hooks/useModal'
import { MEDIA_TYPES } from '../models/constants'

/**
 * Search page component
 * Dedicated page for searching TV shows and movies
 * Features:
 * - Full-screen search interface
 * - Tabbed view for TV Shows and Movies
 * - Modal for viewing detailed information
 */
const Search = () => {
  const navigate = useNavigate()
  const modal = useModal()

  /**
   * Handles clicking on a TV show
   * Fetches full show details and opens modal
   */
  const handleShowClick = async (show) => {
    modal.setLoading(true)
    modal.openModal(show, MEDIA_TYPES.SHOW)
    
    try {
      // If it's a TMDB show, try to get details from TVMaze if we have the name
      // Otherwise, use the TMDB data we already have
      if (show._tmdbData) {
        // For TMDB shows, we'll use the data we have
        // In the future, we could fetch full TMDB details
        modal.setSelectedItem(show)
      } else {
        // For TVMaze shows, fetch full details
        const fullDetails = await getShowById(show.id)
        modal.setSelectedItem(fullDetails)
      }
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

  /**
   * Handles clicking on a similar item from the detail modal
   * Closes current modal and opens a new one with the clicked item
   */
  const handleSimilarItemClick = async (item, itemType) => {
    // Close current modal
    modal.closeModal()
    
    // Small delay to ensure modal closes smoothly
    setTimeout(() => {
      if (itemType === MEDIA_TYPES.MOVIE) {
        handleMovieClick(item)
      } else {
        handleShowClick(item)
      }
    }, 100)
  }

  /**
   * Handles back navigation
   */
  const handleBack = () => {
    navigate('/')
  }

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title="Search Movies & TV Shows"
        description="Search for movies and TV shows. Find your favorite content, watch trailers, explore cast information, and discover new entertainment."
        keywords="movie search, TV show search, search movies, search TV shows, find movies, find TV shows, entertainment search"
      />
      <Header showBackButton onBack={handleBack} />

      <Container
        maxW="container.xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        {/* Search Section */}
        <SearchSection
          onShowClick={handleShowClick}
          onMovieClick={handleMovieClick}
        />
      </Container>

      {/* Detail Modal */}
      <DetailModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        item={modal.selectedItem}
        type={modal.itemType}
        isLoading={modal.loadingDetails}
        onItemClick={handleSimilarItemClick}
      />
    </Box>
  )
}

export default Search

