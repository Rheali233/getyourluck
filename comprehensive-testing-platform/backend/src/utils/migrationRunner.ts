/**
 * 数据库迁移运行器
 * 遵循统一开发标准的数据库迁移规范
 */

import type { Env } from '../index'
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors'

export interface Migration {
  id: string
  name: string
  sql: string
  appliedAt?: string
}

export class MigrationRunner {
  private db: D1Database

  constructor(env: Env) {
    if (!env.DB) {
      throw new ModuleError('Database connection not available', ERROR_CODES.DATABASE_ERROR, 500)
    }
    this.db = env.DB as D1Database
  }

  /**
   * 初始化迁移表
   */
  private async initMigrationTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS migrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `

    try {
      const result = await this.db.prepare(createTableSQL).run()
      if (!result.success) {
        throw new Error(result.error || 'Failed to create migrations table')
      }
    } catch (error) {
      throw new ModuleError(
        `Failed to initialize migration table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      )
    }
  }

  /**
   * 获取已应用的迁移
   */
  private async getAppliedMigrations(): Promise<string[]> {
    try {
      const result = await this.db.prepare('SELECT id FROM migrations ORDER BY applied_at ASC').all()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch applied migrations')
      }

      return result.results.map((row: any) => row.id)
    } catch (error) {
      throw new ModuleError(
        `Failed to get applied migrations: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      )
    }
  }

  /**
   * 应用单个迁移
   */
  private async applyMigration(migration: Migration): Promise<void> {
    try {
      // 执行迁移SQL
      const migrationResult = await this.db.prepare(migration.sql).run()
      
      if (!migrationResult.success) {
        throw new Error(migrationResult.error || 'Migration SQL execution failed')
      }

      // 记录迁移
      const recordResult = await this.db
        .prepare('INSERT INTO migrations (id, name, applied_at) VALUES (?, ?, ?)')
        .bind(migration.id, migration.name, new Date().toISOString())
        .run()

      if (!recordResult.success) {
        throw new Error(recordResult.error || 'Failed to record migration')
      }

      console.log(`Applied migration: ${migration.id} - ${migration.name}`)
    } catch (error) {
      throw new ModuleError(
        `Failed to apply migration ${migration.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      )
    }
  }

  /**
   * 运行所有待应用的迁移
   */
  async runMigrations(migrations: Migration[]): Promise<void> {
    try {
      // 初始化迁移表
      await this.initMigrationTable()

      // 获取已应用的迁移
      const appliedMigrations = await this.getAppliedMigrations()

      // 过滤出待应用的迁移
      const pendingMigrations = migrations.filter(
        migration => !appliedMigrations.includes(migration.id)
      )

      if (pendingMigrations.length === 0) {
        console.log('No pending migrations to apply')
        return
      }

      console.log(`Applying ${pendingMigrations.length} pending migrations...`)

      // 按顺序应用迁移
      for (const migration of pendingMigrations) {
        await this.applyMigration(migration)
      }

      console.log('All migrations applied successfully')
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error
      }
      
      throw new ModuleError(
        `Migration runner failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      )
    }
  }

  /**
   * 获取迁移状态
   */
  async getMigrationStatus(migrations: Migration[]): Promise<{
    applied: Migration[]
    pending: Migration[]
  }> {
    try {
      await this.initMigrationTable()
      const appliedMigrationIds = await this.getAppliedMigrations()

      const applied = migrations.filter(migration => 
        appliedMigrationIds.includes(migration.id)
      )

      const pending = migrations.filter(migration => 
        !appliedMigrationIds.includes(migration.id)
      )

      return { applied, pending }
    } catch (error) {
      throw new ModuleError(
        `Failed to get migration status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      )
    }
  }
}