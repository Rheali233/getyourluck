-- Migration: Extend Holland Career Interest Test to 60 Questions
-- This migration adds questions 31-60 to complete the Holland RIASEC assessment
-- Each dimension (R/I/A/S/E/C) will have exactly 10 questions

-- Add remaining Holland questions (31-60)
INSERT OR REPLACE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, dimension, 
  domain, weight, order_index, is_required, is_active
) VALUES
-- Realistic (R) - Additional questions 31-35
('holland_031', 'holland-category', 'I enjoy working with construction and building materials', 'I enjoy working with construction and building materials', 'likert_scale', 'realistic', 'realistic', 1, 31, 1, 1),
('holland_032', 'holland-category', 'I like to work with electrical and electronic systems', 'I like to work with electrical and electronic systems', 'likert_scale', 'realistic', 'realistic', 1, 32, 1, 1),
('holland_033', 'holland-category', 'I am comfortable working in industrial environments', 'I am comfortable working in industrial environments', 'likert_scale', 'realistic', 'realistic', 1, 33, 1, 1),
('holland_034', 'holland-category', 'I enjoy working with agricultural equipment and processes', 'I enjoy working with agricultural equipment and processes', 'likert_scale', 'realistic', 'realistic', 1, 34, 1, 1),
('holland_035', 'holland-category', 'I like to work with automotive and transportation systems', 'I like to work with automotive and transportation systems', 'likert_scale', 'realistic', 'realistic', 1, 35, 1, 1),

-- Investigative (I) - Additional questions 36-40
('holland_036', 'holland-category', 'I enjoy conducting laboratory experiments', 'I enjoy conducting laboratory experiments', 'likert_scale', 'investigative', 'investigative', 1, 36, 1, 1),
('holland_037', 'holland-category', 'I like to read scientific journals and research papers', 'I like to read scientific journals and research papers', 'likert_scale', 'investigative', 'investigative', 1, 37, 1, 1),
('holland_038', 'holland-category', 'I enjoy working with computer programming and algorithms', 'I enjoy working with computer programming and algorithms', 'likert_scale', 'investigative', 'investigative', 1, 38, 1, 1),
('holland_039', 'holland-category', 'I like to investigate and solve complex problems', 'I like to investigate and solve complex problems', 'likert_scale', 'investigative', 'investigative', 1, 39, 1, 1),
('holland_040', 'holland-category', 'I enjoy working with statistical analysis and research methods', 'I enjoy working with statistical analysis and research methods', 'likert_scale', 'investigative', 'investigative', 1, 40, 1, 1),

-- Artistic (A) - Additional questions 41-45
('holland_041', 'holland-category', 'I enjoy writing creative stories or poetry', 'I enjoy writing creative stories or poetry', 'likert_scale', 'artistic', 'artistic', 1, 41, 1, 1),
('holland_042', 'holland-category', 'I like to work with digital media and graphic design', 'I like to work with digital media and graphic design', 'likert_scale', 'artistic', 'artistic', 1, 42, 1, 1),
('holland_043', 'holland-category', 'I enjoy photography and visual arts', 'I enjoy photography and visual arts', 'likert_scale', 'artistic', 'artistic', 1, 43, 1, 1),
('holland_044', 'holland-category', 'I like to work with interior design and decoration', 'I like to work with interior design and decoration', 'likert_scale', 'artistic', 'artistic', 1, 44, 1, 1),
('holland_045', 'holland-category', 'I enjoy working with fashion and textile design', 'I enjoy working with fashion and textile design', 'likert_scale', 'artistic', 'artistic', 1, 45, 1, 1),

-- Social (S) - Additional questions 46-50
('holland_046', 'holland-category', 'I enjoy counseling and advising others', 'I enjoy counseling and advising others', 'likert_scale', 'social', 'social', 1, 46, 1, 1),
('holland_047', 'holland-category', 'I like to work in healthcare and medical support', 'I like to work in healthcare and medical support', 'likert_scale', 'social', 'social', 1, 47, 1, 1),
('holland_048', 'holland-category', 'I enjoy working with children and youth development', 'I enjoy working with children and youth development', 'likert_scale', 'social', 'social', 1, 48, 1, 1),
('holland_049', 'holland-category', 'I like to work in social services and community support', 'I like to work in social services and community support', 'likert_scale', 'social', 'social', 1, 49, 1, 1),
('holland_050', 'holland-category', 'I enjoy working in human resources and personnel management', 'I enjoy working in human resources and personnel management', 'likert_scale', 'social', 'social', 1, 50, 1, 1),

-- Enterprising (E) - Additional questions 51-55
('holland_051', 'holland-category', 'I enjoy starting and managing my own business', 'I enjoy starting and managing my own business', 'likert_scale', 'enterprising', 'enterprising', 1, 51, 1, 1),
('holland_052', 'holland-category', 'I like to work in marketing and advertising', 'I like to work in marketing and advertising', 'likert_scale', 'enterprising', 'enterprising', 1, 52, 1, 1),
('holland_053', 'holland-category', 'I enjoy working in public relations and communications', 'I enjoy working in public relations and communications', 'likert_scale', 'enterprising', 'enterprising', 1, 53, 1, 1),
('holland_054', 'holland-category', 'I like to work in real estate and property development', 'I like to work in real estate and property development', 'likert_scale', 'enterprising', 'enterprising', 1, 54, 1, 1),
('holland_055', 'holland-category', 'I enjoy working in investment and financial planning', 'I enjoy working in investment and financial planning', 'likert_scale', 'enterprising', 'enterprising', 1, 55, 1, 1),

-- Conventional (C) - Additional questions 56-60
('holland_056', 'holland-category', 'I enjoy working with accounting and bookkeeping', 'I enjoy working with accounting and bookkeeping', 'likert_scale', 'conventional', 'conventional', 1, 56, 1, 1),
('holland_057', 'holland-category', 'I like to work with legal documents and compliance', 'I like to work with legal documents and compliance', 'likert_scale', 'conventional', 'conventional', 1, 57, 1, 1),
('holland_058', 'holland-category', 'I enjoy working with insurance and risk management', 'I enjoy working with insurance and risk management', 'likert_scale', 'conventional', 'conventional', 1, 58, 1, 1),
('holland_059', 'holland-category', 'I like to work with quality control and standards', 'I like to work with quality control and standards', 'likert_scale', 'conventional', 'conventional', 1, 59, 1, 1),
('holland_060', 'holland-category', 'I enjoy working with procurement and supply chain management', 'I enjoy working with procurement and supply chain management', 'likert_scale', 'conventional', 'conventional', 1, 60, 1, 1);
