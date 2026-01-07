import { Center, VStack, Spinner, Text } from '@chakra-ui/react'

/**
 * Loading state component
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message
 */
const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <Center py={{ base: 12, md: 20 }} px={{ base: 4, md: 0 }}>
      <VStack spacing={{ base: 3, md: 4 }}>
        <Spinner
          size={{ base: 'lg', md: 'xl' }}
          color="netflix.500"
          thickness="4px"
          speed="0.8s"
        />
        <Text
          color="rgba(255, 255, 255, 0.7)"
          fontSize={{ base: 'md', md: 'lg' }}
          textAlign="center"
        >
          {message}
        </Text>
      </VStack>
    </Center>
  )
}

export default LoadingState

