// models/userModel.js
import pool from './db.js';
import { hashPassword, comparePassword } from '../utils/passwordService.js';


export const UserModel = {
  // Create a new user
  create: async (name, email, password) => {
    const password_hash = await hashPassword(password);
     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash,otp, otp_expires_at, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, created_at',
      [name, email, password_hash, otp, otp_expires_at, false]
    );
    return { ...result.rows[0], otp };
  },

  // Find user by email
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT id, name, email, password_hash, is_verified, otp, otp_expires_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const result = await pool.query(
      'SELECT id, name, email, is_verified FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Get all users
  getAll: async () => {
    const result = await pool.query('SELECT id, name, email, is_verified FROM users');
    return result.rows;
  },

  
  // Verify OTP
  verifyOtp: async (userId, otp) => {
    const result = await pool.query(
      'UPDATE users SET is_verified = true, otp = NULL, otp_expires_at = NULL WHERE id = $1 AND otp = $2 AND otp_expires_at > NOW() RETURNING id, name, email, is_verified',
      [userId, otp]
    );
    return result.rows[0];
  },

  
  // Update OTP
  updateOtp: async (userId) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    const result = await pool.query(
      'UPDATE users SET otp = $1, otp_expires_at = $2 WHERE id = $3 RETURNING otp',
      [otp, otp_expires_at, userId]
    );
    return result.rows[0].otp;
  },


  // Find user by verification token
  // findByVerificationToken: async (token) => {
  //   const result = await pool.query(
  //     'SELECT id FROM users WHERE verification_token = $1',
  //     [token]
  //   );
  //   return result.rows[0];
  // },

  // // Verify user's email
  // verifyUser: async (userId) => {
  //   const result = await pool.query(
  //     'UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1 RETURNING id, name, email, is_verified',
  //     [userId]
  //   );
  //   return result.rows[0];
  //},

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await comparePassword(plainPassword, hashedPassword);
  }
};

export default UserModel;