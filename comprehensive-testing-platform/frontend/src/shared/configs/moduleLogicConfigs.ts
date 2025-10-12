/**
 * 模块逻辑配置文件
 * 包含各测试模块的特定逻辑配置
 * 支持：psychology, career, relationship, learning等所有模块
 * 
 * @example
 * const psychologyLogic = moduleLogicConfigs.psychology;
 * const careerLogic = moduleLogicConfigs.career;
 */

export interface ModuleLogic {
  calculateResults: (answers: Record<string, any>, questions: any[]) => any;
  validateAnswers?: (answers: Record<string, any>, questions: any[]) => boolean;
  processAnswers?: (answers: Record<string, any>) => Record<string, any>;
  generateInsights?: (results: any) => string[];
}

export interface ModuleLogicConfigs {
  [moduleName: string]: {
    [testType: string]: ModuleLogic;
  };
}

export const moduleLogicConfigs: ModuleLogicConfigs = {
  // 心理学测试模块逻辑
  psychology: {
    mbti: {
      calculateResults: (answers, questions) => {
        const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        
        // MBTI计算逻辑 - 使用dimension字段
        Object.entries(answers).forEach(([questionId, answer]) => {
          const question = questions.find(q => q.id === questionId);
          if (question && answer.value !== undefined) {
            // 根据题目维度计算得分
            if (question.dimension === 'E/I') {
              if (answer.value > 3) scores.E++;
              else scores.I++;
            } else if (question.dimension === 'S/N') {
              if (answer.value > 3) scores.S++;
              else scores.N++;
            } else if (question.dimension === 'T/F') {
              if (answer.value > 3) scores.T++;
              else scores.F++;
            } else if (question.dimension === 'J/P') {
              if (answer.value > 3) scores.J++;
              else scores.P++;
            }
          }
        });

        const type = [
          scores.E > scores.I ? 'E' : 'I',
          scores.S > scores.N ? 'S' : 'N',
          scores.T > scores.F ? 'T' : 'F',
          scores.J > scores.P ? 'J' : 'P'
        ].join('');

        return {
          type,
          scores,
          description: `Your MBTI type is ${type}`,
          insights: generateMBTIInsights(type)
        };
      },
      validateAnswers: (answers, questions) => {
        return questions.every(q => answers[q.id]);
      }
    },

    phq9: {
      calculateResults: (answers) => {
        let totalScore = 0;
        Object.values(answers).forEach((answer: any) => {
          if (answer.value !== undefined) {
            totalScore += answer.value;
          }
        });

        let severity = 'Minimal';
        if (totalScore >= 20) severity = 'Severe';
        else if (totalScore >= 15) severity = 'Moderately severe';
        else if (totalScore >= 10) severity = 'Moderate';
        else if (totalScore >= 5) severity = 'Mild';

        return {
          totalScore,
          severity,
          description: `Your PHQ-9 score is ${totalScore}, indicating ${severity.toLowerCase()} depression symptoms.`
        };
      }
    },

    eq: {
      calculateResults: (answers, questions) => {
        let totalScore = 0;
        const maxScore = questions.length * 5;
        
        Object.values(answers).forEach((answer: any) => {
          if (answer.value !== undefined) {
            totalScore += answer.value;
          }
        });

        const percentage = (totalScore / maxScore) * 100;
        let level = 'Average';
        if (percentage >= 80) level = 'High';
        else if (percentage >= 60) level = 'Above Average';
        else if (percentage < 40) level = 'Below Average';

        return {
          totalScore,
          maxScore,
          percentage,
          level,
          description: `Your EQ score is ${totalScore}/${maxScore} (${percentage.toFixed(1)}%), indicating ${level.toLowerCase()} emotional intelligence.`
        };
      }
    },

    happiness: {
      calculateResults: (answers, questions) => {
        let totalScore = 0;
        const maxScore = questions.length * 10; // 统一使用 1-10 分制，与后端处理器保持一致
        
        Object.values(answers).forEach((answer: any) => {
          if (answer.value !== undefined) {
            totalScore += answer.value;
          }
        });

        const percentage = (totalScore / maxScore) * 100;
        let level = 'Moderate';
        if (percentage >= 80) level = 'Very High';
        else if (percentage >= 60) level = 'High';
        else if (percentage < 40) level = 'Low';

        return {
          totalScore,
          maxScore,
          percentage,
          level,
          description: `Your happiness index is ${totalScore}/${maxScore} (${percentage.toFixed(1)}%), indicating ${level.toLowerCase()} happiness level.`
        };
      }
    }
  },

  // 职业测试模块逻辑
  career: {
    holland: {
      calculateResults: (answers, questions) => {
        const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        
        // 霍兰德职业兴趣计算逻辑
        Object.entries(answers).forEach(([questionId, answer]) => {
          const question = questions.find(q => q.id === questionId);
          if (question && answer.value !== undefined) {
            // 根据题目分类计算得分
            if (question.category === 'R') scores.R += answer.value;
            else if (question.category === 'I') scores.I += answer.value;
            else if (question.category === 'A') scores.A += answer.value;
            else if (question.category === 'S') scores.S += answer.value;
            else if (question.category === 'E') scores.E += answer.value;
            else if (question.category === 'C') scores.C += answer.value;
          }
        });

        // 找出得分最高的三个类型
        const sortedTypes = Object.entries(scores)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([type]) => type);

        return {
          scores,
          primaryType: sortedTypes[0],
          secondaryType: sortedTypes[1],
          tertiaryType: sortedTypes[2],
          hollandCode: sortedTypes.join(''),
          description: `Your Holland code is ${sortedTypes.join('')}, indicating interests in ${sortedTypes.join(', ')} areas.`
        };
      }
    },

    disc: {
      calculateResults: (answers, questions) => {
        const scores = { D: 0, I: 0, S: 0, C: 0 };
        
        // DISC性格测试计算逻辑
        Object.entries(answers).forEach(([questionId, answer]) => {
          const question = questions.find(q => q.id === questionId);
          if (question && answer.value !== undefined) {
            if (question.category === 'D') scores.D += answer.value;
            else if (question.category === 'I') scores.I += answer.value;
            else if (question.category === 'S') scores.S += answer.value;
            else if (question.category === 'C') scores.C += answer.value;
          }
        });

        const sortedEntries = Object.entries(scores).sort(([,a], [,b]) => b - a);
        const dominantType = sortedEntries[0]?.[0] || 'Unknown';

        return {
          scores,
          dominantType,
          description: `Your DISC profile shows ${dominantType} as your dominant trait.`
        };
      }
    }
  },

  // 关系测试模块逻辑
  relationship: {
    loveLanguage: {
      calculateResults: (answers, questions) => {
        const scores = { 
          'Words of Affirmation': 0, 
          'Acts of Service': 0, 
          'Receiving Gifts': 0, 
          'Quality Time': 0, 
          'Physical Touch': 0 
        };
        
        // 爱的语言测试计算逻辑
        Object.entries(answers).forEach(([questionId, answer]) => {
          const question = questions.find(q => q.id === questionId);
          if (question && answer.value !== undefined) {
            if (question.category in scores) {
              scores[question.category as keyof typeof scores] += answer.value;
            }
          }
        });

        const sortedEntries = Object.entries(scores).sort(([,a], [,b]) => b - a);
        const primaryLanguage = sortedEntries[0]?.[0] || 'Unknown';

        return {
          scores,
          primaryLanguage,
          description: `Your primary love language is ${primaryLanguage}.`
        };
      }
    }
  }
};

