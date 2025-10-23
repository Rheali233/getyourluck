/**
 * Tarot Data Loader Service
 * 塔罗牌数据懒加载服务
 * 实现分片加载和缓存策略
 */

import { allTarotCardsLite, TarotCardLite } from '../data/tarotCardsLite';
import type { TarotCard } from '../types';

// 数据加载状态
interface LoadingState {
  isLoading: boolean;
  loadedSuits: Set<string>;
  error: string | null;
}

// 缓存管理
class TarotDataCache {
  private cache = new Map<string, TarotCard[]>();
  private loadingStates = new Map<string, LoadingState>();

  // 获取缓存数据
  get(suit: string): TarotCard[] | null {
    return this.cache.get(suit) || null;
  }

  // 设置缓存数据
  set(suit: string, data: TarotCard[]): void {
    this.cache.set(suit, data);
  }

  // 检查是否已加载
  isLoaded(suit: string): boolean {
    return this.cache.has(suit);
  }

  // 获取加载状态
  getLoadingState(suit: string): LoadingState {
    return this.loadingStates.get(suit) || {
      isLoading: false,
      loadedSuits: new Set(),
      error: null
    };
  }

  // 设置加载状态
  setLoadingState(suit: string, state: Partial<LoadingState>): void {
    const currentState = this.getLoadingState(suit);
    this.loadingStates.set(suit, { ...currentState, ...state });
  }

  // 清除缓存
  clear(): void {
    this.cache.clear();
    this.loadingStates.clear();
  }
}

// 全局缓存实例
const cache = new TarotDataCache();

/**
 * 动态导入完整塔罗牌数据
 */
async function loadFullTarotData(suit: string): Promise<TarotCard[]> {
  try {
    // 动态导入对应的数据文件
    let dataModule;
    
    switch (suit) {
      case 'major':
        dataModule = await import('../data/tarotCards');
        return dataModule.majorArcanaCards;
      case 'wands':
        dataModule = await import('../data/tarotCards');
        return dataModule.wandsCards;
      case 'cups':
        dataModule = await import('../data/tarotCards');
        return dataModule.cupsCards;
      case 'swords':
        dataModule = await import('../data/tarotCards');
        return dataModule.swordsCards;
      case 'pentacles':
        dataModule = await import('../data/tarotCards');
        return dataModule.pentaclesCards;
      default:
        dataModule = await import('../data/tarotCards');
        return dataModule.allTarotCards;
    }
  } catch (error) {
    console.error(`Failed to load tarot data for suit: ${suit}`, error);
    throw new Error(`Failed to load tarot data for ${suit}`);
  }
}

/**
 * 预加载关键数据
 * 在用户进入塔罗牌模块时预加载大阿卡纳数据
 */
export async function preloadCriticalData(): Promise<void> {
  try {
    if (!cache.isLoaded('major')) {
      cache.setLoadingState('major', { isLoading: true, loadedSuits: new Set(), error: null });
      const majorCards = await loadFullTarotData('major');
      cache.set('major', majorCards);
      cache.setLoadingState('major', { isLoading: false, loadedSuits: new Set(['major']), error: null });
    }
  } catch (error) {
    cache.setLoadingState('major', { 
      isLoading: false, 
      loadedSuits: new Set(), 
      error: error instanceof Error ? error.message : 'Failed to preload data'
    });
  }
}

/**
 * 懒加载指定牌组数据
 */
export async function loadSuitData(suit: string): Promise<TarotCard[]> {
  // 检查缓存
  if (cache.isLoaded(suit)) {
    return cache.get(suit)!;
  }

  // 检查是否正在加载
  const loadingState = cache.getLoadingState(suit);
  if (loadingState.isLoading) {
    // 等待加载完成
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const currentState = cache.getLoadingState(suit);
        if (!currentState.isLoading) {
          clearInterval(checkInterval);
          if (currentState.error) {
            reject(new Error(currentState.error));
          } else if (cache.isLoaded(suit)) {
            resolve(cache.get(suit)!);
          } else {
            reject(new Error('Data loading failed'));
          }
        }
      }, 100);
    });
  }

  try {
    // 开始加载
    cache.setLoadingState(suit, { isLoading: true, loadedSuits: new Set(), error: null });
    
    const data = await loadFullTarotData(suit);
    cache.set(suit, data);
    
    cache.setLoadingState(suit, { 
      isLoading: false, 
      loadedSuits: new Set([suit]), 
      error: null 
    });
    
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
    cache.setLoadingState(suit, { 
      isLoading: false, 
      loadedSuits: new Set(), 
      error: errorMessage 
    });
    throw error;
  }
}

/**
 * 获取轻量级数据（用于初始渲染）
 */
export function getLiteData(): TarotCardLite[] {
  return allTarotCardsLite;
}

/**
 * 获取指定牌组的轻量级数据
 */
export function getLiteDataBySuit(suit: string): TarotCardLite[] {
  return allTarotCardsLite.filter(card => card.suit === suit);
}

/**
 * 预加载用户可能需要的牌组
 * 基于用户行为预测
 */
export async function preloadPredictedData(userBehavior: 'drawing' | 'reading' | 'browsing'): Promise<void> {
  const preloadPromises: Promise<void>[] = [];

  switch (userBehavior) {
    case 'drawing':
      // 抽牌时预加载所有牌组
      ['major', 'wands', 'cups', 'swords', 'pentacles'].forEach(suit => {
        if (!cache.isLoaded(suit)) {
          preloadPromises.push(
            loadSuitData(suit).catch(error => 
              console.warn(`Failed to preload ${suit}:`, error)
            )
          );
        }
      });
      break;
    case 'reading':
      // 阅读时预加载大阿卡纳和常用牌组
      ['major', 'cups', 'pentacles'].forEach(suit => {
        if (!cache.isLoaded(suit)) {
          preloadPromises.push(
            loadSuitData(suit).catch(error => 
              console.warn(`Failed to preload ${suit}:`, error)
            )
          );
        }
      });
      break;
    case 'browsing':
      // 浏览时只预加载大阿卡纳
      if (!cache.isLoaded('major')) {
        preloadPromises.push(
          loadSuitData('major').catch(error => 
            console.warn(`Failed to preload major:`, error)
          )
        );
      }
      break;
  }

  await Promise.allSettled(preloadPromises);
}

/**
 * 获取加载状态
 */
export function getLoadingState(suit: string): LoadingState {
  return cache.getLoadingState(suit);
}

/**
 * 清除缓存
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): { loadedSuits: string[]; cacheSize: number } {
  const loadedSuits = Array.from(cache['cache'].keys());
  const cacheSize = cache['cache'].size;
  return { loadedSuits, cacheSize };
}
