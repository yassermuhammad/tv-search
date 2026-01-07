import { Box, HStack } from '@chakra-ui/react'
import { ANIMATION_DELAYS } from '../../utils/constants'

/**
 * Horizontal scrolling row component for displaying cards
 * Similar to Netflix-style horizontal scrolling rows
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to display
 * @param {Function} props.renderItem - Function to render each item
 * @param {string} props.spacing - Spacing between items (default: '16px')
 */
const HorizontalScrollRow = ({ items, renderItem, spacing = '16px' }) => {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <Box
      position="relative"
      w="100%"
      overflowX="auto"
      overflowY="hidden"
      sx={{
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          _hover: {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        },
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)',
        // Smooth scrolling
        scrollBehavior: 'smooth',
      }}
    >
      <HStack
        spacing={spacing}
        align="stretch"
        py={2}
        px={{ base: 0, md: 0 }}
        w="max-content"
      >
        {items.map((item, index) => (
          <Box
            key={item.id}
            minW={{ base: '140px', sm: '160px', md: '180px' }}
            w={{ base: '140px', sm: '160px', md: '180px' }}
            flexShrink={0}
            sx={{
              animation: `fadeIn 0.6s ease-out ${index * ANIMATION_DELAYS.CARD_STAGGER}s both`,
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateX(20px)' },
                to: { opacity: 1, transform: 'translateX(0)' },
              },
            }}
          >
            {renderItem(item)}
          </Box>
        ))}
      </HStack>
    </Box>
  )
}

export default HorizontalScrollRow

