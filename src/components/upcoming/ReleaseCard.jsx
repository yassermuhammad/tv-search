import {
  Box,
  Image,
  Text,
  Badge,
  IconButton,
  HStack,
  Button,
  useToast,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { getImageUrl } from '../../services/tmdbApi'
import { useWatchlist } from '../../contexts/WatchlistContext'
import { useReminders } from '../../contexts/RemindersContext'
import { formatDate } from '../../utils/formatters'
import { MEDIA_TYPES } from '../../models/constants'
import { RATING_THRESHOLDS } from '../../models/constants'

/**
 * Release card component for displaying upcoming movie/TV show releases
 * Features:
 * - Poster image
 * - Release date prominently displayed
 * - Rating badge
 * - Watchlist toggle button
 * - "Set Reminder" button (placeholder for future implementation)
 * 
 * @param {Object} props - Component props
 * @param {Object} props.item - Movie or TV show object
 * @param {string} props.type - 'movie' or 'show'
 * @param {Function} props.onClick - Callback when card is clicked
 * @param {Function} props.onSetReminder - Callback for setting reminder (optional)
 */
const ReleaseCard = ({ item, type, onClick, onSetReminder }) => {
  const toast = useToast()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const { hasReminder, toggleReminder } = useReminders()
  const inWatchlist = isInWatchlist(item.id, type === 'movie' ? MEDIA_TYPES.MOVIE : MEDIA_TYPES.SHOW)
  const hasReminderSet = hasReminder(item.id, type === 'movie' ? MEDIA_TYPES.MOVIE : MEDIA_TYPES.SHOW)

  const posterUrl = type === 'movie' 
    ? getImageUrl(item.poster_path)
    : getImageUrl(item.poster_path)

  const title = type === 'movie' ? item.title : item.name
  const releaseDate = type === 'movie' ? item.release_date : item.first_air_date
  const rating = item.vote_average || 0

  return (
    <Box
      position="relative"
      cursor="pointer"
      onClick={onClick}
      borderRadius="8px"
      overflow="hidden"
      bg="#1a1a1a"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: 'scale(1.05) translateY(-8px)',
        zIndex: 10,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
      }}
      sx={{
        '&:hover .card-image': {
          transform: 'scale(1.1)',
        },
        '&:hover .card-overlay': {
          opacity: 1,
        },
      }}
    >
      {/* Poster Image */}
      <Box position="relative" overflow="hidden" bg="#2a2a2a">
        {posterUrl ? (
          <Image
            className="card-image"
            src={posterUrl}
            alt={title}
            width="100%"
            height={{ base: '280px', md: '320px' }}
            objectFit="cover"
            loading="lazy"
            decoding="async"
            transition="transform 0.3s ease-out"
            fallback={
              <Box
                width="100%"
                height={{ base: '280px', md: '320px' }}
                bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="rgba(255, 255, 255, 0.5)" fontSize="sm" fontWeight="600">
                  No Image
                </Text>
              </Box>
            }
          />
        ) : (
          <Box
            width="100%"
            height={{ base: '280px', md: '320px' }}
            bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="rgba(255, 255, 255, 0.5)" fontSize="sm" fontWeight="600">
              No Image Available
            </Text>
          </Box>
        )}

        {/* Gradient overlay on hover */}
        <Box
          className="card-overlay"
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-t, rgba(0,0,0,0.9), transparent)"
          opacity={0}
          transition="opacity 0.3s ease-out"
        />

        {/* Release Date Badge - Prominently displayed */}
        {releaseDate && (
          <Badge
            position="absolute"
            top="8px"
            left="8px"
            bg="rgba(229, 9, 20, 0.95)"
            color="white"
            fontSize="xs"
            px={3}
            py={2}
            borderRadius="6px"
            fontWeight="bold"
            textTransform="uppercase"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.4)"
          >
            {formatDate(releaseDate, { month: 'short', day: 'numeric', year: 'numeric' })}
          </Badge>
        )}

        {/* Rating Badge */}
        {rating > 0 && (
          <Badge
            position="absolute"
            bottom="8px"
            right="8px"
            bg={
              rating >= RATING_THRESHOLDS.EXCELLENT
                ? 'rgba(34, 197, 94, 0.9)'
                : rating >= RATING_THRESHOLDS.GOOD
                  ? 'rgba(234, 179, 8, 0.9)'
                  : 'rgba(239, 68, 68, 0.9)'
            }
            color="white"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="4px"
            fontWeight="bold"
          >
            ⭐ {rating.toFixed(1)}
          </Badge>
        )}

        {/* Type Badge */}
        <Badge
          position="absolute"
          top="8px"
          right="8px"
          bg={type === 'movie' ? 'rgba(59, 130, 246, 0.9)' : 'rgba(34, 197, 94, 0.9)'}
          color="white"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="4px"
          fontWeight="bold"
          textTransform="uppercase"
        >
          {type === 'movie' ? 'Movie' : 'TV Show'}
        </Badge>

        {/* Watchlist Button */}
        <IconButton
          position="absolute"
          bottom="8px"
          left="8px"
          aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          icon={
            inWatchlist ? (
              <CheckIcon />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            )
          }
          size="md"
          minW="40px"
          h="40px"
          bg={inWatchlist ? 'rgba(229, 9, 20, 0.9)' : 'rgba(0, 0, 0, 0.7)'}
          color="white"
          _hover={{
            bg: inWatchlist ? 'rgba(229, 9, 20, 1)' : 'rgba(0, 0, 0, 0.9)',
            transform: 'scale(1.1)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            toggleWatchlist(item, type === 'movie' ? MEDIA_TYPES.MOVIE : MEDIA_TYPES.SHOW)
          }}
          borderRadius="full"
          transition="all 0.2s"
          zIndex={5}
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.4)"
        />
      </Box>

      {/* Card Info */}
      <Box p={4} bg="#1a1a1a">
        <Text
          fontSize="md"
          fontWeight="bold"
          color="white"
          noOfLines={2}
          mb={2}
          lineHeight="1.3"
        >
          {title}
        </Text>

        {/* Description */}
        {item.overview && (
          <Text
            fontSize="xs"
            color="rgba(255, 255, 255, 0.7)"
            noOfLines={2}
            mb={3}
          >
            {item.overview}
          </Text>
        )}

        {/* Action Buttons */}
        <HStack spacing={2}>
          <Button
            size="sm"
            flex={1}
            bg={hasReminderSet ? 'rgba(229, 9, 20, 0.9)' : 'rgba(255, 255, 255, 0.1)'}
            color="white"
            _hover={{ bg: hasReminderSet ? 'rgba(229, 9, 20, 1)' : 'rgba(255, 255, 255, 0.2)' }}
            onClick={async (e) => {
              e.stopPropagation()
              try {
                const wasSet = hasReminderSet
                await toggleReminder(item, type === 'movie' ? MEDIA_TYPES.MOVIE : MEDIA_TYPES.SHOW)
                
                // Show toast notification
                toast({
                  title: wasSet ? 'Reminder Removed' : 'Reminder Set!',
                  description: wasSet 
                    ? `Removed reminder for ${title}`
                    : `You'll be reminded when ${title} releases${releaseDate ? ` on ${formatDate(releaseDate, { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}`,
                  status: wasSet ? 'info' : 'success',
                  duration: 3000,
                  isClosable: true,
                  position: 'bottom-right',
                })
                
                if (onSetReminder) {
                  onSetReminder(item, type)
                }
              } catch (error) {
                console.error('Error toggling reminder:', error)
                toast({
                  title: 'Error',
                  description: 'Failed to set reminder. Please try again.',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                  position: 'bottom-right',
                })
              }
            }}
            fontSize="xs"
            leftIcon={
              <svg
                width="16"
                height="16"
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
            }
          >
            {hasReminderSet ? 'Reminder Set' : 'Set Reminder'}
          </Button>
        </HStack>
      </Box>
    </Box>
  )
}

export default ReleaseCard
