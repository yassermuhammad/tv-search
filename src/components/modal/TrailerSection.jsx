import { Box, Heading, VStack, HStack, Button, Text, Icon } from '@chakra-ui/react'
import { useState } from 'react'
import { COLORS } from '../../utils/constants'

// Play icon SVG component
const PlayIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M8 5v14l11-7z"
    />
  </Icon>
)

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Trailer section component
 * Displays and plays trailer videos
 * 
 * @param {Object} props - Component props
 * @param {Array} props.videos - Array of video objects
 * @param {boolean} props.loading - Loading state
 */
const TrailerSection = ({ videos = [], loading = false }) => {
  const [selectedVideo, setSelectedVideo] = useState(null)

  // Filter for trailers and teasers
  const trailers = videos.filter(
    (video) =>
      (video.type === 'Trailer' || video.type === 'Teaser') &&
      video.site === 'YouTube'
  )

  if (loading) {
    return (
      <Box>
        <Text color={TEXT_COLOR} fontSize={{ base: 'sm', md: 'md' }}>
          Loading trailers...
        </Text>
      </Box>
    )
  }

  if (trailers.length === 0) {
    return null
  }

  // Get the first trailer as default
  const mainTrailer = trailers[0]

  return (
    <VStack align="stretch" spacing={{ base: 4, md: 6 }}>
      <Heading
        size={{ base: 'sm', md: 'md' }}
        color={TEXT_COLOR}
        fontWeight="600"
        fontSize={{ base: '16px', md: '20px' }}
      >
        Trailers & Videos
      </Heading>

      {/* Main Trailer Player */}
      {selectedVideo || mainTrailer ? (
        <Box
          position="relative"
          w="100%"
          pb="56.25%" // 16:9 aspect ratio
          bg="black"
          borderRadius="md"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            as="iframe"
            src={`https://www.youtube.com/embed/${
              selectedVideo?.key || mainTrailer.key
            }?autoplay=${selectedVideo ? 1 : 0}&rel=0&modestbranding=1&playsinline=1&enablejsapi=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            borderRadius="md"
            border="none"
            referrerPolicy="no-referrer-when-downgrade"
            loading="lazy"
          />
        </Box>
      ) : null}

      {/* Trailer List */}
      {trailers.length > 1 && (
        <VStack align="stretch" spacing={2}>
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={{ base: 'xs', md: 'sm' }}
            fontWeight="600"
          >
            More Videos ({trailers.length})
          </Text>
          <HStack spacing={2} flexWrap="wrap">
            {trailers.map((trailer) => (
              <Button
                key={trailer.id}
                leftIcon={<PlayIcon />}
                size={{ base: 'xs', md: 'sm' }}
                variant={selectedVideo?.id === trailer.id ? 'solid' : 'outline'}
                colorScheme={
                  selectedVideo?.id === trailer.id ? 'netflix' : 'gray'
                }
                onClick={() => setSelectedVideo(trailer)}
                fontSize={{ base: 'xs', md: 'sm' }}
              >
                {trailer.name || trailer.type}
              </Button>
            ))}
          </HStack>
        </VStack>
      )}
    </VStack>
  )
}

export default TrailerSection

