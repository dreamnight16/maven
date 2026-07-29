export interface Dimension {
  key: string;
  label: string;
  question: string;
}

export interface SessionConfig {
  dimensions: Dimension[];
  collectThreshold: number;
  initialStage?: 'collect' | 'ready';
}

export type Stage = 'collect' | 'ready';

export interface SessionMachine {
  getStage(): Stage;
  setValue(key: string, value: string): void;
  getValues(): Record<string, string>;
  nextMissingDimension(currentValues: Record<string, string>): Dimension | null;
  getFilledCount(currentValues: Record<string, string>): number;
}

export function createSessionMachine(config: SessionConfig): SessionMachine {
  const { dimensions, collectThreshold, initialStage = 'collect' } = config;
  const values: Record<string, string> = {};

  function getFilledCount(currentValues: Record<string, string>): number {
    return dimensions.filter((d) => Boolean(currentValues[d.key])).length;
  }

  function getStage(): Stage {
    if (getFilledCount(values) >= collectThreshold) return 'ready';
    return initialStage;
  }

  function setValue(key: string, value: string): void {
    values[key] = value;
  }

  function getValues(): Record<string, string> {
    return { ...values };
  }

  function nextMissingDimension(
    currentValues: Record<string, string>
  ): Dimension | null {
    for (const dim of dimensions) {
      if (!currentValues[dim.key]) return dim;
    }
    return null;
  }

  return { getStage, setValue, getValues, nextMissingDimension, getFilledCount };
}
