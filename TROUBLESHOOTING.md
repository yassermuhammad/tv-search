# GitHub Pages Troubleshooting

## Common Issues and Solutions

### 1. Page Shows 404 or "Not Found"

**Check GitHub Pages Settings:**
1. Go to your repository: https://github.com/yassermuhammad/tv-search
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, make sure it says **"GitHub Actions"**
4. If it says "Deploy from a branch", change it to **"GitHub Actions"**

### 2. Workflow Not Running

**Check GitHub Actions:**
1. Go to the **Actions** tab in your repository
2. Check if there are any workflow runs
3. If there are failed runs, click on them to see the error
4. If no runs exist, the workflow might not have been triggered

**Manually trigger the workflow:**
1. Go to **Actions** tab
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select "main" branch and click "Run workflow"

### 3. Build Fails

Common build errors:
- **Node version**: Should be Node.js 20 (already fixed)
- **Dependencies**: Make sure `yarn.lock` is committed
- **Icons**: The workflow generates icons automatically

### 4. Page Loads But Shows Blank/Errors

**Check browser console:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab to see if files are loading

**Common issues:**
- Base path mismatch (should be `/tv-search/`)
- Missing assets (check if icons and JS files load)

### 5. Verify Deployment Status

1. **Check Actions tab:**
   - Should show green checkmark ✅
   - Click on the latest run to see details

2. **Check Pages settings:**
   - Settings → Pages
   - Should show "Your site is live at https://yassermuhammad.github.io/tv-search/"

3. **Wait a few minutes:**
   - GitHub Pages can take 1-5 minutes to update after deployment

## Quick Fixes

### Re-run the workflow:
```bash
# Make a small change and push
echo "# Test" >> README.md
git add README.md
git commit -m "Trigger deployment"
git push
```

### Check if GitHub Pages is enabled:
- Repository → Settings → Pages
- Source should be "GitHub Actions"
- If not, select it and save

### Verify the URL:
- Correct: `https://yassermuhammad.github.io/tv-search/`
- Note the `/tv-search/` at the end (not just `.github.io`)

## Still Not Working?

1. Check the **Actions** tab for error messages
2. Verify GitHub Pages is enabled in Settings
3. Wait 5-10 minutes after enabling Pages
4. Try accessing the URL in incognito/private mode
5. Check if the repository is public (required for free GitHub Pages)

