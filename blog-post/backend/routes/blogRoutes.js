// routes/blogRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import BlogView from '../views/blogView.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Get all blogs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    // This route should only fetch all blogs, passing the authenticated user's ID for ownership checks.
    const result = await BlogView.getAllBlogs(page, limit, req.userId);
    res.json(result);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get user's own blogs
router.get('/my-posts', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const result = await BlogView.getUserBlogs(req.userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error fetching user's blogs:", error);
    res.status(500).json({ error: "Failed to fetch user's blogs" });
  }
});

// Get blog by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const blog = await BlogView.getBlogById(req.params.id, req.userId);
    res.json(blog);
  } catch (error) {
    if (error.message === 'Blog not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Create blog
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { title, description, content } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const blog = await BlogView.createBlog(
      { title, description, content, image_url },
      req.userId
    );
    
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: error.message || 'Failed to create blog' });
  }
});

// Update blog
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { title, description, content } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;
    
    const blog = await BlogView.updateBlog(
      req.params.id,
      { title, description, content, image_url },
      req.userId
    );
    
    res.json(blog);
  } catch (error) {
    if (error.message === 'Blog not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Unauthorized to update this blog') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Failed to update blog' });
  }
});

// Delete blog
router.delete('/:id', authenticateToken, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    await BlogView.deleteBlog(req.params.id, req.userId);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    if (error.message === 'Blog not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Unauthorized to delete this blog') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Failed to delete blog' });
  }
});

export default router;