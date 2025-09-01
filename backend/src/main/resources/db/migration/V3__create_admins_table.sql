-- Migration V3: Create admins table
-- This table extends the users table with admin-specific fields

CREATE TABLE IF NOT EXISTS admins (
    id BIGINT PRIMARY KEY,
    department VARCHAR(255),
    permissions VARCHAR(255),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);
