// models/userModel.js
import pool from './db.js';
import { hashPassword, comparePassword } from '../utils/passwordService.js';

export const UserModel = {
  // Create a new user
  create: async (name, email, password) => {
    const password_hash = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, password_hash]
    );
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Get all users
  getAll: async () => {
    const result = await pool.query('SELECT id, name, email FROM users');
    return result.rows;
  },

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await comparePassword(plainPassword, hashedPassword);
  }
};

export default UserModel;