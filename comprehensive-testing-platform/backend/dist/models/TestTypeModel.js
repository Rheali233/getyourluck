/**
 * 测试类型数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
import { CACHE_KEYS, DB_TABLES } from '../../../shared/constants';
export class TestTypeModel extends BaseModel {
    constructor(env) {
        super(env, DB_TABLES.TEST_TYPES);
    }
    /**
     * 创建测试类型
     */
    async create(testTypeData) {
        this.validateRequired(testTypeData, ['id', 'name', 'category', 'config']);
        const now = this.formatTimestamp();
        const query = `
      INSERT INTO ${this.tableName} (
        id, name, category, description, config_data,
        is_active, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const params = [
            testTypeData.id,
            testTypeData.name,
            testTypeData.category,
            testTypeData.description || null,
            JSON.stringify(testTypeData.config),
            testTypeData.isActive !== false ? 1 : 0,
            testTypeData.sortOrder || 0,
            now,
            now,
        ];
        await this.executeRun(query, params);
        // 缓存测试配置
        const cacheKey = `${CACHE_KEYS.TEST_CONFIG}${testTypeData.id}`;
        await this.setCache(cacheKey, testTypeData.config, 3600); // 1小时缓存
        return testTypeData.id;
    }
    /**
     * 获取所有活跃的测试类型
     */
    async getAllActive() {
        const cacheKey = 'active_test_types';
        const cached = await this.getCache(cacheKey);
        if (cached) {
            return cached;
        }
        const query = `
      SELECT * FROM ${this.tableName} 
      WHERE is_active = 1 
      ORDER BY sort_order ASC, name ASC
    `;
        const results = await this.executeQuery(query);
        // 缓存结果
        await this.setCache(cacheKey, results, 1800); // 30分钟缓存
        return results;
    }
    /**
     * 根据ID获取测试类型
     */
    async findById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        return this.executeQueryFirst(query, [id]);
    }
    /**
     * 根据分类获取测试类型
     */
    async findByCategory(category) {
        const cacheKey = `test_types_category:${category}`;
        const cached = await this.getCache(cacheKey);
        if (cached) {
            return cached;
        }
        const query = `
      SELECT * FROM ${this.tableName} 
      WHERE category = ? AND is_active = 1 
      ORDER BY sort_order ASC, name ASC
    `;
        const results = await this.executeQuery(query, [category]);
        // 缓存结果
        await this.setCache(cacheKey, results, 1800); // 30分钟缓存
        return results;
    }
    /**
     * 获取测试配置
     */
    async getConfig(id) {
        const cacheKey = `${CACHE_KEYS.TEST_CONFIG}${id}`;
        const cached = await this.getCache(cacheKey);
        if (cached) {
            return cached;
        }
        const testType = await this.findById(id);
        if (!testType) {
            return null;
        }
        try {
            const config = JSON.parse(testType.configData);
            // 缓存配置
            await this.setCache(cacheKey, config, 3600); // 1小时缓存
            return config;
        }
        catch (error) {
            console.error('Failed to parse test config:', error);
            return null;
        }
    }
    /**
     * 更新测试类型
     */
    async update(id, updateData) {
        const now = this.formatTimestamp();
        const fields = [];
        const params = [];
        // 动态构建更新字段
        if (updateData.name !== undefined) {
            fields.push('name = ?');
            params.push(updateData.name);
        }
        if (updateData.category !== undefined) {
            fields.push('category = ?');
            params.push(updateData.category);
        }
        if (updateData.description !== undefined) {
            fields.push('description = ?');
            params.push(updateData.description);
        }
        if (updateData.config !== undefined) {
            fields.push('config_data = ?');
            params.push(JSON.stringify(updateData.config));
        }
        if (updateData.isActive !== undefined) {
            fields.push('is_active = ?');
            params.push(updateData.isActive ? 1 : 0);
        }
        if (updateData.sortOrder !== undefined) {
            fields.push('sort_order = ?');
            params.push(updateData.sortOrder);
        }
        if (fields.length === 0) {
            return; // 没有需要更新的字段
        }
        fields.push('updated_at = ?');
        params.push(now);
        params.push(id);
        const query = `
      UPDATE ${this.tableName} 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `;
        await this.executeRun(query, params);
        // 清除相关缓存
        await this.deleteCache(`${CACHE_KEYS.TEST_CONFIG}${id}`);
        await this.deleteCache('active_test_types');
    }
    /**
     * 删除测试类型（软删除 - 设置为不活跃）
     */
    async softDelete(id) {
        await this.update(id, { isActive: false });
    }
    /**
     * 获取所有分类
     */
    async getCategories() {
        const cacheKey = 'test_categories';
        const cached = await this.getCache(cacheKey);
        if (cached) {
            return cached;
        }
        const query = `
      SELECT DISTINCT category 
      FROM ${this.tableName} 
      WHERE is_active = 1 
      ORDER BY category ASC
    `;
        const results = await this.executeQuery(query);
        const categories = results.map(row => row.category);
        // 缓存结果
        await this.setCache(cacheKey, categories, 3600); // 1小时缓存
        return categories;
    }
}
//# sourceMappingURL=TestTypeModel.js.map