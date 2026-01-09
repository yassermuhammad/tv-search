import { ModalHeader as ChakraModalHeader, HStack, Heading, Badge, Button, Box } from '@chakra-ui/react'
import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { useWatchlist } from '../../contexts/WatchlistContext'
import { getStatusColor } from '../../utils/formatters'
import { MEDIA_TYPES } from '../../models/constants'

/**
 * Modal header component with title, status badge, and watchlist button
 * @param {Object} props - Component props
 * @param {Movie|TVShow} props.item - Movie or show item
 * @param {MediaType} props.type - Item type ('movie' or 'show')
 */
const ModalHeader = ({ item, type }) => {
  const { t } = useTranslation()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(item.id, type)

  return (
    <ChakraModalHeader
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      pb={{ base: 3, md: 4 }}
      pr={{ base: 10, md: 12 }}
      px={{ base: 4, md: 6 }}
    >
      <HStack
        spacing={{ base: 2, md: 4 }}
        align={{ base: 'flex-start', sm: 'center' }}
        justify="space-between"
        flexWrap="wrap"
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 3, sm: 0 }}
      >
        <HStack spacing={{ base: 2, md: 4 }} align="center" flex="1" minW="0">
          <Heading
            size={{ base: 'md', md: 'lg' }}
            color="white"
            fontWeight="bold"
            noOfLines={{ base: 2, md: 1 }}
            flex="1"
            minW="0"
            fontSize={{ base: '18px', md: '24px' }}
          >
            {type === MEDIA_TYPES.MOVIE ? item.title : item.name}
          </Heading>
          {type === MEDIA_TYPES.SHOW && item.status && (
            <Badge
              colorScheme={getStatusColor(item.status)}
              fontSize={{ base: 'xs', md: 'sm' }}
              px={{ base: 1.5, md: 2 }}
              py={1}
              flexShrink={0}
            >
              {item.status}
            </Badge>
          )}
        </HStack>
        <Button
          leftIcon={inWatchlist ? <CheckIcon /> : <AddIcon />}
          bg={inWatchlist ? 'netflix.500' : 'rgba(255, 255, 255, 0.1)'}
          color="white"
          _hover={{
            bg: inWatchlist ? 'netflix.600' : 'rgba(255, 255, 255, 0.2)',
          }}
          onClick={() => toggleWatchlist(item, type)}
          size={{ base: 'xs', md: 'sm' }}
          fontWeight="bold"
          flexShrink={0}
          fontSize={{ base: '12px', md: '14px' }}
          w={{ base: '100%', sm: 'auto' }}
          display={{ base: 'none', md: 'flex' }}
        >
          {inWatchlist ? t('modal.removeFromWatchlist') : t('modal.addToWatchlist')}
        </Button>
      </HStack>
    </ChakraModalHeader>
  )
}

export default ModalHeader

