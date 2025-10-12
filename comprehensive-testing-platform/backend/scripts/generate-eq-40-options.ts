/**
 * Generate complete options SQL for 40-question EQ test
 */

function generateEQ40OptionsSQL(): string {
  let sql = '-- Complete options for 40-question EQ test\n';
  sql += '-- Each question has 5 Likert scale options\n\n';

  for (let questionNum = 1; questionNum <= 40; questionNum++) {
    const questionId = `eq-q-${questionNum}`;
    
    sql += `-- Question ${questionNum}\n`;
    for (let optionNum = 1; optionNum <= 5; optionNum++) {
      const optionText = getOptionText(optionNum);
      const optionValue = optionNum.toString();
      const optionScore = optionNum;
      
      sql += `('${questionId}-opt-${optionNum}', '${questionId}', '${optionText}', '${optionText}', '${optionValue}', ${optionScore}, ${optionNum}, datetime('now'), datetime('now'))`;
      
      if (questionNum === 40 && optionNum === 5) {
        sql += ';';
      } else {
        sql += ',\n';
      }
    }
    sql += '\n\n';
  }

  return sql;
}

function getOptionText(optionNum: number): string {
  const options = [
    'Strongly disagree',
    'Disagree', 
    'Neutral',
    'Agree',
    'Strongly agree'
  ];
  return options[optionNum - 1];
}

// Generate and output the SQL
const sql = generateEQ40OptionsSQL();
console.log(sql);

// Also write to file
import { writeFileSync } from 'fs';
writeFileSync('complete-eq-40-options.sql', sql);
console.log('\n✅ Complete options SQL written to complete-eq-40-options.sql');
