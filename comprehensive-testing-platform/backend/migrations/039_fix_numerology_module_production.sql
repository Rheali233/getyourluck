-- Fix numerology module in production environment
-- This migration ensures numerology module is active and properly configured
-- Migration ID: 039_fix_numerology_module_production
-- Note: D1 doesn't support transactions, so we execute statements individually

-- First, update any existing numerology module (regardless of ID format)
-- This handles both 'numerology' and 'numerology-001' formats
UPDATE homepage_modules
SET 
  is_active = 1,
  name = 'Numerology & Destiny',
  description = 'Traditional numerology decoding life patterns, luck cycles, and meaningful name impacts',
  icon = '🔢',
  theme = 'numerology',
  route = '/tests/numerology',
  features_data = json('["BaZi","Chinese Zodiac","Name Analysis","ZiWei"]'),
  estimated_time = '10-15 minutes',
  sort_order = 5,
  updated_at = CURRENT_TIMESTAMP
WHERE theme = 'numerology' OR id LIKE 'numerology%';

-- Ensure numerology module exists with correct ID 'numerology'
-- If it doesn't exist or has wrong ID, create/update it
INSERT OR REPLACE INTO homepage_modules (
  id, 
  name, 
  description, 
  icon, 
  theme, 
  test_count, 
  rating, 
  is_active, 
  route, 
  features_data, 
  estimated_time, 
  sort_order,
  created_at,
  updated_at
) VALUES (
  'numerology',
  'Numerology & Destiny',
  'Traditional numerology decoding life patterns, luck cycles, and meaningful name impacts',
  '🔢',
  'numerology',
  5,
  4.5,
  1,
  '/tests/numerology',
  json('["BaZi","Chinese Zodiac","Name Analysis","ZiWei"]'),
  '10-15 minutes',
  5,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Remove any duplicate numerology modules with different IDs (like 'numerology-001')
-- Keep only the one with id = 'numerology'
DELETE FROM homepage_modules 
WHERE theme = 'numerology' AND id != 'numerology';

