/**
 * 统一组件接口定义
 * 遵循统一开发标准中的BaseComponentProps规范
 */

export interface BaseComponentProps {
  className?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean;
  size?: "small" | "medium" | "large";
  text?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export interface PageHeaderProps extends BaseComponentProps {
  title: string;
  description: string;
  icon: string;
  theme?: "primary" | "constellation" | "mbti" | "tarot" | "psychology" | "career";
  onStart?: () => void;
}