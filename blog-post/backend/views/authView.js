// views/authView.js
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

// JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

export const AuthView = {
  // Generate JWT token
  generateAuthToken: (user) => {
    return jwt.sign(
      { user_id: user.id, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  },

  // Register a new user
  register: async (userData) => {
    const { name, email, password } = userData;
    
    // Validate input
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required');
    }
    
    try {
      // Create user in database
      const newUser = await UserModel.create(name, email, password);
      
      // Generate token
      const token = AuthView.generateAuthToken(newUser);
      
      // Return user data and token
      return {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      };
    } catch (err) {
      // Handle duplicate email
      if (err.code === '23505') {
        throw new Error('This email is already registered');
      }
      throw err;
    }
  },

  // Login user
  login: async (credentials) => {
    const { email, password } = credentials;
    
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isMatch = await UserModel.verifyPassword(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = AuthView.generateAuthToken(user);
    
    // Return user data and token
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
};

export default AuthView;