// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/constants';

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

    // Base URL for authentication
    const AUTH_URL = `${API_BASE_URL}`; // Corrected: Assuming API_BASE_URL is 'http://localhost:5000/api'

    /**
     * Handles user sign-in.
     */
    const signIn = useCallback(async (credentials) => {
        setAuthLoading(true);
        try {
            const response = await fetch(`${AUTH_URL}/signIn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            console.log('Sign In Response Data:', data); // Debugging line
            if (!response.ok) {
                // The server should return an error message
                return { success: false, error: data.error || 'Login failed. Check your credentials.' };
            }
            
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
    }, [AUTH_URL]);

    /**
     * Handles user sign-up.
     */
    const signUp = useCallback(async (Name,email,password) => {
        setAuthLoading(true);
        try {
            const response = await fetch(`${AUTH_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Name,email,password),
            });
          
            const data = await response.json();
           console.log('Sign Up Response Data:', data); // Debugging line
            if (!response.ok) {
                return { success: false, error: data.error || 'Registration failed.' };
            }
            
            // Set token and user state upon successful registration
            setToken(data.token);
            setUser(data.user); // 💡 CRITICAL: Ensure server returns data.user
            return { success: true, message: 'Registration successful!' };

        } catch (error) {
            console.error('Sign Up Error:', error);
            return { success: false, error: 'Network or server error. Please try again.' };
        } finally {
            setAuthLoading(false);
        }
    }, [AUTH_URL]);

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
        userId: user ?.id, // 💡 NEW: Provide userId directly
        token,
        isAuthenticated,
        authLoading,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

