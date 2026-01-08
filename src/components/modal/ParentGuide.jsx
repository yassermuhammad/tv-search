import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { CONTENT_WARNING_LABELS, SEVERITY_LABELS, MPAA_RATINGS } from '../../models/parentGuideConstants'

/**
 * Parent Guide component to display content warnings and ratings
 * Shows content warnings like nudity, violence, profanity, etc.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.contentRatings - Content ratings from TMDB (certifications)
 * @param {Object} props.parentGuide - Detailed parent guide data (warnings, severity)
 * @param {boolean} props.loading - Loading state
 */
const ParentGuide = ({ contentRatings = [], parentGuide = null, loading = false }) => {
  // Extract US rating (MPAA) from content ratings
  // TMDB API structure:
  // - Movies: /release_dates returns array with iso_3166_1 and release_dates array
  // - TV: /content_ratings returns array with iso_3166_1 and rating string
  const getUSRating = () => {
    if (!contentRatings || contentRatings.length === 0) return null

    const usRating = contentRatings.find((rating) => rating.iso_3166_1 === 'US')
    if (!usRating) return null

    // For movies: release_dates array with certifications
    if (usRating.release_dates && Array.isArray(usRating.release_dates)) {
      const certifications = usRating.release_dates
        .map((rd) => rd.certification)
        .filter((c) => c && c !== '')
      if (certifications.length > 0) {
        // Return the most restrictive rating (alphabetically last, or use a priority system)
        return certifications.sort().pop()
      }
    }

    // For TV shows: direct rating string
    if (usRating.rating) {
      return usRating.rating
    }

    return null
  }

  const usRating = getUSRating()

  // If we have detailed parent guide data, use it
  // Otherwise, show basic certification info
  const hasDetailedGuide = parentGuide && Object.keys(parentGuide).length > 0

  if (loading) {
    return (
      <Box>
        <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold" mb={4}>
          Parent Guide
        </Text>
        <Text color="rgba(255, 255, 255, 0.6)">Loading content ratings...</Text>
      </Box>
    )
  }

  // If no ratings or guide data, don't show the section
  if (!usRating && !hasDetailedGuide) {
    return null
  }

  return (
    <Box>
      <HStack spacing={2} mb={4} align="center">
        <Icon as={WarningIcon} color="yellow.400" boxSize={5} />
        <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold">
          Parent Guide
        </Text>
      </HStack>

      <VStack spacing={4} align="stretch">
        {/* Content Rating Badge */}
        {usRating && (
          <Box>
            <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" mb={2}>
              Content Rating
            </Text>
            <Badge
              fontSize={{ base: 'sm', md: 'md' }}
              px={3}
              py={1}
              colorScheme={
                usRating === 'G' || usRating === 'PG'
                  ? 'green'
                  : usRating === 'PG-13'
                  ? 'yellow'
                  : 'red'
              }
              borderRadius="md"
            >
              {MPAA_RATINGS[usRating] || usRating}
            </Badge>
          </Box>
        )}

        {/* Detailed Content Warnings */}
        {hasDetailedGuide && (
          <Box>
            <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" mb={3}>
              Content Warnings
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              {Object.entries(parentGuide).map(([warningType, severity]) => {
                if (!severity || severity === 'none') return null

                const severityColor =
                  severity === 'mild'
                    ? 'yellow'
                    : severity === 'moderate'
                    ? 'orange'
                    : 'red'

                return (
                  <HStack
                    key={warningType}
                    spacing={2}
                    p={2}
                    bg="rgba(255, 255, 255, 0.05)"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.1)"
                  >
                    <Badge
                      colorScheme={severityColor}
                      fontSize="xs"
                      px={2}
                      py={0.5}
                      borderRadius="sm"
                    >
                      {SEVERITY_LABELS[severity] || severity}
                    </Badge>
                    <Text fontSize="sm" flex={1}>
                      {CONTENT_WARNING_LABELS[warningType] || warningType}
                    </Text>
                  </HStack>
                )
              })}
            </SimpleGrid>
          </Box>
        )}

        {/* Show message if only rating is available */}
        {usRating && !hasDetailedGuide && (
          <Text fontSize="xs" color="rgba(255, 255, 255, 0.5)" fontStyle="italic">
            Detailed content warnings are not available for this title.
          </Text>
        )}
      </VStack>
    </Box>
  )
}

export default ParentGuide

