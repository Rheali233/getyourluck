-- Update homepage_modules routes from old paths to new /tests/* paths
-- This ensures all module routes use the new canonical URL structure

BEGIN TRANSACTION;

-- Psychology: /psychology -> /tests/psychology
UPDATE homepage_modules
SET 
  route = '/tests/psychology',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'psychology' AND route = '/psychology';

-- Career: /career -> /tests/career
UPDATE homepage_modules
SET 
  route = '/tests/career',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'career' AND route = '/career';

-- Astrology: /astrology -> /tests/astrology
UPDATE homepage_modules
SET 
  route = '/tests/astrology',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'astrology' AND route = '/astrology';

-- Tarot: /tarot -> /tests/tarot
UPDATE homepage_modules
SET 
  route = '/tests/tarot',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'tarot' AND route = '/tarot';

-- Numerology: /numerology -> /tests/numerology
UPDATE homepage_modules
SET 
  route = '/tests/numerology',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'numerology' AND route = '/numerology';

-- Learning: /learning -> /tests/learning
UPDATE homepage_modules
SET 
  route = '/tests/learning',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'learning' AND route = '/learning';

-- Relationship: /relationship -> /tests/relationship
UPDATE homepage_modules
SET 
  route = '/tests/relationship',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'relationship' AND route = '/relationship';

COMMIT;

