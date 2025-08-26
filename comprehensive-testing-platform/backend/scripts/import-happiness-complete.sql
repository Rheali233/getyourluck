-- 幸福指数完整题库导入脚本
-- 包含50道题目和250个选项（5点Likert量表）

-- 1. 确保分类存在
INSERT OR IGNORE INTO psychology_question_categories (
  id, name, code, description, question_count, dimensions,
  scoring_type, min_score, max_score, estimated_time, sort_order
) VALUES (
  'happiness-category',
  '幸福指数评估',
  'happiness',
  '基于PERMA模型的幸福指数评估量表，测量积极情绪、投入、人际关系、意义和成就五个维度',
  50,
  '["P", "E", "R", "M", "A"]',
  'likert',
  50,
  250,
  15,
  4
);

-- 2. 插入所有50道题目
INSERT OR IGNORE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, 
  dimension, domain, weight, order_index, is_required, created_at
) VALUES 
-- P - 积极情绪（Positive Emotion）10题
('happiness-q-1', 'happiness-category', '我通常对未来感到乐观。', 'I usually feel optimistic about the future.', 'likert_scale', 'P', 'optimism', 1, 1, 1, datetime('now')),
('happiness-q-2', 'happiness-category', '我会花时间去感激生活中美好的事物。', 'I take time to appreciate the good things in life.', 'likert_scale', 'P', 'gratitude', 1, 2, 1, datetime('now')),
('happiness-q-3', 'happiness-category', '在过去一周，我感到快乐的日子比不快乐的日子多。', 'In the past week, I had more happy days than unhappy days.', 'likert_scale', 'P', 'happiness_frequency', 1, 3, 1, datetime('now')),
('happiness-q-4', 'happiness-category', '我能从日常小事中找到乐趣。', 'I can find joy in everyday small things.', 'likert_scale', 'P', 'enjoyment', 1, 4, 1, datetime('now')),
('happiness-q-5', 'happiness-category', '我很少感到满足或喜悦。', 'I rarely feel satisfied or joyful.', 'likert_scale', 'P', 'positive_mindset', 1, 5, 1, datetime('now')),
('happiness-q-6', 'happiness-category', '我倾向于看到事情好的一面而非坏的一面。', 'I tend to see the good side of things rather than the bad side.', 'likert_scale', 'P', 'optimism_pessimism', 1, 6, 1, datetime('now')),
('happiness-q-7', 'happiness-category', '我会主动分享我的快乐给别人。', 'I actively share my happiness with others.', 'likert_scale', 'P', 'emotion_expression', 1, 7, 1, datetime('now')),
('happiness-q-8', 'happiness-category', '经历挫折后，我能很快恢复积极心态。', 'After experiencing setbacks, I can quickly recover to a positive mindset.', 'likert_scale', 'P', 'resilience', 1, 8, 1, datetime('now')),
('happiness-q-9', 'happiness-category', '我内心感到平静和安宁。', 'I feel peaceful and calm inside.', 'likert_scale', 'P', 'inner_peace', 1, 9, 1, datetime('now')),
('happiness-q-10', 'happiness-category', '我经常被焦虑、担忧等负面情绪困扰。', 'I am often troubled by negative emotions such as anxiety and worry.', 'likert_scale', 'P', 'negative_emotions', 1, 10, 1, datetime('now')),

