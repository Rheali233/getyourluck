-- Refine homepage_modules descriptions to 11-12 words each (English only)
BEGIN TRANSACTION;

UPDATE homepage_modules SET description = 'Professional assessments revealing personality traits and emotional patterns for growth insights', updated_at = CURRENT_TIMESTAMP WHERE id = 'psychology';

UPDATE homepage_modules SET description = 'Daily guidance decoding zodiac tendencies, timing, and opportunities for decisions ahead', updated_at = CURRENT_TIMESTAMP WHERE id = 'astrology';

UPDATE homepage_modules SET description = 'Mystical tarot draws offering reflective insights and practical next steps today', updated_at = CURRENT_TIMESTAMP WHERE id = 'tarot';

UPDATE homepage_modules SET description = 'Scientific career profiling to match strengths with roles and development paths', updated_at = CURRENT_TIMESTAMP WHERE id = 'career';

UPDATE homepage_modules SET description = 'Traditional numerology decoding life patterns, luck cycles, and meaningful name impacts', updated_at = CURRENT_TIMESTAMP WHERE id = 'numerology';

UPDATE homepage_modules SET description = 'Assess learning style and cognition to personalize strategies and study environments', updated_at = CURRENT_TIMESTAMP WHERE id = 'learning';

UPDATE homepage_modules SET description = 'Analyze relationship patterns and communication styles to improve empathy and harmony', updated_at = CURRENT_TIMESTAMP WHERE id = 'relationship';

COMMIT;


