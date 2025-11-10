-- Update production module names and descriptions to match staging/actual display
-- Migration ID: 041_update_production_module_names_descriptions
-- Based on the actual displayed content in production

-- Psychology module - update name and description
UPDATE homepage_modules
SET 
  name = 'Psychology & Science',
  description = 'Research-informed assessments to understand your traits, emotions, and thinking styles. Not a medical diagnosis.',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'psychology';

-- Astrology module - update name and description
UPDATE homepage_modules
SET 
  name = 'Astrology & Birth Chart',
  description = 'Explore your cosmic archetypes for fun, reflective insights.',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'astrology';

-- Tarot module - update description
UPDATE homepage_modules
SET 
  description = 'Card spreads for self-reflection and decision framing.',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'tarot';

-- Career module - update description
UPDATE homepage_modules
SET 
  description = 'Holland/RIASEC + DISC-style insights to explore roles aligned with your interests and strengths.',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'career';

-- Numerology module - update description
UPDATE homepage_modules
SET 
  description = 'Number symbolism for personal reflection.',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'numerology';

-- Learning module - update description
UPDATE homepage_modules
SET 
  description = 'Discover learning preferences and cognitive patterns to study smarter.',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'learning';

-- Relationship module - update description
UPDATE homepage_modules
SET 
  description = 'Improve social awareness and communication with practical, research-informed tips.',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'relationship';

