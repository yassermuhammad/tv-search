# Deployment Guide - GitHub Pages

This app is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

## 🚀 Quick Deploy

1. **Add and commit all files:**
   ```bash
   git add .
   git commit -m "Initial commit: TV Shows & Movies Search app"
   ```

2. **Add the remote repository:**
   ```bash
   git remote add origin https://github.com/yassermuhammad/tv-search.git
   ```

3. **Push to GitHub:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy your app

## 📍 Your App URL

After deployment, your app will be available at:
```
https://yassermuhammad.github.io/tv-search/
```

## 🔄 Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- ✅ Build your app automatically on every push to `main`
- ✅ Generate PWA icons
- ✅ Deploy to GitHub Pages
- ✅ Update the app when you push changes

## 🛠️ Manual Deployment

If you want to deploy manually:

```bash
yarn build
# Then push the dist folder to gh-pages branch
```

But the GitHub Actions workflow handles this automatically!

## 📝 Notes

- The app is configured with base path `/tv-search/` for GitHub Pages
- PWA features will work on the deployed site
- Service worker will be active in production
- All icons are included in the build

## 🔍 Verify Deployment

After pushing, check:
1. **GitHub Actions tab** - See the deployment progress
2. **Repository Settings → Pages** - Verify deployment status
3. **Visit the URL** - Test the live app

