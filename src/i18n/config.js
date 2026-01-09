import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { detectUserLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../utils/languageDetection'

// Re-export for consistency
export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE }
import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'
import arTranslations from './locales/ar.json'
import deTranslations from './locales/de.json'
import itTranslations from './locales/it.json'
import ptTranslations from './locales/pt.json'
import jaTranslations from './locales/ja.json'
import zhTranslations from './locales/zh.json'
import ruTranslations from './locales/ru.json'


/**
 * Translation resources
 */
const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  ar: { translation: arTranslations },
  de: { translation: deTranslations },
  it: { translation: itTranslations },
  pt: { translation: ptTranslations },
  ja: { translation: jaTranslations },
  zh: { translation: zhTranslations },
  ru: { translation: ruTranslations },
}

/**
 * Detect user's preferred language
 */
const detectedLanguage = detectUserLanguage()

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: detectedLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language preference
      caches: ['localStorage'],
      // Key to store language preference in localStorage
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
  })

export default i18n

