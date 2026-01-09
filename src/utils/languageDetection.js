// Note: This file is imported before i18n/config, so we define constants here
const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
}

const DEFAULT_LANGUAGE = 'en'

/**
 * Maps browser language codes to our supported language codes
 */
const LANGUAGE_MAP = {
  // English variants
  'en-US': 'en',
  'en-GB': 'en',
  'en-CA': 'en',
  'en-AU': 'en',
  'en': 'en',
  
  // Spanish variants
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'es-CO': 'es',
  'es': 'es',
  
  // French variants
  'fr-FR': 'fr',
  'fr-CA': 'fr',
  'fr-BE': 'fr',
  'fr': 'fr',
  
  // Arabic variants
  'ar-SA': 'ar',
  'ar-EG': 'ar',
  'ar-AE': 'ar',
  'ar': 'ar',
  
  // German variants
  'de-DE': 'de',
  'de-AT': 'de',
  'de-CH': 'de',
  'de': 'de',
  
  // Italian variants
  'it-IT': 'it',
  'it-CH': 'it',
  'it': 'it',
  
  // Portuguese variants
  'pt-PT': 'pt',
  'pt-BR': 'pt',
  'pt': 'pt',
  
  // Japanese
  'ja-JP': 'ja',
  'ja': 'ja',
  
  // Chinese variants
  'zh-CN': 'zh',
  'zh-TW': 'zh',
  'zh-HK': 'zh',
  'zh': 'zh',
  
  // Russian variants
  'ru-RU': 'ru',
  'ru': 'ru',
}

/**
 * Detects user's preferred language based on:
 * 1. localStorage preference (if set)
 * 2. Browser language
 * 3. Geolocation (if available)
 * 4. Default language
 * 
 * @returns {string} Language code (e.g., 'en', 'es', 'fr')
 */
export const detectUserLanguage = () => {
  // 1. Check localStorage first (user preference)
  const storedLanguage = localStorage.getItem('i18nextLng')
  if (storedLanguage && SUPPORTED_LANGUAGES[storedLanguage]) {
    return storedLanguage
  }

  // 2. Check browser language
  const browserLanguage = navigator.language || navigator.userLanguage
  if (browserLanguage) {
    // Try exact match first
    if (SUPPORTED_LANGUAGES[browserLanguage]) {
      return browserLanguage
    }
    
    // Try language map
    const mappedLanguage = LANGUAGE_MAP[browserLanguage]
    if (mappedLanguage && SUPPORTED_LANGUAGES[mappedLanguage]) {
      return mappedLanguage
    }
    
    // Try base language code (e.g., 'en' from 'en-US')
    const baseLanguage = browserLanguage.split('-')[0]
    if (SUPPORTED_LANGUAGES[baseLanguage]) {
      return baseLanguage
    }
  }

  // 3. Try geolocation-based detection (async, but we'll use it as fallback)
  // Note: This is a simplified version. For production, you might want to use
  // a geolocation API service to map country codes to languages
  
  // 4. Return default language
  return DEFAULT_LANGUAGE
}

/**
 * Gets country code from geolocation (if available)
 * This is a placeholder - in production, you'd use a geolocation API
 * @returns {Promise<string|null>} Country code or null
 */
export const getCountryFromGeolocation = async () => {
  // This is a simplified example
  // In production, you might use:
  // - IP geolocation API (e.g., ipapi.co, ip-api.com)
  // - Browser geolocation API (requires user permission)
  
  try {
    // Example: Using a free IP geolocation service
    // const response = await fetch('https://ipapi.co/json/')
    // const data = await response.json()
    // return data.country_code
    
    return null // Return null for now
  } catch (error) {
    console.error('Error detecting country:', error)
    return null
  }
}

/**
 * Maps country codes to language codes
 */
const COUNTRY_TO_LANGUAGE = {
  // English-speaking countries
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
  
  // Spanish-speaking countries
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
  
  // French-speaking countries
  FR: 'fr', CA: 'fr', BE: 'fr', CH: 'fr',
  
  // Arabic-speaking countries
  SA: 'ar', EG: 'ar', AE: 'ar', IQ: 'ar', JO: 'ar',
  
  // German-speaking countries
  DE: 'de', AT: 'de', CH: 'de',
  
  // Italian
  IT: 'it', CH: 'it',
  
  // Portuguese
  PT: 'pt', BR: 'pt',
  
  // Japanese
  JP: 'ja',
  
  // Chinese
  CN: 'zh', TW: 'zh', HK: 'zh',
  
  // Russian
  RU: 'ru',
}

/**
 * Gets language from country code
 * @param {string} countryCode - ISO country code (e.g., 'US', 'FR')
 * @returns {string} Language code
 */
export const getLanguageFromCountry = (countryCode) => {
  return COUNTRY_TO_LANGUAGE[countryCode] || DEFAULT_LANGUAGE
}

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE }

