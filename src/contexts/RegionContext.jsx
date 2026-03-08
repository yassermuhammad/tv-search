import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getUserCountry } from '../services/geolocationService'
import { WORLDWIDE_CODE, getRegionName } from '../utils/regionConstants'
import { STORAGE_KEYS } from '../utils/constants'

const RegionContext = createContext(null)

export const useRegion = () => {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error('useRegion must be used within RegionProvider')
  }
  return context
}

export const RegionProvider = ({ children }) => {
  const [region, setRegionState] = useState(WORLDWIDE_CODE)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false)

  const setRegion = useCallback((newRegion) => {
    setRegionState(newRegion || WORLDWIDE_CODE)
    try {
      localStorage.setItem(STORAGE_KEYS.REGION, newRegion || WORLDWIDE_CODE)
    } catch (e) {
      // ignore
    }
  }, [])

  const requestPermission = useCallback(async () => {
    setHasRequestedPermission(true)
    setIsLoading(true)
    try {
      const { countryCode, permissionGranted: granted } = await getUserCountry()
      setPermissionGranted(granted)
      try {
        localStorage.setItem(STORAGE_KEYS.REGION_PERMISSION, granted ? '1' : '0')
      } catch (e) {
        // ignore
      }
      if (granted && countryCode) {
        setRegionState(countryCode)
        try {
          localStorage.setItem(STORAGE_KEYS.REGION, countryCode)
        } catch (e) {
          // ignore
        }
      } else {
        setRegionState(WORLDWIDE_CODE)
        try {
          localStorage.setItem(STORAGE_KEYS.REGION, WORLDWIDE_CODE)
        } catch (e) {
          // ignore
        }
      }
    } catch (error) {
      console.error('Region permission error:', error)
      setPermissionGranted(false)
      setRegionState(WORLDWIDE_CODE)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const initRegion = async () => {
      try {
        const storedRegion = localStorage.getItem(STORAGE_KEYS.REGION)
        // Use stored region immediately so manual selection persists across reloads
        if (storedRegion && storedRegion !== WORLDWIDE_CODE) {
          setRegionState(storedRegion)
        }
        const { countryCode, permissionGranted: granted } = await getUserCountry()
        setPermissionGranted(granted)
        if (granted && countryCode && !storedRegion) {
          setRegionState(countryCode)
          localStorage.setItem(STORAGE_KEYS.REGION, countryCode)
        } else if (storedRegion) {
          setRegionState(storedRegion)
        } else if (!granted) {
          setRegionState(storedRegion || WORLDWIDE_CODE)
          if (!storedRegion) localStorage.setItem(STORAGE_KEYS.REGION, WORLDWIDE_CODE)
        }
      } catch (error) {
        console.error('Region init error:', error)
        setRegionState(localStorage.getItem(STORAGE_KEYS.REGION) || WORLDWIDE_CODE)
        setPermissionGranted(false)
      } finally {
        setIsLoading(false)
      }
    }

    initRegion()
  }, [])

  const value = {
    region,
    setRegion,
    permissionGranted,
    isLoading,
    hasRequestedPermission,
    requestPermission,
    regionName: getRegionName(region),
    isWorldwide: region === WORLDWIDE_CODE,
  }

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  )
}
