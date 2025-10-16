import { BLOGS_PER_PAGE } from "../config/constants";

// services/api.js - Centralized API service layer
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for handling API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'API request failed');
  }
  return response.json();
};

// Authentication API services
export const AuthService = {
  // Register a new user (sends OTP)
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/signUp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Verify user's OTP
  verifyOtp: async (userId, otp) => {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp })
    });
    return handleResponse(response);
  },

  // Resend OTP
  resendOtp: async (email) => {
    const response = await fetch(`${API_BASE_URL}/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  // Login user
  login: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/signIn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  }
};

// Blog API services
export const BlogService = {
  // Get all blogs with pagination
  getAllBlogs: async (page = 1, limit = BLOGS_PER_PAGE) => {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await fetch(`${API_BASE_URL}/blogs?page=${page}&limit=${limit}`, {
      headers
    });
    return handleResponse(response);
  },

  // Get a single blog by ID
  getBlogById: async (id) => {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      headers
    });
    return handleResponse(response);
  },

  // Create a new blog
  createBlog: async (blogData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('description', blogData.description);
    formData.append('content', blogData.content);
    if (blogData.image) formData.append('image', blogData.image);
    
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return handleResponse(response);
  },

  // Update a blog
  updateBlog: async (id, blogData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('description', blogData.description);
    formData.append('content', blogData.content);
    if (blogData.image) formData.append('image', blogData.image);
    if (blogData.image_url) formData.append('image_url', blogData.image_url);
    if (blogData.removeImage) formData.append('removeImage', blogData.removeImage);
    
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return handleResponse(response);
  },

  // Delete a blog
  deleteBlog: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  // Get user blogs
  getUserBlogs: async (userId, page = 1, limit = BLOGS_PER_PAGE) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    // The userId parameter is not used in the URL.
    // The backend's /my-posts route securely identifies the user from the token.
    // This is the correct and secure endpoint for fetching the logged-in user's posts.
    const response = await fetch(`${API_BASE_URL}/blogs/my-posts?page=${page}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  }
};

// User API services
export const UserService = {
  // Get all users
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse(response);
  }
};

export default {
  auth: AuthService,
  blogs: BlogService,
  users: UserService
};