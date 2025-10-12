/**
 * 通用classNames工具函数
 * 用于条件性地组合CSS类名
 * 
 * @example
 * cn('base-class', condition && 'conditional-class', 'always-class')
 * cn('base-class', { 'conditional-class': condition })
 */

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default cn;