-- E - 投入（Engagement）10题
('happiness-q-11', 'happiness-category', '我在做喜欢的事情时，会忘记时间。', 'When I do things I like, I lose track of time.', 'likert_scale', 'E', 'flow_experience', 1, 11, 1, datetime('now')),
('happiness-q-12', 'happiness-category', '我能完全专注于我正在做的事情。', 'I can completely focus on what I am doing.', 'likert_scale', 'E', 'concentration', 1, 12, 1, datetime('now')),
('happiness-q-13', 'happiness-category', '我的工作或爱好能让我感到既有挑战性，又能发挥我的技能。', 'My work or hobbies make me feel both challenged and able to use my skills.', 'likert_scale', 'E', 'challenge_skill', 1, 13, 1, datetime('now')),
('happiness-q-14', 'happiness-category', '我很少能全身心投入到一件事情中。', 'I rarely can fully immerse myself in one thing.', 'likert_scale', 'E', 'immersion', 1, 14, 1, datetime('now')),
('happiness-q-15', 'happiness-category', '我对学习新技能或知识感到兴奋。', 'I feel excited about learning new skills or knowledge.', 'likert_scale', 'E', 'learning_interest', 1, 15, 1, datetime('now')),
('happiness-q-16', 'happiness-category', '我常常使用自己的优势和特长。', 'I often use my strengths and talents.', 'likert_scale', 'E', 'personal_strengths', 1, 16, 1, datetime('now')),
('happiness-q-17', 'happiness-category', '我的日常活动与我的个人目标紧密相连。', 'My daily activities are closely connected to my personal goals.', 'likert_scale', 'E', 'goal_alignment', 1, 17, 1, datetime('now')),
('happiness-q-18', 'happiness-category', '我经常感到无聊或无所事事。', 'I often feel bored or have nothing to do.', 'likert_scale', 'E', 'boredom', 1, 18, 1, datetime('now')),
('happiness-q-19', 'happiness-category', '我能把精力集中在当下的任务上。', 'I can focus my energy on the current task.', 'likert_scale', 'E', 'energy_focus', 1, 19, 1, datetime('now')),
('happiness-q-20', 'happiness-category', '我做事的动力主要来自兴趣而不是外部压力。', 'My motivation to do things mainly comes from interest rather than external pressure.', 'likert_scale', 'E', 'interest_driven', 1, 20, 1, datetime('now')),

-- R - 人际关系（Relationships）10题
('happiness-q-21', 'happiness-category', '当我遇到困难时，有人可以依赖。', 'When I encounter difficulties, there is someone I can rely on.', 'likert_scale', 'R', 'social_support', 1, 21, 1, datetime('now')),
('happiness-q-22', 'happiness-category', '我感到自己是某个团体或社区的一员。', 'I feel I am a member of some group or community.', 'likert_scale', 'R', 'belonging', 1, 22, 1, datetime('now')),
('happiness-q-23', 'happiness-category', '我与家人和朋友的关系非常亲密。', 'I have very close relationships with my family and friends.', 'likert_scale', 'R', 'intimate_relationships', 1, 23, 1, datetime('now')),
('happiness-q-24', 'happiness-category', '我经常感到孤独。', 'I often feel lonely.', 'likert_scale', 'R', 'loneliness', 1, 24, 1, datetime('now')),
('happiness-q-25', 'happiness-category', '我喜欢与人交流，享受社交活动。', 'I enjoy communicating with people and social activities.', 'likert_scale', 'R', 'social_interaction', 1, 25, 1, datetime('now')),
('happiness-q-26', 'happiness-category', '我能建立深层次的情感连接。', 'I can establish deep emotional connections.', 'likert_scale', 'R', 'emotional_connection', 1, 26, 1, datetime('now')),
('happiness-q-27', 'happiness-category', '我相信身边的人是真心关心我。', 'I believe the people around me genuinely care about me.', 'likert_scale', 'R', 'trust_others', 1, 27, 1, datetime('now')),
('happiness-q-28', 'happiness-category', '我会主动帮助别人，也愿意接受别人的帮助。', 'I actively help others and am willing to accept help from others.', 'likert_scale', 'R', 'mutual_help', 1, 28, 1, datetime('now')),
('happiness-q-29', 'happiness-category', '我经常感到人际关系给我带来压力。', 'I often feel that interpersonal relationships bring me pressure.', 'likert_scale', 'R', 'interpersonal_pressure', 1, 29, 1, datetime('now')),
('happiness-q-30', 'happiness-category', '我有几个可以无话不谈的知心朋友。', 'I have several close friends I can talk to about anything.', 'likert_scale', 'R', 'close_friends', 1, 30, 1, datetime('now')),

