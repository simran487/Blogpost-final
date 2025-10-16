// server.js - Restructured for MVR architecture
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Import routes
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';


// Import database connection
import pool from './models/db.js';


const app = express();
const PORT = process.env.SERVER_PORT || 5000;


// --- MIDDLEWARE SETUP ---
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/uploads', express.static('uploads'));


// const PORT = process.env.SERVER_PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Request logging middleware
// app.use((req, res, next) => {
//   console.log('Incoming request to:', req.path);
//   console.log('Content-Type:', req.headers['content-type']);
//   next();
// });

// Routes
app.use('/api', authRoutes);
app.use('/api/blogs', blogRoutes);

// User routes
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err.message);
    process.exit(1);
  }
};

startServer();
