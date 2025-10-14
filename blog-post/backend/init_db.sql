-- Check if the blogs table exists and drop it if it does (for clean setup/reset)
DROP TABLE IF EXISTS blogs;

-- Create the main blog posts table
CREATE TABLE blogs (
    -- Unique identifier for each blog post
    id SERIAL PRIMARY KEY,
    
    -- The main title of the blog post (required)
    title VARCHAR(255) NOT NULL,
    
    -- A short summary or one-liner description
    description TEXT,
    
    -- The main body/content of the blog post (required)
    content TEXT NOT NULL,
  
    image_url VARCHAR(255),
    
    -- Timestamp when the record was created, defaults to the current time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert some initial mock data so the frontend has something to display immediately
INSERT INTO blogs (title, description, content, image_url) VALUES 
('First Post: Welcome to the New Blog', 'A quick hello to our readers on the new platform!', 'This marks the beginning of our journey. We are excited to share our thoughts and updates with you.', 'https://placehold.co/400x250/3730a3/ffffff?text=New+Platform'),
('Understanding the CRUD Operations', 'An essential guide to Create, Read, Update, and Delete in web development.', 'CRUD forms the backbone of almost every modern web application. We will use this API to demonstrate all four operations.', 'https://placehold.co/400x250/065f46/ffffff?text=CRUD+Basics'),
('Frontend Refactoring with React Hooks', 'How we updated our React components for better state management.', 'Using hooks like useState and useEffect allows for cleaner, more reusable component logic. This is key to our new approach.', 'https://placehold.co/400x250/6d28d9/ffffff?text=React+Hooks'),
('The Power of PostgreSQL', 'Why this robust database is perfect for scalable blogging platforms.', 'PostgreSQL offers features like advanced indexing and JSONB support, making it an excellent choice for a growing application.', 'https://placehold.co/400x250/be185d/ffffff?text=PostgreSQL+Power');


ALTER TABLE blogs ADD COLUMN user_id INTEGER;

ALTER TABLE blogs ADD CONSTRAINT fk_user
-- 💡 FIX: This line ensures user_id links to users.id
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE SET NULL; 


