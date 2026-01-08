import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Collapse,
  IconButton,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import GenreFilter from './GenreFilter'
import YearRangeFilter from './YearRangeFilter'
import RatingFilter from './RatingFilter'
import SortFilter from './SortFilter'
import LanguageFilter from './LanguageFilter'
import CountryFilter from './CountryFilter'
import { COLORS } from '../../../utils/constants'
import { DEFAULT_FILTERS } from '../../../models/filterConstants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

/**
 * Filter panel component
 * Contains all advanced search filters in a collapsible panel
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFiltersChange - Callback when filters change
 * @param {string} props.mediaType - Media type ('movie' or 'show')
 * @param {Array} props.genres - Available genres list
 */
const FilterPanel = ({ filters = DEFAULT_FILTERS, onFiltersChange, mediaType, genres = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  /**
   * Updates a specific filter value
   * @param {string} key - Filter key
   * @param {*} value - Filter value
   */
  const updateFilter = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  /**
   * Resets all filters to default values
   */
  const resetFilters = () => {
    setLocalFilters(DEFAULT_FILTERS)
    onFiltersChange(DEFAULT_FILTERS)
  }

  /**
   * Checks if any filters are active (not default)
   */
  const hasActiveFilters = () => {
    return (
      localFilters.genres.length > 0 ||
      localFilters.yearFrom !== null ||
      localFilters.yearTo !== null ||
      localFilters.minRating > DEFAULT_FILTERS.minRating ||
      localFilters.language !== DEFAULT_FILTERS.language ||
      localFilters.country !== null ||
      localFilters.sortBy !== DEFAULT_FILTERS.sortBy
    )
  }

  return (
    <Box
      bg="rgba(255, 255, 255, 0.05)"
      borderRadius="md"
      border="1px solid rgba(255, 255, 255, 0.1)"
      p={{ base: 4, md: 6 }}
      mb={{ base: 4, md: 6 }}
    >
      <HStack justify="space-between" mb={isOpen ? 4 : 0}>
        <HStack spacing={3}>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            fontWeight="semibold"
            color={TEXT_COLOR}
          >
            Advanced Filters
          </Text>
          {hasActiveFilters() && (
            <Box
              bg="netflix.500"
              color="white"
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="xs"
              fontWeight="bold"
            >
              Active
            </Box>
          )}
        </HStack>
        <HStack spacing={2}>
          {hasActiveFilters() && (
            <Button
              size="sm"
              variant="ghost"
              color={TEXT_COLOR}
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              onClick={resetFilters}
              fontSize={{ base: 'xs', md: 'sm' }}
            >
              Reset
            </Button>
          )}
          <IconButton
            aria-label={isOpen ? 'Collapse filters' : 'Expand filters'}
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            size="sm"
            variant="ghost"
            color={TEXT_COLOR}
            _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            onClick={() => setIsOpen(!isOpen)}
          />
        </HStack>
      </HStack>

      <Collapse in={isOpen} animateOpacity>
        <VStack spacing={6} align="stretch" pt={4}>
          <Divider borderColor="rgba(255, 255, 255, 0.1)" />

          {/* Sort Filter */}
          <SortFilter
            value={localFilters.sortBy}
            onChange={(value) => updateFilter('sortBy', value)}
          />

          <Divider borderColor="rgba(255, 255, 255, 0.1)" />

          {/* Genre Filter */}
          {genres.length > 0 && (
            <>
              <GenreFilter
                genres={genres}
                selectedGenres={localFilters.genres}
                onChange={(selectedGenres) => updateFilter('genres', selectedGenres)}
              />
              <Divider borderColor="rgba(255, 255, 255, 0.1)" />
            </>
          )}

          {/* Year Range Filter */}
          <YearRangeFilter
            yearFrom={localFilters.yearFrom}
            yearTo={localFilters.yearTo}
            onChange={(yearFrom, yearTo) => {
              updateFilter('yearFrom', yearFrom)
              updateFilter('yearTo', yearTo)
            }}
          />

          <Divider borderColor="rgba(255, 255, 255, 0.1)" />

          {/* Rating Filter */}
          <RatingFilter
            minRating={localFilters.minRating}
            onChange={(value) => updateFilter('minRating', value)}
          />

          <Divider borderColor="rgba(255, 255, 255, 0.1)" />

          {/* Language and Country Filters */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <LanguageFilter
              value={localFilters.language}
              onChange={(value) => updateFilter('language', value)}
            />
            <CountryFilter
              value={localFilters.country}
              onChange={(value) => updateFilter('country', value)}
            />
          </SimpleGrid>
        </VStack>
      </Collapse>
    </Box>
  )
}

export default FilterPanel

