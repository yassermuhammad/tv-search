import { useMemo, useRef, useState } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Center,
  useToast,
} from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'
import { FiShare2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toPng } from 'html-to-image'
import { useWatchlist } from '../contexts/WatchlistContext'
import { computeTasteProfile } from '../utils/tasteStats'
import TasteCard from '../components/taste/TasteCard'
import Header from '../components/shared/Header'
import EmptyState from '../components/shared/EmptyState'
import SEO from '../components/seo/SEO'

/**
 * Taste Card page
 * Generates a shareable "taste profile" card from the user's watchlist and
 * lets them download or share it as an image.
 */
const TasteCardPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const { watchlist } = useWatchlist()
  const cardRef = useRef(null)
  const [isBusy, setIsBusy] = useState(false)

  const profile = useMemo(() => computeTasteProfile(watchlist), [watchlist])

  /**
   * Renders the card DOM node to a PNG data URL.
   * @returns {Promise<string>} Data URL
   */
  const renderToPng = async () => {
    if (!cardRef.current) throw new Error('Card not ready')
    // Render twice: the first pass warms up cross-origin image loading so the
    // second pass reliably inlines all posters.
    await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
    return toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#141414',
    })
  }

  /**
   * Converts a data URL to a File for the Web Share API.
   */
  const dataUrlToFile = async (dataUrl, filename) => {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return new File([blob], filename, { type: 'image/png' })
  }

  const handleDownload = async () => {
    setIsBusy(true)
    try {
      const dataUrl = await renderToPng()
      const link = document.createElement('a')
      link.download = 'my-watchpedia-taste.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error generating taste card image:', error)
      toast({
        title: t('tasteCard.errorTitle'),
        description: t('tasteCard.errorDescription'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsBusy(false)
    }
  }

  const handleShare = async () => {
    setIsBusy(true)
    try {
      const dataUrl = await renderToPng()
      const file = await dataUrlToFile(dataUrl, 'my-watchpedia-taste.png')
      const shareData = {
        title: t('tasteCard.shareTitle'),
        text: t('tasteCard.shareText', {
          persona: t(`tasteCard.personas.${profile.personaKey}`, {
            defaultValue: t('tasteCard.personas.default'),
          }),
        }),
        files: [file],
      }

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData)
      } else {
        // Fallback: download the image instead
        const link = document.createElement('a')
        link.download = 'my-watchpedia-taste.png'
        link.href = dataUrl
        link.click()
        toast({
          title: t('tasteCard.downloadedTitle'),
          description: t('tasteCard.downloadedDescription'),
          status: 'info',
          duration: 4000,
          isClosable: true,
        })
      }
    } catch (error) {
      // Ignore user-cancelled share
      if (error?.name !== 'AbortError') {
        console.error('Error sharing taste card:', error)
        toast({
          title: t('tasteCard.errorTitle'),
          description: t('tasteCard.errorDescription'),
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Box minH="100vh" bg="#141414" position="relative">
      <SEO
        title={t('tasteCard.title')}
        description={t('tasteCard.subtitle')}
        keywords="taste card, movie taste, watch stats, shareable card, film personality"
        noindex={true}
      />
      <Header showBackButton onBack={() => navigate('/watchlist')} />

      <Container maxW="container.md" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
        <VStack align="stretch" spacing={2} mb={{ base: 6, md: 8 }}>
          <Heading
            as="h1"
            color="netflix.500"
            fontWeight="900"
            letterSpacing="tight"
            fontSize={{ base: '22px', sm: '26px', md: '30px' }}
          >
            {t('tasteCard.title')}
          </Heading>
          <Text color="rgba(255,255,255,0.7)" fontSize={{ base: 'sm', md: 'md' }}>
            {t('tasteCard.subtitle')}
          </Text>
        </VStack>

        {profile.isEmpty ? (
          <EmptyState
            title={t('tasteCard.emptyTitle')}
            message={t('tasteCard.emptyMessage')}
          />
        ) : (
          <VStack spacing={{ base: 6, md: 8 }}>
            <Center w="100%">
              <TasteCard ref={cardRef} profile={profile} />
            </Center>

            <HStack spacing={3} w="100%" maxW="380px" justify="center">
              <Button
                leftIcon={<FiShare2 />}
                variant="netflix"
                flex={1}
                onClick={handleShare}
                isLoading={isBusy}
                loadingText={t('tasteCard.working')}
              >
                {t('tasteCard.share')}
              </Button>
              <Button
                leftIcon={<DownloadIcon />}
                flex={1}
                bg="rgba(255,255,255,0.1)"
                color="white"
                _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                onClick={handleDownload}
                isLoading={isBusy}
                loadingText={t('tasteCard.working')}
              >
                {t('tasteCard.download')}
              </Button>
            </HStack>
          </VStack>
        )}
      </Container>
    </Box>
  )
}

export default TasteCardPage
