// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/api'; // 💡 Import AuthService

// 1. Create the Context
const AuthContext = createContext();

// 2. Custom Hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// 3. Auth Provider Component
export const AuthProvider = ({ children }) => {
    // State to hold user info and token
    const [token, setToken] = useState(localStorage.getItem('token'));
    // 💡 NEW: Initialize user state from localStorage
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Could not parse user from localStorage", e);
            return null;
        }
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [authLoading, setAuthLoading] = useState(false);

    // Effect to keep state in sync with localStorage and manage isAuthenticated
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // 💡 NEW: Persist user object
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            setIsAuthenticated(true);
        } else {
            // Clear storage if token is null
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // 💡 NEW: Clear user on logout
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [token, user]); // Depend on both token and user

    /**
     * Handles user sign-in (after verification).
     */
    const signIn = useCallback(async (userData) => {
        setAuthLoading(true);
        try {
            // Use the centralized AuthService
            const data = await AuthService.login(userData);
            
            // Set token and user state upon successful login
            setToken(data.token);
            setUser(data.user); // 💡 CRITICAL: Ensure server returns data.user
            return { success: true, message: 'Login successful!' };

        } catch (error) {
            console.error('Sign In Error:', error);
            return { success: false, error: 'Network or server error. Please try again.' };
        } finally {
            setAuthLoading(false);
        }
    }, []);

    /**
     * Handles user sign-up. This will now just call the registration endpoint
     * which triggers the OTP, without logging the user in.
     */
    const signUp = useCallback(async (userData) => {
        setAuthLoading(true);
        try {
            // Use the centralized AuthService
            const result = await AuthService.register(userData);
            // The backend should send back user info (like id and email) without a token
            // to proceed to OTP verification.
            return { success: true, user: result.user, message: result.message };
        } catch (error) {
            console.error('Sign Up Error:', error);
            // return { success: false, error: error.message || 'An unknown error occurred during sign-up.' };
            throw error;
        } finally {
            setAuthLoading(false);
        }
    }, []);
    
    /**
     * Handles user sign-out by clearing state and token.
     */
    const signOut = useCallback(() => {
        setToken(null);
        setUser(null);
        // localStorage is cleared by the useEffect
    }, []);

    const value = {
        user,
        userId: user?._id, // 💡 FIX: Use `_id` which matches your backend user object
        token,
        isAuthenticated,
        authLoading,
        signIn,
        signUp,
        signOut,
        setToken, // Expose for OTP flow
        setUser,  // Expose for OTP flow
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
