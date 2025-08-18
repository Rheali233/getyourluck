/**
 * 首页配置数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
export interface HomepageConfigData {
    key: string;
    value: string;
    description?: string;
    isPublic: boolean;
    updatedAt: Date;
}
export declare class HomepageConfigModel extends BaseModel {
    constructor(db: D1Database);
    /**
     * 获取所有公开配置
     */
    getAllPublicConfigs(): Promise<Record<string, any>>;
    /**
     * 根据键获取配置
     */
    getConfigByKey(key: string): Promise<any>;
    /**
     * 更新配置
     */
    updateConfig(key: string, value: any, description?: string): Promise<void>;
    /**
     * 批量更新配置
     */
    batchUpdateConfigs(configs: Record<string, any>): Promise<void>;
    /**
     * 删除配置
     */
    deleteConfig(key: string): Promise<void>;
    /**
     * 获取配置列表
     */
    getConfigList(): Promise<HomepageConfigData[]>;
    /**
     * 将数据库行映射为HomepageConfigData对象
     */
    private mapDatabaseRowToConfig;
}
//# sourceMappingURL=HomepageConfigModel.d.ts.map