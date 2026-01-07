/**
 * Utility functions for formatting data
 */

import { DATE_FORMATS } from './constants'
import { STATUS_COLORS } from '../models/constants'

/**
 * Strips HTML tags from a string
 * @param {string} html - HTML string to strip
 * @returns {string} Plain text without HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return 'No description available'
  return html.replace(/<[^>]*>/g, '').trim() || 'No description available'
}

/**
 * Formats a date string to a readable format
 * @param {string} dateString - Date string to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.yearOnly - If true, returns only the year
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A'
  
  if (options.yearOnly) {
    return new Date(dateString).toLocaleDateString(
      DATE_FORMATS.LOCALE,
      DATE_FORMATS.YEAR_ONLY
    )
  }
  
  const date = new Date(dateString)
  return date.toLocaleDateString(DATE_FORMATS.LOCALE, DATE_FORMATS.FULL_DATE)
}

/**
 * Formats a rating value
 * @param {number|string} rating - Rating value to format
 * @returns {string|null} Formatted rating or null if invalid
 */
export const formatRating = (rating) => {
  if (!rating) return null
  return typeof rating === 'number' ? rating.toFixed(1) : rating
}

/**
 * Gets status color for TV shows
 * @param {string} status - Show status
 * @returns {string} Color scheme name
 */
export const getStatusColor = (status) => {
  if (!status) return 'gray'
  return STATUS_COLORS[status] || 'gray'
}

/**
 * Formats currency amount
 * @param {number} amount - Amount to format
 * @returns {string|null} Formatted currency string or null if invalid
 */
export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return null
  return `$${amount.toLocaleString(DATE_FORMATS.LOCALE)}`
}

