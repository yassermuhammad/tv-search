import { Box, Text, Select } from '@chakra-ui/react'
import { COLORS } from '../../../utils/constants'
import { SORT_OPTIONS, SORT_LABELS, DEFAULT_SORT } from '../../../models/filterConstants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Sort filter component
 * Allows users to sort search results
 * 
 * @param {Object} props - Component props
 * @param {string} props.sortBy - Current sort option
 * @param {Function} props.onChange - Callback when sort changes
 */
const SortFilter = ({ sortBy = DEFAULT_SORT, onChange }) => {
  /**
   * Handles sort selection change
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
        Sort By
      </Text>
      <Select
        value={sortBy}
        onChange={handleChange}
        bg="rgba(255, 255, 255, 0.1)"
        borderColor="rgba(255, 255, 255, 0.2)"
        color={TEXT_COLOR}
        size={{ base: 'sm', md: 'md' }}
        _hover={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
        _focus={{ borderColor: 'netflix.500' }}
      >
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <option key={value} value={value} style={{ background: '#1a1a1a', color: '#fff' }}>
            {label}
          </option>
        ))}
      </Select>
    </Box>
  )
}

export default SortFilter

