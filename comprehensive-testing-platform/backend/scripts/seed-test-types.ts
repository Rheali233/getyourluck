#!/usr/bin/env node

/**
 * 测试类型种子数据脚本
 * 用于向test_types表插入基础测试类型数据
 */

interface TestTypeData {
  id: string;
  name: string;
  category: string;
  description: string;
  config: any;
  isActive: boolean;
  sortOrder: number;
}

class TestTypeSeeder {
  /**
   * 执行SQL语句到本地D1数据库
   */
  private async executeLocalSQL(sql: string): Promise<void> {
    try {
      const cleanSql = sql.replace(/\s+/g, ' ').trim();
      const command = `wrangler d1 execute selfatlas-local --local --command "${cleanSql}"`;
      console.log(`执行SQL: ${cleanSql.substring(0, 80)}...`);
      
      const { execSync } = await import('child_process');
      execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
    } catch (error: any) {
      console.error(`SQL执行失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 创建测试类型数据
   */
  private async createTestTypes(): Promise<void> {
    const testTypes: TestTypeData[] = [
      {
        id: 'mbti',
        name: 'MBTI Personality Test',
        category: 'psychology',
        description: 'Myers-Briggs Type Indicator personality assessment',
        config: {
          questions: [],
          scoringType: 'binary',
          scoringRules: {
            dimensions: ['E/I', 'S/N', 'T/F', 'J/P'],
            scoringMethod: 'dimension_based'
          },
          resultTemplates: {
            type: 'personality_type',
            format: 'mbti_16_types'
          },
          timeLimit: 900, // 15 minutes
          questionCount: 20
        },
        isActive: true,
        sortOrder: 1
      },
      {
        id: 'phq9',
        name: 'PHQ-9 Depression Screening',
        category: 'psychology',
        description: '9-item depression screening questionnaire',
        config: {
          questions: [],
          scoringType: 'likert',
          scoringRules: {
            scale: [0, 1, 2, 3],
            interpretation: {
              '0-4': 'minimal',
              '5-9': 'mild',
              '10-14': 'moderate',
              '15-19': 'moderately_severe',
              '20-27': 'severe'
            }
          },
          resultTemplates: {
            type: 'screening_result',
            format: 'severity_level'
          },
          timeLimit: 600, // 10 minutes
          questionCount: 9
        },
        isActive: true,
        sortOrder: 2
      },
      {
        id: 'eq',
        name: 'Emotional Intelligence Test',
        category: 'psychology',
        description: 'Assessment of emotional intelligence across five dimensions',
        config: {
          questions: [],
          scoringType: 'likert',
          scoringRules: {
            dimensions: ['self_awareness', 'self_regulation', 'motivation', 'empathy', 'social_skills'],
            scoringMethod: 'dimension_average'
          },
          resultTemplates: {
            type: 'dimension_profile',
            format: 'eq_dimensions'
          },
          timeLimit: 1200, // 20 minutes
          questionCount: 40
        },
        isActive: true,
        sortOrder: 3
      },
      {
        id: 'happiness',
        name: 'Happiness Index Assessment',
        category: 'psychology',
        description: 'Subjective well-being and life satisfaction assessment',
        config: {
          questions: [],
          scoringType: 'likert',
          scoringRules: {
            dimensions: ['work', 'relationships', 'health', 'personal_growth', 'life_balance'],
            scoringMethod: 'dimension_sum'
          },
          resultTemplates: {
            type: 'wellness_profile',
            format: 'happiness_dimensions'
          },
          timeLimit: 300, // 5 minutes
          questionCount: 5
        },
        isActive: true,
        sortOrder: 4
      },
      {
        id: 'holland',
        name: 'Holland Career Interest Test',
        category: 'career',
        description: 'RIASEC career interest assessment',
        config: {
          questions: [],
          scoringType: 'likert',
          scoringRules: {
            dimensions: ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'],
            scoringMethod: 'dimension_sum'
          },
          resultTemplates: {
            type: 'career_profile',
            format: 'holland_riasec'
          },
          timeLimit: 1200, // 20 minutes
          questionCount: 30
        },
        isActive: true,
        sortOrder: 5
      },
      {
        id: 'disc',
        name: 'DISC Behavioral Style Test',
        category: 'career',
        description: 'DISC behavioral style assessment',
        config: {
          questions: [],
          scoringType: 'likert',
          scoringRules: {
            dimensions: ['dominance', 'influence', 'steadiness', 'conscientiousness'],
            scoringMethod: 'dimension_sum'
          },
          resultTemplates: {
            type: 'behavioral_profile',
            format: 'disc_styles'
          },
          timeLimit: 900, // 15 minutes
          questionCount: 30
        },
        isActive: true,
        sortOrder: 6
      },
      {
        id: 'leadership',
        name: 'Leadership Assessment Test',
        category: 'career',
        description: 'Multi-dimensional leadership assessment',
        config: {
          questions: [],
          scoringType: 'likert',
          scoringRules: {
            dimensions: ['vision', 'influence', 'execution', 'team_dynamics', 'adaptability'],
            scoringMethod: 'dimension_average'
          },
          resultTemplates: {
            type: 'leadership_profile',
            format: 'leadership_dimensions'
          },
          timeLimit: 1500, // 25 minutes
          questionCount: 30
        },
        isActive: true,
        sortOrder: 7
      },
      {
        id: 'love_language',
        name: 'Love Language Test',
        category: 'relationship',
        description: 'Assessment of how you prefer to give and receive love',
        config: {
          questions: [],
          scoringType: 'likert',
          scoringRules: {
            dimensions: ['words_of_affirmation', 'quality_time', 'receiving_gifts', 'acts_of_service', 'physical_touch'],
            scoringMethod: 'dimension_sum'
          },
          resultTemplates: {
            type: 'relationship_profile',
            format: 'love_languages'
          },
          timeLimit: 900, // 15 minutes
          questionCount: 30
        },
        isActive: true,
        sortOrder: 8
      },
      {
        id: 'love_style',
        name: 'Love Style Assessment',
        category: 'relationship',
        description: 'Assessment of romantic relationship styles',
        config: {
          questions: [],
          scoringType: 'likert',
          scoringRules: {
            dimensions: ['eros', 'ludus', 'storge', 'pragma', 'mania', 'agape'],
            scoringMethod: 'dimension_sum'
          },
          resultTemplates: {
            type: 'relationship_profile',
            format: 'love_styles'
          },
          timeLimit: 900, // 15 minutes
          questionCount: 30
        },
        isActive: true,
        sortOrder: 9
      },
      {
        id: 'interpersonal',
        name: 'Interpersonal Skills Assessment',
        category: 'relationship',
        description: 'Assessment of interpersonal communication and relationship skills',
        config: {
          questions: [],
          scoringType: 'likert',
          scoringRules: {
            dimensions: ['communication_skills', 'empathy', 'conflict_resolution', 'trust_building', 'social_skills'],
            scoringMethod: 'dimension_average'
          },
          resultTemplates: {
            type: 'skills_profile',
            format: 'interpersonal_dimensions'
          },
          timeLimit: 900, // 15 minutes
          questionCount: 30
        },
        isActive: true,
        sortOrder: 10
      }
    ];

    for (const testType of testTypes) {
      const sql = `
        INSERT OR REPLACE INTO test_types (
          id, name, category, description, config_data,
          is_active, sort_order, created_at, updated_at
        ) VALUES (
          '${testType.id}',
          '${testType.name.replace(/'/g, "''")}',
          '${testType.category}',
          '${testType.description.replace(/'/g, "''")}',
          '${JSON.stringify(testType.config).replace(/'/g, "''")}',
          ${testType.isActive ? 1 : 0},
          ${testType.sortOrder},
          datetime('now'),
          datetime('now')
        );
      `;

      await this.executeLocalSQL(sql);
    }

    console.log(`✅ 成功创建 ${testTypes.length} 个测试类型`);
  }

  /**
   * 执行所有种子数据插入
   */
  async seedAll(): Promise<void> {
    console.log('🌱 开始执行测试类型种子数据插入...\n');

    try {
      await this.createTestTypes();
      console.log('\n🎉 所有测试类型种子数据插入完成！');
    } catch (error: any) {
      console.error(`❌ 种子数据插入失败: ${error.message}`);
      process.exit(1);
    }
  }
}

// 主函数
async function main() {
  const seeder = new TestTypeSeeder();
  await seeder.seedAll();
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error);
}

export { TestTypeSeeder };
