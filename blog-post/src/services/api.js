// services/api.js - Centralized API service layer
const API_BASE_URL = 'http://localhost:3001/api';

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
  // Register a new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/signUp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/signIn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  }
};

// Blog API services
export const BlogService = {
  // Get all blogs with pagination
  getAllBlogs: async (page = 1, limit = 6) => {
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
  getUserBlogs: async (userId, page = 1, limit = 6) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/blogs/user/${userId}?page=${page}&limit=${limit}`, {
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