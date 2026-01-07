import { Box, Container, Flex, Heading, Button, Badge } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useWatchlist } from '../../contexts/WatchlistContext'

/**
 * Header component with logo and watchlist navigation
 * @param {Object} props - Component props
 * @param {boolean} props.showBackButton - Whether to show back button
 * @param {Function} props.onBack - Callback for back button click
 */
const Header = ({ showBackButton = false, onBack }) => {
  const navigate = useNavigate()
  const { watchlistCount } = useWatchlist()

  return (
    <Box
      position="relative"
      bgGradient="linear(to-b, rgba(0,0,0,0.7), transparent)"
      pb={8}
      pt={4}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Flex align="center" gap={4}>
            {showBackButton && onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                color="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                size="md"
              >
                ← Back
              </Button>
            )}
            <Heading
              as="h1"
              size="xl"
              color="netflix.500"
              fontWeight="900"
              letterSpacing="tight"
              cursor="pointer"
              onClick={() => navigate('/')}
              sx={{
                animation: 'fadeIn 0.6s ease-out',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              STREAMSPOT
            </Heading>
          </Flex>
          <Button
            onClick={() => navigate('/watchlist')}
            bg="rgba(255, 255, 255, 0.1)"
            color="white"
            _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
            fontWeight="600"
            size="md"
          >
            My Watchlist
            {watchlistCount > 0 && (
              <Badge ml={2} bg="netflix.500" color="white" borderRadius="full" px={2}>
                {watchlistCount}
              </Badge>
            )}
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header

