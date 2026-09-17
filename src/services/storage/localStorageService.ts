const isStorageAvailable = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const localStorageService = {
  get<T>(key: string, fallback: T): T {
    if (!isStorageAvailable()) return fallback;

    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : (JSON.parse(value) as T);
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isStorageAvailable()) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable or full. Callers should remain functional.
    }
  },

  remove(key: string): void {
    if (!isStorageAvailable()) return;

    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage failures.
    }
  },
};
