import { Box, Text, Spinner, Center } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import HorizontalScrollRow from '../shared/HorizontalScrollRow'
import ViewAllCard from '../shared/ViewAllCard'
import MovieCard from '../MovieCard'
import ShowCard from '../ShowCard'
import { COLORS } from '../../utils/constants'
import { MEDIA_TYPES } from '../../models/constants'
import { adaptTMDBShowsToTVMaze } from '../../utils/tmdbAdapter'

const TEXT_COLOR = COLORS.TEXT_PRIMARY
const MAX_ITEMS = 6

/**
 * Similar content section component
 * Displays similar movies or TV shows in a horizontal scrolling row
 * Shows only 6 items with a "View All" card
 * 
 * @param {Object} props - Component props
 * @param {Array} props.similarItems - Array of similar movies or TV shows
 * @param {boolean} props.loading - Loading state
 * @param {string} props.type - Media type ('movie' or 'show')
 * @param {Function} props.onItemClick - Callback when an item is clicked
 * @param {string} props.viewAllPath - Path to navigate when "View All" is clicked
 */
const SimilarContent = ({ similarItems = [], loading = false, type, onItemClick, viewAllPath }) => {
  const navigate = useNavigate()

  if (loading) {
    return (
      <Box>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="semibold"
          color={TEXT_COLOR}
          mb={{ base: 3, md: 4 }}
        >
          Similar {type === MEDIA_TYPES.MOVIE ? 'Movies' : 'TV Shows'}
        </Text>
        <Center py={8}>
          <Spinner size="md" color="netflix.500" thickness="3px" />
        </Center>
      </Box>
    )
  }

  if (!similarItems || similarItems.length === 0) {
    return null
  }

  // Adapt TV shows to TVMaze format if needed
  const items = type === MEDIA_TYPES.SHOW 
    ? adaptTMDBShowsToTVMaze(similarItems)
    : similarItems

  // Limit to 6 items
  const displayItems = items.slice(0, MAX_ITEMS)
  const hasMore = items.length > MAX_ITEMS

  const renderItem = (item) => {
    if (item._isViewAll) {
      return (
        <ViewAllCard
          onClick={() => navigate(viewAllPath)}
          label="View All"
        />
      )
    }
    
    if (type === MEDIA_TYPES.MOVIE) {
      return <MovieCard movie={item} onClick={() => onItemClick(item, type)} />
    } else {
      return <ShowCard show={item} onClick={() => onItemClick(item, type)} />
    }
  }

  return (
    <Box>
      <Text
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="semibold"
        color={TEXT_COLOR}
        mb={{ base: 3, md: 4 }}
      >
        Similar {type === MEDIA_TYPES.MOVIE ? 'Movies' : 'TV Shows'}
      </Text>
      <HorizontalScrollRow
        items={[
          ...displayItems,
          ...(hasMore && viewAllPath ? [{ id: 'view-all', _isViewAll: true }] : []),
        ]}
        renderItem={renderItem}
      />
    </Box>
  )
}

export default SimilarContent

