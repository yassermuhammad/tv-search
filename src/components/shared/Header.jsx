import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  Badge,
  IconButton,
  HStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Avatar,
  Spacer
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons'
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
  const { isOpen, onOpen, onClose } = useDisclosure()

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
          wrap="nowrap"
          gap={{ base: 2, md: 4 }}
        >
          <Flex align="center" gap={{ base: 2, md: 4 }}>
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

          <Spacer display={{ base: 'flex', md: 'none' }} />

          {/* Desktop Navigation */}
          <HStack spacing={{ base: 2, md: 3 }} display={{ base: 'none', md: 'flex' }}>
            <LanguageSwitcher size="md" />

            {currentUser ? (
              <HStack spacing={2}>
                {currentUser.photoURL && (
                  <Avatar
                    src={currentUser.photoURL}
                    name={currentUser.displayName}
                    size="sm"
                    border="2px solid"
                    borderColor="netflix.500"
                  />
                )}
                <Button
                  onClick={() => logout()}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                  size="md"
                  fontSize="sm"
                >
                  Logout
                </Button>
              </HStack>
            ) : (
              <Button
                onClick={() => {
                  loginWithGoogle().catch((error) => {
                    console.error('Error signing in with Google:', error);
                  });
                }}
                bg="white"
                color="black"
                _hover={{ bg: 'gray.100' }}
                size="md"
                fontSize="sm"
                leftIcon={<FcGoogle />}
              >
                Sign in
              </Button>
            )}

            <IconButton
              aria-label={t('common.search')}
              icon={<SearchIcon />}
              onClick={() => navigate('/search')}
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
              size="md"
              borderRadius="full"
            />

            <Button
              onClick={() => navigate('/watchlist')}
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
              fontWeight="600"
              size="md"
              px={4}
            >
              {t('common.myWatchlist')}
              {watchlistCount > 0 && (
                <Badge
                  ml={2}
                  bg="netflix.500"
                  color="white"
                  borderRadius="full"
                  px={2}
                  fontSize="xs"
                >
                  {watchlistCount}
                </Badge>
              )}
            </Button>
          </HStack>

          {/* Mobile Navigation */}
          <HStack spacing={2} display={{ base: 'flex', md: 'none' }}>
            <IconButton
              aria-label={t('common.search')}
              icon={<SearchIcon />}
              onClick={() => navigate('/search')}
              bg="transparent"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              size="sm"
            />
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              bg="transparent"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              size="sm"
            />
          </HStack>

          {/* Mobile Drawer */}
          <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
            <DrawerOverlay />
            <DrawerContent bg="#141414" color="white">
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px" borderColor="gray.800">Menu</DrawerHeader>
              <DrawerBody pt={4}>
                <VStack spacing={4} align="stretch">
                  {currentUser && (
                    <Flex align="center" gap={3} p={2} borderRadius="md" bg="gray.900">
                      <Avatar src={currentUser.photoURL} name={currentUser.displayName} size="sm" />
                      <Text fontWeight="bold" noOfLines={1}>{currentUser.displayName}</Text>
                    </Flex>
                  )}

                  <Button
                    justifyContent="space-between"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'gray.800' }}
                    onClick={() => { navigate('/watchlist'); onClose(); }}
                    rightIcon={watchlistCount > 0 ? (
                      <Badge bg="netflix.500" color="white" borderRadius="full">
                        {watchlistCount}
                      </Badge>
                    ) : null}
                  >
                    {t('common.myWatchlist')}
                  </Button>

                  <Box p={2}>
                    <Text fontSize="sm" color="gray.400" mb={2}>Language</Text>
                    <LanguageSwitcher size="sm" />
                  </Box>

                  <Box pt={4} borderTopWidth="1px" borderColor="gray.800">
                    {currentUser ? (
                      <Button w="full" variant="outline" borderColor="gray.600" color="white" _hover={{ bg: 'whiteAlpha.200' }} onClick={() => { logout(); onClose(); }}>
                        Logout
                      </Button>
                    ) : (
                      <Button w="full" bg="white" color="black" leftIcon={<FcGoogle />} onClick={() => {
                        loginWithGoogle().catch(console.error);
                        onClose();
                      }}>
                        Sign in with Google
                      </Button>
                    )}
                  </Box>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header

