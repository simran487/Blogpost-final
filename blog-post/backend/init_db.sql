-- Check if the blogs table exists and drop it if it does (for clean setup/reset)
-- Use "CREATE TABLE IF NOT EXISTS" to prevent errors on subsequent runs.
-- This makes the script safe for development restarts without losing data.

-- Create the users table first
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    otp VARCHAR(6),
    otp_expires_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the blog posts table with a foreign key to the users table
CREATE TABLE IF NOT EXISTS blogs (
    -- Unique identifier for each blog post
    id SERIAL PRIMARY KEY,

    -- The main title of the blog post (required)
    title VARCHAR(255) NOT NULL,

    -- A short summary or one-liner description
    description TEXT,

    -- The main body/content of the blog post (required)
    content TEXT NOT NULL,

    image_url VARCHAR(255),

    -- Foreign key to link the blog post to an author in the users table
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

    -- Timestamp when the record was created, defaults to the current time
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Timestamp for when the record was last updated
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Insert some initial mock data so the frontend has something to display immediately
-- Note: You would need to insert a user first to get an author_id for these posts.
-- Example:
-- INSERT INTO users (name, email, password_hash) VALUES ('Admin', 'admin@example.com', 'some_hash');
-- INSERT INTO blogs (title, description, content, image_url, author_id) VALUES ('First Post', 'Desc', 'Content', 'url', 1);
