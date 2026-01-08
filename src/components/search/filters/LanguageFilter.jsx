import { Box, Text, Select } from '@chakra-ui/react'
import { COLORS } from '../../../utils/constants'
import { LANGUAGES, DEFAULT_LANGUAGE } from '../../../models/filterConstants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Language filter component
 * Allows users to filter by language
 * 
 * @param {Object} props - Component props
 * @param {string} props.language - Selected language code
 * @param {Function} props.onChange - Callback when language changes
 */
const LanguageFilter = ({ language = DEFAULT_LANGUAGE, onChange }) => {
  /**
   * Handles language selection change
   * @param {Event} e - Change event
   */
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <Box>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        fontWeight="600"
        color={TEXT_COLOR}
        mb={3}
      >
        Language
      </Text>
      <Select
        value={language}
        onChange={handleChange}
        bg="rgba(255, 255, 255, 0.1)"
        borderColor="rgba(255, 255, 255, 0.2)"
        color={TEXT_COLOR}
        size={{ base: 'sm', md: 'md' }}
        _hover={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
        _focus={{ borderColor: 'netflix.500' }}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} style={{ background: '#1a1a1a', color: '#fff' }}>
            {lang.name}
          </option>
        ))}
      </Select>
    </Box>
  )
}

export default LanguageFilter

