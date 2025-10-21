// models/blogModel.js
import { BLOGS_PER_PAGE } from '../config/constants.js';
import pool from './db.js';

export const BlogModel = {
  // Get all blogs with pagination
  getAll: async (page = 1, limit = BLOGS_PER_PAGE, userId = null) => {
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const countResult = await pool.query('SELECT COUNT(*) FROM blogs');
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limit);

    const params = [limit, offset, userId || null];

    // Fetch blogs with owner information
    let blogsQuery = `
      SELECT b.*, u.name as author_name, 
      CASE WHEN b.author_id = $3 THEN true ELSE false END as is_owner
      FROM blogs b
      JOIN users u ON b.author_id = u.id
    `;

    blogsQuery += ' ORDER BY b.created_at DESC LIMIT $1 OFFSET $2'; // No user filter here
    const result = await pool.query(blogsQuery, params);
    return {
      blogs: result.rows,
      pagination: {
        totalCount,
        totalPages,
        currentPage: parseInt(page, 10),
        pageSize: limit
      }
    };
  },

  // Get a single blog by ID
  getById: async (id, userId = null) => {
    const query = `
      SELECT b.*, u.name as author_name, 
      CASE WHEN b.author_id = $2 THEN true ELSE false END as is_owner
      FROM blogs b
      JOIN users u ON b.author_id = u.id
      WHERE b.id = $1
    `;

    const result = await pool.query(query, [id, userId || null]);
    return result.rows[0];
  },

  // Create a new blog
  create: async (title, description, content, image_url, userId) => {
    const result = await pool.query(
      'INSERT INTO blogs (title, description, content, image_url, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, content, image_url, userId]
    );
    return result.rows[0];
  },

  // Update a blog
  update: async (id, title, description, content, image_url) => {
    const result = await pool.query(
      'UPDATE blogs SET title = $1, description = $2, content = $3, image_url = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [title, description, content, image_url, id]
    );
    return result.rows[0];
  },

  // Delete a blog
  delete: async (id) => {
    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    return true;
  },

  // Get blogs by user ID
  getByUserId: async (userId, page = 1, limit = BLOGS_PER_PAGE) => {
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const countResult = await pool.query('SELECT COUNT(*) FROM blogs WHERE author_id = $1', [userId]);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch blogs with owner information
    const blogsQuery = `
      SELECT b.*, u.name as author_name, true as is_owner
      FROM blogs b
      JOIN users u ON b.author_id = u.id
      WHERE b.author_id = $1
      ORDER BY b.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(blogsQuery, [userId, limit, offset]);

    return {
      blogs: result.rows,
      pagination: {
        totalCount,
        totalPages,
        currentPage: parseInt(page, 10),
        pageSize: limit
      }
    };
  }
};

export default BlogModel;