/**
 * Run Relationship Module Data Seeding
 * This script executes the seedRelationshipData function
 */

import { seedRelationshipData } from './seed-relationship-data';

// Mock D1Database for local execution
const mockDB = {
  prepare: (sql: string) => ({
    bind: (...args: any[]) => ({
      run: async () => {
        console.log(`Executing SQL: ${sql}`);
        console.log(`With params:`, args);
        return { success: true };
      }
    })
  })
} as any;

async function main() {
  try {
    console.log('🚀 Starting Relationship Module data seeding...');
    await seedRelationshipData(mockDB);
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
