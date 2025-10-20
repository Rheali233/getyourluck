#!/usr/bin/env node

/**
 * 分阶段数据同步脚本
 * 每个模块同步后立即校验，确保数据正确才继续下一个模块
 */

import { execSync } from 'child_process';

const STAGING_API_BASE = 'https://selfatlas-backend-staging.cyberlina.workers.dev';

interface SyncResult {
  success: boolean;
  count: number;
  error?: string;
}

class StagedDataSync {
  private results = {
    testTypes: null as SyncResult | null,
    psychologyQuestions: null as SyncResult | null,
    psychologyOptions: null as SyncResult | null,
    tarotCards: null as SyncResult | null
  };

  /**
   * 调用Staging API
   */
  private async callStagingAPI(endpoint: string, method: string = 'GET', data?: any) {
    const url = `${STAGING_API_BASE}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${result.message || 'Unknown error'}`);
      }
      
      return result;
    } catch (error) {
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  /**
   * 获取本地数据
   */
  private async getLocalData(table: string, query?: string) {
    const sql = query || `SELECT * FROM ${table}`;
    const command = `npx wrangler d1 execute selfatlas-local --local --command "${sql}"`;
    
    try {
      const result = execSync(command, { 
        encoding: 'utf8',
        cwd: '/Users/meowz/project/Web/getyourluck/comprehensive-testing-platform/backend'
      });
      
      const data = JSON.parse(result);
      return data[0]?.results || [];
    } catch (error) {
      throw new Error(`Failed to get local data from ${table}: ${error.message}`);
    }
  }

  /**
   * 获取Staging数据
   */
  private async getStagingData(table: string, query?: string) {
    const sql = query || `SELECT * FROM ${table}`;
    const command = `npx wrangler d1 execute getyourluck-staging --remote --command "${sql}"`;
    
    try {
      const result = execSync(command, { 
        encoding: 'utf8',
        cwd: '/Users/meowz/project/Web/getyourluck/comprehensive-testing-platform/backend'
      });
      
      const data = JSON.parse(result);
      return data[0]?.results || [];
    } catch (error) {
      throw new Error(`Failed to get staging data from ${table}: ${error.message}`);
    }
  }

  /**
   * 获取数据数量
   */
  private async getDataCount(table: string, isLocal: boolean = true) {
    const sql = `SELECT COUNT(*) as count FROM ${table}`;
    const data = isLocal ? 
      await this.getLocalData(table, sql) : 
      await this.getStagingData(table, sql);
    
    return data[0]?.count || 0;
  }

  /**
   * 阶段1：同步测试类型配置
   */
  async syncTestTypes(): Promise<SyncResult> {
    console.log('🚀 开始同步测试类型配置...');
    
    try {
      // 1. 获取本地数据
      const localTypes = await this.getLocalData('test_types');
      console.log(`📊 本地测试类型: ${localTypes.length} 条`);
      
      // 2. 获取Staging现有数据
      const stagingTypes = await this.getStagingData('test_types');
      console.log(`📊 Staging测试类型: ${stagingTypes.length} 条`);
      
      // 3. 找出需要同步的数据
      const existingIds = new Set(stagingTypes.map(t => t.id));
      const missingTypes = localTypes.filter(t => !existingIds.has(t.id));
      
      console.log(`📤 需要同步: ${missingTypes.length} 条`);
      
      if (missingTypes.length === 0) {
        console.log('✅ 测试类型配置已是最新');
        return { success: true, count: stagingTypes.length };
      }
      
      // 4. 同步数据
      let syncedCount = 0;
      for (const type of missingTypes) {
        try {
          await this.callStagingAPI('/api/test-types', 'POST', type);
          syncedCount++;
          console.log(`  ✓ 同步测试类型: ${type.id}`);
        } catch (error) {
          console.warn(`  ⚠️ 跳过测试类型 ${type.id}: ${error.message}`);
        }
      }
      
      console.log(`📤 已同步 ${syncedCount} 条测试类型配置`);
      
      // 5. 校验
      const validationResult = await this.validateTestTypes();
      
      if (validationResult.success) {
        console.log('✅ 测试类型配置校验通过');
        return { success: true, count: validationResult.count };
      } else {
        throw new Error(`校验失败: ${validationResult.error}`);
      }
      
    } catch (error) {
      console.error('❌ 测试类型配置同步失败:', error.message);
      return { success: false, count: 0, error: error.message };
    }
  }

  /**
   * 校验测试类型配置
   */
  async validateTestTypes(): Promise<SyncResult> {
    console.log('🔍 校验测试类型配置...');
    
    try {
      const localCount = await this.getDataCount('test_types', true);
      const stagingCount = await this.getDataCount('test_types', false);
      
      if (stagingCount !== localCount) {
        return {
          success: false,
          count: stagingCount,
          error: `数量不匹配: 本地${localCount}条，Staging${stagingCount}条`
        };
      }
      
      console.log(`✅ 测试类型配置校验通过: ${stagingCount}条`);
      return { success: true, count: stagingCount };
      
    } catch (error) {
      return {
        success: false,
        count: 0,
        error: `校验过程出错: ${error.message}`
      };
    }
  }

  /**
   * 阶段2：同步心理测试题目
   */
  async syncPsychologyQuestions(): Promise<SyncResult> {
    console.log('🚀 开始同步心理测试题目...');
    
    try {
      // 1. 获取本地数据
      const localQuestions = await this.getLocalData('psychology_questions');
      console.log(`📊 本地心理测试题目: ${localQuestions.length} 条`);
      
      // 2. 获取Staging现有数据
      const stagingQuestions = await this.getStagingData('psychology_questions');
      console.log(`📊 Staging心理测试题目: ${stagingQuestions.length} 条`);
      
      // 3. 找出需要同步的数据
      const existingIds = new Set(stagingQuestions.map(q => q.id));
      const missingQuestions = localQuestions.filter(q => !existingIds.has(q.id));
      
      console.log(`📤 需要同步: ${missingQuestions.length} 条`);
      
      if (missingQuestions.length === 0) {
        console.log('✅ 心理测试题目已是最新');
        return { success: true, count: stagingQuestions.length };
      }
      
      // 4. 同步数据
      let syncedCount = 0;
      for (const question of missingQuestions) {
        try {
          await this.callStagingAPI('/api/psychology/questions', 'POST', question);
          syncedCount++;
          console.log(`  ✓ 同步题目: ${question.id}`);
        } catch (error) {
          console.warn(`  ⚠️ 跳过题目 ${question.id}: ${error.message}`);
        }
      }
      
      console.log(`📤 已同步 ${syncedCount} 条心理测试题目`);
      
      // 5. 校验
      const validationResult = await this.validatePsychologyQuestions();
      
      if (validationResult.success) {
        console.log('✅ 心理测试题目校验通过');
        return { success: true, count: validationResult.count };
      } else {
        throw new Error(`校验失败: ${validationResult.error}`);
      }
      
    } catch (error) {
      console.error('❌ 心理测试题目同步失败:', error.message);
      return { success: false, count: 0, error: error.message };
    }
  }

  /**
   * 校验心理测试题目
   */
  async validatePsychologyQuestions(): Promise<SyncResult> {
    console.log('🔍 校验心理测试题目...');
    
    try {
      const localCount = await this.getDataCount('psychology_questions', true);
      const stagingCount = await this.getDataCount('psychology_questions', false);
      
      if (stagingCount !== localCount) {
        return {
          success: false,
          count: stagingCount,
          error: `数量不匹配: 本地${localCount}条，Staging${stagingCount}条`
        };
      }
      
      console.log(`✅ 心理测试题目校验通过: ${stagingCount}条`);
      return { success: true, count: stagingCount };
      
    } catch (error) {
      return {
        success: false,
        count: 0,
        error: `校验过程出错: ${error.message}`
      };
    }
  }

  /**
   * 阶段3：同步心理测试选项
   */
  async syncPsychologyOptions(): Promise<SyncResult> {
    console.log('🚀 开始同步心理测试选项...');
    
    try {
      // 1. 确保题目已同步
      if (!this.results.psychologyQuestions?.success) {
        throw new Error('心理测试题目未同步完成，无法同步选项');
      }
      
      // 2. 获取本地数据
      const localOptions = await this.getLocalData('psychology_question_options');
      console.log(`📊 本地心理测试选项: ${localOptions.length} 条`);
      
      // 3. 获取Staging现有数据
      const stagingOptions = await this.getStagingData('psychology_question_options');
      console.log(`📊 Staging心理测试选项: ${stagingOptions.length} 条`);
      
      // 4. 按题目分组
      const optionsByQuestion = this.groupBy(localOptions, 'question_id');
      console.log(`📊 涉及题目: ${Object.keys(optionsByQuestion).length} 个`);
      
      // 5. 同步数据
      let syncedCount = 0;
      for (const [questionId, options] of Object.entries(optionsByQuestion)) {
        try {
          // 检查题目是否存在
          const questionExists = await this.checkQuestionExists(questionId);
          if (!questionExists) {
            console.warn(`  ⚠️ 跳过题目 ${questionId} 的选项，题目不存在`);
            continue;
          }
          
          // 批量插入选项
          await this.callStagingAPI('/api/psychology/options/batch', 'POST', {
            question_id: questionId,
            options: options
          });
          
          syncedCount += options.length;
          console.log(`  ✓ 同步题目 ${questionId} 的 ${options.length} 个选项`);
        } catch (error) {
          console.warn(`  ⚠️ 跳过题目 ${questionId} 的选项: ${error.message}`);
        }
      }
      
      console.log(`📤 已同步 ${syncedCount} 条心理测试选项`);
      
      // 6. 校验
      const validationResult = await this.validatePsychologyOptions();
      
      if (validationResult.success) {
        console.log('✅ 心理测试选项校验通过');
        return { success: true, count: validationResult.count };
      } else {
        throw new Error(`校验失败: ${validationResult.error}`);
      }
      
    } catch (error) {
      console.error('❌ 心理测试选项同步失败:', error.message);
      return { success: false, count: 0, error: error.message };
    }
  }

  /**
   * 校验心理测试选项
   */
  async validatePsychologyOptions(): Promise<SyncResult> {
    console.log('🔍 校验心理测试选项...');
    
    try {
      const localCount = await this.getDataCount('psychology_question_options', true);
      const stagingCount = await this.getDataCount('psychology_question_options', false);
      
      if (stagingCount !== localCount) {
        return {
          success: false,
          count: stagingCount,
          error: `数量不匹配: 本地${localCount}条，Staging${stagingCount}条`
        };
      }
      
      console.log(`✅ 心理测试选项校验通过: ${stagingCount}条`);
      return { success: true, count: stagingCount };
      
    } catch (error) {
      return {
        success: false,
        count: 0,
        error: `校验过程出错: ${error.message}`
      };
    }
  }

  /**
   * 检查题目是否存在
   */
  private async checkQuestionExists(questionId: string): Promise<boolean> {
    try {
      const questions = await this.getStagingData('psychology_questions', 
        `SELECT id FROM psychology_questions WHERE id = '${questionId}'`);
      return questions.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * 按字段分组
   */
  private groupBy(array: any[], key: string): { [key: string]: any[] } {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  }

  /**
   * 主控制流程
   */
  async syncAllModules() {
    console.log('🚀 开始分阶段数据同步...\n');
    
    try {
      // 阶段1：测试类型配置
      console.log('='.repeat(50));
      console.log('阶段1：测试类型配置');
      console.log('='.repeat(50));
      this.results.testTypes = await this.syncTestTypes();
      
      if (!this.results.testTypes.success) {
        throw new Error('阶段1失败，停止同步');
      }
      console.log('✅ 阶段1完成\n');
      
      // 阶段2：心理测试题目
      console.log('='.repeat(50));
      console.log('阶段2：心理测试题目');
      console.log('='.repeat(50));
      this.results.psychologyQuestions = await this.syncPsychologyQuestions();
      
      if (!this.results.psychologyQuestions.success) {
        throw new Error('阶段2失败，停止同步');
      }
      console.log('✅ 阶段2完成\n');
      
      // 阶段3：心理测试选项
      console.log('='.repeat(50));
      console.log('阶段3：心理测试选项');
      console.log('='.repeat(50));
      this.results.psychologyOptions = await this.syncPsychologyOptions();
      
      if (!this.results.psychologyOptions.success) {
        throw new Error('阶段3失败，停止同步');
      }
      console.log('✅ 阶段3完成\n');
      
      // 最终报告
      console.log('='.repeat(50));
      console.log('同步完成报告');
      console.log('='.repeat(50));
      console.log('✅ 测试类型配置:', this.results.testTypes.count, '条');
      console.log('✅ 心理测试题目:', this.results.psychologyQuestions.count, '条');
      console.log('✅ 心理测试选项:', this.results.psychologyOptions.count, '条');
      console.log('\n🎉 所有模块同步完成！');
      
    } catch (error) {
      console.error('❌ 同步过程中断:', error.message);
      console.log('\n📋 当前状态:');
      console.log(JSON.stringify(this.results, null, 2));
      throw error;
    }
  }
}

// 执行同步
async function main() {
  const sync = new StagedDataSync();
  await sync.syncAllModules();
}

main().catch(console.error);
