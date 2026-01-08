/**
 * Share utility functions
 * Handles sharing functionality including Web Share API and social media sharing
 */

/**
 * Generates a shareable URL for a movie or TV show
 * @param {Object} item - Movie or show item
 * @param {string} type - Item type ('movie' or 'show')
 * @returns {string} Shareable URL
 */
export const generateShareUrl = (item, type) => {
  const baseUrl = window.location.origin
  const title = type === 'movie' ? item.title : item.name
  const encodedTitle = encodeURIComponent(title)
  
  // Create a shareable URL with the item ID and type
  return `${baseUrl}/share/${type}/${item.id}?title=${encodedTitle}`
}

/**
 * Generates share text for a movie or TV show
 * @param {Object} item - Movie or show item
 * @param {string} type - Item type ('movie' or 'show')
 * @returns {string} Share text
 */
export const generateShareText = (item, type) => {
  const title = type === 'movie' ? item.title : item.name
  const year = type === 'movie' 
    ? (item.release_date ? new Date(item.release_date).getFullYear() : '')
    : (item.premiered ? new Date(item.premiered).getFullYear() : '')
  
  const yearText = year ? ` (${year})` : ''
  return `Check out ${title}${yearText}!`
}

/**
 * Checks if Web Share API is supported
 * @returns {boolean} True if Web Share API is supported
 */
export const isWebShareSupported = () => {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

/**
 * Uses native Web Share API to share content
 * @param {Object} item - Movie or show item
 * @param {string} type - Item type ('movie' or 'show')
 * @returns {Promise<boolean>} True if share was successful
 */
export const shareViaWebShare = async (item, type) => {
  if (!isWebShareSupported()) {
    return false
  }

  try {
    const url = generateShareUrl(item, type)
    const text = generateShareText(item, type)
    const title = type === 'movie' ? item.title : item.name

    await navigator.share({
      title,
      text,
      url,
    })
    return true
  } catch (error) {
    // User cancelled or error occurred
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error)
    }
    return false
  }
}

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if copy was successful
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}

/**
 * Generates Twitter share URL
 * @param {Object} item - Movie or show item
 * @param {string} type - Item type ('movie' or 'show')
 * @returns {string} Twitter share URL
 */
export const getTwitterShareUrl = (item, type) => {
  const url = generateShareUrl(item, type)
  const text = generateShareText(item, type)
  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(url)
  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
}

/**
 * Generates Facebook share URL
 * Note: Facebook relies on Open Graph meta tags from the shared URL.
 * For localhost URLs, Facebook won't be able to extract title/description.
 * In production, ensure the Share page has proper Open Graph meta tags.
 * @param {Object} item - Movie or show item
 * @param {string} type - Item type ('movie' or 'show')
 * @returns {string} Facebook share URL
 */
export const getFacebookShareUrl = (item, type) => {
  const url = generateShareUrl(item, type)
  const text = generateShareText(item, type)
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(text)
  // Facebook's sharer.php doesn't officially support quote parameter,
  // but some versions might display it. The real solution is Open Graph meta tags.
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
}

/**
 * Generates WhatsApp share URL
 * @param {Object} item - Movie or show item
 * @param {string} type - Item type ('movie' or 'show')
 * @returns {string} WhatsApp share URL
 */
export const getWhatsAppShareUrl = (item, type) => {
  const url = generateShareUrl(item, type)
  const text = generateShareText(item, type)
  const encodedText = encodeURIComponent(`${text} ${url}`)
  return `https://wa.me/?text=${encodedText}`
}

/**
 * Generates Telegram share URL
 * @param {Object} item - Movie or show item
 * @param {string} type - Item type ('movie' or 'show')
 * @returns {string} Telegram share URL
 */
export const getTelegramShareUrl = (item, type) => {
  const url = generateShareUrl(item, type)
  const text = generateShareText(item, type)
  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(url)
  return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
}

/**
 * Generates Reddit share URL
 * @param {Object} item - Movie or show item
 * @param {string} type - Item type ('movie' or 'show')
 * @returns {string} Reddit share URL
 */
export const getRedditShareUrl = (item, type) => {
  const url = generateShareUrl(item, type)
  const title = type === 'movie' ? item.title : item.name
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  return `https://reddit.com/submit?title=${encodedTitle}&url=${encodedUrl}`
}

/**
 * Generates LinkedIn share URL
 * @param {Object} item - Movie or show item
 * @param {string} type - Item type ('movie' or 'show')
 * @returns {string} LinkedIn share URL
 */
export const getLinkedInShareUrl = (item, type) => {
  const url = generateShareUrl(item, type)
  const encodedUrl = encodeURIComponent(url)
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
}

