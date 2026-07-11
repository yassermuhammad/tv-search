import { forwardRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Flex,
  Image,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

/**
 * A single stat block (number + label).
 */
const Stat = ({ value, label }) => (
  <VStack spacing={0} flex={1} minW={0}>
    <Text fontSize="28px" fontWeight="900" color="white" lineHeight="1.1">
      {value}
    </Text>
    <Text
      fontSize="10px"
      color="rgba(255,255,255,0.6)"
      textTransform="uppercase"
      letterSpacing="normal"
      fontWeight="700"
      textAlign="center"
      noOfLines={1}
    >
      {label}
    </Text>
  </VStack>
)

/**
 * TasteCard - the visual, exportable "taste profile" card.
 * Rendered at a fixed width so it exports consistently as an image.
 *
 * @param {Object} props
 * @param {import('../../utils/tasteStats').TasteProfile} props.profile - Computed taste profile
 */
const TasteCard = forwardRef(({ profile }, ref) => {
  const { t } = useTranslation()

  const personaName = t(`tasteCard.personas.${profile.personaKey}`, {
    defaultValue: t('tasteCard.personas.default'),
  })

  const maxGenreCount =
    profile.topGenres.length > 0 ? profile.topGenres[0].count : 1

  return (
    <Box
      ref={ref}
      width="380px"
      bg="#141414"
      bgGradient="linear(to-b, #1f1f1f, #141414)"
      borderRadius="16px"
      overflow="hidden"
      position="relative"
      border="1px solid rgba(255,255,255,0.08)"
      boxShadow="0 20px 60px rgba(0,0,0,0.6)"
    >
      {/* Accent glow */}
      <Box
        position="absolute"
        top="-80px"
        right="-80px"
        w="220px"
        h="220px"
        bg="netflix.500"
        opacity={0.25}
        filter="blur(70px)"
        borderRadius="full"
      />

      <VStack align="stretch" spacing={5} p={6} position="relative">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text
            fontSize="18px"
            fontWeight="900"
            color="netflix.500"
            letterSpacing="tight"
          >
            WATCHPEDIA
          </Text>
          <Text
            fontSize="10px"
            color="rgba(255,255,255,0.5)"
            textTransform="uppercase"
            letterSpacing="widest"
            fontWeight="700"
          >
            {t('tasteCard.badge')}
          </Text>
        </Flex>

        {/* Persona */}
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="12px" color="rgba(255,255,255,0.6)" fontWeight="600">
            {t('tasteCard.youAre')}
          </Text>
          <Text
            fontSize="30px"
            fontWeight="900"
            color="white"
            lineHeight="1.05"
            letterSpacing="tight"
          >
            {personaName}
          </Text>
          {profile.topGenre && (
            <Text fontSize="13px" color="netflix.300" fontWeight="700">
              {t('tasteCard.topGenreLabel', { genre: profile.topGenre })}
            </Text>
          )}
        </VStack>

        {/* Poster strip */}
        {profile.posters.length > 0 && (
          <HStack spacing={2} justify="flex-start">
            {profile.posters.slice(0, 4).map((src, idx) => (
              <Box
                key={idx}
                w="80px"
                h="120px"
                borderRadius="8px"
                overflow="hidden"
                bg="#2a2a2a"
                flexShrink={0}
                boxShadow="0 6px 16px rgba(0,0,0,0.5)"
              >
                <Image
                  src={src}
                  alt=""
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  crossOrigin="anonymous"
                  loading="eager"
                />
              </Box>
            ))}
          </HStack>
        )}

        {/* Stats row */}
        <HStack
          spacing={2}
          bg="rgba(255,255,255,0.05)"
          borderRadius="12px"
          py={4}
          px={3}
          divider={
            <Box w="1px" alignSelf="stretch" bg="rgba(255,255,255,0.12)" />
          }
        >
          <Stat value={profile.totalCount} label={t('tasteCard.titles')} />
          <Stat value={profile.movieCount} label={t('tasteCard.movies')} />
          <Stat value={profile.showCount} label={t('tasteCard.shows')} />
          <Stat
            value={profile.avgRating != null ? `${profile.avgRating}` : '—'}
            label={t('tasteCard.avgRating')}
          />
        </HStack>

        {/* Top genres */}
        {profile.topGenres.length > 0 && (
          <VStack align="stretch" spacing={2}>
            <Text
              fontSize="11px"
              color="rgba(255,255,255,0.6)"
              textTransform="uppercase"
              letterSpacing="wider"
              fontWeight="700"
            >
              {t('tasteCard.topGenres')}
            </Text>
            {profile.topGenres.slice(0, 3).map((g) => (
              <Box key={g.name}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="13px" color="white" fontWeight="600">
                    {g.name}
                  </Text>
                  <Text fontSize="12px" color="rgba(255,255,255,0.5)" fontWeight="600">
                    {g.count}
                  </Text>
                </Flex>
                <Box w="100%" h="6px" bg="rgba(255,255,255,0.1)" borderRadius="full">
                  <Box
                    h="100%"
                    w={`${Math.max(8, Math.round((g.count / maxGenreCount) * 100))}%`}
                    bgGradient="linear(to-r, netflix.600, netflix.400)"
                    borderRadius="full"
                  />
                </Box>
              </Box>
            ))}
          </VStack>
        )}

        {/* Footer */}
        <Flex justify="space-between" align="center" pt={1}>
          {profile.topDecade ? (
            <Text fontSize="11px" color="rgba(255,255,255,0.5)" fontWeight="600">
              {t('tasteCard.favoriteEra', { decade: profile.topDecade })}
            </Text>
          ) : (
            <Box />
          )}
          <Text fontSize="11px" color="rgba(255,255,255,0.4)" fontWeight="700">
            watchpedia
          </Text>
        </Flex>
      </VStack>
    </Box>
  )
})

TasteCard.displayName = 'TasteCard'

export default TasteCard
