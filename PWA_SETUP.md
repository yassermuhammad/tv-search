# PWA Setup Guide

This app is now a Progressive Web App (PWA) that can be installed on your phone or desktop!

## ✅ What's Included

1. **Web App Manifest** - Defines app metadata, icons, and display settings
2. **Service Worker** - Enables offline functionality and caching
3. **App Icons** - Generated in multiple sizes (192x192, 512x512)
4. **Offline Support** - Caches API responses and images for offline use

## 📱 How to Install

### On Mobile (iOS/Android):

1. **Open the app** in your mobile browser (Chrome, Safari, etc.)
2. **Look for the install prompt** - Most browsers will show a banner
3. **Or manually install:**
   - **Chrome/Edge**: Tap the menu (⋮) → "Add to Home Screen" or "Install app"
   - **Safari (iOS)**: Tap the Share button → "Add to Home Screen"
   - **Firefox**: Tap menu → "Install"

### On Desktop:

1. **Look for the install icon** in your browser's address bar (usually appears after visiting the site)
2. **Click the install icon** to install the app
3. The app will open in its own window, separate from your browser

## 🎨 Icons

Icons are automatically generated from `public/icon.svg` when you run:
```bash
yarn generate-icons
```

Or they're generated automatically during `yarn build`.

## 🔧 Configuration

PWA settings are configured in `vite.config.js`:
- **Theme Color**: Blue (#3182ce)
- **Display Mode**: Standalone (app-like experience)
- **Icons**: 192x192 and 512x512 PNG files

## 📦 Caching Strategy

The service worker caches:
- **API Responses**: TVMaze and TMDB API calls (24 hours)
- **Images**: Show/movie posters (30 days)
- **App Files**: JavaScript, CSS, HTML (auto-updated)

## 🚀 Testing PWA Features

1. **Build for production:**
   ```bash
   yarn build
   ```

2. **Preview the production build:**
   ```bash
   yarn preview
   ```

3. **Test installation:**
   - Open the preview URL
   - Check browser DevTools → Application → Manifest
   - Verify service worker is registered

## 📝 Notes

- PWA features work best in **production builds** (not dev mode)
- Service worker registration happens automatically
- The app will auto-update when new versions are deployed
- Offline mode works for previously visited pages and cached data

