import React, { createContext, useContext, useState, useEffect } from "react";
import {
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Login with Google using redirect method
     * This is more reliable than popup for production deployments
     * and avoids Cross-Origin-Opener-Policy issues
     */
    function loginWithGoogle() {
        return signInWithRedirect(auth, googleProvider);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        // Check for redirect result when component mounts
        // This handles the callback after Google authentication redirect
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    // User successfully signed in via redirect
                    setCurrentUser(result.user);
                }
            })
            .catch((error) => {
                console.error('Error getting redirect result:', error);
            })
            .finally(() => {
                setLoading(false);
            });

        // Listen for auth state changes
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
