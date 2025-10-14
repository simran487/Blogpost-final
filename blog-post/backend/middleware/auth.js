// middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to check for a valid JWT token in the Authorization header.
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Format is "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // Allow unauthenticated access, but don't set userId
    return next(); 
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Token is invalid (e.g., expired)
      console.error('JWT Verification Failed:', err.message);
      return res.status(403).json({ error: 'Token is invalid or expired.' });
    }
    // Token is valid, attach user ID from payload to the request
    req.userId = user.user_id; 
    next(); 
  });
};

export default authenticateToken;