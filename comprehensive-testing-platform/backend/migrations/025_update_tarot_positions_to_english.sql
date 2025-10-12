-- 更新塔罗牌牌阵位置说明为英文
-- 将中文的 meaning 字段更新为英文

-- 更新单张牌阵
UPDATE tarot_spreads 
SET positions = '[{"name": "guidance", "meaning": "Guidance for your current situation"}]'
WHERE id = 'single_card';

-- 更新三张牌阵
UPDATE tarot_spreads 
SET positions = '[{"name": "past", "meaning": "Past influences and experiences"}, {"name": "present", "meaning": "Current situation and challenges"}, {"name": "future", "meaning": "Future possibilities and outcomes"}]'
WHERE id = 'three_card';

-- 更新凯尔特十字牌阵
UPDATE tarot_spreads 
SET positions = '[{"name": "situation", "meaning": "Core of the current situation"}, {"name": "challenge", "meaning": "Main challenge or obstacle"}, {"name": "past", "meaning": "Past influences"}, {"name": "future", "meaning": "Future possibilities"}, {"name": "above", "meaning": "Possible outcomes"}, {"name": "below", "meaning": "Underlying influences"}, {"name": "advice", "meaning": "Advice and guidance"}, {"name": "external", "meaning": "External influences"}, {"name": "hopes_fears", "meaning": "Hopes and fears"}, {"name": "outcome", "meaning": "Final outcome"}]'
WHERE id = 'celtic_cross';

-- 更新关系牌阵
UPDATE tarot_spreads 
SET positions = '[{"name": "you", "meaning": "Your state in the relationship"}, {"name": "partner", "meaning": "Partner''s state in the relationship"}, {"name": "connection", "meaning": "The connection between you"}, {"name": "challenges", "meaning": "Challenges in the relationship"}, {"name": "your_needs", "meaning": "Your needs"}, {"name": "their_needs", "meaning": "Their needs"}, {"name": "future", "meaning": "Future of the relationship"}]'
WHERE id = 'relationship';

-- 更新事业牌阵
UPDATE tarot_spreads 
SET positions = '[{"name": "current_situation", "meaning": "Current work situation"}, {"name": "strengths", "meaning": "Your strengths and skills"}, {"name": "challenges", "meaning": "Challenges you face"}, {"name": "opportunities", "meaning": "Future opportunities"}, {"name": "advice", "meaning": "Career development advice"}]'
WHERE id = 'career';
