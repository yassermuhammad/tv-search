import { Box, Heading, HStack, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import HorizontalScrollRow from '../shared/HorizontalScrollRow'
import LoadingState from '../shared/LoadingState'
import EmptyState from '../shared/EmptyState'
import ViewAllCard from '../shared/ViewAllCard'

/**
 * Content row component for displaying a horizontal scrolling row
 * Can display trending content with time window toggle or popular content
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Row title
 * @param {Array} props.items - Array of items to display
 * @param {Function} props.renderItem - Function to render each item
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.showTimeWindow - Whether to show time window toggle (for trending)
 * @param {string} props.timeWindow - Current time window ('day' or 'week')
 * @param {Function} props.onTimeWindowChange - Callback when time window changes
 * @param {string} props.viewAllPath - Path to navigate when "View All" is clicked
 */
const ContentRow = ({
  title,
  items,
  renderItem,
  loading,
  error,
  showTimeWindow = false,
  timeWindow = 'day',
  onTimeWindowChange,
  viewAllPath,
}) => {
  const navigate = useNavigate()
  const MAX_ITEMS = 6
  const displayItems = items ? items.slice(0, MAX_ITEMS) : []
  const hasMore = items && items.length > MAX_ITEMS
  const handleTimeWindowChange = (newWindow) => {
    if (onTimeWindowChange) {
      onTimeWindowChange(newWindow)
    }
  }

  return (
    <Box mb={{ base: 6, md: 8 }}>
      {/* Header */}
      <HStack
        justify="space-between"
        align={{ base: 'flex-start', sm: 'center' }}
        mb={{ base: 4, md: 6 }}
        direction={{ base: 'column', sm: 'row' }}
        spacing={{ base: 3, sm: 0 }}
        gap={{ base: 3, sm: 0 }}
        flexWrap={{ base: 'wrap', sm: 'nowrap' }}
      >
        <Heading
          size={{ base: 'md', md: 'lg' }}
          color="white"
          fontWeight="600"
          fontSize={{ base: '20px', md: '24px' }}
          whiteSpace="nowrap"
          flexShrink={0}
        >
          {title}
        </Heading>
        {showTimeWindow && (
          <HStack spacing={2} w={{ base: '100%', sm: 'auto' }}>
            <Button
              size={{ base: 'xs', md: 'sm' }}
              variant={timeWindow === 'day' ? 'solid' : 'ghost'}
              colorScheme={timeWindow === 'day' ? 'netflix' : 'gray'}
              onClick={() => handleTimeWindowChange('day')}
              _hover={{
                bg: timeWindow === 'day' ? 'netflix.600' : 'rgba(255, 255, 255, 0.1)',
              }}
              flex={{ base: 1, sm: 'none' }}
              fontSize={{ base: '12px', md: '14px' }}
            >
              Today
            </Button>
            <Button
              size={{ base: 'xs', md: 'sm' }}
              variant={timeWindow === 'week' ? 'solid' : 'ghost'}
              colorScheme={timeWindow === 'week' ? 'netflix' : 'gray'}
              onClick={() => handleTimeWindowChange('week')}
              _hover={{
                bg: timeWindow === 'week' ? 'netflix.600' : 'rgba(255, 255, 255, 0.1)',
              }}
              flex={{ base: 1, sm: 'none' }}
              fontSize={{ base: '12px', md: '14px' }}
            >
              This Week
            </Button>
          </HStack>
        )}
      </HStack>

      {/* Content */}
      {loading ? (
        <LoadingState message={`Loading ${title.toLowerCase()}...`} />
      ) : error ? (
        <EmptyState title={`Failed to load ${title.toLowerCase()}`} message={error} />
      ) : displayItems.length > 0 ? (
        <HorizontalScrollRow
          items={[
            ...displayItems,
            ...(hasMore && viewAllPath
              ? [
                  {
                    id: 'view-all',
                    _isViewAll: true,
                  },
                ]
              : []),
          ]}
          renderItem={(item) => {
            if (item._isViewAll) {
              return (
                <ViewAllCard
                  onClick={() => navigate(viewAllPath)}
                  label="View All"
                />
              )
            }
            return renderItem(item)
          }}
          spacing="16px"
        />
      ) : (
        <EmptyState title={`No ${title.toLowerCase()} found`} />
      )}
    </Box>
  )
}

export default ContentRow

