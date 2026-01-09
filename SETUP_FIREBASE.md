# Firebase Setup Guide

## Step 1: Create Environment File

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important**: The `.env` file is already in `.gitignore` and will NOT be committed to the repository.

## Step 2: Get Firebase Configuration Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. Click on your web app (or create one if you haven't)
6. Copy the configuration values from the `firebaseConfig` object

## Step 3: Configure GitHub Secrets (for GitHub Pages)

For automatic deployment to GitHub Pages, you need to add secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of these secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

## Step 4: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy when you push to `main`

## Step 5: Configure Firebase Security Rules

**CRITICAL**: Set up proper Security Rules in Firebase Console:

1. Go to Firebase Console → **Firestore Database** (or **Storage**)
2. Click on **Rules** tab
3. Configure rules based on your needs. Example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: (Optional) Restrict API Key Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your Firebase API key
4. Click **Edit** and add **Application restrictions**:
   - **HTTP referrers (web sites)**
   - Add your domain: `https://yourusername.github.io/*`
   - Add your custom domain if you have one

## Local Development

For local development, just create the `.env` file and run:

```bash
yarn dev
```

The app will use the environment variables from `.env`.

## Production Deployment

When you push to `main`, GitHub Actions will:
1. Use the secrets you configured
2. Build the app with environment variables
3. Deploy to GitHub Pages automatically

## Troubleshooting

### "Missing Firebase configuration" error
- Make sure `.env` file exists in the root directory
- Check that all required variables are set
- Restart your dev server after creating/updating `.env`

### Build fails on GitHub Actions
- Verify all secrets are set in GitHub repository settings
- Check that secret names match exactly (case-sensitive)
- Review the Actions logs for specific error messages

### Firebase not working in production
- Verify GitHub Secrets are set correctly
- Check that the build process is using the secrets
- Review Firebase Console for any errors

## Security Notes

- Firebase API keys are **safe to expose** in client-side code
- Real security comes from **Firebase Security Rules**
- Never commit `.env` file (already in `.gitignore`)
- Use GitHub Secrets for CI/CD deployments
- Configure proper Security Rules in Firebase Console

See `SECURITY.md` for more detailed security information.

