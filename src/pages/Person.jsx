import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Image,
  Badge,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getPersonDetails, getPersonCredits, getImageUrl } from '../services/tmdbApi'
import DetailModal from '../components/DetailModal'
import Header from '../components/shared/Header'
import MovieCard from '../components/MovieCard'
import ShowCard from '../components/ShowCard'
import LoadingState from '../components/shared/LoadingState'
import EmptyState from '../components/shared/EmptyState'
import SEO from '../components/seo/SEO'
import { useModal } from '../hooks/useModal'
import { MEDIA_TYPES } from '../models/constants'
import { GRID_COLUMNS } from '../utils/constants'
import { formatDate } from '../utils/formatters'
import { getMovieById } from '../services/tmdbApi'
import { searchTVShow } from '../services/tmdbApi'
import { getPersonStructuredData, getBreadcrumbStructuredData } from '../utils/seoHelpers'

/**
 * Person details page
 * Displays person information and their work (movies and TV shows)
 */
const Person = () => {
  const { personId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const modal = useModal()

  const [person, setPerson] = useState(null)
  const [credits, setCredits] = useState({ cast: [], crew: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch person details and credits
  useEffect(() => {
    const fetchPersonData = async () => {
      if (!personId) return

      setLoading(true)
      setError(null)

      try {
        const [personData, creditsData] = await Promise.all([
          getPersonDetails(parseInt(personId)),
          getPersonCredits(parseInt(personId)),
        ])

        setPerson(personData)
        setCredits(creditsData)
      } catch (err) {
        console.error('Error fetching person data:', err)
        setError(err.message || t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchPersonData()
  }, [personId, t])

  // Separate cast into movies and TV shows
  const castMovies = credits.cast.filter((item) => item.media_type === 'movie')
  const castTVShows = credits.cast.filter((item) => item.media_type === 'tv')

  // Sort by release date (most recent first)
  const sortedCastMovies = [...castMovies].sort((a, b) => {
    const dateA = a.release_date ? new Date(a.release_date) : new Date(0)
    const dateB = b.release_date ? new Date(b.release_date) : new Date(0)
    return dateB - dateA
  })

  const sortedCastTVShows = [...castTVShows].sort((a, b) => {
    const dateA = a.first_air_date ? new Date(a.first_air_date) : new Date(0)
    const dateB = b.first_air_date ? new Date(b.first_air_date) : new Date(0)
    return dateB - dateA
  })

  /**
   * Handles clicking on a movie
   */
  const handleMovieClick = async (movie) => {
    modal.setLoading(true)
    modal.openModal(movie, MEDIA_TYPES.MOVIE)

    try {
      const fullDetails = await getMovieById(movie.id)
      modal.setSelectedItem(fullDetails)
    } catch (err) {
      console.error('Error fetching movie details:', err)
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles clicking on a TV show
   */
  const handleTVShowClick = async (show) => {
    modal.setLoading(true)
    
    // Convert TMDB show to TVMaze format
    const tvMazeShow = {
      id: show.id,
      name: show.name,
      _tmdbData: show,
    }
    
    modal.openModal(tvMazeShow, MEDIA_TYPES.SHOW)

    try {
      // Try to get TVMaze data if possible
      const tvMazeData = await searchTVShow(show.name)
      if (tvMazeData) {
        modal.setSelectedItem({ ...tvMazeData, _tmdbData: show })
      } else {
        modal.setSelectedItem(tvMazeShow)
      }
    } catch (err) {
      console.error('Error fetching TV show details:', err)
      modal.setSelectedItem(tvMazeShow)
    } finally {
      modal.setLoading(false)
    }
  }

  /**
   * Handles back navigation
   */
  const handleBack = () => {
    navigate(-1)
  }

  /**
   * Handles similar item click from modal
   */
  const handleSimilarItemClick = async (item, itemType) => {
    modal.setLoading(true)
    modal.openModal(item, itemType)

    try {
      if (itemType === MEDIA_TYPES.MOVIE) {
        const fullDetails = await getMovieById(item.id)
        modal.setSelectedItem(fullDetails)
      } else {
        const tvMazeData = await searchTVShow(item.name)
        if (tvMazeData) {
          modal.setSelectedItem({ ...tvMazeData, _tmdbData: item })
        } else {
          modal.setSelectedItem({ ...item, _tmdbData: item })
        }
      }
    } catch (err) {
      console.error('Error fetching details:', err)
    } finally {
      modal.setLoading(false)
    }
  }

  // Generate structured data
  const personStructuredData = person ? getPersonStructuredData(person) : null
  const breadcrumbData = person
    ? getBreadcrumbStructuredData([
        { name: 'Home', url: 'https://yassermuhammad.github.io/tv-search/' },
        { name: person.name, url: `https://yassermuhammad.github.io/tv-search/person/${person.id}` },
      ])
    : null
  const structuredData = personStructuredData
    ? [personStructuredData, breadcrumbData].filter(Boolean)
    : null

  if (loading) {
    return (
      <Box minH="100vh" bg="#141414">
        <SEO title="Loading..." noindex={true} />
        <Header showBackButton onBack={handleBack} />
        <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6, lg: 8 }}>
          <LoadingState message={t('person.loading')} />
        </Container>
      </Box>
    )
  }

  if (error || !person) {
    return (
      <Box minH="100vh" bg="#141414">
        <SEO title="Person Not Found" noindex={true} />
        <Header showBackButton onBack={handleBack} />
        <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6, lg: 8 }}>
          <EmptyState title={t('person.error')} message={error || t('person.notFound')} />
        </Container>
      </Box>
    )
  }

  const personImage = person.profile_path
    ? getImageUrl(person.profile_path)
    : 'https://yassermuhammad.github.io/tv-search/icon-512x512.png'

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title={`${person.name} - Movies & TV Shows`}
        description={person.biography || `Explore ${person.name}'s filmography. Discover movies and TV shows featuring ${person.name}.`}
        keywords={`${person.name}, actor, movies, TV shows, filmography, ${person.known_for_department || ''}`}
        image={personImage}
        type="profile"
        structuredData={structuredData}
      />
      <Header showBackButton onBack={handleBack} />

      <Container
        maxW="container.xl"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        {/* Person Header Section */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 4, md: 8 }}
          mb={{ base: 6, md: 8 }}
        >
          {/* Profile Image */}
          <Box flexShrink={0}>
            <Image
              src={
                person.profile_path
                  ? getImageUrl(person.profile_path)
                  : undefined
              }
              alt={person.name}
              w={{ base: '150px', md: '300px' }}
              h={{ base: '225px', md: '450px' }}
              objectFit="cover"
              borderRadius="md"
              bg="rgba(255, 255, 255, 0.1)"
              fallbackSrc="https://via.placeholder.com/300x450?text=No+Image"
            />
          </Box>

          {/* Person Info */}
          <VStack align="flex-start" spacing={4} flex={1}>
            <VStack align="flex-start" spacing={2}>
              <Heading
                size={{ base: 'xl', md: '2xl' }}
                color="white"
                fontWeight="bold"
              >
                {person.name}
              </Heading>
              {person.known_for_department && (
                <Badge colorScheme="netflix" fontSize="sm" px={3} py={1}>
                  {person.known_for_department}
                </Badge>
              )}
            </VStack>

            {person.biography && (
              <Box>
                <Text
                  color="white"
                  fontSize={{ base: 'sm', md: 'md' }}
                  lineHeight="tall"
                  noOfLines={{ base: 6, md: 10 }}
                >
                  {person.biography}
                </Text>
              </Box>
            )}

            <VStack align="flex-start" spacing={2} w="100%">
              {person.birthday && (
                <HStack>
                  <Text color="rgba(255, 255, 255, 0.7)" fontWeight="semibold">
                    {t('person.birthday')}:
                  </Text>
                  <Text color="white">
                    {formatDate(person.birthday)}
                    {person.deathday && ` - ${formatDate(person.deathday)}`}
                  </Text>
                </HStack>
              )}
              {person.place_of_birth && (
                <HStack>
                  <Text color="rgba(255, 255, 255, 0.7)" fontWeight="semibold">
                    {t('person.placeOfBirth')}:
                  </Text>
                  <Text color="white">{person.place_of_birth}</Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </Flex>

        <Divider borderColor="rgba(255, 255, 255, 0.1)" mb={{ base: 6, md: 8 }} />

        {/* Work Section */}
        <Tabs colorScheme="netflix" variant="line">
          <TabList>
            <Tab color="white">
              {t('person.movies')} ({castMovies.length})
            </Tab>
            <Tab color="white">
              {t('person.tvShows')} ({castTVShows.length})
            </Tab>
          </TabList>

          <TabPanels>
            {/* Movies Tab */}
            <TabPanel px={0} pt={6}>
              {sortedCastMovies.length > 0 ? (
                <SimpleGrid columns={GRID_COLUMNS} spacing={{ base: 4, md: 6 }}>
                  {sortedCastMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => handleMovieClick(movie)}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <EmptyState title={t('person.noMovies')} />
              )}
            </TabPanel>

            {/* TV Shows Tab */}
            <TabPanel px={0} pt={6}>
              {sortedCastTVShows.length > 0 ? (
                <SimpleGrid columns={GRID_COLUMNS} spacing={{ base: 4, md: 6 }}>
                  {sortedCastTVShows.map((show) => (
                    <ShowCard
                      key={show.id}
                      show={{
                        id: show.id,
                        name: show.name,
                        image: show.poster_path
                          ? {
                              medium: getImageUrl(show.poster_path),
                              original: getImageUrl(show.poster_path),
                            }
                          : null,
                        rating: show.vote_average
                          ? { average: show.vote_average }
                          : null,
                        premiered: show.first_air_date,
                        _tmdbData: show,
                      }}
                      onClick={() => handleTVShowClick(show)}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <EmptyState title={t('person.noTVShows')} />
              )}
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
        onItemClick={handleSimilarItemClick}
      />
    </Box>
  )
}

export default Person
