import { Box, Text, Wrap, WrapItem, Badge, Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../utils/constants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Watchlist Genre Filter Component
 * Filters watchlist items by genre
 * 
 * @param {Object} props - Component props
 * @param {Array<string>} props.availableGenres - List of available genre names
 * @param {Array<string>} props.selectedGenres - Currently selected genre names
 * @param {Function} props.onChange - Callback when selection changes
 */
const WatchlistGenreFilter = ({ 
  availableGenres = [], 
  selectedGenres = [], 
  onChange 
}) => {
  const { t } = useTranslation()

  /**
   * Toggles a genre selection
   * @param {string} genreName - Genre name to toggle
   */
  const toggleGenre = (genreName) => {
    const newSelection = selectedGenres.includes(genreName)
      ? selectedGenres.filter((name) => name !== genreName)
      : [...selectedGenres, genreName]
    onChange(newSelection)
  }

  return (
    <Box mb={{ base: 4, md: 6 }}>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        fontWeight="600"
        color={TEXT_COLOR}
        mb={3}
      >
        {t('watchlist.filterByGenre')}
      </Text>
      {!availableGenres || availableGenres.length === 0 ? (
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          color="rgba(255, 255, 255, 0.5)"
          fontStyle="italic"
        >
          {t('watchlist.noGenresAvailable')}
        </Text>
      ) : (
        <>
          <Wrap spacing={2}>
            {availableGenres.map((genre) => {
              const isSelected = selectedGenres.includes(genre)
              return (
                <WrapItem key={genre}>
                  <Badge
                    as={Button}
                    onClick={() => toggleGenre(genre)}
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
                    {genre}
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
              {t('filters.reset')}
            </Button>
          )}
        </>
      )}
    </Box>
  )
}

export default WatchlistGenreFilter

