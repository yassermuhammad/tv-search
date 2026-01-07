import { Center, VStack, Text } from '@chakra-ui/react'

/**
 * Empty state component for displaying when no results are found
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @param {string} props.message - Message text
 */
const EmptyState = ({ 
  title = 'No results found',
  message = 'Try searching with a different keyword'
}) => {
  return (
    <Center py={20}>
      <VStack spacing={4}>
        <Text fontSize="2xl" color="rgba(255, 255, 255, 0.7)" fontWeight="600">
          {title}
        </Text>
        <Text color="rgba(255, 255, 255, 0.5)" textAlign="center" fontSize="lg">
          {message}
        </Text>
      </VStack>
    </Center>
  )
}

export default EmptyState

