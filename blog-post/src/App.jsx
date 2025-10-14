// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import BlogPage from "./pages/BlogPage";
import SingleBlogPage from "./pages/SingleBlogPage";
import SignIn from "./pages/auth/SignIn";  // Assuming you moved these to a pages/auth directory
import SignUp from "./pages/auth/SignUp";  // Assuming you moved these to a pages/auth directory


const App = () => (
    <Routes>
        <Route path="/" element={<BlogPage />} />
        <Route path="/blog/:id" element={<SingleBlogPage />} />
        
        {/* 💡 NEW: Routes for Authentication Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
                <h1 className="text-3xl font-bold text-gray-700">404 - Page Not Found</h1>
            </div>
        } />
    </Routes>
);

export default App;