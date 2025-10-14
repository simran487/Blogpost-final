// views/blogView.js
import BlogModel from '../models/blogModel.js';
import fs from 'fs';
import path from 'path';

export const BlogView = {
  // Get all blogs with pagination
  getAllBlogs: async (page, limit, userId) => {
    return await BlogModel.getAll(page, limit, userId);
  },
  
  // Get a single blog by ID
  getBlogById: async (id, userId) => {
    const blog = await BlogModel.getById(id, userId);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  },
  
  // Create a new blog
  createBlog: async (blogData, userId) => {
    const { title, description, content, image_url } = blogData;
    
    // Validate input
    if (!title || !description || !content) {
      throw new Error('Title, description, and content are required');
    }
    
    // Create blog in database
    return await BlogModel.create(title, description, content, image_url, userId);
  },
  
  // Update a blog
  updateBlog: async (id, blogData, userId) => {
    const { title, description, content, image_url } = blogData;
    
    // Validate input
    if (!title || !description || !content) {
      throw new Error('Title, description, and content are required');
    }
    
    // Check if blog exists and belongs to user
    const blog = await BlogModel.getById(id, userId);
    if (!blog) {
      throw new Error('Blog not found');
    }
    
    if (!blog.is_owner) {
      throw new Error('Unauthorized to update this blog');
    }
    
    // Update blog in database
    return await BlogModel.update(id, title, description, content, image_url);
  },
  
  // Delete a blog
  deleteBlog: async (id, userId) => {
    // Check if blog exists and belongs to user
    const blog = await BlogModel.getById(id, userId);
    if (!blog) {
      throw new Error('Blog not found');
    }
    
    if (!blog.is_owner) {
      throw new Error('Unauthorized to delete this blog');
    }
    
    // Delete image file if it exists
    if (blog.image_url) {
      const imagePath = path.join(process.cwd(), blog.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete blog from database
    return await BlogModel.delete(id);
  },
  
  // Get blogs by user ID
  getUserBlogs: async (userId, page, limit) => {
    return await BlogModel.getByUserId(userId, page, limit);
  }
};

export default BlogView;