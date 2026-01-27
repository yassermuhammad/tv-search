import { Box, Text, HStack, Badge, VStack, Spinner, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../utils/constants'
import { PROVIDER_TYPE, PROVIDER_COLORS } from '../../models/constants'
import { getProviderUrl } from '../../utils/providerUrls'
import { MEDIA_TYPES } from '../../models/constants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Watch providers component - displays streaming platforms
 * @param {Object} props - Component props
 * @param {Object} props.watchProviders - Watch providers data from TMDB API
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.item - Movie or TV show item
 * @param {string} props.type - Item type ('movie' or 'show')
 */
const WatchProviders = ({ watchProviders, loading, item, type }) => {
  const { t } = useTranslation()
  
  /**
   * Gets the content title for URL generation
   */
  const getContentTitle = () => {
    if (!item) return ''
    return type === MEDIA_TYPES.MOVIE ? item.title || item.name : item.name || ''
  }
  
  /**
   * Gets the content type for URL generation ('movie' or 'tv')
   */
  const getContentType = () => {
    return type === MEDIA_TYPES.MOVIE ? 'movie' : 'tv'
  }
  
  /**
   * Renders a provider badge with optional link
   */
  const renderProviderBadge = (provider, providerType = PROVIDER_TYPE.FLATRATE) => {
    const contentTitle = getContentTitle()
    const contentType = getContentType()
    const providerUrl = getProviderUrl(provider.provider_id, provider.provider_name, contentTitle, contentType)
    const colorScheme = PROVIDER_COLORS[providerType]
    
    const badge = (
      <Badge
        key={provider.provider_id}
        colorScheme={colorScheme}
        variant="subtle"
        fontSize={{ base: 'xs', md: 'sm' }}
        p={{ base: 1.5, md: 2 }}
        cursor={providerUrl ? 'pointer' : 'default'}
        _hover={providerUrl ? { 
          bg: `${colorScheme}.600`,
          transform: 'scale(1.05)'
        } : {}}
        transition="all 0.2s"
      >
        {provider.provider_name}
        {providerUrl && <ExternalLinkIcon ml={1} boxSize="10px" />}
      </Badge>
    )
    
    if (providerUrl) {
      return (
        <Link
          key={provider.provider_id}
          href={providerUrl}
          isExternal
          _hover={{ textDecoration: 'none' }}
        >
          {badge}
        </Link>
      )
    }
    
    return badge
  }
  
  /**
   * Gets available platforms for US (or fallback to any available country)
   * @returns {Object|null} Platform data or null
   */
  const getAvailablePlatforms = () => {
    if (!watchProviders) return null

    // Try US first, then any available country
    const usProviders = watchProviders.US
    if (usProviders) {
      return {
        [PROVIDER_TYPE.FLATRATE]: usProviders[PROVIDER_TYPE.FLATRATE] || [],
        [PROVIDER_TYPE.BUY]: usProviders[PROVIDER_TYPE.BUY] || [],
        [PROVIDER_TYPE.RENT]: usProviders[PROVIDER_TYPE.RENT] || [],
      }
    }

    // Fallback to first available country
    const firstCountry = Object.keys(watchProviders)[0]
    if (firstCountry) {
      return {
        [PROVIDER_TYPE.FLATRATE]: watchProviders[firstCountry][PROVIDER_TYPE.FLATRATE] || [],
        [PROVIDER_TYPE.BUY]: watchProviders[firstCountry][PROVIDER_TYPE.BUY] || [],
        [PROVIDER_TYPE.RENT]: watchProviders[firstCountry][PROVIDER_TYPE.RENT] || [],
      }
    }

    return null
  }

  const platforms = getAvailablePlatforms()

  if (loading) {
    return (
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color={TEXT_COLOR} mb={3}>
          {t('modal.whereToWatch')}
        </Text>
        <HStack spacing={2}>
          <Spinner size="sm" color="blue.500" />
          <Text color={TEXT_COLOR} fontSize="sm">
            {t('modal.loadingPlatforms')}
          </Text>
        </HStack>
      </Box>
    )
  }

  if (!platforms) {
    return (
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color={TEXT_COLOR} mb={3}>
          {t('modal.whereToWatch')}
        </Text>
        <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }} fontStyle="italic">
          {t('modal.noStreamingInfo')}
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      <Text
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="semibold"
        color={TEXT_COLOR}
        mb={{ base: 2, md: 3 }}
      >
        {t('modal.whereToWatch')}
      </Text>
      <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
        {/* Streaming (Subscription) */}
        {platforms[PROVIDER_TYPE.FLATRATE] && platforms[PROVIDER_TYPE.FLATRATE].length > 0 && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={{ base: 1.5, md: 2 }}
            >
              {t('modal.stream')}
            </Text>
            <HStack spacing={{ base: 1.5, md: 2 }} flexWrap="wrap">
              {platforms[PROVIDER_TYPE.FLATRATE].map((provider) => renderProviderBadge(provider, PROVIDER_TYPE.FLATRATE))}
            </HStack>
          </Box>
        )}

        {/* Buy */}
        {platforms[PROVIDER_TYPE.BUY] && platforms[PROVIDER_TYPE.BUY].length > 0 && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={{ base: 1.5, md: 2 }}
            >
              {t('modal.buy')}
            </Text>
            <HStack spacing={{ base: 1.5, md: 2 }} flexWrap="wrap">
              {platforms[PROVIDER_TYPE.BUY].map((provider) => renderProviderBadge(provider, PROVIDER_TYPE.BUY))}
            </HStack>
          </Box>
        )}

        {/* Rent */}
        {platforms[PROVIDER_TYPE.RENT] && platforms[PROVIDER_TYPE.RENT].length > 0 && (
          <Box>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="semibold"
              color={TEXT_COLOR}
              mb={{ base: 1.5, md: 2 }}
            >
              {t('modal.rent')}
            </Text>
            <HStack spacing={{ base: 1.5, md: 2 }} flexWrap="wrap">
              {platforms[PROVIDER_TYPE.RENT].map((provider) => renderProviderBadge(provider, PROVIDER_TYPE.RENT))}
            </HStack>
          </Box>
        )}

        {!platforms[PROVIDER_TYPE.FLATRATE]?.length &&
          !platforms[PROVIDER_TYPE.BUY]?.length &&
          !platforms[PROVIDER_TYPE.RENT]?.length && (
            <Text color={TEXT_COLOR} fontSize={{ base: 'xs', md: 'sm' }} fontStyle="italic">
              {t('modal.noStreamingInfo')}
            </Text>
          )}
      </VStack>
    </Box>
  )
}

export default WatchProviders

