import {
  Box,
  Heading,
  VStack,
  Button,
  HStack,
  Text,
  Badge,
  Center,
  Spinner,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getSeasonEpisodes } from '../../services/tvmazeApi'
import { getTVEpisodeContentRating } from '../../services/tmdbApi'
import { stripHtml, formatDate } from '../../utils/formatters'
import EpisodeParentGuide from './EpisodeParentGuide'

/**
 * Seasons and episodes list component for TV shows
 * @param {Object} props - Component props
 * @param {Array} props.seasons - Array of seasons
 * @param {boolean} props.loading - Loading state
 * @param {number} props.tmdbId - TMDB TV show ID (for fetching episode content ratings)
 * @param {string} props.showRating - Show-level content rating (fallback for episodes)
 */
const SeasonsList = ({ seasons, loading, tmdbId, showRating = null }) => {
  const { t } = useTranslation()
  const [episodesBySeason, setEpisodesBySeason] = useState({})
  const [loadingEpisodes, setLoadingEpisodes] = useState({})
  const [expandedSeasons, setExpandedSeasons] = useState(new Set())
  const [episodeRatings, setEpisodeRatings] = useState({}) // { 'season-episode': rating }
  const [loadingRatings, setLoadingRatings] = useState({}) // { 'season-episode': boolean }

  /**
   * Fetches content rating for a specific episode from TMDB
   */
  const fetchEpisodeRating = async (seasonNumber, episodeNumber) => {
    if (!tmdbId || !seasonNumber || !episodeNumber) return null

    const ratingKey = `${seasonNumber}-${episodeNumber}`
    
    // Check if already loaded
    if (episodeRatings[ratingKey] !== undefined) {
      return episodeRatings[ratingKey]
    }

    setLoadingRatings((prev) => ({ ...prev, [ratingKey]: true }))
    try {
      const rating = await getTVEpisodeContentRating(tmdbId, seasonNumber, episodeNumber)
      setEpisodeRatings((prev) => ({ ...prev, [ratingKey]: rating }))
      return rating
    } catch (error) {
      console.error('Error fetching episode rating:', error)
      setEpisodeRatings((prev) => ({ ...prev, [ratingKey]: null }))
      return null
    } finally {
      setLoadingRatings((prev) => ({ ...prev, [ratingKey]: false }))
    }
  }

  /**
   * Fetches episodes for a season when expanded
   */
  const fetchEpisodesForSeason = async (seasonId, seasonNumber) => {
    if (episodesBySeason[seasonId]) {
      // Already loaded, but fetch ratings if we have tmdbId
      if (tmdbId) {
        const episodes = episodesBySeason[seasonId]
        episodes.forEach((episode) => {
          if (episode.number) {
            fetchEpisodeRating(seasonNumber, episode.number)
          }
        })
      }
      return
    }

    setLoadingEpisodes((prev) => ({ ...prev, [seasonId]: true }))
    try {
      const episodesData = await getSeasonEpisodes(seasonId)
      setEpisodesBySeason((prev) => ({ ...prev, [seasonId]: episodesData }))
      
      // Fetch content ratings for all episodes if we have tmdbId
      if (tmdbId && episodesData.length > 0) {
        episodesData.forEach((episode) => {
          if (episode.number) {
            fetchEpisodeRating(seasonNumber, episode.number)
          }
        })
      }
    } catch (error) {
      console.error('Error fetching episodes:', error)
      setEpisodesBySeason((prev) => ({ ...prev, [seasonId]: [] }))
    } finally {
      setLoadingEpisodes((prev) => ({ ...prev, [seasonId]: false }))
    }
  }

  /**
   * Toggles season expansion
   */
  const toggleSeason = (seasonId, seasonNumber) => {
    const newExpanded = new Set(expandedSeasons)
    if (newExpanded.has(seasonId)) {
      newExpanded.delete(seasonId)
    } else {
      newExpanded.add(seasonId)
      fetchEpisodesForSeason(seasonId, seasonNumber)
    }
    setExpandedSeasons(newExpanded)
  }

  if (loading) {
    return (
      <Center py={{ base: 6, md: 8 }}>
        <VStack spacing={2}>
          <Spinner size={{ base: 'sm', md: 'md' }} color="netflix.500" />
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            {t('common.loading')}
          </Text>
        </VStack>
      </Center>
    )
  }

  if (seasons.length === 0) {
    return (
      <Text color="rgba(255, 255, 255, 0.5)" fontSize={{ base: 'xs', md: 'sm' }}>
        {t('emptyState.noItems')}
      </Text>
    )
  }

  return (
    <Box>
      <Heading
        size={{ base: 'sm', md: 'md' }}
        color="white"
        mb={{ base: 3, md: 4 }}
        fontSize={{ base: '18px', md: '20px' }}
      >
        {t('modal.seasonsEpisodes')}
      </Heading>
      <VStack align="stretch" spacing={{ base: 2, md: 3 }}>
        {seasons.map((season) => {
          const isExpanded = expandedSeasons.has(season.id)
          const episodes = episodesBySeason[season.id] || []
          const isLoadingEp = loadingEpisodes[season.id]

          return (
            <Box
              key={season.id}
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="8px"
              overflow="hidden"
              bg="rgba(255, 255, 255, 0.03)"
              _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
              transition="all 0.2s"
            >
              <Button
                w="100%"
                justifyContent="space-between"
                p={{ base: 3, md: 4 }}
                bg="transparent"
                color="white"
                fontWeight="bold"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                onClick={() => toggleSeason(season.id, season.number)}
                borderRadius="0"
                fontSize={{ base: 'sm', md: 'md' }}
              >
                <HStack spacing={{ base: 2, md: 4 }} flexWrap="wrap">
                  <Text fontSize={{ base: 'md', md: 'lg' }}>Season {season.number}</Text>
                  {season.premiereDate && (
                    <Badge
                      bg="rgba(255, 255, 255, 0.1)"
                      color="rgba(255, 255, 255, 0.7)"
                      fontSize={{ base: '10px', md: 'xs' }}
                      px={{ base: 1.5, md: 2 }}
                      py={1}
                    >
                      {new Date(season.premiereDate).getFullYear()}
                    </Badge>
                  )}
                  {season.episodeOrder && (
                    <Badge
                      bg="rgba(255, 255, 255, 0.1)"
                      color="rgba(255, 255, 255, 0.7)"
                      fontSize={{ base: '10px', md: 'xs' }}
                      px={{ base: 1.5, md: 2 }}
                      py={1}
                    >
                      {season.episodeOrder} episodes
                    </Badge>
                  )}
                </HStack>
                {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Button>

              {isExpanded && (
                <Box p={{ base: 3, md: 4 }} pt={0}>
                  {isLoadingEp ? (
                    <Center py={4}>
                      <Spinner size="sm" color="netflix.500" />
                    </Center>
                  ) : episodes.length > 0 ? (
                    <VStack
                      align="stretch"
                      spacing={{ base: 1.5, md: 2 }}
                      maxH={{ base: '300px', md: '400px' }}
                      overflowY="auto"
                    >
                      {episodes.map((episode) => (
                        <Box
                          key={episode.id}
                          p={{ base: 2, md: 3 }}
                          bg="rgba(0, 0, 0, 0.3)"
                          borderRadius="4px"
                          border="1px solid rgba(255, 255, 255, 0.05)"
                          _hover={{
                            bg: 'rgba(0, 0, 0, 0.5)',
                            borderColor: 'rgba(229, 9, 20, 0.3)',
                          }}
                          transition="all 0.2s"
                        >
                          <HStack justify="space-between" mb={{ base: 1, md: 2 }} flexWrap="wrap">
                            <HStack spacing={{ base: 1.5, md: 2 }} flex={1} minW={0}>
                              <Text
                                fontSize={{ base: 'xs', md: 'sm' }}
                                fontWeight="bold"
                                color="netflix.500"
                                flexShrink={0}
                              >
                                E{episode.number}
                              </Text>
                              <Text
                                fontSize={{ base: 'xs', md: 'sm' }}
                                fontWeight="semibold"
                                color="white"
                                noOfLines={1}
                              >
                                {episode.name || 'Untitled Episode'}
                              </Text>
                            </HStack>
                            <HStack spacing={2} flexShrink={0}>
                              {/* Parent Guide Rating */}
                              {(tmdbId || showRating) && (
                                <EpisodeParentGuide
                                  rating={
                                    episodeRatings[`${season.number}-${episode.number}`] ||
                                    showRating
                                  }
                                  loading={loadingRatings[`${season.number}-${episode.number}`]}
                                />
                              )}
                              {episode.airdate && (
                                <Text
                                  fontSize={{ base: '10px', md: 'xs' }}
                                  color="rgba(255, 255, 255, 0.6)"
                                >
                                  {formatDate(episode.airdate, { yearOnly: true })}
                                </Text>
                              )}
                            </HStack>
                          </HStack>
                          {episode.summary && (
                            <Text
                              fontSize={{ base: '10px', md: 'xs' }}
                              color="rgba(255, 255, 255, 0.7)"
                              noOfLines={2}
                              lineHeight="1.4"
                            >
                              {stripHtml(episode.summary)}
                            </Text>
                          )}
                          {episode.runtime && (
                            <Text
                              fontSize={{ base: '10px', md: 'xs' }}
                              color="rgba(255, 255, 255, 0.5)"
                              mt={1}
                            >
                              {episode.runtime} min
                            </Text>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text
                      color="rgba(255, 255, 255, 0.5)"
                      fontSize={{ base: 'xs', md: 'sm' }}
                      py={{ base: 3, md: 4 }}
                    >
                      {t('emptyState.noItems')}
                    </Text>
                  )}
                </Box>
              )}
            </Box>
          )
        })}
      </VStack>
    </Box>
  )
}

export default SeasonsList

