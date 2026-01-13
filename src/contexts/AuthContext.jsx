import React, { createContext, useContext, useState, useEffect } from "react";
import {
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

const AuthContext = createContext();

function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Login with Google using popup method
     * The auth state will be updated automatically via onAuthStateChanged listener
     */
    function loginWithGoogle() {
        return signInWithPopup(auth, googleProvider)
            .then((result) => {
                // User successfully signed in
                // The onAuthStateChanged listener will handle updating currentUser
                const credential = GoogleAuthProvider.credentialFromResult(result);
                // Optional: You can access the Google Access Token here if needed
                // const token = credential.accessToken;
                return result;
            })
            .catch((error) => {
                // Handle errors and re-throw so callers can handle them
                const errorCode = error.code;
                const errorMessage = error.message;
                
                // Log error for debugging
                console.error('Google sign-in error:', {
                    code: errorCode,
                    message: errorMessage
                });
                
                // Re-throw the error so the caller can handle it
                throw error;
            });
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        // Set up auth state listener
        // This will fire immediately with current user and whenever auth state changes
        // For popup-based auth, this listener handles all auth state updates automatically
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, useAuth };
