import { HStack, Badge, Text, Icon, Tooltip, Box } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { getRatingDescription } from '../../models/parentGuideConstants'

/**
 * Compact parent guide component for individual episodes
 * Displays content rating badge
 * 
 * @param {Object} props - Component props
 * @param {string} props.rating - Content rating (e.g., 'TV-PG', 'TV-14', 'TV-MA')
 * @param {boolean} props.loading - Loading state
 */
const EpisodeParentGuide = ({ rating, loading = false }) => {
  if (loading) {
    return (
      <HStack spacing={1}>
        <Icon as={WarningIcon} color="yellow.400" boxSize={3} />
        <Text fontSize="xs" color="rgba(255, 255, 255, 0.5)">
          Loading...
        </Text>
      </HStack>
    )
  }

  if (!rating) {
    return null
  }

  // Determine color scheme based on rating
  const getColorScheme = (rating) => {
    if (!rating) return 'gray'
    
    // TV ratings
    if (rating.startsWith('TV-Y') || rating === 'TV-G') return 'green'
    if (rating === 'TV-PG') return 'yellow'
    if (rating === 'TV-14') return 'orange'
    if (rating === 'TV-MA') return 'red'
    
    // MPAA ratings (if used for episodes)
    if (rating === 'G' || rating === 'PG') return 'green'
    if (rating === 'PG-13') return 'yellow'
    if (rating === 'R' || rating === 'NC-17') return 'red'
    
    return 'gray'
  }

  const colorScheme = getColorScheme(rating)
  const ratingDescription = getRatingDescription(rating)

  const tooltipContent = ratingDescription ? (
    <Box>
      <Text fontWeight="bold" mb={1}>{ratingDescription.title}</Text>
      <Text fontSize="sm" mb={1}>{ratingDescription.description}</Text>
      <Text fontSize="xs" color="rgba(255, 255, 255, 0.8)">{ratingDescription.content}</Text>
    </Box>
  ) : (
    <Text>{rating}</Text>
  )

  return (
    <Tooltip
      label={tooltipContent}
      hasArrow
      placement="top"
      bg="gray.800"
      color="white"
      px={3}
      py={2}
      borderRadius="md"
      maxW="300px"
    >
      <HStack spacing={1} cursor="help">
        <Icon as={WarningIcon} color="yellow.400" boxSize={3} />
        <Badge
          fontSize="xs"
          px={1.5}
          py={0.5}
          colorScheme={colorScheme}
          borderRadius="sm"
        >
          {rating}
        </Badge>
      </HStack>
    </Tooltip>
  )
}

export default EpisodeParentGuide

