// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'; // 💡 NEW: Import AuthProvider

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/Blogpost-final/blog-post/frontend/">
      {/* 💡 NEW: Wrap the application with AuthProvider */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);