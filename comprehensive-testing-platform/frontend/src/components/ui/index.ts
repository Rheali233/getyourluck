/**
 * UI组件索引文件
 * 遵循统一开发标准的组件导出规范
 */

// UI组件库导出
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Select } from './Select';
export { default as Form } from './Form';
export { default as Modal } from './Modal';
export { default as Alert } from './Alert';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as Navigation } from './Navigation';
export { default as Footer } from './Footer';
export { default as PageHeader } from './PageHeader';
export { TestNavigation } from './TestNavigation';
export { default as QuestionOptions } from './QuestionOptions';

// 类型导出
export type {
  ButtonProps,
  CardProps,
  InputProps,
  SelectProps,
  FormProps,
  LoadingProps as LoadingSpinnerProps,
  NavigationProps,
  PageHeaderProps,
} from '../../types/componentTypes';

export type { ModalProps } from './Modal';
export type { AlertProps } from './Alert';
export type { FooterProps } from './Footer';
export type { TestNavigationProps } from './TestNavigation';