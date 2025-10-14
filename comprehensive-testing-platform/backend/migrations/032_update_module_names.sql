-- Update module names to simplified versions

-- Update Numerology module name
UPDATE homepage_modules SET
  name = 'Numerology'
WHERE id = 'numerology';

-- Update Relationship module name  
UPDATE homepage_modules SET
  name = 'Relationship'
WHERE id = 'relationship';
