-- Sync production homepage modules to match staging environment
-- Migration ID: 040_sync_production_modules_from_staging
-- This updates all module details to match the staging environment display

-- Psychology module
UPDATE homepage_modules
SET 
  estimated_time = '3-5分钟',
  features_data = json('["Personality Discovery","Mental Wellness"]'),
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'psychology';

-- Astrology module
UPDATE homepage_modules
SET 
  estimated_time = '1-2分钟',
  features_data = json('["Daily Guidance","Future Insights"]'),
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'astrology';

-- Tarot module
UPDATE homepage_modules
SET 
  estimated_time = '2-3分钟',
  features_data = json('["Mystical Cards","Future Vision"]'),
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'tarot';

-- Career module
UPDATE homepage_modules
SET 
  estimated_time = '5-8分钟',
  features_data = json('["Dream Job Match","Leadership Skills"]'),
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'career';

-- Numerology module
UPDATE homepage_modules
SET 
  test_count = 756,
  estimated_time = '10-15 minutes',
  features_data = json('["BaZi","Chinese Zodiac"]'),
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'numerology';

-- Learning module
UPDATE homepage_modules
SET 
  estimated_time = '4-6分钟',
  features_data = json('["Learning Style","Intelligence Test"]'),
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'learning';

-- Relationship module
UPDATE homepage_modules
SET 
  estimated_time = '3-5分钟',
  features_data = json('["Love Language","Relationship Style"]'),
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'relationship';

