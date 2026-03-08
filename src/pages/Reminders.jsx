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
  IconButton,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReminders } from '../contexts/RemindersContext'
import ReleaseCard from '../components/upcoming/ReleaseCard'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import EmptyState from '../components/shared/EmptyState'
import ResultsGrid from '../components/shared/ResultsGrid'
import NotificationPermission from '../components/shared/NotificationPermission'
import SEO from '../components/seo/SEO'
import { useModal } from '../hooks/useModal'
import { MEDIA_TYPES } from '../models/constants'
import { getMovieById, getTVShowById } from '../services/tmdbApi'
import { adaptTMDBShowsToTVMaze } from '../utils/tmdbAdapter'
import { formatDate } from '../utils/formatters'

/**
 * Reminders page component
 * Displays user's saved release reminders organized by type
 * Features:
 * - Tabbed view for TV Shows and Movies
 * - Sorted by release date
 * - Clear all functionality
 * - Modal for viewing details
 */
const Reminders = () => {
  const { t } = useTranslation()
  const { reminders, getRemindersByType, clearReminders, removeReminder, getUpcomingReminders } = useReminders()
  const navigate = useNavigate()
  const modal = useModal()

  const shows = getRemindersByType(MEDIA_TYPES.SHOW)
  const movies = getRemindersByType(MEDIA_TYPES.MOVIE)
  const upcomingReminders = getUpcomingReminders()

  // Sort reminders by release date
  const sortedShows = useMemo(() => {
    return [...shows].sort((a, b) => {
      const dateA = new Date(a.releaseDate || 0)
      const dateB = new Date(b.releaseDate || 0)
      return dateA - dateB
    })
  }, [shows])

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      const dateA = new Date(a.releaseDate || 0)
      const dateB = new Date(b.releaseDate || 0)
      return dateA - dateB
    })
  }, [movies])

  /**
   * Handles clicking on a TV show reminder
   */
  const handleShowClick = async (reminder) => {
    modal.setLoading(true)
    modal.openModal(reminder.itemData, MEDIA_TYPES.SHOW)

    try {
      const fullDetails = await getTVShowById(reminder.itemId)
      const adaptedShow = adaptTMDBShowsToTVMaze([fullDetails])[0]
      adaptedShow._tmdbData = fullDetails
      modal.setSelectedItem(adaptedShow)
    } catch (err) {
      console.error('Error fetching show details:', err)
      modal.setSelectedItem(reminder.itemData)
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles clicking on a movie reminder
   */
  const handleMovieClick = async (reminder) => {
    modal.setLoading(true)
    modal.openModal(reminder.itemData, MEDIA_TYPES.MOVIE)

    try {
      const fullDetails = await getMovieById(reminder.itemId)
      modal.setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching movie details:', err)
      modal.setSelectedItem(reminder.itemData)
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles removing a reminder
   */
  const handleRemoveReminder = async (reminder) => {
    try {
      await removeReminder(reminder.itemId, reminder.type)
    } catch (error) {
      console.error('Error removing reminder:', error)
    }
  }

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title="My Reminders - WatchPedia"
        description="Manage your release reminders. Never miss when your favorite movies and TV shows are released."
        keywords="reminders, release reminders, upcoming releases, movie reminders, TV show reminders"
        noindex={true}
      />
      <Header showBackButton onBack={() => navigate('/')} />

      <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6, lg: 8 }}>
        <Flex
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          mb={{ base: 4, md: 6 }}
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 3, sm: 0 }}
        >
          <VStack align={{ base: 'flex-start', sm: 'flex-start' }} spacing={1}>
            <Heading
              as="h1"
              size={{ base: 'lg', md: 'xl' }}
              color="netflix.500"
              fontWeight="900"
              letterSpacing="tight"
              fontSize={{ base: '20px', sm: '24px', md: '28px' }}
            >
              My Reminders
            </Heading>
            <Text
              color="rgba(255, 255, 255, 0.7)"
              fontSize={{ base: 'sm', md: 'md' }}
            >
              {reminders.length} {reminders.length === 1 ? 'reminder' : 'reminders'} set
              {upcomingReminders.length > 0 && (
                <Text as="span" color="green.400" ml={2}>
                  • {upcomingReminders.length} upcoming
                </Text>
              )}
            </Text>
          </VStack>
          {reminders.length > 0 && (
            <Button
              leftIcon={<DeleteIcon />}
              onClick={clearReminders}
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
        <NotificationPermission />
        
        {reminders.length === 0 ? (
          <EmptyState
            title="No Reminders Set"
            message="Set reminders for upcoming releases to never miss when your favorite content is released."
            icon={
              <Box boxSize={12} color="gray.400">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </Box>
            }
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
                {sortedShows.length === 0 ? (
                  <EmptyState
                    title="No TV Show Reminders"
                    message="Set reminders for upcoming TV shows to get notified when they're released."
                  />
                ) : (
                  <VStack align="stretch" spacing={4}>
                    <ResultsGrid
                      items={sortedShows}
                      renderItem={(reminder) => (
                        <Box position="relative">
                          <ReleaseCard
                            item={reminder.itemData}
                            type="show"
                            onClick={() => handleShowClick(reminder)}
                            onSetReminder={() => handleRemoveReminder(reminder)}
                          />
                          {/* Release Date Badge */}
                          {reminder.releaseDate && (
                            <Badge
                              position="absolute"
                              top={2}
                              right={2}
                              bg="green.500"
                              color="white"
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="md"
                              zIndex={10}
                            >
                              {formatDate(reminder.releaseDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Badge>
                          )}
                        </Box>
                      )}
                      itemType="shows"
                      showCount={false}
                    />
                  </VStack>
                )}
              </TabPanel>

              {/* Movies Tab */}
              <TabPanel px={0}>
                {sortedMovies.length === 0 ? (
                  <EmptyState
                    title="No Movie Reminders"
                    message="Set reminders for upcoming movies to get notified when they're released."
                  />
                ) : (
                  <VStack align="stretch" spacing={4}>
                    <ResultsGrid
                      items={sortedMovies}
                      renderItem={(reminder) => (
                        <Box position="relative">
                          <ReleaseCard
                            item={reminder.itemData}
                            type="movie"
                            onClick={() => handleMovieClick(reminder)}
                            onSetReminder={() => handleRemoveReminder(reminder)}
                          />
                          {/* Release Date Badge */}
                          {reminder.releaseDate && (
                            <Badge
                              position="absolute"
                              top={2}
                              right={2}
                              bg="blue.500"
                              color="white"
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="md"
                              zIndex={10}
                            >
                              {formatDate(reminder.releaseDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Badge>
                          )}
                        </Box>
                      )}
                      itemType="movies"
                      showCount={false}
                    />
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

export default Reminders
