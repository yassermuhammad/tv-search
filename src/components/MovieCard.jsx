import {
  Box,
  Image,
  Text,
  Badge,
  IconButton,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { getImageUrl } from '../services/tmdbApi'
import { useWatchlist } from '../contexts/WatchlistContext'
import { formatDate, formatRating } from '../utils/formatters'
import { MEDIA_TYPES } from '../models/constants'
import { RATING_THRESHOLDS } from '../models/constants'

/**
 * Movie card component for displaying movie information
 * Features:
 * - Poster image with hover effects
 * - Rating badge
 * - Watchlist toggle button
 * - Movie details on hover
 * 
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object from TMDB API
 * @param {Function} props.onClick - Callback when card is clicked
 */
const MovieCard = ({ movie, onClick }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id, MEDIA_TYPES.MOVIE)

  const posterUrl = getImageUrl(movie.poster_path)

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
        {posterUrl ? (
          <Image
            className="card-image"
            src={posterUrl}
            alt={movie.title}
            width="100%"
            height={{ base: '240px', md: '280px' }}
            objectFit="cover"
            loading="lazy"
            decoding="async"
            transition="transform 0.3s ease-out"
            fallback={
              <Box
                width="100%"
                height={{ base: '240px', md: '280px' }}
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
            height={{ base: '240px', md: '280px' }}
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

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <Badge
            position="absolute"
            bottom="8px"
            right="8px"
            bg={
              movie.vote_average >= RATING_THRESHOLDS.EXCELLENT
                ? 'rgba(34, 197, 94, 0.9)'
                : movie.vote_average >= RATING_THRESHOLDS.GOOD
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
            ⭐ {formatRating(movie.vote_average)}
          </Badge>
        )}

        {/* Movie Badge */}
        <Badge
          position="absolute"
          top="8px"
          right="8px"
          bg="rgba(229, 9, 20, 0.9)"
          color="white"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="4px"
          fontWeight="bold"
          textTransform="uppercase"
        >
          Movie
        </Badge>

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
            toggleWatchlist(movie, MEDIA_TYPES.MOVIE)
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
          {movie.title}
        </Text>

        {/* Year */}
        {movie.release_date && (
          <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)" mb={2}>
            {formatDate(movie.release_date, { yearOnly: true })}
          </Text>
        )}

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
          {movie.overview || 'No description available'}
        </Text>
      </Box>
    </Box>
  )
}

export default MovieCard
