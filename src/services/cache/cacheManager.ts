type CacheEntry<T> = {
  value: T;
  expiresAt?: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

const now = () => Date.now();

export const cacheManager = {
  get<T>(key: string): T | null {
    const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (entry.expiresAt !== undefined && entry.expiresAt <= now()) {
      memoryCache.delete(key);
      return null;
    }

    return entry.value;
  },

  set<T>(key: string, value: T, ttlMs?: number): void {
    memoryCache.set(key, {
      value,
      expiresAt: ttlMs ? now() + ttlMs : undefined,
    });
  },

  remove(key: string): void {
    memoryCache.delete(key);
  },

  clear(): void {
    memoryCache.clear();
  },
};
