/**
 * Generate SQL script for all question options
 * This script will create options for all 90 questions
 */

const categories = [
  { id: 'love-style-category', prefix: 'ls', questionCount: 30 },
  { id: 'love-language-category', prefix: 'll', questionCount: 30 },
  { id: 'interpersonal-category', prefix: 'ip', questionCount: 30 }
];

const options = [
  { number: 1, text: 'Strongly Disagree', value: '1', score: 1, description: 'Completely does not match my situation' },
  { number: 2, text: 'Disagree', value: '2', score: 2, description: 'Mostly does not match my situation' },
  { number: 3, text: 'Neutral', value: '3', score: 3, description: 'Partially matches my situation' },
  { number: 4, text: 'Agree', value: '4', score: 4, description: 'Mostly matches my situation' },
  { number: 5, text: 'Strongly Agree', value: '5', score: 5, description: 'Completely matches my situation' }
];

let sql = '';

categories.forEach(category => {
  for (let i = 1; i <= category.questionCount; i++) {
    const questionId = `${category.id}-q${i}`;
    
    options.forEach(option => {
      const optionId = `${category.prefix}-q${i}-opt-${option.number}`;
      sql += `('${optionId}', '${questionId}', '${option.text}', '${option.value}', ${option.score}, '${option.description}', ${option.number}, 0),\n`;
    });
  }
});

// Remove the last comma and newline
sql = sql.slice(0, -2);

console.log('INSERT OR IGNORE INTO psychology_question_options (id, question_id, option_text, option_value, option_score, option_description, order_index, is_correct) VALUES');
console.log(sql + ';');
