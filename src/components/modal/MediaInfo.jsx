import { SimpleGrid, Box, VStack, HStack, Text, Badge, Image } from '@chakra-ui/react'
import { getImageUrl } from '../../services/tmdbApi'
import {
  formatDate,
  formatRating,
  formatCurrency,
} from '../../utils/formatters'
import { COLORS } from '../../utils/constants'
import { MEDIA_TYPES } from '../../models/constants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Media information section component
 * Displays poster image and detailed information about the media
 * @param {Object} props - Component props
 * @param {Movie|TVShow} props.item - Movie or show item
 * @param {MediaType} props.type - Item type ('movie' or 'show')
 */
const MediaInfo = ({ item, type }) => {
  const renderPoster = () => {
    if (type === MEDIA_TYPES.MOVIE) {
      return item.poster_path ? (
        <Image
          src={getImageUrl(item.poster_path)}
          alt={item.title}
          borderRadius="md"
          fallback={
            <Box
              width="100%"
              height="400px"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
            >
              <Text color="gray.500">No Image Available</Text>
            </Box>
          }
        />
      ) : (
        <Box
          width="100%"
          height="400px"
          bg="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
        >
          <Text color="gray.500">No Image Available</Text>
        </Box>
      )
    } else {
      return item.image?.original || item.image?.medium ? (
        <Image
          src={item.image.original || item.image.medium}
          alt={item.name}
          borderRadius="md"
          fallback={
            <Box
              width="100%"
              height="400px"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
            >
              <Text color="gray.500">No Image Available</Text>
            </Box>
          }
        />
      ) : (
        <Box
          width="100%"
          height="400px"
          bg="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
        >
          <Text color="gray.500">No Image Available</Text>
        </Box>
      )
    }
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      {/* Poster Image */}
      <Box>{renderPoster()}</Box>

      {/* Basic Info */}
      <VStack align="stretch" spacing={4}>
        {/* Rating */}
        {(type === MEDIA_TYPES.MOVIE ? item.vote_average : item.rating?.average) && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={2}>
              Rating
            </Text>
            <Badge
              bg="rgba(234, 179, 8, 0.2)"
              color="yellow.400"
              fontSize="lg"
              p={2}
              borderRadius="4px"
              fontWeight="bold"
            >
                      ⭐ {formatRating(
                        type === MEDIA_TYPES.MOVIE ? item.vote_average : item.rating.average
                      )}/10
            </Badge>
          </Box>
        )}

        {/* Genres */}
        {((type === MEDIA_TYPES.MOVIE && item.genres) || (type === MEDIA_TYPES.SHOW && item.genres)) && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={2}>
              Genres
            </Text>
            <HStack spacing={2} flexWrap="wrap">
              {(type === MEDIA_TYPES.MOVIE ? item.genres : item.genres)?.map((genre) => (
                <Badge
                  key={genre.id || genre}
                  bg="rgba(255, 255, 255, 0.1)"
                  color="rgba(255, 255, 255, 0.8)"
                  fontSize="sm"
                  px={2}
                  py={1}
                  borderRadius="4px"
                >
                  {genre.name || genre}
                </Badge>
              ))}
            </HStack>
          </Box>
        )}

        {/* Release/Premiere Date */}
        {(type === MEDIA_TYPES.MOVIE ? item.release_date : item.premiered) && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={1}>
              {type === MEDIA_TYPES.MOVIE ? 'Release Date' : 'Premiere Date'}
            </Text>
            <Text color={TEXT_COLOR}>
              {formatDate(type === MEDIA_TYPES.MOVIE ? item.release_date : item.premiered)}
            </Text>
          </Box>
        )}

        {/* End Date (for shows) */}
        {type === MEDIA_TYPES.SHOW && item.ended && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={1}>
              End Date
            </Text>
            <Text color={TEXT_COLOR}>{formatDate(item.ended)}</Text>
          </Box>
        )}

        {/* Runtime */}
        {(type === MEDIA_TYPES.MOVIE ? item.runtime : item.runtime || item.averageRuntime) && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={1}>
              Runtime
            </Text>
            <Text color={TEXT_COLOR}>
              {type === MEDIA_TYPES.MOVIE
                ? `${item.runtime} minutes`
                : `${item.runtime || item.averageRuntime} minutes per episode`}
            </Text>
          </Box>
        )}

        {/* Type (for shows) */}
        {type === MEDIA_TYPES.SHOW && item.type && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={1}>
              Type
            </Text>
            <Text color={TEXT_COLOR}>{item.type}</Text>
          </Box>
        )}

        {/* Language */}
        {(type === MEDIA_TYPES.MOVIE ? item.original_language : item.language) && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={1}>
              Language
            </Text>
            <Text color={TEXT_COLOR} textTransform="uppercase">
              {type === MEDIA_TYPES.MOVIE ? item.original_language : item.language}
            </Text>
          </Box>
        )}

        {/* Network/Production Company */}
        {type === MEDIA_TYPES.SHOW && (item.network || item.webChannel) && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={1}>
              Network
            </Text>
            <Text color={TEXT_COLOR}>
              {item.network?.name || item.webChannel?.name}
              {item.network?.country && ` • ${item.network.country.name}`}
            </Text>
          </Box>
        )}

        {/* Production Companies (for movies) */}
        {type === MEDIA_TYPES.MOVIE && item.production_companies && item.production_companies.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={1}>
              Production Companies
            </Text>
            <Text color={TEXT_COLOR}>
              {item.production_companies.map((company) => company.name).join(', ')}
            </Text>
          </Box>
        )}

        {/* Schedule (for shows) */}
        {type === MEDIA_TYPES.SHOW && item.schedule && item.schedule.days && item.schedule.days.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={1}>
              Schedule
            </Text>
            <Text color={TEXT_COLOR}>
              {item.schedule.days.join(', ')}
              {item.schedule.time && ` at ${item.schedule.time}`}
            </Text>
          </Box>
        )}

        {/* Budget/Revenue (for movies) */}
        {type === MEDIA_TYPES.MOVIE && (item.budget || item.revenue) && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={TEXT_COLOR} mb={1}>
              Box Office
            </Text>
            <VStack align="stretch" spacing={1}>
              {item.budget > 0 && (
                <Text color={TEXT_COLOR}>
                  Budget: {formatCurrency(item.budget)}
                </Text>
              )}
              {item.revenue > 0 && (
                <Text color={TEXT_COLOR}>
                  Revenue: {formatCurrency(item.revenue)}
                </Text>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
    </SimpleGrid>
  )
}

export default MediaInfo

