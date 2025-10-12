-- Insert a real blog article: Platform introduction (English only)
-- This migration adds one published article into blog_articles

INSERT INTO blog_articles (
  id,
  title,
  content,
  excerpt,
  category,
  tags_data,
  view_count,
  like_count,
  is_published,
  is_featured,
  published_at,
  created_at,
  updated_at
) VALUES (
  'intro-001',
  'Welcome to the Comprehensive Testing Platform',
  '## About Our Platform\n\nOur platform brings together scientific psychology assessments and traditional wisdom modules into one unified experience. You can explore MBTI, Big Five, learning styles, career planning, astrology, tarot, numerology, and more — all in English.\n\n### What You Can Do Here\n- Discover your personality and strengths\n- Evaluate emotional intelligence and mental wellness\n- Plan your career path with evidence-based frameworks\n- Explore astrology insights and tarot readings\n- Connect test results to real-life actions\n\n### Why It Matters\nWe believe self-knowledge should be: accessible, actionable, and enjoyable. Every test is optimized for mobile, fast to complete, and paired with clear guidance for next steps.\n\n### How We Ensure Quality\n- Unified design system and consistent UX\n- Verified test models and structured data\n- Privacy-first approach, no forced sign-in\n\nStart with any module that resonates with you — psychology, career, relationships, learning, astrology, tarot, or numerology — and build a holistic view of yourself.',
  'An overview of our all-in-one platform combining psychology, career, and traditional wisdom — designed for fast, meaningful self-discovery.',
  'Platform',
  json('["Platform", "Introduction", "Getting Started"]'),
  0,
  0,
  1,
  1,
  datetime('now'),
  datetime('now'),
  datetime('now')
);


