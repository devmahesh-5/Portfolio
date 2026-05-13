interface CacheItem<T> {
  data: T;
  expiry: number;
}

const cache: Map<string, CacheItem<unknown>> = new Map();

export function setCache<T>(key: string, data: T, ttlSeconds: number = 3600): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  });
}

export function getCache<T>(key: string): T | null {
  const item = cache.get(key) as CacheItem<T> | undefined;
  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}