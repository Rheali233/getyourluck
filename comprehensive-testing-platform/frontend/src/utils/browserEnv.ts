/**
 * 浏览器环境工具函数
 * 封装对 window、location 和 localStorage 的安全访问
 */

const isBrowser = (): boolean => typeof window !== 'undefined';

export const getWindow = (): Window | undefined => (isBrowser() ? window : undefined);

export const getLocation = (): Location | undefined => getWindow()?.location;

export const getLocationOrigin = (fallback = ''): string => getLocation()?.origin ?? fallback;

export const getLocationHref = (fallback = ''): string => getLocation()?.href ?? fallback;

export const getLocationPathname = (fallback = '/'): string => getLocation()?.pathname ?? fallback;

export const resolveAbsoluteUrl = (path: string, fallbackOrigin = ''): string => {
  if (!path) {
    return getLocationHref(fallbackOrigin);
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const origin = getLocationOrigin(fallbackOrigin);

  if (!origin) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${origin}${path}`;
  }

    return `${origin}/${path}`;
};

export const getHistoryLength = (): number => getWindow()?.history?.length ?? 0;

export const getLocalStorageItem = (key: string): string | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const setLocalStorageItem = (key: string, value: string): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // 忽略存储异常（如配额限制或无权限）
  }
};

export const removeLocalStorageItem = (key: string): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // 忽略删除异常
  }
};

export const clearLocalStorage = (): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.clear();
  } catch {
    // 忽略清理异常
  }
};

export const isBrowserEnvironment = isBrowser;

