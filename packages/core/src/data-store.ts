type Fetcher = (url: string) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

interface DataStoreOptions {
  endpoint: string;
  fetch?: Fetcher;
}

export interface DataStore<T> {
  load(): Promise<boolean>;
  getAll(): T[];
  findById(id: string): T | undefined;
  filter(predicate: (item: T) => boolean): T[];
  isLoaded(): boolean;
  hasError(): boolean;
  getError(): string | null;
}

export function createDataStore<T extends { id: string }>(
  opts: DataStoreOptions
): DataStore<T> {
  const fetcher = opts.fetch ?? (globalThis as unknown as { fetch: Fetcher }).fetch;
  let data: T[] = [];
  let loaded = false;
  let error: string | null = null;
  let loadPromise: Promise<void> | null = null;

  async function load(): Promise<boolean> {
    if (loaded) return true;
    if (loadPromise) {
      try {
        await loadPromise;
        return loaded;
      } catch {
        return false;
      }
    }

    loadPromise = (async () => {
      try {
        const res = await fetcher(opts.endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { data?: T[] };
        data = json.data ?? (json as unknown as T[]);
        loaded = true;
      } catch (e) {
        error = e instanceof Error ? e.message : '数据加载失败';
        loadPromise = null;
      }
    })();

    try {
      await loadPromise;
      return loaded;
    } catch {
      return false;
    }
  }

  function getAll(): T[] {
    return [...data];
  }

  function findById(id: string): T | undefined {
    return data.find((item) => item.id === id);
  }

  function filter(predicate: (item: T) => boolean): T[] {
    return data.filter(predicate);
  }

  function isLoaded(): boolean {
    return loaded;
  }

  function hasError(): boolean {
    return !loaded && error !== null;
  }

  function getError(): string | null {
    return error;
  }

  return { load, getAll, findById, filter, isLoaded, hasError, getError };
}
