# GitHub Pages Deployment Troubleshooting

## Issue: Deployment Stuck in "deployment_queued" Status

If your GitHub Actions workflow keeps showing "deployment_queued" and never completes, follow these steps:

### Step 1: Verify GitHub Pages Configuration

1. Go to your repository on GitHub: `https://github.com/yassermuhammad/tv-search`
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, make sure it says **"GitHub Actions"**
4. If it says "Deploy from a branch" or anything else:
   - Select **"GitHub Actions"** from the dropdown
   - Click **Save**
   - Wait a few minutes for GitHub to process the change

### Step 2: Check for Stuck Deployments

1. Go to **Settings** → **Pages**
2. Scroll down to **Deployments** section
3. Look for any deployments stuck in "Queued" or "In progress" status
4. If you see stuck deployments:
   - Click on the deployment
   - Try to cancel it if possible
   - Or wait for it to timeout (usually 10-15 minutes)

### Step 3: Clear Deployment Queue

If deployments are stuck:

1. Go to **Settings** → **Environments**
2. Click on **"prod"** environment
3. Check if there are any pending deployments
4. You can try:
   - **Deleting and recreating the environment** (if needed):
     - Delete the "prod" environment
     - The workflow will recreate it on the next run
   - **Or wait** for stuck deployments to timeout

### Step 4: Re-run the Workflow

After fixing the configuration:

1. Go to **Actions** tab
2. Click on the latest workflow run
3. Click **"Re-run all jobs"** (or **"Re-run failed jobs"**)
4. Wait for it to complete

### Step 5: Manual Fix (If Still Stuck)

If the above doesn't work:

1. **Cancel all running workflows:**
   - Go to **Actions** tab
   - Click on any running workflows
   - Click **"Cancel workflow"**

2. **Temporarily disable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Change source to **"None"**
   - Click **Save**
   - Wait 1-2 minutes

3. **Re-enable GitHub Pages:**
   - Go back to **Settings** → **Pages**
   - Change source back to **"GitHub Actions"**
   - Click **Save**

4. **Trigger a new deployment:**
   - Make a small change (e.g., update README)
   - Commit and push to `main` branch
   - Or manually trigger the workflow from **Actions** tab

### Step 6: Verify Environment Variables

Make sure all required environment variables are set:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click on **Variables** tab
3. Verify all these variables exist:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

### Step 7: Check Workflow Logs

1. Go to **Actions** tab
2. Click on the latest workflow run
3. Click on **"build-and-deploy"** job
4. Check the logs for any errors
5. Look specifically at the **"Deploy to GitHub Pages"** step

## Common Causes

1. **GitHub Pages not enabled**: Source must be set to "GitHub Actions"
2. **Stuck deployment**: Previous deployment never completed
3. **Environment issues**: The "prod" environment might be misconfigured
4. **Permissions**: Repository might not have Pages write permissions (should be automatic)
5. **Rate limiting**: Too many deployments in a short time

## Prevention

The workflow has been updated with:
- `cancel-in-progress: true` - Cancels stuck deployments automatically
- `timeout-minutes: 10` - Prevents infinite waiting

## Still Having Issues?

1. Check GitHub Status: https://www.githubstatus.com/
2. Wait 10-15 minutes and try again (sometimes GitHub needs time to process)
3. Contact GitHub Support if the issue persists

## Quick Test

To test if deployment works:

```bash
# Make a small change
echo "<!-- Test -->" >> index.html
git add index.html
git commit -m "Test deployment"
git push origin main
```

Then check the **Actions** tab to see if it deploys successfully.
