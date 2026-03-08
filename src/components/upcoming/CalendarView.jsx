import {
  Box,
  Grid,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../utils/formatters'

/**
 * Calendar view component for upcoming releases
 * Shows a monthly calendar grid with highlighted dates that have releases
 * 
 * @param {Object} props - Component props
 * @param {Array} props.movies - Array of upcoming movies
 * @param {Array} props.tvShows - Array of upcoming TV shows
 * @param {Function} props.onDateClick - Callback when a date is clicked
 */
const CalendarView = ({ movies = [], tvShows = [], onDateClick }) => {
  const { t, i18n } = useTranslation()
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const bgColor = useColorModeValue('gray.800', 'gray.900')
  const dayBgColor = useColorModeValue('gray.700', 'gray.800')
  const todayBgColor = useColorModeValue('blue.500', 'blue.600')
  const releaseBgColor = useColorModeValue('red.500', 'red.600')

  // Get first day of month and number of days
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Create a map of dates to releases
  const releasesByDate = useMemo(() => {
    const map = new Map()

    // Process movies
    movies.forEach((movie) => {
      if (movie.release_date) {
        const dateKey = movie.release_date.split('T')[0] // YYYY-MM-DD
        if (!map.has(dateKey)) {
          map.set(dateKey, { movies: [], tvShows: [] })
        }
        map.get(dateKey).movies.push(movie)
      }
    })

    // Process TV shows
    tvShows.forEach((show) => {
      if (show.first_air_date) {
        const dateKey = show.first_air_date.split('T')[0] // YYYY-MM-DD
        if (!map.has(dateKey)) {
          map.set(dateKey, { movies: [], tvShows: [] })
        }
        map.get(dateKey).tvShows.push(show)
      }
    })

    return map
  }, [movies, tvShows])

  // Check if a date has releases
  const getReleasesForDate = (day) => {
    const date = new Date(year, month, day)
    const dateKey = date.toISOString().split('T')[0]
    return releasesByDate.get(dateKey) || { movies: [], tvShows: [] }
  }

  // Get color for a date cell
  const getDateColor = (day) => {
    const releases = getReleasesForDate(day)
    const hasMovies = releases.movies.length > 0
    const hasTVShows = releases.tvShows.length > 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const cellDate = new Date(year, month, day)
    cellDate.setHours(0, 0, 0, 0)
    const isToday = cellDate.getTime() === today.getTime()

    if (hasMovies && hasTVShows) {
      return 'purple.500' // Both
    } else if (hasMovies) {
      return 'blue.500' // Movies
    } else if (hasTVShows) {
      return 'green.500' // TV Shows
    } else if (isToday) {
      return todayBgColor
    }
    return 'transparent'
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get month name (use i18n language for locale)
  const locale = i18n.language === 'en' ? 'en-US' : i18n.language
  const monthName = currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  // Day names (short form, locale-aware, Sun–Sat)
  const dayNames = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 7 + i).toLocaleDateString(locale, { weekday: 'short' })
  )

  return (
    <Box>
      {/* Calendar Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <HStack spacing={4}>
          <Button
            onClick={goToPreviousMonth}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
          >
            <ChevronLeftIcon />
          </Button>
          <Text fontSize="xl" fontWeight="bold" color="white">
            {monthName}
          </Text>
          <Button
            onClick={goToNextMonth}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
          >
            <ChevronRightIcon />
          </Button>
        </HStack>
        <Button
          onClick={goToToday}
          size="sm"
          variant="outline"
          color="white"
          borderColor="rgba(255, 255, 255, 0.2)"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
        >
          {t('upcoming.today')}
        </Button>
      </Flex>

      {/* Legend */}
      <HStack spacing={4} mb={4} flexWrap="wrap">
        <HStack spacing={2}>
          <Box w={4} h={4} bg="blue.500" borderRadius="sm" />
          <Text fontSize="sm" color="gray.400">{t('watchlist.movies')}</Text>
        </HStack>
        <HStack spacing={2}>
          <Box w={4} h={4} bg="green.500" borderRadius="sm" />
          <Text fontSize="sm" color="gray.400">{t('watchlist.tvShows')}</Text>
        </HStack>
        <HStack spacing={2}>
          <Box w={4} h={4} bg="purple.500" borderRadius="sm" />
          <Text fontSize="sm" color="gray.400">{t('upcoming.both')}</Text>
        </HStack>
      </HStack>

      {/* Calendar Grid */}
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {/* Day names header */}
        {dayNames.map((day) => (
          <Box
            key={day}
            textAlign="center"
            py={2}
            fontWeight="bold"
            color="gray.400"
            fontSize="sm"
          >
            {day}
          </Box>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <Box key={`empty-${index}`} />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const releases = getReleasesForDate(day)
          const totalReleases = releases.movies.length + releases.tvShows.length
          const bgColor = getDateColor(day)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const cellDate = new Date(year, month, day)
          cellDate.setHours(0, 0, 0, 0)
          const isToday = cellDate.getTime() === today.getTime()

          return (
            <Box
              key={day}
              as="button"
              onClick={() => {
                if (totalReleases > 0) {
                  const date = new Date(year, month, day)
                  onDateClick(date, releases)
                }
              }}
              minH="60px"
              p={2}
              bg={bgColor !== 'transparent' ? bgColor : dayBgColor}
              borderRadius="md"
              border={isToday ? '2px solid' : '1px solid'}
              borderColor={isToday ? 'yellow.400' : 'transparent'}
              cursor={totalReleases > 0 ? 'pointer' : 'default'}
              transition="all 0.2s"
              _hover={
                totalReleases > 0
                  ? {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }
                  : {}
              }
              position="relative"
            >
              <Text
                fontSize="sm"
                fontWeight={isToday ? 'bold' : 'normal'}
                color={isToday ? 'yellow.400' : 'white'}
                mb={1}
              >
                {day}
              </Text>
              {totalReleases > 0 && (
                <Badge
                  bg="rgba(0, 0, 0, 0.5)"
                  color="white"
                  fontSize="xs"
                  borderRadius="full"
                  px={1.5}
                >
                  {totalReleases}
                </Badge>
              )}
            </Box>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CalendarView
