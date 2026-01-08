import { Box, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, HStack } from '@chakra-ui/react'
import { COLORS } from '../../../utils/constants'
import { RATING_RANGE } from '../../../models/filterConstants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Rating filter component
 * Allows users to filter by minimum rating
 * 
 * @param {Object} props - Component props
 * @param {number} props.minRating - Minimum rating value
 * @param {Function} props.onChange - Callback when rating changes
 */
const RatingFilter = ({ minRating = RATING_RANGE.MIN, onChange }) => {
  /**
   * Handles slider change
   * @param {number} value - New rating value
   */
  const handleChange = (value) => {
    onChange(value)
  }

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="600"
          color={TEXT_COLOR}
        >
          Minimum Rating
        </Text>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="600"
          color="netflix.500"
        >
          {minRating.toFixed(1)}
        </Text>
      </HStack>
      <Slider
        value={minRating}
        onChange={handleChange}
        min={RATING_RANGE.MIN}
        max={RATING_RANGE.MAX}
        step={RATING_RANGE.STEP}
        colorScheme="netflix"
        focusThumbOnChange={false}
      >
        <SliderTrack bg="rgba(255, 255, 255, 0.1)">
          <SliderFilledTrack bg="netflix.500" />
        </SliderTrack>
        <SliderThumb
          boxSize={5}
          border="2px solid"
          borderColor="netflix.500"
          bg="white"
        />
      </Slider>
      <HStack justify="space-between" mt={1}>
        <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
          {RATING_RANGE.MIN}
        </Text>
        <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
          {RATING_RANGE.MAX}
        </Text>
      </HStack>
    </Box>
  )
}

export default RatingFilter

