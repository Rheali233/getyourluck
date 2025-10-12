/**
 * 通用组件类型定义
 * 适用于所有测试模块的组件
 */
import type React from 'react'
export interface BaseComponentProps {
  /** 组件的CSS类名 */
  className?: string;
  /** 组件的测试ID */
  testId?: string;
  /** 组件的其他属性 */
  [key: string]: any;
}

export interface TestComponentProps extends BaseComponentProps {
  /** 测试类型 */
  testType: string;
  /** 测试配置 */
  config: any;
  /** 主题 */
  theme?: string;
}

export interface LayoutComponentProps extends BaseComponentProps {
  /** 页面标题 */
  title?: string;
  /** 页面描述 */
  description?: string;
  /** 是否显示导航 */
  showNavigation?: boolean;
  /** 导航路径 */
  navigationPath?: string;
} 

// ===== UI 组件 Props 补充定义 =====

export interface FormProps extends BaseComponentProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends BaseComponentProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export type LoadingSize = 'small' | 'medium' | 'large';

export interface LoadingProps extends BaseComponentProps {
  isLoading?: boolean;
  size?: LoadingSize;
  text?: string;
}

export interface ThemeContextProps {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}