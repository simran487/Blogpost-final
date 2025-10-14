// src/components/Layout/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, X } from 'lucide-react'; // Import icons
import { useAuth } from "../../context/AuthContext";

const Header = ({ totalArticles }) => {
    const { isAuthenticated, user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for profile dropdown

    const handleSignOut = () => {
        signOut();
        navigate('/'); 
        setIsMenuOpen(false);
        console.log('User signed out.');
    }

    // Toggle menu state
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <header className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-start">
                <div>
                    <Link to="/" className="text-4xl font-extrabold text-gray-900 mb-2 hover:text-indigo-600 transition">
                        Tech Blog Platform
                    </Link>
                    <p className="text-lg text-gray-600">
                        Viewing {totalArticles} articles.
                    </p>
                </div>

                <div className="relative flex flex-col items-end space-y-2">
                    {isAuthenticated ? (
                        <>
                            {/* Profile Button */}
                            <button
                                onClick={toggleMenu}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full shadow-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
                            </button>
                            
                            {/* Profile Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-xl z-30 border border-gray-100">
                                    <div className="p-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:rounded-b-lg transition"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex space-x-3">
                            <Link 
                                to="/signin" 
                                className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition duration-200"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup" 
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
