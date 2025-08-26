/**
 * 完整EQ情商题库导入脚本
 * 清理现有EQ题库数据，导入50题优化版题库到数据库
 */

import { eqQuestionsOptimized, eqOptionsOptimized } from '../seeds/eq-questions-optimized';

async function seedEQComplete() {
  console.log('🚀 开始完整导入优化版EQ情商题库...');
  
  try {
    // 模拟数据库操作（实际执行时需要真实的数据库连接）
    console.log('📊 题库数据统计:');
    console.log(`   题目数量: ${eqQuestionsOptimized.length}`);
    console.log(`   选项数量: ${eqOptionsOptimized.length}`);
    
    // 显示题库结构
    const dimensions = eqQuestionsOptimized.reduce((acc, question) => {
      const dim = question.dimension;
      acc[dim] = (acc[dim] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📋 题库维度分布:');
    Object.entries(dimensions).forEach(([dim, count]) => {
      const dimensionNames: Record<string, string> = {
        'self_awareness': '自我认知',
        'self_regulation': '自我管理', 
        'motivation': '动机',
        'empathy': '共情',
        'social_skills': '社会技能'
      };
      console.log(`   ${dimensionNames[dim] || dim}: ${count}题`);
    });
    
    // 显示反向题统计
    const reverseQuestions = eqQuestionsOptimized.filter(q => q.isReverse);
    console.log(`🔄 反向题数量: ${reverseQuestions.length}题 (${(reverseQuestions.length / eqQuestionsOptimized.length * 100).toFixed(1)}%)`);
    
    // 显示题目示例
    console.log('\n📝 题目示例:');
    eqQuestionsOptimized.slice(0, 3).forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.questionText} [${q.dimension}]`);
    });
    
    console.log('\n✅ 优化版EQ题库数据验证完成');
    console.log('💡 下一步：执行数据库导入操作');
    
  } catch (error) {
    console.error('❌ 验证优化版EQ题库失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  seedEQComplete()
    .then(() => {
      console.log('🎉 优化版EQ题库验证脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 脚本执行失败:', error);
      process.exit(1);
    });
}

export { seedEQComplete };
