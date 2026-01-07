import { Box, Container, Flex, Heading, Button, Badge, IconButton, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from '@chakra-ui/icons'
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
      pb={{ base: 4, md: 8 }}
      pt={{ base: 3, md: 4 }}
      px={{ base: 4, md: 0 }}
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        <Flex
          justify="space-between"
          align="center"
          mb={{ base: 4, md: 8 }}
          direction={{ base: 'row', sm: 'row' }}
          wrap="nowrap"
          gap={{ base: 2, md: 4 }}
        >
          <Flex align="center" gap={{ base: 2, md: 4 }} minW={0} flex={1}>
            {showBackButton && onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                color="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                size={{ base: 'sm', md: 'md' }}
                display={{ base: 'none', sm: 'flex' }}
              >
                ← Back
              </Button>
            )}
            <Heading
              as="h1"
              size={{ base: 'lg', md: 'xl' }}
              color="netflix.500"
              fontWeight="900"
              letterSpacing="tight"
              cursor="pointer"
              onClick={() => navigate('/')}
              fontSize={{ base: '20px', sm: '24px', md: '28px' }}
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
          <HStack spacing={{ base: 2, md: 3 }} flexShrink={0}>
            {/* Search Icon Button */}
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              onClick={() => navigate('/search')}
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
              size={{ base: 'sm', md: 'md' }}
              borderRadius="full"
            />
            {/* Watchlist Button */}
            <Button
              onClick={() => navigate('/watchlist')}
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
              fontWeight="600"
              size={{ base: 'sm', md: 'md' }}
              fontSize={{ base: 'xs', md: 'sm' }}
              px={{ base: 3, md: 4 }}
            >
              <Box as="span" display={{ base: 'none', sm: 'inline' }}>
                My Watchlist
              </Box>
              <Box as="span" display={{ base: 'inline', sm: 'none' }}>
                Watchlist
              </Box>
              {watchlistCount > 0 && (
                <Badge
                  ml={2}
                  bg="netflix.500"
                  color="white"
                  borderRadius="full"
                  px={{ base: 1.5, md: 2 }}
                  fontSize={{ base: '10px', md: 'xs' }}
                >
                  {watchlistCount}
                </Badge>
              )}
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header

