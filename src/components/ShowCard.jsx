import {
  Box,
  Image,
  Text,
  Badge,
  HStack,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'

const ShowCard = ({ show, onClick }) => {
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
    return html.replace(/<[^>]*>/g, '').trim() || 'No description available'
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).getFullYear()
  }

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
        {show.image?.medium ? (
          <Image
            src={show.image.medium}
            alt={show.name}
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
            height="280px"
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
            top="8px"
            left="8px"
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
              {formatDate(show.premiered)}
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
          {stripHtml(show.summary)}
        </Text>
      </Box>
    </Box>
  )
}

export default ShowCard
