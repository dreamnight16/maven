import type { Source } from './message.js';

export function parseSourcesLine(line: string): Source[] | null {
  try {
    const parsed = JSON.parse(line);
    if (parsed.type === 'sources' && Array.isArray(parsed.data)) {
      return parsed.data as Source[];
    }
    return null;
  } catch {
    return null;
  }
}

export function stripDoneMarker(text: string): string {
  return text.replace(/\[DONE\]$/, '');
}
