export type AIProvider = 'anthropic' | 'deepseek';

export function pickProvider(env: Record<string, string | undefined>): AIProvider | null {
  if (env.ANTHROPIC_API_KEY) return 'anthropic';
  if (env.DEEPSEEK_API_KEY) return 'deepseek';
  return null;
}

export function buildChatUrl(provider: AIProvider): string {
  switch (provider) {
    case 'deepseek':
      return 'https://api.deepseek.com/v1/chat/completions';
    case 'anthropic':
      throw new Error('Anthropic uses SDK, not direct URL.');
  }
}
