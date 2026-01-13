# Domain Name Change: StreamSpot → WatchPedia

## Summary

The application has been rebranded from **StreamSpot** to **WatchPedia**. The domain will be **watchpedia.com**.

## Changes Made

All references to "StreamSpot" have been updated to "WatchPedia" in the following files:

### Core Application Files
- ✅ `src/components/shared/Header.jsx` - App name display
- ✅ `vite.config.js` - PWA manifest name and short_name
- ✅ `index.html` - Page title and Apple web app title
- ✅ `src/utils/constants.js` - LocalStorage key for watchlist

### Translation Files (All Languages)
- ✅ `src/i18n/locales/en.json` - English
- ✅ `src/i18n/locales/ar.json` - Arabic
- ✅ `src/i18n/locales/de.json` - German
- ✅ `src/i18n/locales/es.json` - Spanish
- ✅ `src/i18n/locales/fr.json` - French
- ✅ `src/i18n/locales/it.json` - Italian
- ✅ `src/i18n/locales/ja.json` - Japanese
- ✅ `src/i18n/locales/pt.json` - Portuguese
- ✅ `src/i18n/locales/ru.json` - Russian
- ✅ `src/i18n/locales/zh.json` - Chinese

### Documentation
- ✅ `FIRESTORE_SETUP.md` - Fixed typo "stramspot" → "watchpedia"

## New Domain Information

**New App Name:** WatchPedia  
**Display Name:** WATCHPEDIA (in header)  
**Full Name:** WatchPedia - TV Shows & Movies Search  
**Domain:** watchpedia.com

## Important Notes

### LocalStorage Migration
The watchlist localStorage key has changed from `streamspot-watchlist` to `watchpedia-watchlist`. 

**Action Required:** Existing users will need to re-add items to their watchlist, OR you can add migration code to copy data from the old key to the new key.

### Firebase Project
If you're using a Firebase project named with "streamspot" or "stramspot", you may want to:
1. Create a new Firebase project with "watchpedia" in the name
2. Update Firebase configuration in `.env` and GitHub Variables
3. Migrate Firestore data if needed

### Domain Registration
To use the custom domain:
1. Register `watchpedia.com`
2. Update DNS settings to point to GitHub Pages
3. Configure GitHub Pages custom domain in repository settings
4. Update Firebase Authorized Domains to include `watchpedia.com`

## Next Steps

1. ✅ Code changes complete
2. ⏳ Test the application locally
3. ⏳ Update Firebase project name (if desired)
4. ⏳ Register new domain name
5. ⏳ Configure DNS settings
6. ⏳ Update Firebase Authorized Domains
7. ⏳ Deploy and verify

## Testing Checklist

- [ ] App name displays correctly in header
- [ ] PWA installation shows correct name
- [ ] Page title is correct
- [ ] Watchlist functionality works (may need migration)
- [ ] All translations display correct app name
- [ ] Firebase authentication still works
- [ ] Watchlist syncs correctly (if using Firestore)
