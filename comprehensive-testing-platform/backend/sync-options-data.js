import { execSync } from 'child_process';
import fs from 'fs';

async function syncOptionsData() {
  console.log('🔄 Starting options data sync...');
  
  try {
    // Export psychology question options from local
    console.log('📤 Exporting psychology question options from local...');
    execSync('npx wrangler d1 execute selfatlas-local --local --command "SELECT * FROM psychology_question_options ORDER BY question_id, order_index;" --json > /tmp/local_psychology_options.json', { stdio: 'inherit' });
    
    // Export VARK options from local
    console.log('📤 Exporting VARK options from local...');
    execSync('npx wrangler d1 execute selfatlas-local --local --command "SELECT * FROM vark_options ORDER BY question_id;" --json > /tmp/local_vark_options.json', { stdio: 'inherit' });
    
    const psychologyOptionsData = JSON.parse(fs.readFileSync('/tmp/local_psychology_options.json', 'utf8'));
    const varkOptionsData = JSON.parse(fs.readFileSync('/tmp/local_vark_options.json', 'utf8'));
    
    const psychologyOptions = psychologyOptionsData[0].results;
    const varkOptions = varkOptionsData[0].results;
    
    console.log(`📊 Found ${psychologyOptions.length} psychology options and ${varkOptions.length} VARK options in local environment`);
    
    // Clear production psychology options
    console.log('🧹 Clearing production psychology options...');
    execSync('CLOUDFLARE_API_TOKEN=5jNvulOMARh__1v7m7V9bkPd-n2-9BplfSrTZim7 npx wrangler d1 execute selfatlas-prod --env=production --remote --command "DELETE FROM psychology_question_options;" --json', { stdio: 'inherit' });
    
    // Clear production VARK options
    console.log('🧹 Clearing production VARK options...');
    execSync('CLOUDFLARE_API_TOKEN=5jNvulOMARh__1v7m7V9bkPd-n2-9BplfSrTZim7 npx wrangler d1 execute selfatlas-prod --env=production --remote --command "DELETE FROM vark_options;" --json', { stdio: 'inherit' });
    
    // Create SQL file for psychology options
    console.log('📝 Creating SQL file for psychology options...');
    let psychologySQL = '';
    for (const option of psychologyOptions) {
      const escapedOptionText = option.option_text.replace(/'/g, "''");
      const escapedOptionTextEn = option.option_text_en ? option.option_text_en.replace(/'/g, "''") : null;
      
      psychologySQL += `INSERT INTO psychology_question_options (id, question_id, option_text, option_text_en, option_value, order_index, is_active, created_at) VALUES ('${option.id}', '${option.question_id}', '${escapedOptionText}', ${escapedOptionTextEn ? `'${escapedOptionTextEn}'` : 'NULL'}, '${option.option_value}', ${option.order_index}, ${option.is_active}, '${option.created_at}');\n`;
    }
    
    fs.writeFileSync('/tmp/production_psychology_options.sql', psychologySQL);
    
    // Create SQL file for VARK options
    console.log('📝 Creating SQL file for VARK options...');
    let varkSQL = '';
    for (const option of varkOptions) {
      const escapedText = option.text.replace(/'/g, "''");
      
      varkSQL += `INSERT INTO vark_options (id, question_id, text, dimension, weight, is_active, created_at) VALUES ('${option.id}', '${option.question_id}', '${escapedText}', '${option.dimension}', ${option.weight}, ${option.is_active}, '${option.created_at}');\n`;
    }
    
    fs.writeFileSync('/tmp/production_vark_options.sql', varkSQL);
    
    // Execute psychology options SQL
    console.log('📥 Inserting psychology options into production...');
    execSync('CLOUDFLARE_API_TOKEN=5jNvulOMARh__1v7m7V9bkPd-n2-9BplfSrTZim7 npx wrangler d1 execute selfatlas-prod --env=production --remote --file /tmp/production_psychology_options.sql --json', { stdio: 'inherit' });
    
    // Execute VARK options SQL
    console.log('📥 Inserting VARK options into production...');
    execSync('CLOUDFLARE_API_TOKEN=5jNvulOMARh__1v7m7V9bkPd-n2-9BplfSrTZim7 npx wrangler d1 execute selfatlas-prod --env=production --remote --file /tmp/production_vark_options.sql --json', { stdio: 'inherit' });
    
    console.log('✅ Options data sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

syncOptionsData();
