/**
 * 环境配置管理
 * 安全地管理API密钥和其他环境变量
 */

interface EnvironmentConfig {
  DEEPSEEK_API_KEY: string;
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'production' | 'test';
}

// 从环境变量读取配置
const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = (import.meta as any).env;
  
  return {
    DEEPSEEK_API_KEY: env.VITE_DEEPSEEK_API_KEY || '',
    API_BASE_URL: env.VITE_API_BASE_URL || 'http://localhost:8787',
    ENVIRONMENT: (env.VITE_ENVIRONMENT as 'development' | 'production' | 'test') || 'development'
  };
};

// 验证必要的环境变量
const validateEnvironmentConfig = (config: EnvironmentConfig): void => {
  const requiredVars: (keyof EnvironmentConfig)[] = ['DEEPSEEK_API_KEY'];
  
  for (const requiredVar of requiredVars) {
    if (!config[requiredVar]) {
      console.warn(`警告: 环境变量 ${requiredVar} 未设置`);
      
      if (config.ENVIRONMENT === 'production') {
        console.error(`错误: 生产环境必须设置 ${requiredVar}`);
      }
    }
  }
};

// 导出环境配置
export const environmentConfig = getEnvironmentConfig();

// 验证配置
validateEnvironmentConfig(environmentConfig);

// 导出类型
export type { EnvironmentConfig };
