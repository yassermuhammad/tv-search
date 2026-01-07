import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { ANIMATION_DELAYS, GRID_COLUMNS } from '../../utils/constants'

/**
 * Results grid component for displaying search results
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to display
 * @param {Function} props.renderItem - Function to render each item
 * @param {string} props.itemType - Type of items (e.g., 'show', 'movie')
 * @param {boolean} props.showCount - Whether to show result count
 */
const ResultsGrid = ({ items, renderItem, itemType = 'items', showCount = true }) => {
  if (items.length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        animation: 'fadeIn 0.6s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {showCount && (
        <Text
          fontSize={{ base: 'lg', md: '2xl' }}
          fontWeight="bold"
          color="white"
          mb={{ base: 4, md: 6 }}
        >
          Found {items.length} {items.length === 1 ? itemType.slice(0, -1) : itemType}
        </Text>
      )}
      <SimpleGrid columns={GRID_COLUMNS} spacing={{ base: 4, md: 6 }}>
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              animation: `fadeIn 0.6s ease-out ${index * ANIMATION_DELAYS.CARD_STAGGER}s both`,
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            {renderItem(item)}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default ResultsGrid

