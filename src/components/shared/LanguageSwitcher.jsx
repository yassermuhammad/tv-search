import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Text,
  Box,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { SUPPORTED_LANGUAGES } from '../../i18n/config'

/**
 * Language switcher component
 * Allows users to change the application language
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 */
const LanguageSwitcher = ({ size = 'md' }) => {
  const { i18n, t } = useTranslation()

  /**
   * Updates document direction and language attribute
   * @param {string} languageCode - Language code
   */
  const updateDocumentDirection = (languageCode) => {
    if (languageCode === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl')
      document.documentElement.setAttribute('lang', 'ar')
    } else {
      document.documentElement.setAttribute('dir', 'ltr')
      document.documentElement.setAttribute('lang', languageCode)
    }
  }

  // Update document direction on mount and language change
  useEffect(() => {
    updateDocumentDirection(i18n.language)
  }, [i18n.language])

  /**
   * Handles language change
   * @param {string} languageCode - Language code to switch to
   */
  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
    updateDocumentDirection(languageCode)
  }

  const currentLanguage = SUPPORTED_LANGUAGES[i18n.language] || SUPPORTED_LANGUAGES.en

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        size={size}
        bg="rgba(255, 255, 255, 0.1)"
        color="white"
        _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
        _active={{ bg: 'rgba(255, 255, 255, 0.2)' }}
        fontWeight="600"
        fontSize={{ base: 'xs', md: 'sm' }}
        px={{ base: 2, md: 3 }}
        borderRadius="md"
      >
        <HStack spacing={1}>
          <Text fontSize={{ base: 'sm', md: 'md' }}>{currentLanguage.flag}</Text>
          <Box as="span" display={{ base: 'none', sm: 'inline' }}>
            {currentLanguage.nativeName}
          </Box>
          <Box as="span" display={{ base: 'inline', sm: 'none' }}>
            {currentLanguage.name.substring(0, 2).toUpperCase()}
          </Box>
        </HStack>
      </MenuButton>
      <MenuList
        bg="rgba(26, 26, 26, 0.95)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        minW="200px"
        maxH="400px"
        overflowY="auto"
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
          <MenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            bg={i18n.language === code ? 'rgba(229, 9, 20, 0.2)' : 'transparent'}
            color="white"
            _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            _focus={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            py={2}
          >
            <HStack spacing={2} w="100%">
              <Text fontSize="lg">{lang.flag}</Text>
              <Text flex={1}>{lang.nativeName}</Text>
              {i18n.language === code && (
                <Text fontSize="xs" color="netflix.500">
                  ✓
                </Text>
              )}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default LanguageSwitcher

