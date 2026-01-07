import { Box, VStack, Text, Icon } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

/**
 * View All card component
 * Displays a card that navigates to a full results page
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Callback when card is clicked
 * @param {string} props.label - Label text (default: "View All")
 */
const ViewAllCard = ({ onClick, label = 'View All' }) => {
  return (
    <Box
      minH={{ base: '240px', md: '280px' }}
      w="100%"
      cursor="pointer"
      onClick={onClick}
      borderRadius="4px"
      overflow="hidden"
      bg="rgba(255, 255, 255, 0.05)"
      border="2px dashed rgba(255, 255, 255, 0.2)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="all 0.3s ease"
      _hover={{
        bg: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'netflix.500',
        transform: 'scale(1.05)',
      }}
    >
      <VStack spacing={3}>
        <Icon
          as={ChevronRightIcon}
          boxSize={8}
          color="netflix.500"
          transform="rotate(-90deg)"
        />
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="bold"
          color="white"
          textAlign="center"
        >
          {label}
        </Text>
      </VStack>
    </Box>
  )
}

export default ViewAllCard

