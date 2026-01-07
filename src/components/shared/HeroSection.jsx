import { VStack, Heading, Text } from '@chakra-ui/react'

/**
 * Hero section component displayed when no search has been performed
 * @param {Object} props - Component props
 * @param {string} props.title - Hero title
 * @param {string} props.subtitle - Hero subtitle
 */
const HeroSection = ({ 
  title = 'Find Your Next Binge',
  subtitle = 'Search and discover TV shows and movies'
}) => {
  return (
    <VStack
      spacing={6}
      py={12}
      textAlign="center"
      sx={{
        animation: 'fadeIn 0.8s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Heading
        as="h2"
        size="3xl"
        color="white"
        fontWeight="900"
        letterSpacing="tight"
        lineHeight="1.2"
      >
        {title}
      </Heading>
      <Text fontSize="xl" color="rgba(255, 255, 255, 0.8)" maxW="600px">
        {subtitle}
      </Text>
    </VStack>
  )
}

export default HeroSection

