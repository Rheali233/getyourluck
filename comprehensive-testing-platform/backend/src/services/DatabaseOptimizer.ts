/**
 * 数据库查询优化服务
 * 负责优化D1数据库查询性能和索引管理
 */

export interface QueryPlan {
  query: string;
  executionTime: number;
  rowCount: number;
  indexUsage: string[];
  optimization: string[];
}

export interface IndexInfo {
  tableName: string;
  indexName: string;
  columns: string[];
  isUnique: boolean;
  cardinality: number;
}

export class DatabaseOptimizer {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * 分析查询执行计划
   */
  async analyzeQuery(query: string, params: any[] = []): Promise<QueryPlan> {
    const startTime = Date.now();
    
    try {
      // 执行查询并测量时间
      const result = await this.db.prepare(query).bind(...params).all();
      const executionTime = Date.now() - startTime;

      // 分析查询结构
      const analysis = this.analyzeQueryStructure(query);
      
      return {
        query,
        executionTime,
        rowCount: result.results?.length || 0,
        indexUsage: analysis.indexUsage,
        optimization: analysis.optimization
      };
    } catch (error) {
      console.error('Query analysis failed:', error);
      throw error;
    }
  }

  /**
   * 分析查询结构
   */
  private analyzeQueryStructure(query: string): { indexUsage: string[], optimization: string[] } {
    const indexUsage: string[] = [];
    const optimization: string[] = [];
    const upperQuery = query.toUpperCase();

    // 检查是否使用了索引
    if (upperQuery.includes('WHERE')) {
      const whereClause = upperQuery.substring(upperQuery.indexOf('WHERE'));
      
      // 检查常见字段的索引使用
      const indexedFields = ['ID', 'USER_ID', 'MODULE_ID', 'CREATED_AT', 'UPDATED_AT'];
      indexedFields.forEach(field => {
        if (whereClause.includes(field)) {
          indexUsage.push(`${field} 字段可能使用索引`);
        }
      });
    }

    // 检查查询优化建议
    if (upperQuery.includes('SELECT *')) {
      optimization.push('建议使用具体的列名而不是 SELECT *');
    }

    if (upperQuery.includes('ORDER BY') && !upperQuery.includes('LIMIT')) {
      optimization.push('ORDER BY 查询建议添加 LIMIT 子句');
    }

    if (upperQuery.includes('LIKE') && upperQuery.includes('%')) {
      optimization.push('LIKE 查询以 % 开头可能无法使用索引');
    }

    return { indexUsage, optimization };
  }

  /**
   * 获取表索引信息
   */
  async getTableIndexes(tableName: string): Promise<IndexInfo[]> {
    try {
      const query = `
        SELECT 
          name as indexName,
          sql as indexSql
        FROM sqlite_master 
        WHERE type = 'index' AND tbl_name = ?
      `;
      
      const result = await this.db.prepare(query).bind(tableName).all();
      const indexes: IndexInfo[] = [];

      for (const row of result.results || []) {
        const indexSql = row['indexSql'] as string;
        const columns = this.extractIndexColumns(indexSql);
        
        indexes.push({
          tableName,
          indexName: row['indexName'] as string,
          columns,
          isUnique: indexSql.includes('UNIQUE'),
          cardinality: 0 // SQLite不提供基数信息
        });
      }

      return indexes;
    } catch (error) {
      console.error('Failed to get table indexes:', error);
      return [];
    }
  }

  /**
   * 提取索引列信息
   */
  private extractIndexColumns(indexSql: string): string[] {
    const match = indexSql.match(/\(([^)]+)\)/);
    if (!match) return [];
    
