#!/usr/bin/env node

/**
 * 测试会话种子数据脚本
 * 用于向test_sessions表插入基础测试会话数据
 */

interface TestSessionData {
  id: string;
  testTypeId: string;
  userId: string;
  status: string;
  startTime: string;
  endTime?: string;
  resultData?: any;
  metadata?: any;
}

class TestSessionSeeder {
  /**
   * 执行SQL语句到本地D1数据库
   */
  private async executeLocalSQL(sql: string): Promise<void> {
    try {
      const cleanSql = sql.replace(/\s+/g, ' ').trim();
      const command = `wrangler d1 execute selfatlas-local --local --command "${cleanSql}"`;
      console.log(`执行SQL: ${cleanSql.substring(0, 80)}...`);
      
      // 使用动态导入避免类型错误
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
   * 创建测试会话数据
   */
  private async createTestSessions(): Promise<void> {
    const testSessions: TestSessionData[] = [
      {
        id: 'session-mbti-001',
        testTypeId: 'mbti',
        userId: 'user-001',
        status: 'completed',
        startTime: '2025-08-30 02:00:00',
        endTime: '2025-08-30 02:15:00',
        resultData: {
          scores: {
            'E/I': 3,
            'S/N': 2,
            'T/F': 4,
            'J/P': 1
          },
          interpretation: 'ENFP - The Campaigner',
          recommendations: [
            'Focus on developing your planning and organization skills',
            'Consider careers in counseling, teaching, or creative fields'
          ]
        },
        metadata: {
          device: 'desktop',
          browser: 'chrome',
          timeSpent: 900
        }
      },
      {
        id: 'session-phq9-001',
        testTypeId: 'phq9',
        userId: 'user-002',
        status: 'completed',
        startTime: '2025-08-30 01:30:00',
        endTime: '2025-08-30 01:40:00',
        resultData: {
          scores: {
            total: 7,
            interpretation: 'mild',
            severity: 'mild'
          },
          recommendations: [
            'Consider talking to a mental health professional',
            'Practice stress management techniques',
            'Maintain regular sleep and exercise routines'
          ]
        },
        metadata: {
          device: 'mobile',
          browser: 'safari',
          timeSpent: 600
        }
      },
      {
        id: 'session-eq-001',
        testTypeId: 'eq',
        userId: 'user-003',
        status: 'completed',
        startTime: '2025-08-30 00:45:00',
        endTime: '2025-08-30 01:05:00',
        resultData: {
          scores: {
            self_awareness: 18,
            self_regulation: 16,
            motivation: 19,
            empathy: 17,
            social_skills: 18
          },
          interpretation: 'High emotional intelligence',
          recommendations: [
            'Continue developing your empathy skills',
            'Focus on stress management techniques'
          ]
        },
        metadata: {
          device: 'desktop',
          browser: 'firefox',
          timeSpent: 1200
        }
      },
      {
        id: 'session-happiness-001',
        testTypeId: 'happiness',
        userId: 'user-004',
        status: 'completed',
        startTime: '2025-08-29 23:30:00',
        endTime: '2025-08-29 23:35:00',
        resultData: {
          scores: {
            work: 4,
            relationships: 5,
            health: 4,
            personal_growth: 4,
            life_balance: 4
          },
          interpretation: 'Good overall life satisfaction',
          recommendations: [
            'Focus on work-life balance',
            'Continue nurturing your relationships'
          ]
        },
        metadata: {
          device: 'mobile',
          browser: 'chrome',
          timeSpent: 300
        }
      },
      {
        id: 'session-holland-001',
        testTypeId: 'holland',
        userId: 'user-005',
        status: 'completed',
        startTime: '2025-08-29 22:00:00',
        endTime: '2025-08-29 22:20:00',
        resultData: {
          scores: {
            realistic: 45,
            investigative: 52,
            artistic: 38,
            social: 48,
            enterprising: 35,
            conventional: 42
          },
          interpretation: 'Investigative-Social type',
          recommendations: [
            'Consider careers in research, education, or healthcare',
            'Focus on developing your artistic and enterprising skills'
          ]
        },
        metadata: {
          device: 'desktop',
          browser: 'edge',
          timeSpent: 1200
        }
      },
      {
        id: 'session-mbti-002',
        testTypeId: 'mbti',
        userId: 'user-006',
        status: 'in_progress',
        startTime: '2025-08-30 03:00:00',
        resultData: {
          progress: 12,
          currentQuestion: 13
        },
        metadata: {
          device: 'tablet',
          browser: 'safari',
          timeSpent: 720
        }
      },
      {
        id: 'session-phq9-002',
        testTypeId: 'phq9',
        userId: 'user-007',
        status: 'abandoned',
        startTime: '2025-08-29 21:00:00',
        resultData: {
          progress: 3,
          reason: 'user_interruption'
        },
        metadata: {
          device: 'mobile',
          browser: 'chrome',
          timeSpent: 180
        }
      }
    ];

    for (const session of testSessions) {
      // 转义JSON字符串中的特殊字符
      const resultDataStr = JSON.stringify(session.resultData || {})
        .replace(/'/g, "''")
        .replace(/"/g, '""')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
      
      const metadataStr = JSON.stringify(session.metadata || {})
        .replace(/'/g, "''")
        .replace(/"/g, '""')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');

      const sql = `
        INSERT OR REPLACE INTO test_sessions (
          id, test_type_id, answers_data, result_data, user_agent, ip_address_hash, session_duration, created_at
        ) VALUES (
          '${session.id}',
          '${session.testTypeId}',
          '{"progress": ${session.resultData?.progress || 0}}',
          '{"score": 85, "status": "completed"}',
          '${session.metadata?.browser || 'chrome'}',
          'hash-${session.userId}',
          ${session.metadata?.timeSpent || 0},
          '${session.startTime}'
        );
      `;

      await this.executeLocalSQL(sql);
    }

    console.log(`✅ 成功创建 ${testSessions.length} 个测试会话`);
  }

  /**
   * 执行所有种子数据插入
   */
  async seedAll(): Promise<void> {
    console.log('🌱 开始执行测试会话种子数据插入...\n');

    try {
      await this.createTestSessions();
      console.log('\n🎉 所有测试会话种子数据插入完成！');
    } catch (error: any) {
      console.error(`❌ 种子数据插入失败: ${error.message}`);
      process.exit(1);
    }
  }
}

// 主函数
async function main() {
  const seeder = new TestSessionSeeder();
  await seeder.seedAll();
}

// 如果直接运行此脚本
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

export { TestSessionSeeder };
