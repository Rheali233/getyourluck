/**
 * 首页模块数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
export class HomepageModuleModel extends BaseModel {
    constructor(env) {
        super(env, 'homepage_modules');
    }
    /**
     * 获取所有活跃的测试模块
     */
    async getAllActiveModules() {
        try {
            const result = await this.db
                .prepare(`
          SELECT * FROM homepage_modules 
          WHERE is_active = 1 
          ORDER BY sort_order ASC, created_at ASC
        `)
                .all();
            return result.results?.map(this.mapDatabaseRowToModule) || [];
        }
        catch (error) {
            console.error('获取活跃测试模块失败:', error);
            throw new Error('获取测试模块失败');
        }
    }
    /**
     * 根据主题获取测试模块
     */
    async getModulesByTheme(theme) {
        try {
            const result = await this.db
                .prepare(`
          SELECT * FROM homepage_modules 
          WHERE theme = ? AND is_active = 1 
          ORDER BY sort_order ASC
        `)
                .bind(theme)
                .all();
            return result.results?.map(this.mapDatabaseRowToModule) || [];
        }
        catch (error) {
            console.error(`获取${theme}主题测试模块失败:`, error);
            throw new Error(`获取${theme}主题测试模块失败`);
        }
    }
    /**
     * 根据ID获取测试模块
     */
    async getModuleById(id) {
        try {
            const result = await this.db
                .prepare('SELECT * FROM homepage_modules WHERE id = ? AND is_active = 1')
                .bind(id)
                .first();
            return result ? this.mapDatabaseRowToModule(result) : null;
        }
        catch (error) {
            console.error(`获取测试模块${id}失败:`, error);
            throw new Error(`获取测试模块失败`);
        }
    }
    /**
     * 更新测试模块统计信息
     */
    async updateModuleStats(id, testCount, rating) {
        try {
            await this.db
                .prepare(`
          UPDATE homepage_modules 
          SET test_count = ?, rating = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `)
                .bind(testCount, rating, id)
                .run();
        }
        catch (error) {
            console.error(`更新测试模块${id}统计信息失败:`, error);
            throw new Error('更新统计信息失败');
        }
    }
    /**
     * 获取测试模块统计摘要
     */
    async getModulesStats() {
        try {
            // 分别查询统计信息，避免SQLite兼容性问题
            const countResult = await this.db
                .prepare('SELECT COUNT(*) as total_modules FROM homepage_modules WHERE is_active = 1')
                .first();
            const sumResult = await this.db
                .prepare('SELECT SUM(test_count) as total_tests, AVG(rating) as average_rating FROM homepage_modules WHERE is_active = 1')
                .first();
            const themesResult = await this.db
                .prepare('SELECT DISTINCT theme FROM homepage_modules WHERE is_active = 1')
                .all();
            if (!countResult || !sumResult) {
                return {
                    totalModules: 0,
                    totalTests: 0,
                    averageRating: 0,
                    activeThemes: [],
                };
            }
            return {
                totalModules: countResult.total_modules,
                totalTests: sumResult.total_tests || 0,
                averageRating: sumResult.average_rating || 0,
                activeThemes: themesResult.results?.map((row) => row.theme) || [],
            };
        }
        catch (error) {
            console.error('获取测试模块统计摘要失败:', error);
            throw new Error('获取统计摘要失败');
        }
    }
    /**
     * 将数据库行映射为HomepageModule对象
     */
    mapDatabaseRowToModule(row) {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            icon: row.icon,
            theme: row.theme,
            testCount: row.test_count,
            rating: row.rating,
            isActive: Boolean(row.is_active),
            route: row.route,
            features: JSON.parse(row.features_data),
            estimatedTime: row.estimated_time,
            sortOrder: row.sort_order,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
}
//# sourceMappingURL=HomepageModuleModel.js.map