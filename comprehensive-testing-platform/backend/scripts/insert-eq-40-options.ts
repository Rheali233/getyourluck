/**
 * Insert options for 40-question EQ test
 * Each question has 5 Likert scale options
 */

const options = [
  { text: 'Strongly disagree', value: 1, score: 1 },
  { text: 'Disagree', value: 2, score: 2 },
  { text: 'Neutral', value: 3, score: 3 },
  { text: 'Agree', value: 4, score: 4 },
  { text: 'Strongly agree', value: 5, score: 5 },
];

async function insertOptions() {
  console.log('🔄 Inserting options for 40 EQ questions...');
  
  let successCount = 0;
  let totalCount = 0;
  
  for (let q = 1; q <= 40; q++) {
    const questionId = `eq-q-${q}`;
    
    for (let o = 1; o <= 5; o++) {
      const option = options[o - 1];
      const optionId = `${questionId}-opt-${o}`;
      
      const sql = `INSERT INTO psychology_question_options (id, question_id, option_text, option_text_en, option_value, option_score, order_index, is_correct, is_active, created_at) VALUES ('${optionId}', '${questionId}', '${option.text.replace(/'/g, "''")}', '${option.text.replace(/'/g, "''")}', '${option.value}', ${option.score}, ${o}, 0, 1, datetime('now'))`;
      
      try {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        
        await execAsync(`npx wrangler d1 execute selfatlas-local --command="${sql}"`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to insert option ${o} for question ${q}:`, error);
      }
      
      totalCount++;
    }
    
    if (q % 10 === 0) {
      console.log(`✅ Processed ${q}/40 questions...`);
    }
  }
  
  console.log(`🎉 Options insertion completed! Success: ${successCount}/${totalCount}`);
  console.log(`📊 Expected: 200 options (40 questions × 5 options each)`);
}

insertOptions().catch(console.error);
