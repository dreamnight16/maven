import type { Source } from './message.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSource(value: unknown): value is Source {
  if (!isRecord(value)) return false;
  return (
    typeof value.title === 'string' &&
    typeof value.url === 'string' &&
    typeof value.snippet === 'string'
  );
}

export function parseSourcesLine(line: string): Source[] | null {
  try {
    const parsed: unknown = JSON.parse(line);
    if (!isRecord(parsed) || parsed.type !== 'sources' || !Array.isArray(parsed.data)) {
      return null;
    }
    return parsed.data.filter(isSource).map((item) => ({
      title: item.title,
      url: item.url,
      snippet: item.snippet,
    }));
  } catch {
    return null;
  }
}

export function stripDoneMarker(text: string): string {
  return text.replace(/\[DONE\]$/, '');
}
