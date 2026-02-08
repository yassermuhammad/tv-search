/**
 * Notification Service
 * Handles browser notifications for release reminders
 * Uses the browser Notification API and Service Worker for background notifications
 */

/**
 * Request notification permission from the user
 * @returns {Promise<boolean>} True if permission granted, false otherwise
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    console.warn('Notification permission was denied')
    return false
  }

  // Request permission
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

/**
 * Check if notification permission is granted
 * @returns {boolean} True if permission is granted
 */
export const hasNotificationPermission = () => {
  if (!('Notification' in window)) {
    return false
  }
  return Notification.permission === 'granted'
}

/**
 * Schedule a notification for a release date
 * @param {Object} reminder - Reminder object with itemData, releaseDate, etc.
 * @returns {Promise<void>}
 */
export const scheduleReleaseNotification = async (reminder) => {
  if (!hasNotificationPermission()) {
    console.warn('Notification permission not granted')
    return
  }

  const releaseDate = new Date(reminder.releaseDate)
  const now = new Date()
  
  // Don't schedule notifications for past dates
  if (releaseDate <= now) {
    return
  }

  const title = reminder.type === 'movie' 
    ? reminder.itemData.title 
    : reminder.itemData.name

  const notificationData = {
    title: `${title} is releasing soon!`,
    body: `${title} releases on ${formatReleaseDate(releaseDate)}`,
    icon: reminder.type === 'movie'
      ? reminder.itemData.poster_path 
        ? `https://image.tmdb.org/t/p/w500${reminder.itemData.poster_path}`
        : '/icon-192x192.png'
      : reminder.itemData.poster_path
        ? `https://image.tmdb.org/t/p/w500${reminder.itemData.poster_path}`
        : '/icon-192x192.png',
    badge: '/icon-96x96.png',
    tag: `reminder-${reminder.itemId}-${reminder.type}`,
    data: {
      itemId: reminder.itemId,
      type: reminder.type,
      releaseDate: reminder.releaseDate,
    },
    requireInteraction: false,
    silent: false,
  }

  // Calculate time until release (schedule for 1 day before release)
  const oneDayBefore = new Date(releaseDate)
  oneDayBefore.setDate(oneDayBefore.getDate() - 1)
  oneDayBefore.setHours(9, 0, 0, 0) // 9 AM on the day before

  // If release is less than 1 day away, schedule for 1 hour before
  const oneHourBefore = new Date(releaseDate)
  oneHourBefore.setHours(oneHourBefore.getHours() - 1)

  const scheduleTime = oneDayBefore > now ? oneDayBefore : oneHourBefore
  const delay = scheduleTime.getTime() - now.getTime()

  // If delay is negative or too small, schedule immediately (for testing)
  if (delay < 0 || delay < 60000) {
    // For releases very soon, show notification immediately
    showNotification(notificationData)
    return
  }

  // Schedule notification
  setTimeout(() => {
    showNotification(notificationData)
  }, delay)

  // Also schedule a notification for the release day itself
  const releaseDay = new Date(releaseDate)
  releaseDay.setHours(9, 0, 0, 0) // 9 AM on release day
  
  if (releaseDay > now) {
    const releaseDelay = releaseDay.getTime() - now.getTime()
    setTimeout(() => {
      showNotification({
        ...notificationData,
        title: `${title} releases today!`,
        body: `Don't miss ${title} - it's releasing today!`,
      })
    }, releaseDelay)
  }
}

/**
 * Show a notification immediately
 * @param {Object} options - Notification options
 */
export const showNotification = async (options) => {
  if (!hasNotificationPermission()) {
    return
  }

  // Try to use service worker for better background support
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/icon-96x96.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        vibrate: [200, 100, 200], // Vibration pattern for mobile
      })
      return
    } catch (error) {
      console.error('Error showing notification via service worker:', error)
      // Fall through to regular Notification API
    }
  }

  // Fallback to regular Notification API (real device notification)
  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/icon-192x192.png',
      badge: options.badge || '/icon-96x96.png',
      tag: options.tag,
      data: options.data,
      requireInteraction: options.requireInteraction || false,
      silent: options.silent || false,
      vibrate: [200, 100, 200], // Vibration pattern for mobile devices
    })

    // Handle notification click - opens the app when clicked
    notification.onclick = (event) => {
      event.preventDefault()
      window.focus()
      // Navigate to the item detail page if data is provided
      if (options.data && options.data.itemId && options.data.type && !options.data.test) {
        const { itemId, type } = options.data
        const path = type === 'movie' ? `/share/movie/${itemId}` : `/share/show/${itemId}`
        window.location.href = path
      }
      notification.close()
    }
  } catch (error) {
    console.error('Error showing device notification:', error)
    throw error // Re-throw so caller knows it failed
  }
}

/**
 * Cancel scheduled notifications for a reminder
 * @param {Object} reminder - Reminder object
 */
export const cancelScheduledNotification = (reminder) => {
  // Note: setTimeout IDs aren't easily trackable, so we'll rely on tag-based cancellation
  // In a production app, you'd want to store timeout IDs
  
  if ('serviceWorker' in navigator && 'getNotifications' in ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      const tag = `reminder-${reminder.itemId}-${reminder.type}`
      registration.getNotifications({ tag }).then((notifications) => {
        notifications.forEach((notification) => notification.close())
      })
    })
  }
}

/**
 * Format release date for notification
 * @param {Date} date - Release date
 * @returns {string} Formatted date string
 */
const formatReleaseDate = (date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Schedule notifications for all reminders
 * @param {Array} reminders - Array of reminder objects
 */
export const scheduleAllReminders = async (reminders) => {
  if (!hasNotificationPermission()) {
    return
  }

  reminders.forEach((reminder) => {
    scheduleReleaseNotification(reminder)
  })
}

/**
 * Test notification - shows a device notification after a delay (for testing purposes)
 * This will show a real browser/system notification, not just a toast
 * @param {number} delaySeconds - Delay in seconds before showing notification (default: 10)
 * @returns {Promise<void>}
 */
export const testNotification = async (delaySeconds = 10) => {
  if (!hasNotificationPermission()) {
    throw new Error('Notification permission not granted. Please enable notifications first.')
  }

  const delay = delaySeconds * 1000 // Convert to milliseconds

  return new Promise((resolve, reject) => {
    // Show immediate feedback that notification is scheduled
    console.log(`Test notification scheduled for ${delaySeconds} seconds from now`)
    
    setTimeout(async () => {
      try {
        // Show real device notification (not toast)
        await showNotification({
          title: '🎬 WatchPedia Test Notification',
          body: 'This is a test notification! Your reminder notifications will work exactly like this.',
          icon: '/icon-192x192.png',
          badge: '/icon-96x96.png',
          tag: 'test-notification',
          data: {
            itemId: 0,
            type: 'test',
            test: true,
          },
          requireInteraction: false,
          silent: false,
        })
        console.log('Test notification sent successfully')
        resolve()
      } catch (error) {
        console.error('Error showing test notification:', error)
        reject(error)
      }
    }, delay)
  })
}
