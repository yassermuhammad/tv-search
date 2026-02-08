import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { 
  collection, 
  doc,
  setDoc, 
  deleteDoc, 
  onSnapshot,
  writeBatch,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { STORAGE_KEYS } from '../utils/constants'
import { MEDIA_TYPES } from '../models/constants'
import { useAuth } from './AuthContext'
import { 
  scheduleReleaseNotification, 
  cancelScheduledNotification,
  scheduleAllReminders 
} from '../services/notificationService'

/**
 * Reminders Context
 * Manages user's release reminders with Firebase Firestore persistence
 * Falls back to localStorage when user is not logged in
 */

const RemindersContext = createContext()

/**
 * Custom hook to access reminders context
 * @returns {Object} Reminders context value
 * @throws {Error} If used outside RemindersProvider
 */
export const useReminders = () => {
  const context = useContext(RemindersContext)
  if (!context) {
    throw new Error('useReminders must be used within a RemindersProvider')
  }
  return context
}

/**
 * Loads reminders from localStorage
 * @returns {Array<Reminder>} Array of reminders or empty array if none found
 */
const loadRemindersFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading reminders from localStorage:', error)
  }
  return []
}

/**
 * Saves reminders to localStorage
 * @param {Array<Reminder>} reminders - Reminders to save
 */
const saveRemindersToStorage = (reminders) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders))
  } catch (error) {
    console.error('Error saving reminders to localStorage:', error)
  }
}

/**
 * Gets the Firestore collection reference for a user's reminders
 * @param {string} userId - User ID
 * @returns {CollectionReference} Firestore collection reference
 */
const getRemindersCollection = (userId) => {
  return collection(db, 'users', userId, 'reminders')
}

/**
 * Gets the Firestore document reference for a reminder
 * @param {string} userId - User ID
 * @param {number} itemId - Item ID
 * @param {string} type - Item type ('show' or 'movie')
 * @returns {DocumentReference} Firestore document reference
 */
const getReminderDoc = (userId, itemId, type) => {
  // Create a unique document ID from itemId and type
  const docId = `${itemId}_${type}`
  return doc(db, 'users', userId, 'reminders', docId)
}

