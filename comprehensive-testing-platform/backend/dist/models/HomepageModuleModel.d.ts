/**
 * 首页模块数据模型
 * 遵循统一开发标准的数据模型规范
 */
import type { HomepageModule } from '../../../shared/types/homepage';
import { BaseModel } from './BaseModel';
export declare class HomepageModuleModel extends BaseModel {
    constructor(env: any);
    /**
     * 获取所有活跃的测试模块
     */
    getAllActiveModules(): Promise<HomepageModule[]>;
    /**
     * 根据主题获取测试模块
     */
    getModulesByTheme(theme: string): Promise<HomepageModule[]>;
    /**
     * 根据ID获取测试模块
     */
    getModuleById(id: string): Promise<HomepageModule | null>;
    /**
     * 更新测试模块统计信息
     */
    updateModuleStats(id: string, testCount: number, rating: number): Promise<void>;
    /**
     * 获取测试模块统计摘要
     */
    getModulesStats(): Promise<{
        totalModules: number;
        totalTests: number;
        averageRating: number;
        activeThemes: string[];
    }>;
    /**
     * 将数据库行映射为HomepageModule对象
     */
    private mapDatabaseRowToModule;
}
//# sourceMappingURL=HomepageModuleModel.d.ts.map