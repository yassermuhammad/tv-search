import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { 
  collection, 
  doc,
  setDoc, 
  deleteDoc, 
  onSnapshot,
  writeBatch
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { STORAGE_KEYS } from '../utils/constants'
import { MEDIA_TYPES } from '../models/constants'
import { useAuth } from './AuthContext'

/**
 * Watchlist Context
 * Manages user's saved TV shows and movies with Firebase Firestore persistence
 * Falls back to localStorage when user is not logged in
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
 * Saves watchlist to localStorage
 * @param {Array<WatchlistItem>} watchlist - Watchlist items to save
 */
const saveWatchlistToStorage = (watchlist) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist))
  } catch (error) {
    console.error('Error saving watchlist to localStorage:', error)
  }
}

/**
 * Gets the Firestore collection reference for a user's watchlist
 * @param {string} userId - User ID
 * @returns {CollectionReference} Firestore collection reference
 */
const getWatchlistCollection = (userId) => {
  return collection(db, 'users', userId, 'watchlist')
}

/**
 * Gets the Firestore document reference for a watchlist item
 * @param {string} userId - User ID
 * @param {number} itemId - Item ID
 * @param {string} type - Item type ('show' or 'movie')
 * @returns {DocumentReference} Firestore document reference
 */
const getWatchlistItemDoc = (userId, itemId, type) => {
  // Create a unique document ID from itemId and type
  const docId = `${itemId}_${type}`
  return doc(db, 'users', userId, 'watchlist', docId)
}

