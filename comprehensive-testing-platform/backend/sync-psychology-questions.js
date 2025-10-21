#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

async function syncPsychologyQuestions() {
  console.log('🔄 Starting psychology questions sync...');
  
  try {
    // 1. 从staging环境导出数据
    console.log('📤 Exporting data from staging...');
    execSync('npx wrangler d1 execute getyourluck-staging --env=staging --remote --command "SELECT * FROM psychology_questions ORDER BY category_id, order_index;" --json > /tmp/psychology_questions_staging.json', { stdio: 'inherit' });
    
    // 2. 读取导出的数据
    const data = JSON.parse(fs.readFileSync('/tmp/psychology_questions_staging.json', 'utf8'));
    const questions = data[0].results;
    
    console.log(`📊 Found ${questions.length} questions to sync`);
    
    // 3. 分批处理数据（每批50条）
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < questions.length; i += batchSize) {
      batches.push(questions.slice(i, i + batchSize));
    }
    
    console.log(`📦 Processing ${batches.length} batches...`);
    
    // 4. 为每个批次创建SQL文件并执行
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`🔄 Processing batch ${i + 1}/${batches.length} (${batch.length} questions)...`);
      
      const sqlContent = generateInsertSQL(batch);
      const filename = `/tmp/psychology_batch_${i + 1}.sql`;
      
      fs.writeFileSync(filename, sqlContent);
      
      // 执行SQL
      try {
        execSync(`npx wrangler d1 execute selfatlas-prod --env=production --remote --file=${filename}`, { stdio: 'inherit' });
        console.log(`✅ Batch ${i + 1} completed`);
      } catch (error) {
        console.error(`❌ Batch ${i + 1} failed:`, error.message);
        // 继续处理下一批
      }
      
      // 清理临时文件
      fs.unlinkSync(filename);
    }
    
    console.log('🎉 Psychology questions sync completed!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

function generateInsertSQL(questions) {
  // 映射category_id从staging格式到生产环境psychology_question_categories表格式
  const categoryMapping = {
    'mbti-category': 'cat_mbti',
    'phq9-category': 'cat_phq9',
    'eq-category': 'cat_eq',
    'happiness-category': 'cat_happiness',
    'holland-category': 'cat_holland',
    'disc-category': 'cat_disc',
    'leadership-category': 'cat_leadership',
    'love-language-category': 'cat_love_language',
    'love-style-category': 'cat_love_style',
    'interpersonal-category': 'cat_interpersonal',
    'vark-category': 'cat_vark'
  };
  
  const values = questions.map(q => {
    const id = q.id.replace(/'/g, "''");
    const categoryId = categoryMapping[q.category_id] || q.category_id.replace(/'/g, "''");
    const questionText = q.question_text.replace(/'/g, "''");
    const questionTextEn = q.question_text_en ? q.question_text_en.replace(/'/g, "''") : null;
    const questionType = q.question_type.replace(/'/g, "''");
    const dimension = q.dimension ? q.dimension.replace(/'/g, "''") : null;
    const domain = q.domain ? q.domain.replace(/'/g, "''") : null;
    
    return `('${id}', '${categoryId}', '${questionText}', ${questionTextEn ? `'${questionTextEn}'` : 'NULL'}, '${questionType}', ${dimension ? `'${dimension}'` : 'NULL'}, ${domain ? `'${domain}'` : 'NULL'}, ${q.weight || 1}, ${q.order_index}, ${q.is_required ? 1 : 0}, ${q.is_active ? 1 : 0}, '${q.created_at}', '${q.updated_at}')`;
  }).join(',\n');
  
  return `INSERT OR REPLACE INTO psychology_questions (
    id, category_id, question_text, question_text_en, question_type, dimension, domain, 
    weight, order_index, is_required, is_active, created_at, updated_at
  ) VALUES 
${values};`;
}

// 运行同步
syncPsychologyQuestions();
