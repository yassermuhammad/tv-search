import {
  Box,
  Image,
  Text,
  Badge,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { useWatchlist } from '../contexts/WatchlistContext'
import { getStatusColor, stripHtml, formatDate } from '../utils/formatters'
import { MEDIA_TYPES } from '../models/constants'

/**
 * TV Show card component for displaying show information
 * Features:
 * - Poster image with hover effects
 * - Status badge (Running, Ended, etc.)
 * - Rating badge
 * - Watchlist toggle button
 * - Show details on hover
 * 
 * @param {Object} props - Component props
 * @param {Object} props.show - Show object from TVMaze API
 * @param {Function} props.onClick - Callback when card is clicked
 */
const ShowCard = ({ show, onClick }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(show.id, MEDIA_TYPES.SHOW)

  return (
    <Box
      position="relative"
      cursor="pointer"
      onClick={onClick}
      borderRadius="4px"
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
        '&:hover .card-info': {
          transform: 'translateY(-4px)',
        },
        '&:hover .card-description': {
          maxHeight: '60px',
        },
      }}
    >
      {/* Poster Image */}
      <Box position="relative" overflow="hidden" bg="#2a2a2a">
        {show.image?.medium ? (
          <Image
            className="card-image"
            src={show.image.medium}
            alt={show.name}
            width="100%"
            height={{ base: '240px', md: '280px' }}
            objectFit="cover"
            transition="transform 0.3s ease-out"
            fallback={
              <Box
                width="100%"
                height={{ base: '240px', md: '280px' }}
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
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
            height={{ base: '240px', md: '280px' }}
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
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

        {/* Status Badge */}
        <Badge
          position="absolute"
          top="8px"
          right="8px"
          colorScheme={getStatusColor(show.status)}
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="4px"
          fontWeight="bold"
          textTransform="uppercase"
        >
          {show.status}
        </Badge>

        {/* Rating Badge */}
        {show.rating?.average && (
          <Badge
            position="absolute"
            bottom="8px"
            right="8px"
            bg="rgba(0, 0, 0, 0.8)"
            color="yellow.400"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="4px"
            fontWeight="bold"
          >
            ⭐ {show.rating.average}/10
          </Badge>
        )}

        {/* Watchlist Button - Heart Icon */}
        <IconButton
          className="card-button"
          position="absolute"
          top="8px"
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
            toggleWatchlist(show, MEDIA_TYPES.SHOW)
          }}
          borderRadius="full"
          transition="all 0.2s"
          opacity={{ base: 1, md: 1 }}
          zIndex={5}
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.4)"
        />
      </Box>

      {/* Card Info - Shows on hover */}
      <Box
        className="card-info"
        p={4}
        bg="#1a1a1a"
        transform="translateY(0)"
        transition="all 0.3s ease-out"
      >
        <Text
          fontSize="md"
          fontWeight="bold"
          color="white"
          noOfLines={2}
          mb={2}
          lineHeight="1.3"
        >
          {show.name}
        </Text>

        {/* Genres */}
        {show.genres && show.genres.length > 0 && (
          <HStack spacing={1} mb={2} flexWrap="wrap">
            {show.genres.slice(0, 2).map((genre) => (
              <Badge
                key={genre}
                bg="rgba(255, 255, 255, 0.1)"
                color="rgba(255, 255, 255, 0.7)"
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="4px"
              >
                {genre}
              </Badge>
            ))}
          </HStack>
        )}

        {/* Year and Runtime */}
        <HStack spacing={2} mb={2}>
          {show.premiered && (
            <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
              {formatDate(show.premiered, { yearOnly: true })}
            </Text>
          )}
          {(show.runtime || show.averageRuntime) && (
            <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
              • {show.runtime || show.averageRuntime} min
            </Text>
          )}
        </HStack>

        {/* Description - Only visible on hover */}
        <Text
          className="card-description"
          fontSize="xs"
          color="rgba(255, 255, 255, 0.7)"
          noOfLines={3}
          maxH="0"
          overflow="hidden"
          transition="max-height 0.3s ease-out"
        >
          {stripHtml(show.summary)}
        </Text>
      </Box>
    </Box>
  )
}

export default ShowCard