-- M - 意义（Meaning）10题
('happiness-q-31', 'happiness-category', '我对自己的生活有一个清晰的目标。', 'I have a clear goal for my life.', 'likert_scale', 'M', 'goal_sense', 1, 31, 1, datetime('now')),
('happiness-q-32', 'happiness-category', '我觉得自己的生命是有意义的。', 'I feel my life is meaningful.', 'likert_scale', 'M', 'existence_value', 1, 32, 1, datetime('now')),
('happiness-q-33', 'happiness-category', '我相信我的工作或行动能对他人产生积极影响。', 'I believe my work or actions can have a positive impact on others.', 'likert_scale', 'M', 'serving_others', 1, 33, 1, datetime('now')),
('happiness-q-34', 'happiness-category', '我觉得我的生活没有方向或目的。', 'I feel my life has no direction or purpose.', 'likert_scale', 'M', 'purpose_sense', 1, 34, 1, datetime('now')),
('happiness-q-35', 'happiness-category', '我的行动与我的个人价值观相符。', 'My actions align with my personal values.', 'likert_scale', 'M', 'values', 1, 35, 1, datetime('now')),
('happiness-q-36', 'happiness-category', '我会为比我个人更宏大的目标而努力。', 'I will work hard for goals that are greater than myself.', 'likert_scale', 'M', 'altruism', 1, 36, 1, datetime('now')),
('happiness-q-37', 'happiness-category', '我对自己所做的事感到自豪。', 'I feel proud of what I do.', 'likert_scale', 'M', 'achievement_sense', 1, 37, 1, datetime('now')),
('happiness-q-38', 'happiness-category', '我觉得我能为集体或社会做出贡献。', 'I feel I can contribute to the collective or society.', 'likert_scale', 'M', 'contribution', 1, 38, 1, datetime('now')),
('happiness-q-39', 'happiness-category', '我时常感到迷失，不知道自己的人生方向。', 'I often feel lost and don''t know my life direction.', 'likert_scale', 'M', 'lost_sense', 1, 39, 1, datetime('now')),
('happiness-q-40', 'happiness-category', '我觉得我的生活有一个重要的使命。', 'I feel my life has an important mission.', 'likert_scale', 'M', 'mission_sense', 1, 40, 1, datetime('now')),

-- A - 成就（Accomplishment）10题
('happiness-q-41', 'happiness-category', '我经常能够成功完成我设定的目标。', 'I can often successfully complete the goals I set.', 'likert_scale', 'A', 'goal_achievement', 1, 41, 1, datetime('now')),
('happiness-q-42', 'happiness-category', '我对自己的成就感到自豪。', 'I feel proud of my achievements.', 'likert_scale', 'A', 'pride', 1, 42, 1, datetime('now')),
('happiness-q-43', 'happiness-category', '我相信努力工作会得到回报。', 'I believe hard work will be rewarded.', 'likert_scale', 'A', 'effort_reward', 1, 43, 1, datetime('now')),
('happiness-q-44', 'happiness-category', '我对自己的生活有掌控感。', 'I feel in control of my life.', 'likert_scale', 'A', 'mastery_sense', 1, 44, 1, datetime('now')),
('happiness-q-45', 'happiness-category', '我很容易拖延，无法完成计划。', 'I easily procrastinate and cannot complete plans.', 'likert_scale', 'A', 'procrastination', 1, 45, 1, datetime('now')),
('happiness-q-46', 'happiness-category', '我很享受在竞争中获胜的感觉。', 'I enjoy the feeling of winning in competition.', 'likert_scale', 'A', 'competitiveness', 1, 46, 1, datetime('now')),
('happiness-q-47', 'happiness-category', '我能感受到自己在持续进步。', 'I can feel that I am continuously improving.', 'likert_scale', 'A', 'progress', 1, 47, 1, datetime('now')),
('happiness-q-48', 'happiness-category', '我有信心能应对生活中的各种挑战。', 'I am confident I can handle various challenges in life.', 'likert_scale', 'A', 'self_efficacy', 1, 48, 1, datetime('now')),
('happiness-q-49', 'happiness-category', '我对自己的表现感到不满，即使已经做得很好了。', 'I am dissatisfied with my performance even when I have done well.', 'likert_scale', 'A', 'perfectionism', 1, 49, 1, datetime('now')),
('happiness-q-50', 'happiness-category', '即使遇到失败，我也能坚持下去。', 'Even when I encounter failure, I can persist.', 'likert_scale', 'A', 'resilience', 1, 50, 1, datetime('now'));
