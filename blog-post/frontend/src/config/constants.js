// src/config/constants.js
export const BLOGS_PER_PAGE = 6; 

// The root URL of the backend server, used for constructing file paths.
export const SERVER_BASE_URL = 'http://localhost:5000';

// The base URL for all API calls, derived from the server's root URL.
export const API_BASE_URL = `${SERVER_BASE_URL}/api`;

// // 💡 NEW: Explicit Auth URL
// export const AUTH_API_URL = `${API_BASE_URL}/auth`;

// // 💡 NEW: Explicit Blog URL
// export const BLOGS_API_URL = `${API_BASE_URL}/blogs`;
