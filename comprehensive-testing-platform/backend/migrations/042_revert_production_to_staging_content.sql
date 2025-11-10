-- Revert production module content to match staging environment
-- Migration ID: 042_revert_production_to_staging_content
-- This updates production to match the correct staging content

-- Psychology module - revert to staging content
UPDATE homepage_modules
SET 
  name = 'Personality & Mind',
  description = 'Professional assessments revealing personality traits and growth insights',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'psychology';

-- Astrology module - revert to staging content
UPDATE homepage_modules
SET 
  name = 'Astrology & Fortune',
  description = 'Daily guidance decoding zodiac tendencies and opportunities',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'astrology';

-- Tarot module - revert to staging content
UPDATE homepage_modules
SET 
  description = 'Mystical tarot draws with reflective insights and next steps',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'tarot';

-- Career module - revert to staging content
UPDATE homepage_modules
SET 
  description = 'Career profiling to match strengths with roles and paths',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'career';

-- Numerology module - revert to staging content
UPDATE homepage_modules
SET 
  description = 'Traditional numerology decoding life patterns, luck cycles, and meaningful name impacts',
  features_data = json('["BaZi","Chinese Zodiac","Name Analysis","ZiWei"]'),
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'numerology';

-- Learning module - revert to staging content
UPDATE homepage_modules
SET 
  description = 'Assess learning style and cognition to personalize strategies and study environments',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'learning';

-- Relationship module - revert to staging content
UPDATE homepage_modules
SET 
  description = 'Analyze relationship patterns and communication styles to improve empathy and harmony',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'relationship';

