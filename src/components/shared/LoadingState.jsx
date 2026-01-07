import { Center, VStack, Spinner, Text } from '@chakra-ui/react'

/**
 * Loading state component
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message
 */
const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <Center py={20}>
      <VStack spacing={4}>
        <Spinner size="xl" color="netflix.500" thickness="4px" speed="0.8s" />
        <Text color="rgba(255, 255, 255, 0.7)" fontSize="lg">
          {message}
        </Text>
      </VStack>
    </Center>
  )
}

export default LoadingState

