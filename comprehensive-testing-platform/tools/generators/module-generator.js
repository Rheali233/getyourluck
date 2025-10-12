#!/usr/bin/env node

/**
 * 模块生成器
 * 用法: node tools/generators/module-generator.js <module-name> <type>
 * 类型: frontend | backend
 */

const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];
const moduleType = process.argv[3] || 'frontend';

if (!moduleName) {
  console.error('请提供模块名称');
  process.exit(1);
}

const pascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const camelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

// 前端模块模板
const frontendTemplates = {
  'index.ts': `// ${pascalCase(moduleName)} Module Exports
export { ${pascalCase(moduleName)} } from './components';
export { ${camelCase(moduleName)}Service } from './services';
export { use${pascalCase(moduleName)}Store } from './stores';
export type * from './types';
`,

  'components/index.ts': `export { ${pascalCase(moduleName)} } from './${pascalCase(moduleName)}';
`,

  [`components/${pascalCase(moduleName)}/index.ts`]: `export { ${pascalCase(moduleName)} } from './${pascalCase(moduleName)}';
export type { ${pascalCase(moduleName)}Props } from './types';
`,

  [`components/${pascalCase(moduleName)}/${pascalCase(moduleName)}.tsx`]: `import React from 'react';
import { cn } from '@/shared/utils';
import type { ${pascalCase(moduleName)}Props } from './types';

export const ${pascalCase(moduleName)}: React.FC<${pascalCase(moduleName)}Props> = ({
  className = '',
  testId = '${moduleName}',
  ...props
}) => {
  return (
    <div 
      className={cn('${moduleName}-container', className)} 
      data-testid={testId}
      {...props}
    >
      <h1>${pascalCase(moduleName)} Module</h1>
      {/* TODO: 实现${moduleName}功能 */}
    </div>
  );
};
`,

  [`components/${pascalCase(moduleName)}/types.ts`]: `import type { BaseComponentProps } from '@/types/componentTypes';

export interface ${pascalCase(moduleName)}Props extends BaseComponentProps {
  // TODO: 添加${moduleName}特定属性
}
`,

  [`components/${pascalCase(moduleName)}/${pascalCase(moduleName)}.test.tsx`]: `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${pascalCase(moduleName)} } from './${pascalCase(moduleName)}';

describe('${pascalCase(moduleName)}', () => {
  it('should render correctly', () => {
    render(<${pascalCase(moduleName)} />);
    expect(screen.getByTestId('${moduleName}')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<${pascalCase(moduleName)} className="custom-class" />);
    expect(screen.getByTestId('${moduleName}')).toHaveClass('custom-class');
  });
});
`,

  'services/index.ts': `export { ${camelCase(moduleName)}Service } from './${camelCase(moduleName)}Service';
`,

  [`services/${camelCase(moduleName)}Service.ts`]: `import { apiClient } from '@/services/apiClient';
import type { APIResponse } from '@/shared/types/apiResponse';
import type { ${pascalCase(moduleName)}Data } from '../types';

class ${pascalCase(moduleName)}Service {
  private readonly baseUrl = '/${moduleName}';

  async getData(): Promise<APIResponse<${pascalCase(moduleName)}Data[]>> {
    return apiClient.get<${pascalCase(moduleName)}Data[]>(this.baseUrl);
  }

  async createData(data: Partial<${pascalCase(moduleName)}Data>): Promise<APIResponse<${pascalCase(moduleName)}Data>> {
    return apiClient.post<${pascalCase(moduleName)}Data>(this.baseUrl, data);
  }

  async updateData(id: string, data: Partial<${pascalCase(moduleName)}Data>): Promise<APIResponse<${pascalCase(moduleName)}Data>> {
    return apiClient.put<${pascalCase(moduleName)}Data>(\`\${this.baseUrl}/\${id}\`, data);
  }

  async deleteData(id: string): Promise<APIResponse<void>> {
    return apiClient.delete<void>(\`\${this.baseUrl}/\${id}\`);
  }
}

export const ${camelCase(moduleName)}Service = new ${pascalCase(moduleName)}Service();
`,

  'stores/index.ts': `export { use${pascalCase(moduleName)}Store } from './use${pascalCase(moduleName)}Store';
`,

  [`stores/use${pascalCase(moduleName)}Store.ts`]: `import { create } from 'zustand';
import type { ModuleState, ModuleActions } from '@/shared/types/moduleState';
import type { ${pascalCase(moduleName)}Data } from '../types';
import { ${camelCase(moduleName)}Service } from '../services';

interface ${pascalCase(moduleName)}State extends ModuleState {
  items: ${pascalCase(moduleName)}Data[];
  currentItem: ${pascalCase(moduleName)}Data | null;
}

interface ${pascalCase(moduleName)}Actions extends ModuleActions {
  fetchItems: () => Promise<void>;
  createItem: (data: Partial<${pascalCase(moduleName)}Data>) => Promise<void>;
  updateItem: (id: string, data: Partial<${pascalCase(moduleName)}Data>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setCurrentItem: (item: ${pascalCase(moduleName)}Data | null) => void;
}

export const use${pascalCase(moduleName)}Store = create<${pascalCase(moduleName)}State & ${pascalCase(moduleName)}Actions>((set, get) => ({
  // 基础状态
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null,

  // ${moduleName}特定状态
  items: [],
  currentItem: null,

  // 基础操作
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  setData: (data: any) => set({ data, lastUpdated: new Date() }),
  reset: () => set({
    isLoading: false,
    error: null,
    data: null,
    lastUpdated: null,
    items: [],
    currentItem: null,
  }),

  // ${moduleName}特定操作
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ${camelCase(moduleName)}Service.getData();
      if (response.success && response.data) {
        set({ 
          items: response.data, 
          isLoading: false,
          data: response.data,
          lastUpdated: new Date()
        });
      } else {
        throw new Error(response.error || 'Failed to fetch items');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },

  createItem: async (data: Partial<${pascalCase(moduleName)}Data>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ${camelCase(moduleName)}Service.createData(data);
      if (response.success && response.data) {
        const { items } = get();
        set({ 
          items: [...items, response.data],
          isLoading: false,
          lastUpdated: new Date()
        });
      } else {
        throw new Error(response.error || 'Failed to create item');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },

  updateItem: async (id: string, data: Partial<${pascalCase(moduleName)}Data>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ${camelCase(moduleName)}Service.updateData(id, data);
      if (response.success && response.data) {
        const { items } = get();
        set({ 
          items: items.map(item => item.id === id ? response.data! : item),
          isLoading: false,
          lastUpdated: new Date()
        });
      } else {
        throw new Error(response.error || 'Failed to update item');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },

  deleteItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ${camelCase(moduleName)}Service.deleteData(id);
      if (response.success) {
        const { items } = get();
        set({ 
          items: items.filter(item => item.id !== id),
          isLoading: false,
          lastUpdated: new Date()
        });
      } else {
        throw new Error(response.error || 'Failed to delete item');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },

  setCurrentItem: (item: ${pascalCase(moduleName)}Data | null) => set({ currentItem: item }),
}));
`,

  'types/index.ts': `export type { ${pascalCase(moduleName)}Data, ${pascalCase(moduleName)}Config } from './${camelCase(moduleName)}Types';
`,

  [`types/${camelCase(moduleName)}Types.ts`]: `export interface ${pascalCase(moduleName)}Data {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // TODO: 添加${moduleName}特定字段
}

export interface ${pascalCase(moduleName)}Config {
  // TODO: 添加${moduleName}配置选项
}
`,

  'utils/index.ts': `export { ${camelCase(moduleName)}Utils } from './${camelCase(moduleName)}Utils';
`,

  [`utils/${camelCase(moduleName)}Utils.ts`]: `export const ${camelCase(moduleName)}Utils = {
  // TODO: 添加${moduleName}工具函数
  formatData: (data: any) => {
    // 实现数据格式化逻辑
    return data;
  },

  validateData: (data: any): boolean => {
    // 实现数据验证逻辑
    return true;
  },
};
`,

  'hooks/index.ts': `export { use${pascalCase(moduleName)} } from './use${pascalCase(moduleName)}';
`,

  [`hooks/use${pascalCase(moduleName)}.ts`]: `import { useEffect } from 'react';
import { use${pascalCase(moduleName)}Store } from '../stores';

export const use${pascalCase(moduleName)} = () => {
  const store = use${pascalCase(moduleName)}Store();

  useEffect(() => {
    // 初始化逻辑
    if (!store.data && !store.isLoading) {
      store.fetchItems();
    }
  }, []);

  return {
    ...store,
    // 添加计算属性或派生状态
    hasItems: store.items.length > 0,
    isEmpty: store.items.length === 0 && !store.isLoading,
  };
};
`,
};

