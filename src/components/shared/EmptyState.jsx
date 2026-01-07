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
    <Center py={{ base: 12, md: 20 }} px={{ base: 4, md: 0 }}>
      <VStack spacing={{ base: 3, md: 4 }}>
        <Text
          fontSize={{ base: 'lg', md: '2xl' }}
          color="rgba(255, 255, 255, 0.7)"
          fontWeight="600"
        >
          {title}
        </Text>
        <Text
          color="rgba(255, 255, 255, 0.5)"
          textAlign="center"
          fontSize={{ base: 'md', md: 'lg' }}
          px={{ base: 4, md: 0 }}
        >
          {message}
        </Text>
      </VStack>
    </Center>
  )
}

export default EmptyState

