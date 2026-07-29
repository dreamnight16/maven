import type { Source } from './message.js';

interface WebSearchOptions {
  query: string;
  maxResults?: number;
  timeout?: number;
  provider?: 'brave' | 'duckduckgo';
}

export async function searchWeb(opts: WebSearchOptions): Promise<Source[]> {
  const { query, maxResults = 8, timeout = 8000, provider = 'duckduckgo' } = opts;

  if (provider === 'brave' && process.env.BRAVE_API_KEY) {
    return searchBrave(query, maxResults, timeout);
  }
  return searchDuckDuckGo(query, maxResults, timeout);
}

async function searchBrave(
  query: string,
  maxResults: number,
  timeout: number
): Promise<Source[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${maxResults}`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': process.env.BRAVE_API_KEY!,
        },
        signal: controller.signal,
      }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { web?: { results?: Array<Record<string, string>> } };
    return (json.web?.results ?? []).map(
      (r) => ({
        title: r.title ?? '',
        url: r.url ?? '',
        snippet: r.description ?? '',
      })
    );
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function searchDuckDuckGo(
  query: string,
  maxResults: number,
  timeout: number
): Promise<Source[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    );
    if (!res.ok) return [];
    const html = await res.text();
    return extractDuckDuckGoResults(html, maxResults);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function extractDuckDuckGoResults(html: string, maxResults: number): Source[] {
  const results: Source[] = [];
  const linkRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi;
  const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;

  const links: Array<{ url: string; title: string }> = [];
  let m;
  while ((m = linkRegex.exec(html)) !== null && links.length < maxResults) {
    links.push({ url: m[1] ?? '', title: m[2] ?? '' });
  }

  const snippets: string[] = [];
  while ((m = snippetRegex.exec(html)) !== null && snippets.length < maxResults) {
    snippets.push(m[1]?.replace(/<[^>]*>/g, '').trim() ?? '');
  }

  for (let i = 0; i < Math.min(links.length, maxResults); i++) {
    results.push({
      title: links[i]!.title,
      url: links[i]!.url,
      snippet: snippets[i] ?? '',
    });
  }
  return results;
}
