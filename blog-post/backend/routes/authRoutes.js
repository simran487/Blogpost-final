// routes/authRoutes.js
import express from 'express';
import AuthView from '../views/authView.js';

const router = express.Router();

// Register route
router.post('/signUp', async (req, res) => {
  try {
    const result = await AuthView.register(req.body);
    res.json(result);
  } catch (error) {
    if (error.message === 'This email is already registered') {
      return res.status(409).json({ error: error.message });
    }
    if (error.code === 'EAUTH' || error.code === 'EENVELOPE') {
      console.error('Email sending error:', error.message);
      return res.status(500).json({ error: 'Could not send verification email. Please try again later.' });
    }
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed due to a server error.' });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const result = await AuthView.verifyOtp(userId, otp);
    res.json(result);
  } catch (error) {
    console.error('OTP verification error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Resend OTP route
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await AuthView.resendOtp(email);
    res.json(result);
  } catch (error) {
    console.error('Resend OTP error:', error.message);
    res.status(400).json({ error: error.message });
  }
});


// Login route
router.post('/signIn', async (req, res) => {
  try {
    const result = await AuthView.login(req.body);
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ error: error.message });
    }
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed due to a server error.' });
  }
});

export default router;