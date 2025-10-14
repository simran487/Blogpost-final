// routes/authRoutes.js
import express from 'express';
import AuthView from '../views/authView.js';

const router = express.Router();

// Register route
router.post('/signUp', async (req, res) => {
  try {
    const result = await AuthView.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'This email is already registered') {
      return res.status(409).json({ error: error.message });
    }
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Failed to register user.' });
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