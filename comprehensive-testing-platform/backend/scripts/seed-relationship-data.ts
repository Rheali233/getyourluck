/**
 * Seed Relationship Module Data
 * Imports all relationship test questions and options into the database
 */

import { D1Database } from '@cloudflare/workers-types';
import { 
  loveStyleQuestions, 
  loveStyleOptions, 
  loveStyleCategory, 
  loveStyleConfigs,
  loveLanguageQuestions,
  loveLanguageOptions,
  loveLanguageCategory,
  loveLanguageConfigs,
  interpersonalQuestions,
  interpersonalOptions,
  interpersonalCategory,
  interpersonalConfigs
} from '../seeds/relationship-questions';

export async function seedRelationshipData(db: D1Database) {
  console.log('🌱 Starting Relationship Module data seeding...');

  try {
    // Insert categories
    await insertCategory(db, loveStyleCategory);
    await insertCategory(db, loveLanguageCategory);
    await insertCategory(db, interpersonalCategory);

    // Insert questions
    await insertQuestions(db, loveStyleQuestions, 'love-style-category');
    await insertQuestions(db, loveLanguageQuestions, 'love-language-category');
    await insertQuestions(db, interpersonalQuestions, 'interpersonal-category');

    // Insert options
    await insertOptions(db, loveStyleOptions, 'love-style-category');
    await insertOptions(db, loveLanguageOptions, 'love-language-category');
    await insertOptions(db, interpersonalOptions, 'interpersonal-category');

    // Insert configs
    await insertConfigs(db, loveStyleConfigs);
    await insertConfigs(db, loveLanguageConfigs);
    await insertConfigs(db, interpersonalConfigs);

    console.log('✅ Relationship Module data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Relationship Module data:', error);
    throw error;
  }
}

async function insertCategory(db: D1Database, category: any) {
  const { id, name, code, description, questionCount, dimensions, scoringType, minScore, maxScore, estimatedTime } = category;
  
  await db.prepare(`
    INSERT OR IGNORE INTO psychology_question_categories 
    (id, name, code, description, question_count, dimensions, scoring_type, min_score, max_score, estimated_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, name, code, description, questionCount, 
    JSON.stringify(dimensions), scoringType, minScore, maxScore, estimatedTime
  ).run();

  console.log(`📝 Inserted category: ${name}`);
}

async function insertQuestions(db: D1Database, questions: any[], categoryId: string) {
  for (const question of questions) {
    const { categoryId: _, ...questionData } = question;
    
    await db.prepare(`
      INSERT OR IGNORE INTO psychology_questions 
      (id, category_id, question_text, question_type, dimension, weight, order_index, is_required)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `${categoryId}-q${question.orderIndex}`,
      categoryId,
      questionData.questionText,
      questionData.questionType,
      questionData.dimension,
      questionData.weight,
      questionData.orderIndex,
      questionData.isRequired || true
    ).run();
  }

  console.log(`📝 Inserted ${questions.length} questions for category: ${categoryId}`);
}

async function insertOptions(db: D1Database, options: any[], categoryId: string) {
  for (const option of options) {
    await db.prepare(`
      INSERT OR IGNORE INTO psychology_question_options 
      (id, question_id, option_text, option_value, option_score, option_description, order_index, is_correct)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `${categoryId}-opt-${option.orderIndex}`,
      option.questionId,
      option.optionText,
      option.optionValue,
      option.optionScore,
      option.optionDescription,
      option.orderIndex,
      option.isCorrect
    ).run();
  }

  console.log(`📝 Inserted ${options.length} options for category: ${categoryId}`);
}

async function insertConfigs(db: D1Database, configs: any[]) {
  for (const config of configs) {
    const { id, categoryId, configKey, configValue, configType, description } = config;
    
    await db.prepare(`
      INSERT OR IGNORE INTO psychology_question_configs 
      (id, category_id, config_key, config_value, config_type, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, categoryId, configKey, configValue, configType, description).run();
  }

  console.log(`📝 Inserted ${configs.length} configs`);
}
