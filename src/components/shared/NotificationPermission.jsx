import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
} from '@chakra-ui/react'
import { 
  requestNotificationPermission, 
  hasNotificationPermission 
} from '../../services/notificationService'

/**
 * Component to request notification permission from the user
 * Shows a banner when permission is not granted
 */
const NotificationPermission = () => {
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    // Check current permission status
    setPermissionGranted(hasNotificationPermission())
  }, [])

  const handleRequestPermission = async () => {
    setIsRequesting(true)
    try {
      const granted = await requestNotificationPermission()
      setPermissionGranted(granted)
      
      if (granted) {
        toast({
          title: 'Notifications Enabled!',
          description: 'You\'ll receive notifications for your release reminders.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Notifications Disabled',
          description: 'You can enable notifications in your browser settings.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      toast({
        title: 'Error',
        description: 'Failed to request notification permission.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsRequesting(false)
    }
  }

  // Don't show anything if permission is already granted
  if (permissionGranted) {
    return null
  }

  // Don't show if browser doesn't support notifications
  if (!('Notification' in window)) {
    return null
  }

  return (
    <Alert
      status="info"
      variant="subtle"
      flexDirection={{ base: 'column', md: 'row' }}
      alignItems={{ base: 'stretch', md: 'center' }}
      justifyContent={{ base: 'stretch', md: 'space-between' }}
      flexWrap="wrap"
      gap={{ base: 3, md: 4 }}
      textAlign={{ base: 'center', md: 'left' }}
      borderRadius="lg"
      mb={4}
      bg="rgba(59, 130, 246, 0.08)"
      border="1px solid"
      borderColor="rgba(59, 130, 246, 0.25)"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 3 }}
    >
      <Box
        display="flex"
        alignItems={{ base: 'center', md: 'center' }}
        justifyContent={{ base: 'center', md: 'flex-start' }}
        flexDirection="row"
        flex={1}
        minW={0}
      >
        <AlertIcon
          color="blue.400"
          flexShrink={0}
          boxSize={{ base: 4, md: 5 }}
          mr={2}
        />
        <AlertDescription
          flex={1}
          fontSize={{ base: 'sm', md: 'md' }}
          lineHeight="tall"
          as="span"
        >
          🔔 Enable notifications to get reminded when your favorite movies and TV shows are released!
        </AlertDescription>
      </Box>
      <Button
        size={{ base: 'md', md: 'sm' }}
        colorScheme="blue"
        onClick={handleRequestPermission}
        isLoading={isRequesting}
        loadingText="Requesting..."
        width={{ base: '100%', md: 'auto' }}
        minW={{ base: 'auto', md: '140px' }}
        flexShrink={0}
        whiteSpace="nowrap"
        px={{ base: 4, md: 4 }}
        py={{ base: 3, md: 2 }}
      >
        Enable Notifications
      </Button>
    </Alert>
  )
}

export default NotificationPermission
