-- Activate numerology module and update to match current English content
-- This migration sets is_active = 1 for numerology module and updates its content to match the frontend

BEGIN TRANSACTION;

-- Activate numerology module and update content
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

COMMIT;

