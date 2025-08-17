-- Initialize database with basic settings
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
-- These will be created after migrations run

-- Set timezone
SET timezone = 'UTC';