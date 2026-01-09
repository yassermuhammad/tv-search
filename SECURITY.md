# Security Guide

## Firebase API Keys - Important Security Information

### Are Firebase API Keys Secret?

**No, Firebase API keys are NOT secret keys.** They are safe to expose in client-side code and public repositories.

### Why Are They Safe?

1. **Public by Design**: Firebase API keys are meant to be included in client-side applications (web, mobile, etc.)
2. **Security Rules**: Real security comes from Firebase Security Rules configured in the Firebase Console
3. **Identification Only**: These keys identify your Firebase project, they don't grant access to your data
4. **Domain Restrictions**: You can restrict API key usage to specific domains in Firebase Console

### What Actually Protects Your Data?

- **Firebase Security Rules**: Configure these in Firebase Console for Firestore, Storage, etc.
- **Authentication**: User authentication (Google Sign-In, etc.) is handled securely by Firebase
- **Domain Restrictions**: Restrict API key usage to your domain in Firebase Console

### Best Practices

1. **Use Environment Variables**: Store config in `.env` files (already gitignored)
2. **Never Commit `.env`**: The `.env` file is in `.gitignore` - never commit it
3. **Use GitHub Secrets**: For CI/CD, use GitHub Secrets (configured in workflow)
4. **Configure Security Rules**: Always set up proper Security Rules in Firebase Console
5. **Restrict API Keys**: Add domain restrictions in Firebase Console if needed

### Setting Up Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values
3. The `.env` file is gitignored and won't be committed

### For GitHub Pages Deployment

Environment variables are set as GitHub Secrets and injected during the build process via GitHub Actions workflow.

### Firebase Security Rules Example

```javascript
// Firestore Security Rules Example
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firebase API Key Restrictions](https://console.cloud.google.com/apis/credentials)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

