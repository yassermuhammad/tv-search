# Firestore Setup Guide

This guide explains how to set up Firebase Firestore for the watchlist feature.

## Overview

The watchlist feature now uses Firebase Firestore to store user watchlists, enabling:
- **Cross-device synchronization**: Watchlist syncs across all devices when user is logged in
- **Real-time updates**: Changes are reflected instantly across all devices
- **Cloud backup**: Watchlist data is stored securely in the cloud
- **Offline support**: Falls back to localStorage when user is not logged in

## Firestore Structure

The watchlist data is stored in the following structure:

```
users/
  {userId}/
    watchlist/
      {itemId}_{type}/
        id: number
        type: "show" | "movie"
        data: { ... }  // Full item data
        addedAt: string (ISO timestamp)
```

Example:
```
users/
  abc123/
    watchlist/
      123_movie/
        id: 123
        type: "movie"
        data: { title: "Inception", ... }
        addedAt: "2024-01-15T10:30:00.000Z"
      456_show/
        id: 456
        type: "show"
        data: { name: "Breaking Bad", ... }
        addedAt: "2024-01-14T15:20:00.000Z"
```

## Step-by-Step Setup Instructions

### Step 1: Enable Firestore Database

**IMPORTANT**: You must enable Firestore before the watchlist feature will work.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (e.g., `watchpedia-a811f`)
3. In the left sidebar, click on **"Firestore Database"** (or **"Build"** → **"Firestore Database"**)
4. If you see a **"Create database"** button, click it
5. Choose your preferred location (select the closest region to your users)
6. Choose **"Start in test mode"** (we'll update the rules in the next step)
7. Click **"Enable"** and wait for Firestore to be created

### Step 2: Set Up Firestore Security Rules

**CRITICAL**: Without proper security rules, you'll get "Missing or insufficient permissions" errors.

1. In Firebase Console, make sure you're still in **Firestore Database**
2. Click on the **"Rules"** tab at the top
3. You'll see default rules that look like this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 1, 1);
    }
  }
}
```

4. **Replace** the entire rules section with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own watchlist
    match /users/{userId}/watchlist/{itemId} {
      // Allow read/write only if the user is authenticated and owns the data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **"Publish"** button to save the rules
6. You should see a success message: "Rules published successfully"

### Step 3: Verify Setup

After setting up the rules:
1. Refresh your app
2. Log in with Google
3. Try adding an item to your watchlist
4. Check the browser console - you should NOT see permission errors
5. Check Firebase Console → Firestore Database → Data tab - you should see your watchlist items under `users/{yourUserId}/watchlist/`

## Common Issues

### Error: "Missing or insufficient permissions"

**Cause**: Firestore Security Rules are not set up correctly or Firestore is not enabled.

**Solution**:
1. Make sure Firestore Database is enabled (Step 1 above)
2. Make sure Security Rules are published (Step 2 above)
3. Verify the rules match exactly what's shown above
4. Make sure you're logged in (`currentUser` should not be null)
5. Refresh the page after updating rules

## Features

### Automatic Migration

When a user logs in for the first time, their existing localStorage watchlist is automatically migrated to Firestore. This happens automatically and transparently.

### Real-time Sync

The watchlist uses Firestore's `onSnapshot` listener to provide real-time updates. When a user adds or removes an item on one device, it automatically appears/disappears on all other devices where they're logged in.

### Offline Support

- **When logged in**: Watchlist is stored in Firestore and syncs across devices
- **When logged out**: Watchlist falls back to localStorage (local only, no sync)

### Error Handling

If Firestore operations fail (e.g., network issues), the app gracefully falls back to local state updates to ensure the UI remains responsive.

## Testing

1. **Test cross-device sync**:
   - Log in on Device A
   - Add items to watchlist
   - Log in on Device B with the same account
   - Verify items appear automatically

2. **Test migration**:
   - Add items to watchlist while logged out (saves to localStorage)
   - Log in
   - Verify items are migrated to Firestore
   - Log out and log back in
   - Verify items persist

3. **Test offline behavior**:
   - Log in and add items
   - Go offline
   - Add/remove items
   - Go online
   - Verify changes sync to Firestore

## Troubleshooting

### Watchlist not syncing

- Check Firestore Security Rules are published correctly
- Verify user is authenticated (`currentUser` is not null)
- Check browser console for Firestore errors
- Verify Firebase project configuration is correct

### Migration not working

- Check browser console for errors
- Verify localStorage has watchlist data before logging in
- Check Firestore Security Rules allow write access

### Performance issues

- Firestore queries are optimized with indexes
- Large watchlists (>1000 items) may need pagination (not currently implemented)
- Consider implementing pagination if watchlist grows very large
