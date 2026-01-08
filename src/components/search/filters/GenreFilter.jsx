import { Box, Text, Wrap, WrapItem, Badge, Button } from '@chakra-ui/react'
import { COLORS } from '../../../utils/constants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Genre filter component
 * Allows users to select multiple genres for filtering
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.genres - Available genres list
 * @param {Array<number>} props.selectedGenres - Currently selected genre IDs
 * @param {Function} props.onChange - Callback when selection changes
 */
const GenreFilter = ({ genres = [], selectedGenres = [], onChange }) => {
  /**
   * Toggles a genre selection
   * @param {number} genreId - Genre ID to toggle
   */
  const toggleGenre = (genreId) => {
    const newSelection = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId]
    onChange(newSelection)
  }

  if (!genres || genres.length === 0) {
    return null
  }

  return (
    <Box>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        fontWeight="600"
        color={TEXT_COLOR}
        mb={3}
      >
        Genres
      </Text>
      <Wrap spacing={2}>
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id)
          return (
            <WrapItem key={genre.id}>
              <Badge
                as={Button}
                onClick={() => toggleGenre(genre.id)}
                bg={isSelected ? 'netflix.500' : 'rgba(255, 255, 255, 0.1)'}
                color={isSelected ? 'white' : TEXT_COLOR}
                px={3}
                py={1.5}
                borderRadius="md"
                fontSize={{ base: 'xs', md: 'sm' }}
                cursor="pointer"
                _hover={{
                  bg: isSelected ? 'netflix.600' : 'rgba(255, 255, 255, 0.2)',
                }}
                transition="all 0.2s"
                border={isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'}
              >
                {genre.name}
              </Badge>
            </WrapItem>
          )
        })}
      </Wrap>
      {selectedGenres.length > 0 && (
        <Button
          size="xs"
          variant="ghost"
          color="rgba(255, 255, 255, 0.6)"
          mt={2}
          onClick={() => onChange([])}
          _hover={{ color: TEXT_COLOR }}
        >
          Clear all
        </Button>
      )}
    </Box>
  )
}

export default GenreFilter

