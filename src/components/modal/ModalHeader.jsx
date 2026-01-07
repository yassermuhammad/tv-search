import { ModalHeader as ChakraModalHeader, HStack, Heading, Badge, Button } from '@chakra-ui/react'
import { AddIcon, CheckIcon } from '@chakra-ui/icons'
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
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(item.id, type)

  return (
    <ChakraModalHeader
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      pb={4}
      pr={12}
    >
      <HStack spacing={4} align="center" justify="space-between" flexWrap="wrap">
        <HStack spacing={4} align="center" flex="1" minW="0">
          <Heading
            size="lg"
            color="white"
            fontWeight="bold"
            noOfLines={1}
            flex="1"
            minW="0"
          >
            {type === MEDIA_TYPES.MOVIE ? item.title : item.name}
          </Heading>
          {type === MEDIA_TYPES.SHOW && item.status && (
            <Badge
              colorScheme={getStatusColor(item.status)}
              fontSize="sm"
              px={2}
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
          size="sm"
          fontWeight="bold"
          flexShrink={0}
        >
          {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </Button>
      </HStack>
    </ChakraModalHeader>
  )
}

export default ModalHeader

