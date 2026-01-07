import {
  Box,
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { getImageUrl } from '../services/tmdbApi'

const MovieCard = ({ movie, onClick }) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

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
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)', cursor: 'pointer' }}
      transition="all 0.2s"
      height="100%"
      onClick={onClick}
    >
      <Box position="relative">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            width="100%"
            height="300px"
            objectFit="cover"
            fallback={
              <Box
                width="100%"
                height="300px"
                bg="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="gray.500">No Image</Text>
              </Box>
            }
          />
        ) : (
          <Box
            width="100%"
            height="300px"
            bg="gray.200"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.500">No Image Available</Text>
          </Box>
        )}
        {movie.vote_average > 0 && (
          <Badge
            position="absolute"
            top="2"
            right="2"
            colorScheme={movie.vote_average >= 7 ? 'green' : movie.vote_average >= 5 ? 'yellow' : 'red'}
          >
            {formatRating(movie.vote_average)}/10
          </Badge>
        )}
      </Box>

      <CardBody>
        <Stack spacing="3">
          <Heading size="md" noOfLines={2}>
            {movie.title}
          </Heading>

          {movie.genre_ids && movie.genre_ids.length > 0 && (
            <HStack spacing="2" flexWrap="wrap">
              <Badge colorScheme="purple" variant="subtle">
                Movie
              </Badge>
            </HStack>
          )}

          <VStack align="stretch" spacing="1">
            {movie.vote_average > 0 && (
              <HStack>
                <Text fontSize="sm" fontWeight="semibold">
                  Rating:
                </Text>
                <Badge colorScheme="yellow" fontSize="sm">
                  {formatRating(movie.vote_average)}/10
                </Badge>
              </HStack>
            )}

            {movie.release_date && (
              <Text fontSize="sm" color="gray.600">
                Released: {formatDate(movie.release_date)}
              </Text>
            )}

            {movie.original_language && (
              <Text fontSize="sm" color="gray.600" textTransform="uppercase">
                Language: {movie.original_language}
              </Text>
            )}
          </VStack>

          <Text fontSize="sm" noOfLines={3} color="gray.600">
            {movie.overview || 'No description available'}
          </Text>

          <Link
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            isExternal
            color="blue.500"
            fontSize="sm"
            display="flex"
            alignItems="center"
            gap="1"
          >
            View on TMDB <ExternalLinkIcon />
          </Link>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default MovieCard

