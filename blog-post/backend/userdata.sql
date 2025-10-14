DROP TABLE IF EXISTS users;
CREATE TABLE users (
-- Using SERIAL ensures id auto-increments with a sequence object
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
-- Pre-hashed password for 'password' using bcrypt (salt rounds 10) for mock data
password_hash TEXT NOT NULl,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert a mock admin user (ID will likely be 1)
-- Password is 'password'
INSERT INTO users (name, email, password_hash) VALUES 
('Blog Admin', 'admin@blog.com', '$2b$10$wE9w2n2z9B0P0wX0P2X7.u4T6I5J4K3L2M1N0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E');
