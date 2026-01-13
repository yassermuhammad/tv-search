import { Box, Container, Flex, Heading, Button, Badge, IconButton, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from '@chakra-ui/icons'
import { useAuth } from '../../contexts/AuthContext'
import { useWatchlist } from '../../contexts/WatchlistContext'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import { FcGoogle } from "react-icons/fc";

/**
 * Header component with logo and watchlist navigation
 * @param {Object} props - Component props
 * @param {boolean} props.showBackButton - Whether to show back button
 * @param {Function} props.onBack - Callback for back button click
 */
const Header = ({ showBackButton = false, onBack }) => {
  const navigate = useNavigate()
  const { watchlistCount } = useWatchlist()
  const { t } = useTranslation()
  const { currentUser, loginWithGoogle, logout } = useAuth()

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
                ← {t('common.back')}
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
              WATCHPEDIA
            </Heading>
          </Flex>
          <HStack spacing={{ base: 2, md: 3 }} flexShrink={0}>
            {/* Language Switcher */}
            <LanguageSwitcher size={{ base: 'sm', md: 'md' }} />

            {/* Auth Button */}
            {currentUser ? (
              <HStack spacing={2}>
                {currentUser.photoURL && (
                  <Box
                    as="img"
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    border="2px solid"
                    borderColor="netflix.500"
                  />
                )}
                <Button
                  onClick={() => logout()}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                  size={{ base: 'sm', md: 'md' }}
                  fontSize={{ base: 'xs', md: 'sm' }}
                >
                  Logout
                </Button>
              </HStack>
            ) : (
              <Button
                onClick={() => {
                  loginWithGoogle().catch((error) => {
                    console.error('Error signing in with Google:', error);
                    // Error will be handled by Firebase, user will see error message
                  });
                }}
                bg="white"
                color="black"
                _hover={{ bg: 'gray.100' }}
                size={{ base: 'sm', md: 'md' }}
                fontSize={{ base: 'xs', md: 'sm' }}
                leftIcon={<FcGoogle />}
              >
                Sign in
              </Button>
            )}

            {/* Search Icon Button */}
            <IconButton
              aria-label={t('common.search')}
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
                {t('common.myWatchlist')}
              </Box>
              <Box as="span" display={{ base: 'inline', sm: 'none' }}>
                {t('common.watchlist')}
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

