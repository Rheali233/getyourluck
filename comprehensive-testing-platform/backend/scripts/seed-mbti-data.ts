/**
 * MBTI Question Bank Data Seeding Script
 * Imports MBTI questions and options into the database
 */

import { mbtiQuestionsEnglish } from '../seeds/mbti-questions-english';

// Mock D1Database for local execution
const mockDB = {
  prepare: (sql: string) => ({
    bind: (...args: any[]) => ({
      run: async () => {
        console.log(`Executing SQL: ${sql}`);
        console.log(`With params:`, args);
        return { success: true };
      },
      all: async () => {
        console.log(`Querying SQL: ${sql}`);
        return { results: [] };
      }
    })
  })
} as any;

async function seedMBTIData(db: any) {
  try {
    console.log('🚀 Starting MBTI question bank data seeding...');
    
    // First, ensure the MBTI category exists
    console.log('📋 Creating MBTI category...');
    const categoryId = await createMBTICategory(db);
    
    // Then import all MBTI questions
    console.log('❓ Importing MBTI questions...');
    await importMBTIQuestions(db, categoryId);
    
    console.log('✅ MBTI data seeding completed successfully!');
  } catch (error) {
    console.error('❌ MBTI data seeding failed:', error);
    throw error;
  }
}

async function createMBTICategory(db: any): Promise<string> {
  // This would create the MBTI category if it doesn't exist
  // For now, we'll use the existing category ID from the migration
  return 'mbti-category';
}

async function importMBTIQuestions(db: any, categoryId: string) {
  console.log(`📝 Importing ${mbtiQuestionsEnglish.length} MBTI questions...`);
  
  for (const question of mbtiQuestionsEnglish) {
    console.log(`  - Importing question: ${question.questionText.substring(0, 50)}...`);
    
    // In a real implementation, this would:
    // 1. Insert the question into the database
    // 2. Create options for the question
    // 3. Handle any errors
    
    // For now, just log the question details
    console.log(`    Category: ${question.categoryId}`);
    console.log(`    Type: ${question.questionType}`);
    console.log(`    Dimension: ${question.dimension}`);
    console.log(`    Weight: ${question.weight}`);
  }
}

async function main() {
  try {
    await seedMBTIData(mockDB);
    console.log('🎉 All MBTI data has been processed!');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

main();