// 后端模块模板
const backendTemplates = {
  'index.ts': `import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppContext } from '../../types/env';
import { ${camelCase(moduleName)}Handlers } from './handlers';
import { ${camelCase(moduleName)}Validators } from './validators';

const ${camelCase(moduleName)}Routes = new Hono<AppContext>();

// GET /${moduleName}
${camelCase(moduleName)}Routes.get('/', ${camelCase(moduleName)}Handlers.getAll);

// GET /${moduleName}/:id
${camelCase(moduleName)}Routes.get('/:id', ${camelCase(moduleName)}Handlers.getById);

// POST /${moduleName}
${camelCase(moduleName)}Routes.post('/', ${camelCase(moduleName)}Validators.create, ${camelCase(moduleName)}Handlers.create);

// PUT /${moduleName}/:id
${camelCase(moduleName)}Routes.put('/:id', ${camelCase(moduleName)}Validators.update, ${camelCase(moduleName)}Handlers.update);

// DELETE /${moduleName}/:id
${camelCase(moduleName)}Routes.delete('/:id', ${camelCase(moduleName)}Handlers.delete);

export { ${camelCase(moduleName)}Routes };
`,

  'handlers/index.ts': `export { ${camelCase(moduleName)}Handlers } from './${camelCase(moduleName)}Handlers';
`,

  [`handlers/${camelCase(moduleName)}Handlers.ts`]: `import type { Context } from 'hono';
import type { AppContext } from '../../../types/env';
import type { APIResponse } from '../../../../../shared/types/apiResponse';
import { ${pascalCase(moduleName)}Service } from '../../../services/${pascalCase(moduleName)}Service';
import { ModuleError, ERROR_CODES } from '../../../../../shared/types/errors';

export const ${camelCase(moduleName)}Handlers = {
  async getAll(c: Context<AppContext>) {
    try {
      const dbService = c.get('dbService');
      const ${camelCase(moduleName)}Service = new ${pascalCase(moduleName)}Service(dbService);
      
      const items = await ${camelCase(moduleName)}Service.getAll();
      
      const response: APIResponse = {
        success: true,
        data: items,
        message: '${pascalCase(moduleName)} items retrieved successfully',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId'),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        'Failed to retrieve ${moduleName} items',
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  },

  async getById(c: Context<AppContext>) {
    const id = c.req.param('id');
    
    try {
      const dbService = c.get('dbService');
      const ${camelCase(moduleName)}Service = new ${pascalCase(moduleName)}Service(dbService);
      
      const item = await ${camelCase(moduleName)}Service.getById(id);
      
      if (!item) {
        throw new ModuleError(
          \`${pascalCase(moduleName)} item not found: \${id}\`,
          ERROR_CODES.NOT_FOUND,
          404
        );
      }
      
      const response: APIResponse = {
        success: true,
        data: item,
        message: '${pascalCase(moduleName)} item retrieved successfully',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId'),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        \`Failed to retrieve ${moduleName} item: \${id}\`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  },

  async create(c: Context<AppContext>) {
    try {
      const data = await c.req.json();
      const dbService = c.get('dbService');
      const ${camelCase(moduleName)}Service = new ${pascalCase(moduleName)}Service(dbService);
      
      const item = await ${camelCase(moduleName)}Service.create(data);
      
      const response: APIResponse = {
        success: true,
        data: item,
        message: '${pascalCase(moduleName)} item created successfully',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId'),
      };

      return c.json(response, 201);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        'Failed to create ${moduleName} item',
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  },

  async update(c: Context<AppContext>) {
    const id = c.req.param('id');
    
    try {
      const data = await c.req.json();
      const dbService = c.get('dbService');
      const ${camelCase(moduleName)}Service = new ${pascalCase(moduleName)}Service(dbService);
      
      const item = await ${camelCase(moduleName)}Service.update(id, data);
      
      const response: APIResponse = {
        success: true,
        data: item,
        message: '${pascalCase(moduleName)} item updated successfully',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId'),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        \`Failed to update ${moduleName} item: \${id}\`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  },

  async delete(c: Context<AppContext>) {
    const id = c.req.param('id');
    
    try {
      const dbService = c.get('dbService');
      const ${camelCase(moduleName)}Service = new ${pascalCase(moduleName)}Service(dbService);
      
      await ${camelCase(moduleName)}Service.delete(id);
      
      const response: APIResponse = {
        success: true,
        message: '${pascalCase(moduleName)} item deleted successfully',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId'),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        \`Failed to delete ${moduleName} item: \${id}\`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  },
};
`,

  'validators/index.ts': `export { ${camelCase(moduleName)}Validators } from './${camelCase(moduleName)}Validators';
`,

  [`validators/${camelCase(moduleName)}Validators.ts`]: `import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const create${pascalCase(moduleName)}Schema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  // TODO: 添加${moduleName}特定验证规则
});

const update${pascalCase(moduleName)}Schema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  // TODO: 添加${moduleName}特定验证规则
});

export const ${camelCase(moduleName)}Validators = {
  create: zValidator('json', create${pascalCase(moduleName)}Schema),
  update: zValidator('json', update${pascalCase(moduleName)}Schema),
};
`,

  'types.ts': `export interface ${pascalCase(moduleName)}Data {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // TODO: 添加${moduleName}特定字段
}

export interface Create${pascalCase(moduleName)}Request {
  name: string;
  description?: string;
  // TODO: 添加${moduleName}特定字段
}

export interface Update${pascalCase(moduleName)}Request {
  name?: string;
  description?: string;
  // TODO: 添加${moduleName}特定字段
}
`,
};

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function createFile(filePath, content) {
  createDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
}

function generateModule() {
  const templates = moduleType === 'backend' ? backendTemplates : frontendTemplates;
  const basePath = moduleType === 'backend' 
    ? `backend/src/routes/${moduleName}`
    : `frontend/src/modules/${moduleName}`;

  console.log(`🚀 Generating ${moduleType} module: ${moduleName}`);
  console.log(`📁 Base path: ${basePath}`);

  Object.entries(templates).forEach(([filePath, content]) => {
    const fullPath = path.join(basePath, filePath);
    createFile(fullPath, content);
  });

  console.log(`\n✨ ${pascalCase(moduleName)} module generated successfully!`);
  console.log(`\n📝 Next steps:`);
  console.log(`1. Review generated files in ${basePath}`);
  console.log(`2. Update types according to your needs`);
  console.log(`3. Implement business logic`);
  console.log(`4. Add tests`);
  console.log(`5. Update documentation`);
}

generateModule();