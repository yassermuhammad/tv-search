import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Grid } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../components/shared/Header'
import CalendarView from '../components/upcoming/CalendarView'
import ListView from '../components/upcoming/ListView'
import ReleaseCard from '../components/upcoming/ReleaseCard'
import NotificationPermission from '../components/shared/NotificationPermission'
import DetailModal from '../components/DetailModal'
import SEO from '../components/seo/SEO'
import { useUpcoming } from '../hooks/useUpcoming'
import { useModal } from '../hooks/useModal'
import { getMovieById, getTVShowById } from '../services/tmdbApi'
import { adaptTMDBShowsToTVMaze } from '../utils/tmdbAdapter'
import { MEDIA_TYPES } from '../models/constants'

/**
 * Upcoming Releases page
 * Features:
 * - Calendar view and list view
 * - Filter by movies/TV shows
 * - View upcoming releases
 * - Set reminders (placeholder)
 * 
 * Routes:
 * - /upcoming - Default (list view, all content)
 * - /upcoming/movies - Movies only
 * - /upcoming/tv-shows - TV shows only
 * - /upcoming/calendar - Calendar view
 */
const Upcoming = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const modal = useModal()
  const { isOpen: isDateModalOpen, onOpen: onDateModalOpen, onClose: onDateModalClose } = useDisclosure()
  const [selectedDateReleases, setSelectedDateReleases] = useState({ movies: [], tvShows: [] })
  const [selectedDate, setSelectedDate] = useState(null)

  // Determine view type and content type from URL
  const pathname = location.pathname
  const isCalendarView = pathname.includes('/calendar')
  const contentType = pathname.includes('/movies')
    ? 'movies'
    : pathname.includes('/tv-shows')
      ? 'tv-shows'
      : 'all'

  // Fetch upcoming content
  const { upcomingMovies, upcomingTVShows, loading, error } = useUpcoming(contentType)

  // Handle item click
  const handleItemClick = async (item, type) => {
    modal.setLoading(true)
    modal.openModal(item, type === 'movie' ? MEDIA_TYPES.MOVIE : MEDIA_TYPES.SHOW)

    try {
      if (type === 'movie') {
        const fullDetails = await getMovieById(item.id)
        modal.setSelectedItem(fullDetails)
      } else {
        const fullDetails = await getTVShowById(item.id)
        const adaptedShow = adaptTMDBShowsToTVMaze([fullDetails])[0]
        adaptedShow._tmdbData = fullDetails
        modal.setSelectedItem(adaptedShow)
      }
    } catch (err) {
      console.error('Error fetching details:', err)
    } finally {
      modal.setLoading(false)
    }
  }

  // Handle date click in calendar
  const handleDateClick = (date, releases) => {
    setSelectedDate(date)
    setSelectedDateReleases(releases)
    onDateModalOpen()
  }

  // Handle set reminder (placeholder)
  const handleSetReminder = (item, type) => {
    // TODO: Implement reminder functionality with Firestore
    console.log('Set reminder for:', item, type)
    // This will be implemented in a future update
  }

  // Get releases for selected date
  const selectedDateReleasesList = [
    ...selectedDateReleases.movies.map((m) => ({ ...m, _type: 'movie' })),
    ...selectedDateReleases.tvShows.map((s) => ({ ...s, _type: 'show' })),
  ]

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title="Upcoming Releases - WatchPedia"
        description="Discover upcoming movie and TV show releases. Browse by calendar or list view, filter by date, and set reminders for your favorite content."
        keywords="upcoming movies, upcoming TV shows, release calendar, movie releases, TV show releases, release dates"
      />
      <Header />

      <Container
        maxW="container.xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        <VStack spacing={6} align="stretch">
          {/* Notification Permission Banner */}
          <NotificationPermission />

          {/* Page Title */}
          <Box>
            <Box
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="bold"
              color="white"
              mb={2}
            >
              Upcoming Releases
            </Box>
            <Box fontSize="md" color="gray.400">
              Discover what's coming soon to theaters and streaming
            </Box>
          </Box>

          {/* Tabs for View Selection */}
          <Tabs
            index={isCalendarView ? 1 : 0}
            onChange={(index) => {
              if (index === 0) {
                navigate(`/upcoming${contentType !== 'all' ? `/${contentType}` : ''}`)
              } else {
                navigate(`/upcoming/calendar${contentType !== 'all' ? `/${contentType}` : ''}`)
              }
            }}
            colorScheme="red"
          >
            <TabList borderColor="gray.700">
              <Tab
                color="gray.400"
                _selected={{ color: 'white', borderColor: 'red.500' }}
              >
                List View
              </Tab>
              <Tab
                color="gray.400"
                _selected={{ color: 'white', borderColor: 'red.500' }}
              >
                Calendar View
              </Tab>
            </TabList>

            <TabPanels>
              {/* List View */}
              <TabPanel px={0} pt={6}>
                <ListView
                  movies={upcomingMovies}
                  tvShows={upcomingTVShows}
                  onItemClick={handleItemClick}
                  onSetReminder={handleSetReminder}
                />
              </TabPanel>

              {/* Calendar View */}
              <TabPanel px={0} pt={6}>
                <CalendarView
                  movies={upcomingMovies}
                  tvShows={upcomingTVShows}
                  onDateClick={handleDateClick}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Content Type Filter */}
          <Box>
            <Box fontSize="sm" color="gray.400" mb={2}>
              Filter by Type
            </Box>
            <Box display="flex" gap={2}>
              <Box
                as="button"
                px={4}
                py={2}
                borderRadius="md"
                bg={contentType === 'all' ? 'red.500' : 'gray.800'}
                color="white"
                onClick={() => navigate(isCalendarView ? '/upcoming/calendar' : '/upcoming')}
                _hover={{ bg: contentType === 'all' ? 'red.600' : 'gray.700' }}
              >
                All
              </Box>
              <Box
                as="button"
                px={4}
                py={2}
                borderRadius="md"
                bg={contentType === 'movies' ? 'blue.500' : 'gray.800'}
                color="white"
                onClick={() => navigate(isCalendarView ? '/upcoming/calendar/movies' : '/upcoming/movies')}
                _hover={{ bg: contentType === 'movies' ? 'blue.600' : 'gray.700' }}
              >
                Movies
              </Box>
              <Box
                as="button"
                px={4}
                py={2}
                borderRadius="md"
                bg={contentType === 'tv-shows' ? 'green.500' : 'gray.800'}
                color="white"
                onClick={() => navigate(isCalendarView ? '/upcoming/calendar/tv-shows' : '/upcoming/tv-shows')}
                _hover={{ bg: contentType === 'tv-shows' ? 'green.600' : 'gray.700' }}
              >
                TV Shows
              </Box>
            </Box>
          </Box>
        </VStack>
      </Container>

      {/* Detail Modal */}
      <DetailModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        item={modal.selectedItem}
        type={modal.itemType}
        isLoading={modal.loadingDetails}
      />

      {/* Date Releases Modal */}
      <Modal isOpen={isDateModalOpen} onClose={onDateModalClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="#1a1a1a" color="white">
          <ModalHeader>
            Releases on {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedDateReleasesList.length > 0 ? (
              <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                }}
                gap={4}
              >
                {selectedDateReleasesList.map((item) => (
                  <ReleaseCard
                    key={`${item._type}-${item.id}`}
                    item={item}
                    type={item._type}
                    onClick={() => {
                      onDateModalClose()
                      handleItemClick(item, item._type)
                    }}
                    onSetReminder={handleSetReminder}
                  />
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={8}>
                <Box color="gray.400">No releases found for this date</Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Upcoming
