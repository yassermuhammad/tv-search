import { Box, Text, Select } from '@chakra-ui/react'
import { COLORS } from '../../../utils/constants'
import { COUNTRIES } from '../../../models/filterConstants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Country filter component
 * Allows users to filter by country
 * 
 * @param {Object} props - Component props
 * @param {string|null} props.country - Selected country code
 * @param {Function} props.onChange - Callback when country changes
 */
const CountryFilter = ({ country = null, onChange }) => {
  /**
   * Handles country selection change
   * @param {Event} e - Change event
   */
  const handleChange = (e) => {
    const value = e.target.value === '' ? null : e.target.value
    onChange(value)
  }

  return (
    <Box>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        fontWeight="600"
        color={TEXT_COLOR}
        mb={3}
      >
        Country
      </Text>
      <Select
        value={country || ''}
        onChange={handleChange}
        bg="rgba(255, 255, 255, 0.1)"
        borderColor="rgba(255, 255, 255, 0.2)"
        color={TEXT_COLOR}
        size={{ base: 'sm', md: 'md' }}
        _hover={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
        _focus={{ borderColor: 'netflix.500' }}
        placeholder="All Countries"
      >
        {COUNTRIES.map((countryOption) => (
          <option key={countryOption.code} value={countryOption.code} style={{ background: '#1a1a1a', color: '#fff' }}>
            {countryOption.name}
          </option>
        ))}
      </Select>
    </Box>
  )
}

export default CountryFilter

