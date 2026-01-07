import { SimpleGrid, Box, VStack, HStack, Text, Badge, Image, IconButton } from '@chakra-ui/react'
import { getImageUrl } from '../../services/tmdbApi'
import {
  formatDate,
  formatRating,
  formatCurrency,
} from '../../utils/formatters'
import { COLORS } from '../../utils/constants'
import { MEDIA_TYPES } from '../../models/constants'
import { useWatchlist } from '../../contexts/WatchlistContext'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Media information section component
 * Displays poster image and detailed information about the media
 * @param {Object} props - Component props
 * @param {Movie|TVShow} props.item - Movie or show item
 * @param {MediaType} props.type - Item type ('movie' or 'show')
 */
const MediaInfo = ({ item, type }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(item.id, type)

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
              height={{ base: '300px', md: '400px' }}
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
          height={{ base: '300px', md: '400px' }}
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
              height={{ base: '300px', md: '400px' }}
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
          height={{ base: '300px', md: '400px' }}
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
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
      {/* Poster Image */}
      <Box position="relative">
        {renderPoster()}
        {/* Heart Icon Button - Mobile Only */}
        <IconButton
          aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={inWatchlist ? '#E50914' : 'none'}
              stroke={inWatchlist ? '#E50914' : 'white'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: 'all 0.2s ease-in-out',
                transform: inWatchlist ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          }
          onClick={(e) => {
            e.stopPropagation()
            toggleWatchlist(item, type)
          }}
          position="absolute"
          top={3}
          right={3}
          bg={inWatchlist ? 'rgba(229, 9, 20, 0.2)' : 'rgba(0, 0, 0, 0.6)'}
          color={inWatchlist ? '#E50914' : 'white'}
          borderRadius="full"
          size="md"
          minW="48px"
          h="48px"
          _hover={{
            bg: inWatchlist ? 'rgba(229, 9, 20, 0.3)' : 'rgba(0, 0, 0, 0.8)',
            transform: 'scale(1.1)',
          }}
          _active={{
            transform: 'scale(0.95)',
          }}
          transition="all 0.2s ease-in-out"
          display={{ base: 'flex', md: 'none' }}
          zIndex={10}
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.4)"
        />
      </Box>

      {/* Basic Info */}
      <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
        {/* Rating */}
        {(type === MEDIA_TYPES.MOVIE ? item.vote_average : item.rating?.average) && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={{ base: 1.5, md: 2 }}
            >
              Rating
            </Text>
            <Badge
              bg="rgba(234, 179, 8, 0.2)"
              color="yellow.400"
              fontSize={{ base: 'md', md: 'lg' }}
              p={{ base: 1.5, md: 2 }}
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
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={{ base: 1.5, md: 2 }}
            >
              Genres
            </Text>
            <HStack spacing={{ base: 1.5, md: 2 }} flexWrap="wrap">
              {(type === MEDIA_TYPES.MOVIE ? item.genres : item.genres)?.map((genre) => (
                <Badge
                  key={genre.id || genre}
                  bg="rgba(255, 255, 255, 0.1)"
                  color="rgba(255, 255, 255, 0.8)"
                  fontSize={{ base: 'xs', md: 'sm' }}
                  px={{ base: 1.5, md: 2 }}
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
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={1}
            >
              {type === MEDIA_TYPES.MOVIE ? 'Release Date' : 'Premiere Date'}
            </Text>
            <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }}>
              {formatDate(type === MEDIA_TYPES.MOVIE ? item.release_date : item.premiered)}
            </Text>
          </Box>
        )}

        {/* End Date (for shows) */}
        {type === MEDIA_TYPES.SHOW && item.ended && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={1}
            >
              End Date
            </Text>
            <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }}>
              {formatDate(item.ended)}
            </Text>
          </Box>
        )}

        {/* Runtime */}
        {(type === MEDIA_TYPES.MOVIE ? item.runtime : item.runtime || item.averageRuntime) && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={1}
            >
              Runtime
            </Text>
            <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }}>
              {type === MEDIA_TYPES.MOVIE
                ? `${item.runtime} minutes`
                : `${item.runtime || item.averageRuntime} minutes per episode`}
            </Text>
          </Box>
        )}

        {/* Type (for shows) */}
        {type === MEDIA_TYPES.SHOW && item.type && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={1}
            >
              Type
            </Text>
            <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }}>
              {item.type}
            </Text>
          </Box>
        )}

        {/* Language */}
        {(type === MEDIA_TYPES.MOVIE ? item.original_language : item.language) && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={1}
            >
              Language
            </Text>
            <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }} textTransform="uppercase">
              {type === MEDIA_TYPES.MOVIE ? item.original_language : item.language}
            </Text>
          </Box>
        )}

        {/* Network/Production Company */}
        {type === MEDIA_TYPES.SHOW && (item.network || item.webChannel) && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={1}
            >
              Network
            </Text>
            <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }}>
              {item.network?.name || item.webChannel?.name}
              {item.network?.country && ` • ${item.network.country.name}`}
            </Text>
          </Box>
        )}

        {/* Production Companies (for movies) */}
        {type === MEDIA_TYPES.MOVIE && item.production_companies && item.production_companies.length > 0 && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={1}
            >
              Production Companies
            </Text>
            <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }}>
              {item.production_companies.map((company) => company.name).join(', ')}
            </Text>
          </Box>
        )}

        {/* Schedule (for shows) */}
        {type === MEDIA_TYPES.SHOW && item.schedule && item.schedule.days && item.schedule.days.length > 0 && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={1}
            >
              Schedule
            </Text>
            <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }}>
              {item.schedule.days.join(', ')}
              {item.schedule.time && ` at ${item.schedule.time}`}
            </Text>
          </Box>
        )}

        {/* Budget/Revenue (for movies) */}
        {type === MEDIA_TYPES.MOVIE && (item.budget || item.revenue) && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={1}
            >
              Box Office
            </Text>
            <VStack align="stretch" spacing={1}>
              {item.budget > 0 && (
                <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }}>
                  Budget: {formatCurrency(item.budget)}
                </Text>
              )}
              {item.revenue > 0 && (
                <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }}>
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

