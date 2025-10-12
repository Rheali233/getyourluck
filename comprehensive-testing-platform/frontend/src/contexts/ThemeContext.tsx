/**
 * 主题上下文
 * 遵循统一开发标准的上下文实现
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ThemeContextProps } from '@/types/componentTypes';

// 默认主题
export const DEFAULT_THEME = 'primary';

// 支持的主题列表
export type ThemeType = 'primary' | 'secondary' | 'constellation' | 'psychology' | 'tarot' | 'mbti' | 'career';

// 创建主题上下文
const ThemeContext = createContext<ThemeContextProps>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

/**
 * 主题提供者组件
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 初始化主题状态，优先从本地存储获取
  const [theme, setThemeState] = useState<string>(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || DEFAULT_THEME;
  });

  // 当主题变更时保存到本地存储
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // 更新文档根元素的data-theme属性以供全局CSS使用
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * 设置主题
   */
  const setTheme: React.Dispatch<React.SetStateAction<string>> = (newTheme) => {
    setThemeState(newTheme);
  };

  // 提供主题上下文
  const contextValue: ThemeContextProps = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 使用主题的自定义Hook
 */
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme必须在ThemeProvider内部使用');
  }
  return context;
};

export default ThemeContext; 