// 生成MBTI洞察的辅助函数
function generateMBTIInsights(type: string): string[] {
  const insights: Record<string, string[]> = {
    'INTJ': ['Strategic thinker', 'Independent', 'Analytical', 'Future-oriented'],
    'INTP': ['Innovative', 'Logical', 'Abstract thinker', 'Problem solver'],
    'ENTJ': ['Natural leader', 'Efficient', 'Strategic', 'Decisive'],
    'ENTP': ['Innovative', 'Quick thinker', 'Adaptable', 'Debater'],
    'INFJ': ['Insightful', 'Creative', 'Idealistic', 'Empathetic'],
    'INFP': ['Creative', 'Idealistic', 'Empathetic', 'Adaptable'],
    'ENFJ': ['Charismatic', 'Reliable', 'Passionate', 'Altruistic'],
    'ENFP': ['Enthusiastic', 'Creative', 'Sociable', 'Independent'],
    'ISTJ': ['Practical', 'Factual', 'Dependable', 'Organized'],
    'ISFJ': ['Supportive', 'Reliable', 'Patient', 'Imaginative'],
    'ESTJ': ['Organized', 'Loyal', 'Practical', 'Decisive'],
    'ESFJ': ['Extraordinarily caring', 'Social', 'Popular', 'Conscientious'],
    'ISTP': ['Bold', 'Practical', 'Experimental', 'Spontaneous'],
    'ISFP': ['Artistic', 'Flexible', 'Charming', 'Sensitive'],
    'ESTP': ['Smart', 'Energetic', 'Perceptive', 'Risk-taker'],
    'ESFP': ['Spontaneous', 'Enthusiastic', 'Friendly', 'Optimistic']
  };

  return insights[type] || ['Individual personality', 'Unique characteristics', 'Personal growth potential'];
}

export default moduleLogicConfigs;
