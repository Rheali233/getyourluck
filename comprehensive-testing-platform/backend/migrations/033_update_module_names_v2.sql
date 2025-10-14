-- Update module names to more accurate and descriptive versions

-- Update Psychology module name
UPDATE homepage_modules SET
  name = 'Personality & Mind'
WHERE id = 'psychology';

-- Update Astrology module name
UPDATE homepage_modules SET
  name = 'Astrology & Fortune'
WHERE id = 'astrology';

-- Update Tarot module name
UPDATE homepage_modules SET
  name = 'Tarot & Divination'
WHERE id = 'tarot';

-- Update Career module name
UPDATE homepage_modules SET
  name = 'Career & Development'
WHERE id = 'career';

-- Update Numerology module name
UPDATE homepage_modules SET
  name = 'Numerology & Destiny'
WHERE id = 'numerology';

-- Update Learning module name
UPDATE homepage_modules SET
  name = 'Learning & Intelligence'
WHERE id = 'learning';

-- Update Relationship module name
UPDATE homepage_modules SET
  name = 'Relationships & Communication'
WHERE id = 'relationship';
