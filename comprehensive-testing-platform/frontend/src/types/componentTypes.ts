/**
 * 统一组件类型定义文件
 * 遵循统一开发标准的组件接口规范
 */

import React from 'react';

/**
 * 基础组件属性接口
 * 所有组件都应继承此接口
 */
export interface BaseComponentProps {
  className?: string;
  testId?: string;
  "data-testid"?: string;
}

/**
 * 布局组件属性接口
 */
export interface LayoutProps extends BaseComponentProps {
  children: React.ReactNode;
}

/**
 * 加载组件属性接口
 */
export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean;
  size?: "small" | "medium" | "large";
  text?: string;
}

/**
 * 按钮组件属性接口
 */
export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

/**
 * 卡片组件属性接口
 */
export interface CardProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 页面头部组件属性接口
 */
export interface PageHeaderProps extends BaseComponentProps {
  title: string;
  description?: string;
  icon?: string;
  theme?: "primary" | "secondary" | "constellation" | "psychology" | "tarot" | "mbti" | "career";
  onStart?: () => void;
}

/**
 * 输入框组件属性接口
 */
export interface InputProps extends BaseComponentProps {
  type?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * 表单组件属性接口
 */
export interface FormProps extends BaseComponentProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}

/**
 * 选择组件属性接口
 */
export interface SelectProps extends BaseComponentProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * 测试题目属性接口
 */
export interface TestQuestionProps extends BaseComponentProps {
  question: string;
  options: Array<{ id: string; text: string }>;
  onSelect: (id: string) => void;
  selectedId?: string;
  index: number;
  total: number;
}

/**
 * 测试结果属性接口
 */
export interface TestResultProps extends BaseComponentProps {
  title: string;
  description: string;
  scores: Record<string, number>;
  interpretation: string;
  recommendations: string[];
  testType: string;
  onRestart?: () => void;
}

/**
 * 导航菜单属性接口
 */
export interface NavigationProps extends BaseComponentProps {
  transparent?: boolean;
  onMenuToggle?: () => void;
}

/**
 * 移动菜单属性接口
 */
export interface MobileMenuProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 主题上下文属性接口
 */
export interface ThemeContextProps {
  theme: string;
  setTheme: (theme: string) => void;
}

/**
 * 错误边界属性接口
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 错误边界状态接口
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
} 