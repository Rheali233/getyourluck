import type { StateCreator } from 'zustand';

type ZustandSet<T> = Parameters<StateCreator<T>>[0];
type ZustandGet<T> = Parameters<StateCreator<T>>[1];
type ZustandApi<T> = Parameters<StateCreator<T>>[2];

interface DevtoolsOptions<T> {
  /**
   * Store name displayed in Redux DevTools
   */
  name?: string;
  /**
   * Select a subset of the state when sending payloads to DevTools
   */
  selectState?: (state: T) => unknown;
  /**
   * Generate action descriptions for DevTools timeline
   */
  describe?: (state: T, previousState: T | null) => string;
}

const isBrowser = typeof window !== 'undefined';
const isDev = import.meta.env.DEV;

export const withDevtools = <T extends object>(
  initializer: StateCreator<T>,
  options: DevtoolsOptions<T> = {}
): StateCreator<T> => {
  if (!isBrowser || !isDev) {
    return initializer;
  }

  return (set: ZustandSet<T>, get: ZustandGet<T>, api: ZustandApi<T>) => {
    const extension = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.connect({
      name: options.name ?? 'zustand-store'
    });

    const selectState = options.selectState ?? ((state: T) => state);
    let previousState: T | null = null;

    const setWithDevtools: typeof set = (partial, replace) => {
      const result = set(partial, replace);
      if (extension) {
        try {
          const currentState = get();
          const description = options.describe?.(currentState, previousState) ?? 'setState';
          extension.send(description, selectState(currentState));
          previousState = currentState;
        } catch (error) {
          console.warn('[withDevtools] Failed to publish update to Redux DevTools', error);
        }
      }

      return result;
    };

    const store = initializer(setWithDevtools, get, api);

    if (extension) {
      try {
        extension.init(selectState(get()));
      } catch (error) {
        console.warn('[withDevtools] Failed to initialise Redux DevTools', error);
      }
    }

    return store;
  };
};


