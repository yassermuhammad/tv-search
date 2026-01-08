import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  SimpleGrid,
  Box,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import {
  shareViaWebShare,
  copyToClipboard,
  generateShareUrl,
  generateShareText,
  getTwitterShareUrl,
  getFacebookShareUrl,
  getWhatsAppShareUrl,
  getTelegramShareUrl,
  getRedditShareUrl,
  getLinkedInShareUrl,
  isWebShareSupported,
} from '../../utils/shareUtils'
import { COLORS } from '../../utils/constants'
import { MEDIA_TYPES } from '../../models/constants'

const MODAL_BG_COLOR = COLORS.MODAL_BG
const TEXT_COLOR = COLORS.TEXT_PRIMARY

// Social media icons as SVG components
const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  </svg>
)

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
)

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const TelegramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const RedditIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
)

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const CopyIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

/**
 * Share modal component
 * Displays sharing options including native share (mobile) and social media platforms
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Object} props.item - Movie or show item
 * @param {string} props.type - Item type ('movie' or 'show')
 */
const ShareModal = ({ isOpen, onClose, item, type }) => {
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  if (!item) return null

  const shareUrl = generateShareUrl(item, type)
  const shareText = generateShareText(item, type)
  const title = type === MEDIA_TYPES.MOVIE ? item.title : item.name

  /**
   * Handles native Web Share API (mobile)
   */
  const handleNativeShare = async () => {
    const success = await shareViaWebShare(item, type)
    if (success) {
      onClose()
      toast({
        title: 'Shared successfully!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  /**
   * Handles copying link to clipboard
   */
  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl)
    if (success) {
      setCopied(true)
      toast({
        title: 'Link copied to clipboard!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast({
        title: 'Failed to copy link',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  /**
   * Handles social media sharing
   */
  const handleSocialShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400')
  }

  const socialOptions = [
    {
      name: 'Twitter',
      icon: TwitterIcon,
      color: '#1DA1F2',
      getUrl: () => getTwitterShareUrl(item, type),
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      color: '#1877F2',
      getUrl: () => getFacebookShareUrl(item, type),
    },
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      color: '#25D366',
      getUrl: () => getWhatsAppShareUrl(item, type),
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      color: '#0088cc',
      getUrl: () => getTelegramShareUrl(item, type),
    },
    {
      name: 'Reddit',
      icon: RedditIcon,
      color: '#FF4500',
      getUrl: () => getRedditShareUrl(item, type),
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      color: '#0077B5',
      getUrl: () => getLinkedInShareUrl(item, type),
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: undefined, md: 'md' }} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent
        bg={MODAL_BG_COLOR}
        maxH={{ base: 'calc(100vh - 64px)', md: '90vh' }}
        maxW={{ base: 'calc(100vw - 32px)', md: 'md' }}
        borderRadius={{ base: '8px', md: '8px' }}
        my={{ base: 8, md: 'auto' }}
        mx={{ base: 4, md: 'auto' }}
      >
        <ModalHeader
          borderBottom="1px solid rgba(255, 255, 255, 0.1)"
          pb={4}
          color={TEXT_COLOR}
          fontSize={{ base: 'lg', md: 'xl' }}
        >
          Share {title}
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
          <VStack spacing={6} align="stretch">
            {/* Native Share Button (Mobile) */}
            {isWebShareSupported() && (
              <>
                <Button
                  size="lg"
                  bg="netflix.500"
                  color="white"
                  _hover={{ bg: 'netflix.600' }}
                  onClick={handleNativeShare}
                  leftIcon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  }
                  fontWeight="bold"
                  w="100%"
                >
                  Share via...
                </Button>
                <Box>
                  <Text
                    fontSize="sm"
                    color="rgba(255, 255, 255, 0.6)"
                    textAlign="center"
                    mb={4}
                  >
                    Or share on social media
                  </Text>
                </Box>
              </>
            )}

            {/* Copy Link Button */}
            <Button
              size="lg"
              variant="outline"
              borderColor="rgba(255, 255, 255, 0.2)"
              color={TEXT_COLOR}
              _hover={{
                bg: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
              onClick={handleCopyLink}
              leftIcon={<CopyIcon />}
              fontWeight="bold"
              w="100%"
            >
              {copied ? 'Link Copied!' : 'Copy Link'}
            </Button>

            {/* Social Media Options */}
            <Box>
              <Text
                fontSize="sm"
                color="rgba(255, 255, 255, 0.6)"
                mb={4}
                fontWeight="600"
              >
                Share on social media
              </Text>
              <SimpleGrid columns={3} spacing={4}>
                {socialOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <VStack
                      key={option.name}
                      spacing={2}
                      as="button"
                      onClick={() => handleSocialShare(option.getUrl())}
                      p={4}
                      borderRadius="md"
                      bg="rgba(255, 255, 255, 0.05)"
                      _hover={{
                        bg: 'rgba(255, 255, 255, 0.1)',
                        transform: 'scale(1.05)',
                      }}
                      transition="all 0.2s"
                      cursor="pointer"
                      border="none"
                      outline="none"
                      aria-label={`Share on ${option.name}`}
                    >
                      <Box
                        w="48px"
                        h="48px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg={`${option.color}20`}
                        color={option.color}
                        borderRadius="full"
                        _hover={{
                          bg: `${option.color}30`,
                        }}
                        transition="all 0.2s"
                      >
                        <IconComponent width="24px" height="24px" />
                      </Box>
                      <Text
                        fontSize="xs"
                        color={TEXT_COLOR}
                        fontWeight="600"
                        textAlign="center"
                      >
                        {option.name}
                      </Text>
                    </VStack>
                  )
                })}
              </SimpleGrid>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ShareModal

