import { describe, it, expect } from 'vitest';
import { escapeHtml, safeMarkdown } from './escape.js';

describe('escapeHtml', () => {
  it('escapes HTML entities', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('passes through safe text unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });
});

describe('safeMarkdown', () => {
  it('converts **bold** to <strong>', () => {
    expect(safeMarkdown('hello **world** today')).toBe(
      'hello <strong>world</strong> today'
    );
  });

  it('converts newlines to <br/>', () => {
    expect(safeMarkdown('line1\nline2')).toBe('line1<br/>line2');
  });

  it('ignores inline code backticks', () => {
    const input = 'text with `code` block';
    expect(safeMarkdown(input)).toBe('text with `code` block');
  });
});
