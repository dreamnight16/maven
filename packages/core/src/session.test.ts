import { describe, it, expect } from 'vitest';

describe('createSessionMachine', () => {
  it('starts in collect stage', async () => {
    const { createSessionMachine } = await import('./session.js');

    const machine = createSessionMachine({
      dimensions: [
        { key: 'grade', label: '年级', question: '你现在几年级？' },
        { key: 'interest', label: '兴趣', question: '你对什么方向感兴趣？' },
        { key: 'province', label: '省份', question: '你在哪个省？' },
      ],
      collectThreshold: 2,
    });

    expect(machine.getStage()).toBe('collect');
    const next = machine.nextMissingDimension({});
    expect(next).toEqual({ key: 'grade', label: '年级', question: '你现在几年级？' });
  });

  it('transitions to ready stage when threshold met', async () => {
    const { createSessionMachine } = await import('./session.js');

    const machine = createSessionMachine({
      dimensions: [
        { key: 'a', label: 'A', question: '?' },
        { key: 'b', label: 'B', question: '?' },
        { key: 'c', label: 'C', question: '?' },
      ],
      collectThreshold: 2,
    });

    expect(machine.getStage()).toBe('collect');
    machine.setValue('a', 'v1');
    machine.setValue('b', 'v2');
    expect(machine.getStage()).toBe('ready');
  });

  it('returns null when all dimensions filled', async () => {
    const { createSessionMachine } = await import('./session.js');

    const machine = createSessionMachine({
      dimensions: [{ key: 'a', label: 'A', question: '?' }],
      collectThreshold: 1,
    });

    machine.setValue('a', 'v1');
    const next = machine.nextMissingDimension({ a: 'v1' });
    expect(next).toBeNull();
  });

  it('getValues returns a shallow copy', async () => {
    const { createSessionMachine } = await import('./session.js');

    const machine = createSessionMachine({
      dimensions: [{ key: 'a', label: 'A', question: '?' }],
      collectThreshold: 1,
    });

    machine.setValue('a', 'v1');
    const values = machine.getValues();
    values.a = 'mutated';
    expect(machine.getValues().a).toBe('v1'); // immutable — copy was returned
  });
});
