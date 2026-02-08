import { VStack, Heading, Text, Button, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaDice } from 'react-icons/fa'

/**
 * Hero section component displayed when no search has been performed
 * @param {Object} props - Component props
 * @param {string} props.title - Hero title (optional, uses translation if not provided)
 * @param {string} props.subtitle - Hero subtitle (optional, uses translation if not provided)
 * @param {Function} props.onRandomClick - Callback when random button is clicked
 * @param {boolean} props.isRandomLoading - Loading state for random button
 */
const HeroSection = ({ 
  title,
  subtitle,
  onRandomClick,
  isRandomLoading = false
}) => {
  const { t } = useTranslation()
  
  const heroTitle = title || t('home.title')
  const heroSubtitle = subtitle || t('home.subtitle')
  return (
    <VStack
      spacing={{ base: 3, md: 4 }}
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
        {heroTitle}
      </Heading>
      <Text
        fontSize={{ base: 'sm', sm: 'md', md: 'lg' }}
        color="rgba(255, 255, 255, 0.8)"
        maxW="600px"
        px={{ base: 4, md: 0 }}
      >
        {heroSubtitle}
      </Text>
      {onRandomClick && (
        <Button
          leftIcon={<FaDice />}
          colorScheme="netflix"
          size={{ base: 'md', md: 'lg' }}
          onClick={onRandomClick}
          isLoading={isRandomLoading}
          loadingText={t('home.randomLoading')}
          fontWeight="600"
          px={8}
          py={6}
          borderRadius="md"
          _hover={{
            transform: 'scale(1.05)',
            boxShadow: 'lg',
          }}
          transition="all 0.2s"
        >
          {t('home.randomButton')}
        </Button>
      )}
    </VStack>
  )
}

export default HeroSection

