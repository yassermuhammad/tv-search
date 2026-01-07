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
      spacing={{ base: 2, md: 3 }}
      py={{ base: 3, md: 4 }}
      px={{ base: 4, md: 0 }}
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
        size={{ base: 'lg', sm: 'xl', md: '2xl' }}
        color="white"
        fontWeight="900"
        letterSpacing="tight"
        lineHeight="1.2"
        fontSize={{ base: '24px', sm: '28px', md: '36px' }}
        px={{ base: 2, md: 0 }}
      >
        {title}
      </Heading>
      <Text
        fontSize={{ base: 'sm', sm: 'md', md: 'lg' }}
        color="rgba(255, 255, 255, 0.8)"
        maxW="600px"
        px={{ base: 4, md: 0 }}
      >
        {subtitle}
      </Text>
    </VStack>
  )
}

export default HeroSection

