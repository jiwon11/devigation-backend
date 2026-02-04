-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create indexes for search optimization (will be applied after Prisma migration)
-- These are placeholder comments for reference

-- Full-text search indexes
-- CREATE INDEX IF NOT EXISTS idx_posts_title_trgm ON posts USING gin (title gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_posts_content_trgm ON posts USING gin (content gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_roadmaps_title_trgm ON roadmaps USING gin (title gin_trgm_ops);
