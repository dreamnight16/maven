import { describe, it, expect } from 'vitest';

describe('@maven/ai-types', () => {
  it('exports ChatMessage type', () => {
    // Type-level test: verify ChatMessage shape at runtime
    const msg: import('./message.js').ChatMessage = {
      role: 'user',
      content: 'hello',
    };
    expect(msg.role).toBe('user');
    expect(msg.content).toBe('hello');
  });

  it('exports ApiResponse type', () => {
    const ok: import('./api.js').ApiResponse<string> = {
      success: true,
      data: 'ok',
    };
    expect(ok.success).toBe(true);
  });

  it('exports KnowledgeAtom type', () => {
    const atom: import('./message.js').KnowledgeAtom = {
      id: '1',
      category: 'test',
      title: 'Test',
      content: 'content',
      tags: ['test'],
      sourceUrl: 'https://example.com',
      trustLevel: 'verified',
      lastUpdated: '2026-01-01',
    };
    expect(atom.id).toBe('1');
  });
});
