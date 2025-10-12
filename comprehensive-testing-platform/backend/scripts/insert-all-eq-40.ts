/**
 * Insert all 40 EQ questions into database
 */

const questions = [
  // Self-Awareness (1-10)
  { id: 'eq-q-1', text: 'I can accurately perceive my emotions in different situations', dimension: 'self_awareness', order: 1, weight: 1 },
  { id: 'eq-q-2', text: 'I can clearly express my strengths and weaknesses', dimension: 'self_awareness', order: 2, weight: 1 },
  { id: 'eq-q-3', text: 'I consider my values before making decisions', dimension: 'self_awareness', order: 3, weight: 1 },
  { id: 'eq-q-4', text: 'I can distinguish between feelings of stress and anxiety', dimension: 'self_awareness', order: 4, weight: 1 },
  { id: 'eq-q-5', text: 'I can detect when I am becoming emotional', dimension: 'self_awareness', order: 5, weight: 1 },
  { id: 'eq-q-6', text: 'I sometimes feel confused about what I truly want', dimension: 'self_awareness', order: 6, weight: -1 },
  { id: 'eq-q-7', text: 'I can identify the specific emotions I am experiencing', dimension: 'self_awareness', order: 7, weight: 1 },
  { id: 'eq-q-8', text: 'I understand how my emotions affect my behavior', dimension: 'self_awareness', order: 8, weight: 1 },
  { id: 'eq-q-9', text: 'I can recognize my emotional triggers', dimension: 'self_awareness', order: 9, weight: 1 },
  { id: 'eq-q-10', text: 'I am aware of my emotional patterns over time', dimension: 'self_awareness', order: 10, weight: 1 },

  // Self-Management (11-20)
  { id: 'eq-q-11', text: 'I can control my emotions even in stressful situations', dimension: 'self_management', order: 11, weight: 1 },
  { id: 'eq-q-12', text: 'I can stay calm when facing criticism or conflict', dimension: 'self_management', order: 12, weight: 1 },
  { id: 'eq-q-13', text: 'I can delay gratification to achieve long-term goals', dimension: 'self_management', order: 13, weight: 1 },
  { id: 'eq-q-14', text: 'I can adapt my behavior to different situations', dimension: 'self_management', order: 14, weight: 1 },
  { id: 'eq-q-15', text: 'I maintain a positive attitude even when things go wrong', dimension: 'self_management', order: 15, weight: 1 },
  { id: 'eq-q-16', text: 'I often lose control of my emotions', dimension: 'self_management', order: 16, weight: -1 },
  { id: 'eq-q-17', text: 'I can motivate myself to complete difficult tasks', dimension: 'self_management', order: 17, weight: 1 },
  { id: 'eq-q-18', text: 'I can bounce back quickly from setbacks', dimension: 'self_management', order: 18, weight: 1 },
  { id: 'eq-q-19', text: 'I can manage my time effectively to achieve goals', dimension: 'self_management', order: 19, weight: 1 },
  { id: 'eq-q-20', text: 'I can stay focused on important tasks despite distractions', dimension: 'self_management', order: 20, weight: 1 },

  // Social Awareness (21-30)
  { id: 'eq-q-21', text: 'I can sense how others are feeling by observing their body language', dimension: 'social_awareness', order: 21, weight: 1 },
  { id: 'eq-q-22', text: 'I can understand different perspectives in a conflict', dimension: 'social_awareness', order: 22, weight: 1 },
  { id: 'eq-q-23', text: 'I can recognize when someone needs emotional support', dimension: 'social_awareness', order: 23, weight: 1 },
  { id: 'eq-q-24', text: 'I can sense the mood of a group or team', dimension: 'social_awareness', order: 24, weight: 1 },
  { id: 'eq-q-25', text: 'I can understand cultural differences in emotional expression', dimension: 'social_awareness', order: 25, weight: 1 },
  { id: 'eq-q-26', text: 'I often miss social cues from others', dimension: 'social_awareness', order: 26, weight: -1 },
  { id: 'eq-q-27', text: 'I can identify the emotions behind someone\'s words', dimension: 'social_awareness', order: 27, weight: 1 },
  { id: 'eq-q-28', text: 'I can sense when someone is uncomfortable or upset', dimension: 'social_awareness', order: 28, weight: 1 },
  { id: 'eq-q-29', text: 'I can understand the impact of my words on others', dimension: 'social_awareness', order: 29, weight: 1 },
  { id: 'eq-q-30', text: 'I can recognize power dynamics in social situations', dimension: 'social_awareness', order: 30, weight: 1 },

  // Relationship Management (31-40)
  { id: 'eq-q-31', text: 'I can build rapport with people from different backgrounds', dimension: 'relationship_management', order: 31, weight: 1 },
  { id: 'eq-q-32', text: 'I can resolve conflicts between team members', dimension: 'relationship_management', order: 32, weight: 1 },
  { id: 'eq-q-33', text: 'I can give constructive feedback without causing offense', dimension: 'relationship_management', order: 33, weight: 1 },
  { id: 'eq-q-34', text: 'I can inspire and motivate others to achieve common goals', dimension: 'relationship_management', order: 34, weight: 1 },
  { id: 'eq-q-35', text: 'I can work effectively in diverse teams', dimension: 'relationship_management', order: 35, weight: 1 },
  { id: 'eq-q-36', text: 'I find it difficult to influence or persuade others', dimension: 'relationship_management', order: 36, weight: -1 },
  { id: 'eq-q-37', text: 'I can adapt my communication style to different audiences', dimension: 'relationship_management', order: 37, weight: 1 },
  { id: 'eq-q-38', text: 'I can build and maintain professional networks', dimension: 'relationship_management', order: 38, weight: 1 },
  { id: 'eq-q-39', text: 'I can facilitate group discussions and decision-making', dimension: 'relationship_management', order: 39, weight: 1 },
  { id: 'eq-q-40', text: 'I can create a positive and inclusive team environment', dimension: 'relationship_management', order: 40, weight: 1 }
];

async function insertQuestions() {
  console.log('🔄 Inserting 40 EQ questions...');
  
  for (const q of questions) {
    const sql = `INSERT INTO psychology_questions (id, category_id, question_text, question_text_en, question_type, dimension, order_index, weight, is_required, is_active, created_at, updated_at) VALUES ('${q.id}', 'eq-category', '${q.text.replace(/'/g, "''")}', '${q.text.replace(/'/g, "''")}', 'likert_scale', '${q.dimension}', ${q.order}, ${q.weight}, 1, 1, datetime('now'), datetime('now'))`;
    
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      await execAsync(`npx wrangler d1 execute selfatlas-local --command="${sql}"`);
      console.log(`✅ Inserted question ${q.order}: ${q.text.substring(0, 50)}...`);
    } catch (error) {
      console.error(`❌ Failed to insert question ${q.order}:`, error);
    }
  }
  
  console.log('🎉 All 40 EQ questions inserted successfully!');
}

insertQuestions().catch(console.error);
