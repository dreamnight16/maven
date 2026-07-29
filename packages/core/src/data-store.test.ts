import { describe, it, expect } from 'vitest';

describe('createDataStore', () => {
  it('loads and caches data', async () => {
    const { createDataStore } = await import('./data-store.js');

    let fetchCount = 0;
    const mockFetch = async (_url: string) => {
      fetchCount++;
      return {
        ok: true,
        json: async () => ({ data: [{ id: '1', name: 'test' }] }),
      };
    };

    const store = createDataStore<{ id: string; name: string }>({
      endpoint: '/data/test.json',
      fetch: mockFetch as unknown as typeof fetch,
    });

    expect(store.isLoaded()).toBe(false);

    const result = await store.load();
    expect(result).toBe(true);
    expect(fetchCount).toBe(1);
    expect(store.getAll()).toEqual([{ id: '1', name: 'test' }]);
    expect(store.isLoaded()).toBe(true);

    // Second call should be cached, no re-fetch
    await store.load();
    expect(fetchCount).toBe(1);
  });

  it('findById finds item', async () => {
    const { createDataStore } = await import('./data-store.js');

    const mockFetch = async (_url: string) => ({
      ok: true,
      json: async () => ({ data: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }] }),
    });

    const store = createDataStore<{ id: string; name: string }>({
      endpoint: '/data/test.json',
      fetch: mockFetch as unknown as typeof fetch,
    });

    await store.load();
    expect(store.findById('a')).toEqual({ id: 'a', name: 'A' });
    expect(store.findById('x')).toBeUndefined();
  });

  it('filter returns matching items', async () => {
    const { createDataStore } = await import('./data-store.js');

    const mockFetch = async (_url: string) => ({
      ok: true,
      json: async () => ({ data: [{ id: '1', type: 'a' }, { id: '2', type: 'b' }, { id: '3', type: 'a' }] }),
    });

    const store = createDataStore<{ id: string; type: string }>({
      endpoint: '/data/test.json',
      fetch: mockFetch as unknown as typeof fetch,
    });

    await store.load();
    expect(store.filter((item) => item.type === 'a')).toHaveLength(2);
  });
});
