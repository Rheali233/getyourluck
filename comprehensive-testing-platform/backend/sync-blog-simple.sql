-- 同步博客文章到生产环境 - 简化版本
INSERT OR REPLACE INTO blog_articles (
  id, title, content, excerpt, category, tags_data, 
  view_count, like_count, is_published, is_featured, 
  published_at, created_at, updated_at, slug, cover_image
) VALUES 
('intro-001', 'Welcome to the Comprehensive Testing Platform', 
'## About Our Platform

Our platform brings together scientific psychology assessments and traditional wisdom modules into one unified experience. You can explore MBTI, Big Five, learning styles, career planning, astrology, tarot, numerology, and more — all in English.

### What You Can Do Here
- Discover your personality and strengths
- Evaluate emotional intelligence and mental wellness
- Plan your career path with evidence-based frameworks
- Explore astrology insights and tarot readings
- Connect test results to real-life actions

### Why It Matters
We believe self-knowledge should be: accessible, actionable, and enjoyable. Every test is optimized for mobile, fast to complete, and paired with clear guidance for next steps.

### How We Ensure Quality
- Unified design system and consistent UX
- Verified test models and structured data
- Privacy-first approach, no forced sign-in

Start with any module that resonates with you — psychology, career, relationships, learning, astrology, tarot, or numerology — and build a holistic view of yourself.',
'An overview of our all-in-one platform combining psychology, career, and traditional wisdom — designed for fast, meaningful self-discovery.',
'Platform', '["Platform","Introduction","Getting Started"]', 139, 0, 0, 1, 
'2025-09-23 09:52:26', '2025-09-23 09:52:26', '2025-09-23 09:52:26', 'intro-001', NULL);
