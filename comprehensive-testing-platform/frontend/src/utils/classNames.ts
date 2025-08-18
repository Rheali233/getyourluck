/**
 * 类名辅助工具
 * 用于合并和条件性应用 CSS 类名
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并多个类名，解决Tailwind类名冲突问题
 * 使用clsx处理条件类名，然后使用tailwind-merge合并可能冲突的类
 * 
 * @example
 * cn('text-red-500', 'bg-blue-500', isActive && 'font-bold', { 'p-4': hasPadding })
 * 
 * @param inputs - 要合并的类名
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}