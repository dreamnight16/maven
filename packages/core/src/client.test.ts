import { describe, it, expect } from 'vitest';
import { buildChatUrl, pickProvider } from './client.js';

describe('pickProvider', () => {
  it('returns anthropic when ANTHROPIC_API_KEY is set', () => {
    const result = pickProvider({ ANTHROPIC_API_KEY: 'sk-ant-test' });
    expect(result).toBe('anthropic');
  });

  it('returns deepseek when only DEEPSEEK_API_KEY is set', () => {
    const result = pickProvider({ DEEPSEEK_API_KEY: 'sk-ds-test' });
    expect(result).toBe('deepseek');
  });

  it('prefers anthropic over deepseek when both are set', () => {
    const result = pickProvider({
      ANTHROPIC_API_KEY: 'sk-ant-test',
      DEEPSEEK_API_KEY: 'sk-ds-test',
    });
    expect(result).toBe('anthropic');
  });

  it('returns null when no provider keys are set', () => {
    const result = pickProvider({});
    expect(result).toBeNull();
  });
});

describe('buildChatUrl', () => {
  it('builds DeepSeek chat URL', () => {
    expect(buildChatUrl('deepseek')).toBe(
      'https://api.deepseek.com/v1/chat/completions'
    );
  });

  it('throws for anthropic (uses SDK, not URL)', () => {
    expect(() => buildChatUrl('anthropic')).toThrow();
  });
});
