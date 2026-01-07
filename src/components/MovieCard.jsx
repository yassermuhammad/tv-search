import {
  Box,
  Image,
  Text,
  Badge,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { getImageUrl } from '../services/tmdbApi'

const MovieCard = ({ movie, onClick }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).getFullYear()
  }

  // Format rating (TMDB uses 10-point scale)
  const formatRating = (rating) => {
    if (!rating) return null
    return rating.toFixed(1)
  }

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
      group
    >
      {/* Poster Image */}
      <Box position="relative" overflow="hidden" bg="#2a2a2a">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            width="100%"
            height="280px"
            objectFit="cover"
            transition="transform 0.3s ease-out"
            _groupHover={{
              transform: 'scale(1.1)',
            }}
            fallback={
              <Box
                width="100%"
                height="280px"
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
            height="280px"
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
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-t, rgba(0,0,0,0.9), transparent)"
          opacity={0}
          transition="opacity 0.3s ease-out"
          _groupHover={{
            opacity: 1,
          }}
        />

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <Badge
            position="absolute"
            top="8px"
            right="8px"
            bg={movie.vote_average >= 7 ? 'rgba(34, 197, 94, 0.9)' : movie.vote_average >= 5 ? 'rgba(234, 179, 8, 0.9)' : 'rgba(239, 68, 68, 0.9)'}
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
          left="8px"
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
      </Box>

      {/* Card Info - Shows on hover */}
      <Box
        p={4}
        bg="#1a1a1a"
        transform="translateY(0)"
        transition="all 0.3s ease-out"
        _groupHover={{
          transform: 'translateY(-4px)',
        }}
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
            {formatDate(movie.release_date)}
          </Text>
        )}

        {/* Description - Only visible on hover */}
        <Text
          fontSize="xs"
          color="rgba(255, 255, 255, 0.7)"
          noOfLines={3}
          maxH="0"
          overflow="hidden"
          transition="max-height 0.3s ease-out"
          _groupHover={{
            maxH: "60px",
          }}
        >
          {movie.overview || 'No description available'}
        </Text>
      </Box>
    </Box>
  )
}

export default MovieCard