    return (match[1] || '').split(',').map(col => col.trim());
  }

  /**
   * 创建索引
   */
  async createIndex(
    tableName: string, 
    indexName: string, 
    columns: string[], 
    isUnique: boolean = false
  ): Promise<boolean> {
    try {
      const uniqueClause = isUnique ? 'UNIQUE' : '';
      const columnsClause = columns.join(', ');
      
      const query = `
        CREATE ${uniqueClause} INDEX IF NOT EXISTS ${indexName} 
        ON ${tableName} (${columnsClause})
      `;
      
      await this.db.prepare(query).run();
      return true;
    } catch (error) {
      console.error('Failed to create index:', error);
      return false;
    }
  }

  /**
   * 删除索引
   */
  async dropIndex(indexName: string): Promise<boolean> {
    try {
      const query = `DROP INDEX IF EXISTS ${indexName}`;
      await this.db.prepare(query).run();
      return true;
    } catch (error) {
      console.error('Failed to drop index:', error);
      return false;
    }
  }

  /**
   * 分析表性能
   */
  async analyzeTable(tableName: string): Promise<{
    rowCount: number;
    tableSize: number;
    indexes: IndexInfo[];
    recommendations: string[];
  }> {
    try {
      // 获取行数
      const countResult = await this.db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).first();
      const rowCount = countResult?.['count'] as number || 0;

      // 获取表大小（估算）
      const sizeResult = await this.db.prepare(`
        SELECT SUM(length(hex(data))/2) as size 
        FROM sqlite_dbpage 
        WHERE pgno > 1
      `).first();
      const tableSize = sizeResult?.['size'] as number || 0;

      // 获取索引信息
      const indexes = await this.getTableIndexes(tableName);

      // 生成优化建议
      const recommendations = this.generateTableRecommendations(tableName, rowCount, indexes);

      return {
        rowCount,
        tableSize,
        indexes,
        recommendations
      };
    } catch (error) {
      console.error('Failed to analyze table:', error);
      throw error;
    }
  }

  /**
   * 生成表优化建议
   */
  private generateTableRecommendations(
    _tableName: string, 
    rowCount: number, 
    indexes: IndexInfo[]
  ): string[] {
    const recommendations: string[] = [];

    // 基于行数的建议
    if (rowCount > 10000) {
      recommendations.push('大表建议添加复合索引优化查询性能');
    }

    if (rowCount > 100000) {
      recommendations.push('超大表建议考虑分区或归档策略');
    }

    // 基于索引的建议
    if (indexes.length === 0) {
      recommendations.push('建议为常用查询字段添加索引');
    }

    // 检查是否有复合索引
    const hasCompositeIndex = indexes.some(index => index.columns.length > 1);
    if (!hasCompositeIndex && rowCount > 5000) {
      recommendations.push('建议为多字段查询添加复合索引');
    }

    return recommendations;
  }

  /**
   * 优化查询
   */
  async optimizeQuery(originalQuery: string, _params: any[] = []): Promise<{
    optimizedQuery: string;
    explanation: string[];
    estimatedImprovement: number;
  }> {
    // const analysis = await this.analyzeQuery(originalQuery, params); // 未使用，暂时注释
    const optimizations: string[] = [];
    let estimatedImprovement = 0;

    // 查询优化逻辑
    let optimizedQuery = originalQuery;

    // 1. 添加LIMIT子句
    if (originalQuery.toUpperCase().includes('SELECT') && 
        !originalQuery.toUpperCase().includes('LIMIT') &&
        !originalQuery.toUpperCase().includes('COUNT')) {
      optimizedQuery += ' LIMIT 1000';
      optimizations.push('添加LIMIT子句防止返回过多数据');
      estimatedImprovement += 20;
    }

    // 2. 优化SELECT语句
    if (originalQuery.toUpperCase().includes('SELECT *')) {
      // 这里需要知道表结构来生成具体的列名
      optimizations.push('建议使用具体的列名而不是SELECT *');
      estimatedImprovement += 15;
    }

    // 3. 优化WHERE子句
    if (originalQuery.toUpperCase().includes('WHERE')) {
      const whereClause = originalQuery.toUpperCase().substring(
        originalQuery.toUpperCase().indexOf('WHERE')
      );
      
      if (whereClause.includes('LIKE') && whereClause.includes('%')) {
        optimizations.push('LIKE查询建议避免以%开头');
        estimatedImprovement += 10;
      }
    }

    // 4. 优化JOIN
    if (originalQuery.toUpperCase().includes('JOIN')) {
      optimizations.push('JOIN查询建议确保连接字段有索引');
      estimatedImprovement += 25;
    }

    return {
      optimizedQuery,
      explanation: optimizations,
      estimatedImprovement: Math.min(estimatedImprovement, 80)
    };
  }

  /**
   * 批量查询优化
   */
  async batchOptimize(queries: string[]): Promise<{
    totalOptimizations: number;
    totalEstimatedImprovement: number;
    queryOptimizations: Array<{
      query: string;
      optimizations: string[];
      estimatedImprovement: number;
    }>;
  }> {
    const queryOptimizations = [];
    let totalOptimizations = 0;
    let totalEstimatedImprovement = 0;

    for (const query of queries) {
      const optimization = await this.optimizeQuery(query);
      queryOptimizations.push(optimization);
      totalOptimizations += optimization.explanation.length;
      totalEstimatedImprovement += optimization.estimatedImprovement;
    }

    return {
      totalOptimizations,
      totalEstimatedImprovement: Math.round(totalEstimatedImprovement / queries.length),
      queryOptimizations: queryOptimizations.map(q => ({
        query: q.optimizedQuery,
        optimizations: q.explanation,
        estimatedImprovement: q.estimatedImprovement
      }))
    };
  }

  /**
   * 获取数据库统计信息
   */
  async getDatabaseStats(): Promise<{
    totalTables: number;
    totalIndexes: number;
    totalSize: number;
    optimizationScore: number;
  }> {
    try {
      // 获取表数量
      const tablesResult = await this.db.prepare(`
        SELECT COUNT(*) as count FROM sqlite_master WHERE type = 'table'
      `).first();
      const totalTables = tablesResult?.['count'] as number || 0;

      // 获取索引数量
      const indexesResult = await this.db.prepare(`
        SELECT COUNT(*) as count FROM sqlite_master WHERE type = 'index'
      `).first();
      const totalIndexes = indexesResult?.['count'] as number || 0;

      // 计算优化分数
      const optimizationScore = Math.min(100, Math.round((totalIndexes / totalTables) * 50 + 50));

      return {
        totalTables,
        totalIndexes,
        totalSize: 0, // SQLite不提供总大小信息
        optimizationScore
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return {
        totalTables: 0,
        totalIndexes: 0,
        totalSize: 0,
        optimizationScore: 0
      };
    }
  }
}
