import { describe, it, expect } from 'vitest';
import {
  extractDuckDuckGoResults,
  resolveSearchProvider,
} from './web-search.js';

describe('extractDuckDuckGoResults', () => {
  it('extracts title, url, and snippet from a single result', () => {
    const html = `
<div class="result">
  <a rel="nofollow" class="result__a" href="https://example.com">Example Title</a>
  <a class="result__snippet" href="https://example.com">This is a plain snippet.</a>
</div>`;
    expect(extractDuckDuckGoResults(html, 8)).toEqual([
      {
        title: 'Example Title',
        url: 'https://example.com',
        snippet: 'This is a plain snippet.',
      },
    ]);
  });

  it('extracts multiple results capped at maxResults', () => {
    const html = `
<a class="result__a" href="https://a.com">Title A</a>
<a class="result__snippet">Snippet A</a>
<a class="result__a" href="https://b.com">Title B</a>
<a class="result__snippet">Snippet B</a>
<a class="result__a" href="https://c.com">Title C</a>
<a class="result__snippet">Snippet C</a>`;
    expect(extractDuckDuckGoResults(html, 2)).toEqual([
      { title: 'Title A', url: 'https://a.com', snippet: 'Snippet A' },
      { title: 'Title B', url: 'https://b.com', snippet: 'Snippet B' },
    ]);
  });

  it('strips inline HTML tags from snippets', () => {
    const html = `
<a class="result__a" href="https://example.com">Bold Title</a>
<a class="result__snippet">A snippet with <b>bold</b> and <em>italic</em> text.</a>`;
    expect(extractDuckDuckGoResults(html, 8)).toEqual([
      {
        title: 'Bold Title',
        url: 'https://example.com',
        snippet: 'A snippet with bold and italic text.',
      },
    ]);
  });

  it('returns an empty array when no results match', () => {
    expect(extractDuckDuckGoResults('', 8)).toEqual([]);
    expect(extractDuckDuckGoResults('<div>no results here</div>', 8)).toEqual(
      []
    );
  });

  it('returns an empty snippet when a link has no snippet', () => {
    const html = `<a class="result__a" href="https://example.com">Solo Title</a>`;
    expect(extractDuckDuckGoResults(html, 8)).toEqual([
      { title: 'Solo Title', url: 'https://example.com', snippet: '' },
    ]);
  });
});

describe('resolveSearchProvider', () => {
  it('uses brave when provider is brave and an API key is set', () => {
    expect(resolveSearchProvider('brave', 'some-key')).toBe('brave');
  });

  it('falls back to duckduckgo when the brave key is missing', () => {
    expect(resolveSearchProvider('brave', undefined)).toBe('duckduckgo');
  });

  it('falls back to duckduckgo when the brave key is empty', () => {
    expect(resolveSearchProvider('brave', '')).toBe('duckduckgo');
  });

  it('returns duckduckgo when provider is duckduckgo regardless of key', () => {
    expect(resolveSearchProvider('duckduckgo', 'some-key')).toBe('duckduckgo');
    expect(resolveSearchProvider('duckduckgo', undefined)).toBe('duckduckgo');
  });
});
