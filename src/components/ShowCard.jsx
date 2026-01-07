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

const ShowCard = ({ show, onClick }) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Running':
        return 'green'
      case 'Ended':
        return 'red'
      case 'To Be Determined':
        return 'yellow'
      default:
        return 'gray'
    }
  }

  // Strip HTML from summary
  const stripHtml = (html) => {
    if (!html) return 'No description available'
    // Simple HTML tag removal using regex
    return html.replace(/<[^>]*>/g, '').trim() || 'No description available'
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).getFullYear()
  }

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
        {show.image?.medium ? (
          <Image
            src={show.image.medium}
            alt={show.name}
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
        <Badge
          position="absolute"
          top="2"
          right="2"
          colorScheme={getStatusColor(show.status)}
        >
          {show.status}
        </Badge>
      </Box>

      <CardBody>
        <Stack spacing="3">
          <Heading size="md" noOfLines={2}>
            {show.name}
          </Heading>

          <HStack spacing="2" flexWrap="wrap">
            {show.genres?.map((genre) => (
              <Badge key={genre} colorScheme="blue" variant="subtle">
                {genre}
              </Badge>
            ))}
          </HStack>

          <VStack align="stretch" spacing="1">
            {show.rating?.average && (
              <HStack>
                <Text fontSize="sm" fontWeight="semibold">
                  Rating:
                </Text>
                <Badge colorScheme="yellow" fontSize="sm">
                  {show.rating.average}/10
                </Badge>
              </HStack>
            )}

            <HStack>
              <Text fontSize="sm" color="gray.600">
                {show.type} • {show.runtime || show.averageRuntime || 'N/A'} min
              </Text>
            </HStack>

            {show.premiered && (
              <Text fontSize="sm" color="gray.600">
                Premiered: {formatDate(show.premiered)}
                {show.ended && ` • Ended: ${formatDate(show.ended)}`}
              </Text>
            )}

            {(show.network || show.webChannel) && (
              <Text fontSize="sm" color="gray.600">
                {show.network?.name || show.webChannel?.name}
                {show.network?.country && ` • ${show.network.country.name}`}
              </Text>
            )}
          </VStack>

          <Text fontSize="sm" noOfLines={3} color="gray.600">
            {stripHtml(show.summary)}
          </Text>

          {show.url && (
            <Link
              href={show.url}
              isExternal
              color="blue.500"
              fontSize="sm"
              display="flex"
              alignItems="center"
              gap="1"
            >
              View on TVMaze <ExternalLinkIcon />
            </Link>
          )}
        </Stack>
      </CardBody>
    </Card>
  )
}

export default ShowCard

