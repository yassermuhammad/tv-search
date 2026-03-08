import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Grid,
  Button,
  Badge,
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReleaseCard from './ReleaseCard'
import { formatDate } from '../../utils/formatters'

/**
 * List view component for upcoming releases
 * Features:
 * - Filter by time period (This Week, This Month, This Year)
 * - Sort by date, popularity, rating
 * - Display releases in a grid
 * 
 * @param {Object} props - Component props
 * @param {Array} props.movies - Array of upcoming movies
 * @param {Array} props.tvShows - Array of upcoming TV shows
 * @param {Function} props.onItemClick - Callback when an item is clicked
 * @param {Function} props.onSetReminder - Callback for setting reminder
 */
const ListView = ({ movies = [], tvShows = [], onItemClick, onSetReminder }) => {
  const { t } = useTranslation()
  const [timeFilter, setTimeFilter] = useState('month') // 'week', 'month', 'year'
  const [sortBy, setSortBy] = useState('date') // 'date', 'popularity', 'rating'
  const [showType, setShowType] = useState('all') // 'all', 'movies', 'tv-shows'

  // Filter and sort releases
  const filteredReleases = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison
    let cutoffDate

    switch (timeFilter) {
      case 'week':
        cutoffDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        cutoffDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        // Set cutoff to end of current year (December 31st)
        cutoffDate = new Date(now.getFullYear(), 11, 31) // December 31st of current year
        break
      default:
        cutoffDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    }
    cutoffDate.setHours(23, 59, 59, 999) // Set to end of day

    // Combine and filter
    let releases = []

    if (showType === 'all' || showType === 'movies') {
      releases.push(
        ...movies
          .filter((movie) => {
            if (!movie.release_date) return false
            const releaseDate = new Date(movie.release_date)
            releaseDate.setHours(0, 0, 0, 0) // Normalize to start of day
            return releaseDate >= now && releaseDate <= cutoffDate
          })
          .map((movie) => ({ ...movie, _type: 'movie' }))
      )
    }

    if (showType === 'all' || showType === 'tv-shows') {
      releases.push(
        ...tvShows
          .filter((show) => {
            if (!show.first_air_date) return false
            const releaseDate = new Date(show.first_air_date)
            releaseDate.setHours(0, 0, 0, 0) // Normalize to start of day
            return releaseDate >= now && releaseDate <= cutoffDate
          })
          .map((show) => ({ ...show, _type: 'show' }))
      )
    }

    // Sort
    releases.sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || 0)
      const dateB = new Date(b.release_date || b.first_air_date || 0)

      switch (sortBy) {
        case 'date':
          return dateA - dateB
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0)
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0)
        default:
          return dateA - dateB
      }
    })

    return releases
  }, [movies, tvShows, timeFilter, sortBy, showType])

  return (
    <VStack spacing={6} align="stretch">
      {/* Filters */}
      <HStack spacing={4} flexWrap="wrap">
        <Box>
          <Text fontSize="sm" color="gray.400" mb={1}>
            {t('upcoming.timePeriod')}
          </Text>
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            bg="gray.800"
            color="white"
            borderColor="gray.700"
            size="sm"
            w="150px"
          >
            <option value="week">{t('upcoming.thisWeek')}</option>
            <option value="month">{t('upcoming.thisMonth')}</option>
            <option value="year">{t('upcoming.thisYear')}</option>
          </Select>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.400" mb={1}>
            {t('upcoming.sortBy')}
          </Text>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            bg="gray.800"
            color="white"
            borderColor="gray.700"
            size="sm"
            w="150px"
          >
            <option value="date">{t('upcoming.releaseDate')}</option>
            <option value="popularity">{t('upcoming.popularity')}</option>
            <option value="rating">{t('upcoming.rating')}</option>
          </Select>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.400" mb={1}>
            {t('upcoming.type')}
          </Text>
          <HStack spacing={2}>
            <Button
              size="sm"
              variant={showType === 'all' ? 'solid' : 'outline'}
              colorScheme={showType === 'all' ? 'red' : 'gray'}
              onClick={() => setShowType('all')}
            >
              {t('common.all')}
            </Button>
            <Button
              size="sm"
              variant={showType === 'movies' ? 'solid' : 'outline'}
              colorScheme={showType === 'movies' ? 'blue' : 'gray'}
              onClick={() => setShowType('movies')}
            >
              {t('watchlist.movies')}
            </Button>
            <Button
              size="sm"
              variant={showType === 'tv-shows' ? 'solid' : 'outline'}
              colorScheme={showType === 'tv-shows' ? 'green' : 'gray'}
              onClick={() => setShowType('tv-shows')}
            >
              {t('watchlist.tvShows')}
            </Button>
          </HStack>
        </Box>

        <Box ml="auto">
          <Badge
            bg="rgba(255, 255, 255, 0.1)"
            color="white"
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
          >
            {filteredReleases.length} {filteredReleases.length === 1 ? t('upcoming.release') : t('upcoming.releases')}
          </Badge>
        </Box>
      </HStack>

      {/* Releases Grid */}
      {filteredReleases.length > 0 ? (
        <Grid
          templateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)',
          }}
          gap={4}
        >
          {filteredReleases.map((item) => (
            <ReleaseCard
              key={`${item._type}-${item.id}`}
              item={item}
              type={item._type}
              onClick={() => onItemClick(item, item._type)}
              onSetReminder={onSetReminder}
            />
          ))}
        </Grid>
      ) : (
        <Box
          textAlign="center"
          py={12}
          bg="gray.800"
          borderRadius="md"
        >
          <Text color="gray.400" fontSize="lg">
            {t('upcoming.noReleasesForFilters')}
          </Text>
        </Box>
      )}
    </VStack>
  )
}

export default ListView
