import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

/**
 * Firebase Configuration
 * 
 * IMPORTANT SECURITY NOTES:
 * - Firebase API keys are NOT secret keys - they're safe to expose in client-side code
 * - Real security comes from Firebase Security Rules (Firestore, Storage, etc.)
 * - These keys are used to identify your Firebase project, not authenticate users
 * - Always configure proper Security Rules in Firebase Console
 * 
 * Get these values from Firebase Console:
 * Project Settings -> General -> Your apps -> Web app config
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate that all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  console.error(
    `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
    'Please create a .env file based on .env.example'
  );
  throw new Error(`Missing Firebase configuration: ${missingVars.join(', ')}`);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only if measurementId is provided
export const analytics = firebaseConfig.measurementId
  ? getAnalytics(app)
  : null;