import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  SimpleGrid,
  Icon,
  Collapse,
  Button,
} from '@chakra-ui/react'
import { WarningIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import {
  CONTENT_WARNING_LABELS,
  SEVERITY_LABELS,
  MPAA_RATINGS,
  getRatingDescription,
} from '../../models/parentGuideConstants'

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
  const [isRatingExpanded, setIsRatingExpanded] = useState(false)
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
  const ratingDescription = usRating ? getRatingDescription(usRating) : null

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
        {/* Content Rating with Details */}
        {usRating && ratingDescription && (
          <Box
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="md"
            p={{ base: 4, md: 3 }}
            bg="rgba(255, 255, 255, 0.03)"
          >
            <VStack spacing={2} align="stretch" mb={3}>
              <HStack 
                justify={{ base: 'flex-start', md: 'space-between' }} 
                align={{ base: 'flex-start', md: 'center' }}
                flexWrap="wrap"
                spacing={2}
              >
                <Text 
                  fontSize={{ base: 'sm', md: 'sm' }} 
                  color="rgba(255, 255, 255, 0.7)" 
                  fontWeight="medium"
                  flexShrink={0}
                >
                  Content Rating
                </Text>
                <Badge
                  fontSize={{ base: 'xs', md: 'sm' }}
                  px={{ base: 2, md: 3 }}
                  py={{ base: 1.5, md: 1 }}
                  colorScheme={
                    usRating === 'G' || usRating === 'PG' || usRating === 'TV-G' || usRating === 'TV-Y' || usRating === 'TV-Y7'
                      ? 'green'
                      : usRating === 'PG-13' || usRating === 'TV-PG'
                      ? 'yellow'
                      : usRating === 'TV-14'
                      ? 'orange'
                      : 'red'
                  }
                  borderRadius="md"
                  whiteSpace="nowrap"
                >
                  {ratingDescription.title}
                </Badge>
              </HStack>
              
              <Text 
                fontSize={{ base: 'sm', md: 'sm' }} 
                color="rgba(255, 255, 255, 0.9)" 
                fontWeight="medium"
                lineHeight="1.6"
              >
                {ratingDescription.description}
              </Text>
            </VStack>
            
            <Collapse in={isRatingExpanded} animateOpacity>
              <Box
                mt={2}
                pt={3}
                borderTop="1px solid rgba(255, 255, 255, 0.1)"
              >
                <Text 
                  fontSize={{ base: 'xs', md: 'xs' }} 
                  color="rgba(255, 255, 255, 0.7)" 
                  lineHeight="1.7"
                >
                  {ratingDescription.content}
                </Text>
              </Box>
            </Collapse>
            
            <Button
              size={{ base: 'sm', md: 'xs' }}
              variant="ghost"
              color="rgba(255, 255, 255, 0.6)"
              onClick={() => setIsRatingExpanded(!isRatingExpanded)}
              mt={3}
              leftIcon={isRatingExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              _hover={{ color: 'white', bg: 'rgba(255, 255, 255, 0.1)' }}
              width={{ base: '100%', md: 'auto' }}
              justifyContent={{ base: 'flex-start', md: 'center' }}
              fontSize={{ base: 'sm', md: 'xs' }}
              py={{ base: 2, md: 1 }}
            >
              {isRatingExpanded ? 'Show Less' : 'Show More Details'}
            </Button>
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
          <Text 
            fontSize={{ base: 'xs', md: 'xs' }} 
            color="rgba(255, 255, 255, 0.5)" 
            fontStyle="italic"
            textAlign={{ base: 'center', md: 'left' }}
            px={{ base: 2, md: 0 }}
          >
            Detailed content warnings are not available for this title.
          </Text>
        )}
      </VStack>
    </Box>
  )
}

export default ParentGuide

