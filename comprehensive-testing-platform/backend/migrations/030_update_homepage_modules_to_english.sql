-- Unify homepage_modules to English-only content and correct routes
-- This script updates name, description, features_data (JSON), route, and estimated_time.
-- Assumes ids: psychology, astrology, tarot, career, numerology, learning, relationship

BEGIN TRANSACTION;

-- Psychology
UPDATE homepage_modules
SET 
  name = 'Psychology Tests',
  description = 'Discover your personality secrets',
  features_data = json('["MBTI","Depression","EQ"]'),
  route = '/psychology',
  estimated_time = '10-15 minutes',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'psychology';

-- Astrology
UPDATE homepage_modules
SET 
  name = 'Astrology Analysis',
  description = 'Know your daily fortune',
  features_data = json('["Zodiac Matching","Fortune"]'),
  route = '/astrology',
  estimated_time = '5-8 minutes',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'astrology';

-- Tarot
UPDATE homepage_modules
SET 
  name = 'Tarot Reading',
  description = 'Mysterious tarot reveals your heart',
  features_data = json('["Online Drawing","Interpretation"]'),
  route = '/tarot',
  estimated_time = '8-12 minutes',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'tarot';

-- Career
UPDATE homepage_modules
SET 
  name = 'Career Planning',
  description = 'Find your perfect career path',
  features_data = json('["Holland Code","DISC Test"]'),
  route = '/career',
  estimated_time = '15-20 minutes',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'career';

-- Numerology
UPDATE homepage_modules
SET 
  name = 'Traditional Numerology',
  description = 'Calculate your good fortune',
  features_data = json('["BaZi","Chinese Zodiac","Name Analysis"]'),
  route = '/numerology',
  estimated_time = '10-15 minutes',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'numerology';

-- Learning Ability
UPDATE homepage_modules
SET 
  name = 'Learning Ability',
  description = 'Assess your learning style and cognitive abilities to optimize learning methods',
  features_data = json('["Learning Style","Cognitive Ability"]'),
  route = '/learning',
  estimated_time = '12-18 minutes',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'learning';

-- Relationship
UPDATE homepage_modules
SET 
  name = 'Interpersonal Relationships',
  description = 'In-depth analysis of your interpersonal relationship patterns to improve social skills',
  features_data = json('["Love Language","Relationship Style","Social Skills"]'),
  route = '/relationship',
  estimated_time = '8-12 minutes',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'relationship';

COMMIT;


