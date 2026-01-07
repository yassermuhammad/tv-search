import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import { MEDIA_TYPES } from '../models/constants'

/**
 * Watchlist Context
 * Manages user's saved TV shows and movies with localStorage persistence
 */

const WatchlistContext = createContext()

/**
 * Custom hook to access watchlist context
 * @returns {Object} Watchlist context value
 * @throws {Error} If used outside WatchlistProvider
 */
export const useWatchlist = () => {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return context
}

/**
 * Loads watchlist from localStorage
 * @returns {Array} Array of watchlist items or empty array if none found
 */
/**
 * Loads watchlist from localStorage
 * @returns {Array<WatchlistItem>} Array of watchlist items or empty array if none found
 */
const loadWatchlistFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WATCHLIST)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading watchlist from localStorage:', error)
  }
  return []
}

/**
 * WatchlistProvider component
 * Provides watchlist context to child components
 * 
 * Features:
 * - Persists watchlist to localStorage
 * - Manages add/remove/toggle operations
 * - Filters by type (show/movie)
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const WatchlistProvider = ({ children }) => {
  // Initialize state directly from localStorage to avoid race conditions
  const [watchlist, setWatchlist] = useState(() => loadWatchlistFromStorage())
  const isMounted = useRef(false)

  // Save watchlist to localStorage whenever it changes (but skip first render)
  useEffect(() => {
    // Skip saving on initial mount - only save when user makes changes
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    // Save to localStorage whenever watchlist changes after mount
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist))
    } catch (error) {
      console.error('Error saving watchlist to localStorage:', error)
    }
  }, [watchlist])

  /**
   * Adds an item to the watchlist
   * @param {Movie|TVShow} item - Movie or show object
   * @param {MediaType} type - Item type ('show' or 'movie')
   * @returns {WatchlistItem} Created watchlist item
   */
  const addToWatchlist = (item, type) => {
    const watchlistItem = {
      id: item.id,
      type, // 'show' or 'movie'
      data: item,
      addedAt: new Date().toISOString(),
    }

    setWatchlist((prev) => {
      // Check if already in watchlist
      const exists = prev.some(
        (w) => w.id === item.id && w.type === type
      )
      if (exists) {
        return prev
      }
      return [...prev, watchlistItem]
    })
  }

  /**
   * Removes an item from the watchlist
   * @param {number} id - Item ID
   * @param {MediaType} type - Item type ('show' or 'movie')
   */
  const removeFromWatchlist = (id, type) => {
    setWatchlist((prev) =>
      prev.filter((item) => !(item.id === id && item.type === type))
    )
  }

  /**
   * Checks if an item is in the watchlist
   * @param {number} id - Item ID
   * @param {MediaType} type - Item type ('show' or 'movie')
   * @returns {boolean} True if item is in watchlist
   */
  const isInWatchlist = (id, type) => {
    return watchlist.some((item) => item.id === id && item.type === type)
  }

  /**
   * Toggles an item in the watchlist (adds if not present, removes if present)
   * @param {Movie|TVShow} item - Movie or show object
   * @param {MediaType} type - Item type ('show' or 'movie')
   */
  const toggleWatchlist = (item, type) => {
    if (isInWatchlist(item.id, type)) {
      removeFromWatchlist(item.id, type)
    } else {
      addToWatchlist(item, type)
    }
  }

  /**
   * Gets all items from watchlist filtered by type
   * @param {MediaType} type - Item type ('show' or 'movie')
   * @returns {Array<WatchlistItem>} Filtered watchlist items
   */
  const getWatchlistByType = (type) => {
    return watchlist.filter((item) => item.type === type)
  }

  /**
   * Clears all items from the watchlist
   */
  const clearWatchlist = () => {
    setWatchlist([])
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
        getWatchlistByType,
        clearWatchlist,
        watchlistCount: watchlist.length,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}

