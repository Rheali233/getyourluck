-- 同步测试类型配置到生产环境
INSERT OR REPLACE INTO test_types (
  id, name, category, description, config_data, is_active, sort_order, created_at, updated_at
) VALUES 
('mbti', 'MBTI Personality Test', 'psychology', 'Myers-Briggs Type Indicator personality assessment', 
'{questions:[],scoringType:binary,scoringRules:{dimensions:[E/I,S/N,T/F,J/P],scoringMethod:dimension_based},resultTemplates:{type:personality_type,format:mbti_16_types},timeLimit:900,questionCount:20}', 
1, 1, '2025-08-30 03:36:03', '2025-08-30 03:36:03'),

('phq9', 'PHQ-9 Depression Screening', 'psychology', '9-item depression screening questionnaire', 
'{questions:[],scoringType:likert,scoringRules:{scale:[0,1,2,3],interpretation:{0-4:minimal,5-9:mild,10-14:moderate,15-19:moderately_severe,20-27:severe}},resultTemplates:{type:screening_result,format:severity_level},timeLimit:600,questionCount:9}', 
1, 2, '2025-08-30 03:36:04', '2025-08-30 03:36:04'),

('eq', 'Emotional Intelligence Test', 'psychology', 'Assessment of emotional intelligence across five dimensions', 
'{questions:[],scoringType:likert,scoringRules:{dimensions:[self_awareness,self_regulation,motivation,empathy,social_skills],scoringMethod:dimension_average},resultTemplates:{type:dimension_profile,format:eq_dimensions},timeLimit:1200,questionCount:40}', 
1, 3, '2025-08-30 03:36:05', '2025-08-30 03:36:05'),

('happiness', 'Happiness Index Assessment', 'psychology', 'Subjective well-being and life satisfaction assessment', 
'{questions:[],scoringType:likert,scoringRules:{dimensions:[work,relationships,health,personal_growth,life_balance],scoringMethod:dimension_sum},resultTemplates:{type:wellness_profile,format:happiness_dimensions},timeLimit:300,questionCount:5}', 
1, 4, '2025-08-30 03:36:06', '2025-08-30 03:36:06'),

('holland', 'Holland Career Interest Test', 'career', 'RIASEC career interest assessment', 
'{questions:[],scoringType:likert,scoringRules:{dimensions:[realistic,investigative,artistic,social,enterprising,conventional],scoringMethod:dimension_sum},resultTemplates:{type:career_profile,format:holland_riasec},timeLimit:1200,questionCount:30}', 
1, 5, '2025-08-30 03:36:07', '2025-08-30 03:36:07'),

('disc', 'DISC Behavioral Style Test', 'career', 'DISC behavioral style assessment', 
'{questions:[],scoringType:likert,scoringRules:{dimensions:[dominance,influence,steadiness,conscientiousness],scoringMethod:dimension_sum},resultTemplates:{type:behavioral_profile,format:disc_styles},timeLimit:900,questionCount:30}', 
1, 6, '2025-08-30 03:36:08', '2025-08-30 03:36:08'),

('leadership', 'Leadership Assessment Test', 'career', 'Multi-dimensional leadership assessment', 
'{questions:[],scoringType:likert,scoringRules:{dimensions:[vision,influence,execution,team_dynamics,adaptability],scoringMethod:dimension_average},resultTemplates:{type:leadership_profile,format:leadership_dimensions},timeLimit:1500,questionCount:30}', 
1, 7, '2025-08-30 03:36:09', '2025-08-30 03:36:09'),

('love_language', 'Love Language Test', 'relationship', 'Assessment of how you prefer to give and receive love', 
'{questions:[],scoringType:likert,scoringRules:{dimensions:[words_of_affirmation,quality_time,receiving_gifts,acts_of_service,physical_touch],scoringMethod:dimension_sum},resultTemplates:{type:relationship_profile,format:love_languages},timeLimit:900,questionCount:30}', 
1, 8, '2025-08-30 03:36:10', '2025-08-30 03:36:10'),

('love_style', 'Love Style Assessment', 'relationship', 'Assessment of romantic relationship styles', 
'{questions:[],scoringType:likert,scoringRules:{dimensions:[eros,ludus,storge,pragma,mania,agape],scoringMethod:dimension_sum},resultTemplates:{type:relationship_profile,format:love_styles},timeLimit:900,questionCount:30}', 
1, 9, '2025-08-30 03:36:11', '2025-08-30 03:36:11'),

('interpersonal', 'Interpersonal Skills Assessment', 'relationship', 'Assessment of interpersonal communication and relationship skills', 
'{questions:[],scoringType:likert,scoringRules:{dimensions:[communication_skills,empathy,conflict_resolution,trust_building,social_skills],scoringMethod:dimension_average},resultTemplates:{type:skills_profile,format:interpersonal_dimensions},timeLimit:900,questionCount:30}', 
1, 10, '2025-08-30 03:36:12', '2025-08-30 03:36:12'),

('tarot_reading', 'Tarot Reading', 'divination', 'Tarot card reading and divination', 
'{}', 
1, 100, '2025-09-13 19:09:51', '2025-09-13 19:09:51'),

('vark', 'VARK Learning Style Test', 'learning', 'Visual, Auditory, Reading/Writing, and Kinesthetic learning style assessment', 
'{"questions": [], "scoringType": "multiple_choice", "scoringRules": {"dimensions": ["V", "A", "R", "K"], "scoringMethod": "dimension_count"}, "resultTemplates": {"type": "learning_style", "format": "vark_profile"}, "timeLimit": 600, "questionCount": 16}', 
1, 20, '2025-10-08 15:22:46', '2025-10-08 15:22:46'),


('tarot', 'Tarot Reading', 'tarot', 'Tarot reading with spreads and AI interpretations (English only).', 
'{"spreads":["single_card","three_card","celtic_cross"],"aiEnabled":true}', 
1, 50, '2025-10-09 13:09:03', '2025-10-09 13:09:03');
