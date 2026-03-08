/**
 * Geolocation service for detecting user's country
 * Uses browser Geolocation API + reverse geocoding
 * PWA-safe: requests permission before accessing location
 */

const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

/**
 * Request geolocation permission and get user's position
 * @returns {Promise<{latitude: number, longitude: number}|null>} Position or null if denied/unavailable
 */
export const requestGeolocationPermission = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 }
    )
  })
}

/**
 * Reverse geocode coordinates to country code (ISO 3166-1 alpha-2)
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string|null>} Country code (e.g. 'US') or null
 */
export const getCountryFromCoordinates = async (latitude, longitude) => {
  try {
    const url = `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    const response = await fetch(url)
    if (!response.ok) return null

    const data = await response.json()
    return data.countryCode || null
  } catch (error) {
    console.error('Reverse geocode error:', error)
    return null
  }
}

/**
 * Get user's country: request permission, get position, reverse geocode
 * @returns {Promise<{countryCode: string|null, permissionGranted: boolean}>}
 */
export const getUserCountry = async () => {
  const position = await requestGeolocationPermission()
  if (!position) {
    return { countryCode: null, permissionGranted: false }
  }

  const countryCode = await getCountryFromCoordinates(
    position.latitude,
    position.longitude
  )

  return {
    countryCode: countryCode || null,
    permissionGranted: true,
  }
}
