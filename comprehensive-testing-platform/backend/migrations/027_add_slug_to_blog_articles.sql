-- Add slug column to blog_articles and backfill the intro article

-- SQLite in D1 doesn't support IF NOT EXISTS for ADD COLUMN; attempt plain add
ALTER TABLE blog_articles ADD COLUMN slug TEXT;

-- Create index for slug lookup
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);

-- Backfill slug for existing intro article
UPDATE blog_articles
SET slug = 'intro-001'
WHERE id = 'intro-001' AND (slug IS NULL OR slug = '');