/**
 * RemindersProvider component
 * Provides reminders context to child components
 * 
 * Features:
 * - Persists reminders to Firebase Firestore when user is logged in
 * - Falls back to localStorage when user is not logged in
 * - Real-time sync across devices
 * - Automatic migration from localStorage to Firestore on first login
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const RemindersProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [reminders, setReminders] = useState(() => loadRemindersFromStorage())
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

      // Set up real-time listener for reminders
      const remindersCollection = getRemindersCollection(userId)
      
      // Query reminders ordered by release date
      const remindersQuery = query(
        remindersCollection,
        orderBy('releaseDate', 'asc')
      )
      
      unsubscribeRef.current = onSnapshot(
        remindersQuery,
        (snapshot) => {
          if (!isMounted.current) return

          const items = []
          snapshot.forEach((doc) => {
            items.push(doc.data())
          })

          setReminders(items)
          setLoading(false)

          // Schedule notifications for all reminders
          if (items.length > 0) {
            scheduleAllReminders(items).catch((error) => {
              console.error('Error scheduling notifications:', error)
            })
          }

          // Migrate localStorage data to Firestore on first login (one-time)
          if (!hasMigratedRef.current && items.length === 0) {
            migrateLocalStorageToFirestore(userId)
            hasMigratedRef.current = true
          }
        },
        (error) => {
          console.error('Error listening to reminders:', error)
          
          // Provide helpful error message for permission errors
          if (error.code === 'permission-denied') {
            console.error(
              '❌ Firestore Permission Error:\n' +
              'The reminders cannot sync because Firestore Security Rules are not configured.\n' +
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
          setReminders(loadRemindersFromStorage())
        }
      )
    } else {
      // User is not logged in - use localStorage
      hasMigratedRef.current = false
      setReminders(loadRemindersFromStorage())
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
   * Migrates reminders from localStorage to Firestore
   * @param {string} userId - User ID
   */
  const migrateLocalStorageToFirestore = async (userId) => {
    try {
      const localReminders = loadRemindersFromStorage()
      
      if (localReminders.length === 0) {
        return // Nothing to migrate
      }

      setIsSyncing(true)
      const batch = writeBatch(db)

      localReminders.forEach((reminder) => {
        const reminderDoc = getReminderDoc(userId, reminder.itemId, reminder.type)
        batch.set(reminderDoc, {
          itemId: reminder.itemId,
          type: reminder.type,
          itemData: reminder.itemData,
          releaseDate: reminder.releaseDate,
          createdAt: reminder.createdAt || new Date().toISOString(),
        })
      })

      await batch.commit()
      
      // Optionally clear localStorage after successful migration
      // localStorage.removeItem(STORAGE_KEYS.REMINDERS)
    } catch (error) {
      console.error('Error migrating reminders to Firestore:', error)
      if (error.code === 'permission-denied') {
        console.error(
          '❌ Cannot migrate reminders: Firestore Security Rules not configured.\n' +
          'See FIRESTORE_SETUP.md for setup instructions.\n' +
          'Reminders will continue to use localStorage until rules are set up.'
        )
      }
    } finally {
      setIsSyncing(false)
    }
  }

  /**
   * Adds a reminder for an upcoming release
   * @param {Movie|TVShow} item - Movie or show object
   * @param {MediaType} type - Item type ('show' or 'movie')
   * @returns {Promise<void>}
   */
  const addReminder = async (item, type) => {
    const releaseDate = type === MEDIA_TYPES.MOVIE 
      ? item.release_date 
      : item.first_air_date

    if (!releaseDate) {
      throw new Error('Release date is required to set a reminder')
    }

    const reminder = {
      itemId: item.id,
      type, // 'show' or 'movie'
      itemData: item,
      releaseDate,
      createdAt: new Date().toISOString(),
    }

    // Check if already has reminder
    const exists = reminders.some(
      (r) => r.itemId === item.id && r.type === type
    )
    if (exists) {
      return // Already has reminder
    }

    if (currentUser) {
      // Save to Firestore
      try {
        const userId = currentUser.uid
        const reminderDoc = getReminderDoc(userId, item.id, type)
        await setDoc(reminderDoc, reminder)
        // onSnapshot listener will update state automatically
        
        // Schedule notification for this reminder
        scheduleReleaseNotification(reminder).catch((error) => {
          console.error('Error scheduling notification:', error)
        })
      } catch (error) {
        console.error('Error adding reminder to Firestore:', error)
        if (error.code === 'permission-denied') {
          console.error(
            '❌ Cannot add reminder: Firestore Security Rules not configured.\n' +
            'See FIRESTORE_SETUP.md for setup instructions.'
          )
        }
        // Fall back to local state update
        setReminders((prev) => [...prev, reminder])
        // Still schedule notification even if Firestore fails
        scheduleReleaseNotification(reminder).catch((error) => {
          console.error('Error scheduling notification:', error)
        })
      }
    } else {
      // Save to localStorage
      const newReminders = [...reminders, reminder]
      setReminders(newReminders)
      saveRemindersToStorage(newReminders)
      
      // Schedule notification for this reminder
      scheduleReleaseNotification(reminder).catch((error) => {
        console.error('Error scheduling notification:', error)
      })
    }
  }

  /**
   * Removes a reminder
   * @param {number} itemId - Item ID
   * @param {MediaType} type - Item type ('show' or 'movie')
   * @returns {Promise<void>}
   */
  const removeReminder = async (itemId, type) => {
    // Find the reminder to cancel its notification
    const reminderToRemove = reminders.find(
      (r) => r.itemId === itemId && r.type === type
    )
    
    if (reminderToRemove) {
      cancelScheduledNotification(reminderToRemove)
    }

    if (currentUser) {
      // Remove from Firestore
      try {
        const userId = currentUser.uid
        const reminderDoc = getReminderDoc(userId, itemId, type)
        await deleteDoc(reminderDoc)
        // onSnapshot listener will update state automatically
      } catch (error) {
        console.error('Error removing reminder from Firestore:', error)
        // Fall back to local state update
        setReminders((prev) =>
          prev.filter((item) => !(item.itemId === itemId && item.type === type))
        )
      }
    } else {
      // Remove from localStorage
      const newReminders = reminders.filter(
        (item) => !(item.itemId === itemId && item.type === type)
      )
      setReminders(newReminders)
      saveRemindersToStorage(newReminders)
    }
  }

  /**
   * Checks if an item has a reminder
   * @param {number} itemId - Item ID
   * @param {MediaType} type - Item type ('show' or 'movie')
   * @returns {boolean} True if item has a reminder
   */
  const hasReminder = (itemId, type) => {
    return reminders.some((item) => item.itemId === itemId && item.type === type)
  }

  /**
   * Toggles a reminder (adds if not present, removes if present)
   * @param {Movie|TVShow} item - Movie or show object
   * @param {MediaType} type - Item type ('show' or 'movie')
   * @returns {Promise<void>}
   */
  const toggleReminder = async (item, type) => {
    if (hasReminder(item.id, type)) {
      await removeReminder(item.id, type)
    } else {
      await addReminder(item, type)
    }
  }

  /**
   * Gets reminders filtered by type
   * @param {MediaType} type - Item type ('show' or 'movie')
   * @returns {Array<Reminder>} Filtered reminders
   */
  const getRemindersByType = (type) => {
    return reminders.filter((item) => item.type === type)
  }

  /**
   * Gets upcoming reminders (release date in the future)
   * @returns {Array<Reminder>} Upcoming reminders
   */
  const getUpcomingReminders = () => {
    const now = new Date()
    return reminders.filter((reminder) => {
      const releaseDate = new Date(reminder.releaseDate)
      return releaseDate >= now
    })
  }

  /**
   * Clears all reminders
   * @returns {Promise<void>}
   */
  const clearReminders = async () => {
    if (currentUser) {
      // Clear from Firestore
      try {
        const userId = currentUser.uid
        const batch = writeBatch(db)
        
        reminders.forEach((reminder) => {
          const reminderDoc = getReminderDoc(userId, reminder.itemId, reminder.type)
          batch.delete(reminderDoc)
        })

        await batch.commit()
        // onSnapshot listener will update state automatically
      } catch (error) {
        console.error('Error clearing reminders from Firestore:', error)
        setReminders([])
      }
    } else {
      // Clear from localStorage
      setReminders([])
      saveRemindersToStorage([])
    }
  }

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        addReminder,
        removeReminder,
        hasReminder,
        toggleReminder,
        getRemindersByType,
        getUpcomingReminders,
        clearReminders,
        remindersCount: reminders.length,
        loading,
        isSyncing,
      }}
    >
      {children}
    </RemindersContext.Provider>
  )
}
