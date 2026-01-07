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
import { getSeasonEpisodes } from '../../services/tvmazeApi'
import { stripHtml, formatDate } from '../../utils/formatters'

/**
 * Seasons and episodes list component for TV shows
 * @param {Object} props - Component props
 * @param {Array} props.seasons - Array of seasons
 * @param {boolean} props.loading - Loading state
 */
const SeasonsList = ({ seasons, loading }) => {
  const [episodesBySeason, setEpisodesBySeason] = useState({})
  const [loadingEpisodes, setLoadingEpisodes] = useState({})
  const [expandedSeasons, setExpandedSeasons] = useState(new Set())

  /**
   * Fetches episodes for a season when expanded
   */
  const fetchEpisodesForSeason = async (seasonId, seasonNumber) => {
    if (episodesBySeason[seasonId]) {
      // Already loaded
      return
    }

    setLoadingEpisodes((prev) => ({ ...prev, [seasonId]: true }))
    try {
      const episodesData = await getSeasonEpisodes(seasonId)
      setEpisodesBySeason((prev) => ({ ...prev, [seasonId]: episodesData }))
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
      <Center py={8}>
        <VStack spacing={2}>
          <Spinner size="md" color="netflix.500" />
          <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
            Loading seasons...
          </Text>
        </VStack>
      </Center>
    )
  }

  if (seasons.length === 0) {
    return (
      <Text color="rgba(255, 255, 255, 0.5)" fontSize="sm">
        No seasons information available
      </Text>
    )
  }

  return (
    <Box>
      <Heading size="md" color="white" mb={4}>
        Seasons & Episodes
      </Heading>
      <VStack align="stretch" spacing={3}>
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
                p={4}
                bg="transparent"
                color="white"
                fontWeight="bold"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                onClick={() => toggleSeason(season.id, season.number)}
                borderRadius="0"
              >
                <HStack spacing={4}>
                  <Text fontSize="lg">Season {season.number}</Text>
                  {season.premiereDate && (
                    <Badge
                      bg="rgba(255, 255, 255, 0.1)"
                      color="rgba(255, 255, 255, 0.7)"
                      fontSize="xs"
                      px={2}
                      py={1}
                    >
                      {new Date(season.premiereDate).getFullYear()}
                    </Badge>
                  )}
                  {season.episodeOrder && (
                    <Badge
                      bg="rgba(255, 255, 255, 0.1)"
                      color="rgba(255, 255, 255, 0.7)"
                      fontSize="xs"
                      px={2}
                      py={1}
                    >
                      {season.episodeOrder} episodes
                    </Badge>
                  )}
                </HStack>
                {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Button>

              {isExpanded && (
                <Box p={4} pt={0}>
                  {isLoadingEp ? (
                    <Center py={4}>
                      <Spinner size="sm" color="netflix.500" />
                    </Center>
                  ) : episodes.length > 0 ? (
                    <VStack align="stretch" spacing={2} maxH="400px" overflowY="auto">
                      {episodes.map((episode) => (
                        <Box
                          key={episode.id}
                          p={3}
                          bg="rgba(0, 0, 0, 0.3)"
                          borderRadius="4px"
                          border="1px solid rgba(255, 255, 255, 0.05)"
                          _hover={{
                            bg: 'rgba(0, 0, 0, 0.5)',
                            borderColor: 'rgba(229, 9, 20, 0.3)',
                          }}
                          transition="all 0.2s"
                        >
                          <HStack justify="space-between" mb={2}>
                            <HStack spacing={2}>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="netflix.500"
                              >
                                E{episode.number}
                              </Text>
                              <Text fontSize="sm" fontWeight="semibold" color="white">
                                {episode.name || 'Untitled Episode'}
                              </Text>
                            </HStack>
                            {episode.airdate && (
                              <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
                                {formatDate(episode.airdate)}
                              </Text>
                            )}
                          </HStack>
                          {episode.summary && (
                            <Text
                              fontSize="xs"
                              color="rgba(255, 255, 255, 0.7)"
                              noOfLines={2}
                              lineHeight="1.4"
                            >
                              {stripHtml(episode.summary)}
                            </Text>
                          )}
                          {episode.runtime && (
                            <Text fontSize="xs" color="rgba(255, 255, 255, 0.5)" mt={1}>
                              {episode.runtime} min
                            </Text>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color="rgba(255, 255, 255, 0.5)" fontSize="sm" py={4}>
                      No episodes available
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

