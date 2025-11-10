-- Activate numerology module and update to match current English content
-- This migration ensures numerology module is active and has correct content
-- Migration ID: 036_activate_numerology_final

BEGIN TRANSACTION;

-- Activate numerology module and update content to match frontend
UPDATE homepage_modules
SET 
  is_active = 1,
  name = 'Numerology & Destiny',
  description = 'Traditional numerology decoding life patterns, luck cycles, and meaningful name impacts',
  features_data = json('["BaZi","Chinese Zodiac","Name Analysis","ZiWei"]'),
  route = '/tests/numerology',
  estimated_time = '10-15 minutes',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'numerology';

-- Ensure numerology module exists, if not create it
INSERT OR IGNORE INTO homepage_modules (
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
  sort_order
) VALUES (
  'numerology',
  'Numerology & Destiny',
  'Traditional numerology decoding life patterns, luck cycles, and meaningful name impacts',
  '🔢',
  'numerology',
  5,
  4.1,
  1,
  '/tests/numerology',
  json('["BaZi","Chinese Zodiac","Name Analysis","ZiWei"]'),
  '10-15 minutes',
  5
);

COMMIT;

