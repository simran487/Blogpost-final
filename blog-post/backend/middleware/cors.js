// backend/middleware/cors.js
import cors from 'cors';

// Define the list of allowed origins (your frontend URL)
const allowedOrigins = [
  'http://localhost:3000', // Default React dev server port
  'http://localhost:3001', // Another common dev port
  'http://frontend.blogpost.run.place'
  // Add your deployed frontend URL here when you go to production
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
};

export default cors(corsOptions);
