import { Box, Text, HStack, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import { COLORS } from '../../../utils/constants'
import { YEAR_RANGE } from '../../../models/filterConstants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Year range filter component
 * Allows users to filter by release year range
 * 
 * @param {Object} props - Component props
 * @param {number|null} props.yearFrom - Start year
 * @param {number|null} props.yearTo - End year
 * @param {Function} props.onChange - Callback when values change
 */
const YearRangeFilter = ({ yearFrom, yearTo, onChange }) => {
  /**
   * Handles year from change
   * @param {string} value - New year from value
   */
  const handleYearFromChange = (value) => {
    const numValue = value === '' ? null : parseInt(value, 10)
    onChange({ yearFrom: numValue, yearTo })
  }

  /**
   * Handles year to change
   * @param {string} value - New year to value
   */
  const handleYearToChange = (value) => {
    const numValue = value === '' ? null : parseInt(value, 10)
    onChange({ yearFrom, yearTo: numValue })
  }

  return (
    <Box>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        fontWeight="600"
        color={TEXT_COLOR}
        mb={3}
      >
        Release Year
      </Text>
      <HStack spacing={4} align="center">
        <Box flex={1}>
          <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)" mb={1}>
            From
          </Text>
          <NumberInput
            value={yearFrom || ''}
            onChange={handleYearFromChange}
            min={YEAR_RANGE.MIN}
            max={YEAR_RANGE.MAX}
            size={{ base: 'sm', md: 'md' }}
          >
            <NumberInputField
              bg="rgba(255, 255, 255, 0.1)"
              borderColor="rgba(255, 255, 255, 0.2)"
              color={TEXT_COLOR}
              _hover={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
              _focus={{ borderColor: 'netflix.500' }}
              placeholder="1900"
            />
            <NumberInputStepper>
              <NumberIncrementStepper color={TEXT_COLOR} />
              <NumberDecrementStepper color={TEXT_COLOR} />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        <Box flex={1}>
          <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)" mb={1}>
            To
          </Text>
          <NumberInput
            value={yearTo || ''}
            onChange={handleYearToChange}
            min={YEAR_RANGE.MIN}
            max={YEAR_RANGE.MAX}
            size={{ base: 'sm', md: 'md' }}
          >
            <NumberInputField
              bg="rgba(255, 255, 255, 0.1)"
              borderColor="rgba(255, 255, 255, 0.2)"
              color={TEXT_COLOR}
              _hover={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
              _focus={{ borderColor: 'netflix.500' }}
              placeholder={YEAR_RANGE.MAX.toString()}
            />
            <NumberInputStepper>
              <NumberIncrementStepper color={TEXT_COLOR} />
              <NumberDecrementStepper color={TEXT_COLOR} />
            </NumberInputStepper>
          </NumberInput>
        </Box>
      </HStack>
    </Box>
  )
}

export default YearRangeFilter