/**
 * WatchlistProvider component
 * Provides watchlist context to child components
 * 
 * Features:
 * - Persists watchlist to Firebase Firestore when user is logged in
 * - Falls back to localStorage when user is not logged in
 * - Real-time sync across devices
 * - Automatic migration from localStorage to Firestore on first login
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const WatchlistProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [watchlist, setWatchlist] = useState(() => loadWatchlistFromStorage())
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const unsubscribeRef = useRef(null)
  const isMounted = useRef(false)
  const hasMigratedRef = useRef(false)

  // Initialize on mount
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Handle auth state changes and sync with Firestore
  useEffect(() => {
    // Clean up previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    if (currentUser) {
      // User is logged in - use Firestore
      const userId = currentUser.uid
      setLoading(true)

      // Set up real-time listener for watchlist
      const watchlistCollection = getWatchlistCollection(userId)
      
      unsubscribeRef.current = onSnapshot(
        watchlistCollection,
        (snapshot) => {
          if (!isMounted.current) return

          const items = []
          snapshot.forEach((doc) => {
            items.push(doc.data())
          })

          // Sort by addedAt (most recent first)
          items.sort((a, b) => {
            const dateA = new Date(a.addedAt || 0)
            const dateB = new Date(b.addedAt || 0)
            return dateB - dateA
          })

          setWatchlist(items)
          setLoading(false)

          // Migrate localStorage data to Firestore on first login (one-time)
          if (!hasMigratedRef.current && items.length === 0) {
            migrateLocalStorageToFirestore(userId)
            hasMigratedRef.current = true
          }
        },
        (error) => {
          console.error('Error listening to watchlist:', error)
          
          // Provide helpful error message for permission errors
          if (error.code === 'permission-denied') {
            console.error(
              '❌ Firestore Permission Error:\n' +
              'The watchlist cannot sync because Firestore Security Rules are not configured.\n' +
              'Please follow these steps:\n' +
              '1. Go to Firebase Console → Firestore Database\n' +
              '2. Click "Rules" tab\n' +
              '3. Set up security rules (see FIRESTORE_SETUP.md)\n' +
              '4. Click "Publish" to save the rules\n' +
              '5. Refresh this page'
            )
          }
          
          setLoading(false)
          // Fall back to localStorage on error
          setWatchlist(loadWatchlistFromStorage())
        }
      )
    } else {
      // User is not logged in - use localStorage
      hasMigratedRef.current = false
      setWatchlist(loadWatchlistFromStorage())
      setLoading(false)
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [currentUser])

  /**
   * Migrates watchlist from localStorage to Firestore
   * @param {string} userId - User ID
   */
  const migrateLocalStorageToFirestore = async (userId) => {
    try {
      const localWatchlist = loadWatchlistFromStorage()
      
      if (localWatchlist.length === 0) {
        return // Nothing to migrate
      }

      setIsSyncing(true)
      const batch = writeBatch(db)

      // Check if Firestore already has data by checking if collection exists
      // We'll migrate only if the current watchlist is empty (from snapshot)
      // This ensures we don't overwrite existing Firestore data
      
      localWatchlist.forEach((item) => {
        const itemDoc = getWatchlistItemDoc(userId, item.id, item.type)
        batch.set(itemDoc, {
          id: item.id,
          type: item.type,
          data: item.data,
          addedAt: item.addedAt || new Date().toISOString(),
        })
      })

      await batch.commit()
      console.log(`Migrated ${localWatchlist.length} items from localStorage to Firestore`)
      
      // Optionally clear localStorage after successful migration
      // localStorage.removeItem(STORAGE_KEYS.WATCHLIST)
    } catch (error) {
      console.error('Error migrating watchlist to Firestore:', error)
      if (error.code === 'permission-denied') {
        console.error(
          '❌ Cannot migrate watchlist: Firestore Security Rules not configured.\n' +
          'See FIRESTORE_SETUP.md for setup instructions.\n' +
          'Watchlist will continue to use localStorage until rules are set up.'
        )
      }
    } finally {
      setIsSyncing(false)
    }
  }

  /**
   * Saves watchlist to Firestore or localStorage based on auth state
   * @param {Array<WatchlistItem>} newWatchlist - New watchlist items
   */
  const saveWatchlist = async (newWatchlist) => {
    if (currentUser) {
      // Save to Firestore (will trigger onSnapshot listener)
      // Note: We don't need to manually save here because Firestore operations
      // (add/remove) will trigger the listener automatically
      return
    } else {
      // Save to localStorage
      saveWatchlistToStorage(newWatchlist)
    }
  }

  /**
   * Adds an item to the watchlist
   * @param {Movie|TVShow} item - Movie or show object
   * @param {MediaType} type - Item type ('show' or 'movie')
   */
  const addToWatchlist = async (item, type) => {
    const watchlistItem = {
      id: item.id,
      type, // 'show' or 'movie'
      data: item,
      addedAt: new Date().toISOString(),
    }

    // Check if already in watchlist
    const exists = watchlist.some(
      (w) => w.id === item.id && w.type === type
    )
    if (exists) {
      return
    }

    if (currentUser) {
      // Save to Firestore
      try {
        const userId = currentUser.uid
        const itemDoc = getWatchlistItemDoc(userId, item.id, type)
        await setDoc(itemDoc, watchlistItem)
        // onSnapshot listener will update state automatically
      } catch (error) {
        console.error('Error adding item to Firestore:', error)
        if (error.code === 'permission-denied') {
          console.error(
            '❌ Cannot add item: Firestore Security Rules not configured.\n' +
            'See FIRESTORE_SETUP.md for setup instructions.'
          )
        }
        // Fall back to local state update
        setWatchlist((prev) => [...prev, watchlistItem])
      }
    } else {
      // Save to localStorage
      const newWatchlist = [...watchlist, watchlistItem]
      setWatchlist(newWatchlist)
      saveWatchlist(newWatchlist)
    }
  }

  /**
   * Removes an item from the watchlist
   * @param {number} id - Item ID
   * @param {MediaType} type - Item type ('show' or 'movie')
   */
  const removeFromWatchlist = async (id, type) => {
    if (currentUser) {
      // Remove from Firestore
      try {
        const userId = currentUser.uid
        const itemDoc = getWatchlistItemDoc(userId, id, type)
        await deleteDoc(itemDoc)
        // onSnapshot listener will update state automatically
      } catch (error) {
        console.error('Error removing item from Firestore:', error)
        // Fall back to local state update
        setWatchlist((prev) =>
          prev.filter((item) => !(item.id === id && item.type === type))
        )
      }
    } else {
      // Remove from localStorage
      const newWatchlist = watchlist.filter(
        (item) => !(item.id === id && item.type === type)
      )
      setWatchlist(newWatchlist)
      saveWatchlist(newWatchlist)
    }
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
  const clearWatchlist = async () => {
    if (currentUser) {
      // Clear from Firestore
      try {
        const userId = currentUser.uid
        const batch = writeBatch(db)
        
        watchlist.forEach((item) => {
          const itemDoc = getWatchlistItemDoc(userId, item.id, item.type)
          batch.delete(itemDoc)
        })

        await batch.commit()
        // onSnapshot listener will update state automatically
      } catch (error) {
        console.error('Error clearing watchlist from Firestore:', error)
        setWatchlist([])
      }
    } else {
      // Clear from localStorage
      setWatchlist([])
      saveWatchlist([])
    }
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
        loading,
        isSyncing,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}
