/**
 * 环境配置
 * 根据当前环境动态配置 API 地址
 */

export interface EnvironmentConfig {
  API_BASE_URL: string
  CDN_BASE_URL: string
  NODE_ENV: string
}

// 环境配置映射
const environmentConfigs: Record<string, EnvironmentConfig> = {
  production: {
    API_BASE_URL: 'https://api.getyourluck.com',
    CDN_BASE_URL: 'https://cdn.getyourluck.com',
    NODE_ENV: 'production'
  },
  staging: {
    API_BASE_URL: 'https://getyourluck-backend-staging.cyberlina.workers.dev',
    CDN_BASE_URL: 'https://staging-cdn.getyourluck.com',
    NODE_ENV: 'staging'
  },
  development: {
    API_BASE_URL: '/api',
    CDN_BASE_URL: '/cdn',
    NODE_ENV: 'development'
  }
}

// 获取当前环境配置
export const getEnvironmentConfig = (): EnvironmentConfig => {
  // 从环境变量获取环境类型，默认为 development
  const envType = (import.meta as any).env?.VITE_NODE_ENV || 'development'
  
  // 返回对应环境的配置，确保类型安全
  const config = environmentConfigs[envType]
  if (config) {
    return config
  }
  
  // 如果找不到配置，返回 development 配置
  return environmentConfigs['development']!
}

// 导出当前环境配置
export const env = getEnvironmentConfig()
