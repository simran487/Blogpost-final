// views/authView.js
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import { sendOtpEmail } from '../utils/emailService.js';


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
      
      // Send OTP email
      const verifiedUser =await UserModel.verifyOtp(newUser.email, newUser.otp);

      // Generate auth token for the new user
      const authToken = AuthView.generateAuthToken(verifiedUser);
      
    // Return success message
      return {
        success: true,
        token: authToken,
        message: 'Registration successful! Please check your email for the OTP to verify your account.',
        user: {
          id: verifiedUser.id,
          name: verifiedUser.name,
          email: verifiedUser.email
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


   // Verify user's OTP
  verifyOtp: async (userId, otp) => {
    const verifiedUser = await UserModel.verifyOtp(userId, otp);
    if (!verifiedUser) {
      throw new Error('Invalid or expired OTP.');
    }

    const authToken = AuthView.generateAuthToken(verifiedUser);

    return {
      token: authToken,
      user: {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
      },
      message: 'Email verified successfully! You are now logged in.',
    };
  },

  // Resend OTP
  resendOtp: async (email) => {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.is_verified) {
      throw new Error('This email is already verified.');
    }

    const newOtp = await UserModel.updateOtp(user.id);
    await sendOtpEmail(user.email, newOtp);

    return {
      message: 'A new OTP has been sent to your email address.',
    };
  },

  // //     return {
  // //       token,
  // //       user: {
  // //         id: newUser.id,
  // //         name: newUser.name,
  // //         email: newUser.email
  // //       },
  // //       message: 'Registration successful! You are now logged in.'
  // //     };

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

    // Check if user is verified
    // if (!user.is_verified) {
    //   throw new Error('Please verify your email before logging in.');
    // }

    // Verify password
    const isMatch = await UserModel.verifyPassword(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    
    
    // Generate token
    console.log('User object before token generation:', user);
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
  },
};

export default AuthView;