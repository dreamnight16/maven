import { describe, it, expect } from 'vitest';
import { parseSourcesLine, stripDoneMarker } from './streaming.js';

describe('parseSourcesLine', () => {
  it('parses a valid JSON sources line', () => {
    const line = '{"type":"sources","data":[{"title":"test","url":"https://example.com","snippet":"desc"}]}';
    const result = parseSourcesLine(line);
    expect(result).toEqual([
      { title: 'test', url: 'https://example.com', snippet: 'desc' },
    ]);
  });

  it('returns null for non-sources type lines', () => {
    const line = '{"type":"message","data":"hi"}';
    expect(parseSourcesLine(line)).toBeNull();
  });

  it('returns null for plain text', () => {
    expect(parseSourcesLine('hello world')).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    expect(parseSourcesLine('not json')).toBeNull();
  });
});

describe('stripDoneMarker', () => {
  it('removes [DONE] from end', () => {
    expect(stripDoneMarker('some text[DONE]')).toBe('some text');
  });

  it('removes [DONE] with space before it', () => {
    expect(stripDoneMarker('some text [DONE]')).toBe('some text ');
  });

  it('does nothing if no [DONE]', () => {
    expect(stripDoneMarker('normal text')).toBe('normal text');
  });
});
