export type AIProvider = 'anthropic' | 'deepseek';

const DEFAULT_ENDPOINTS: Record<AIProvider, string> = {
  anthropic: 'https://api.anthropic.com',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
};

function requiredApiKey(provider: AIProvider): string {
  return provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'DEEPSEEK_API_KEY';
}

export function pickProvider(env: Record<string, string | undefined>): AIProvider | null {
  const explicit = env.AI_PROVIDER;
  if (explicit === 'anthropic' || explicit === 'deepseek') {
    if (!env[requiredApiKey(explicit)]) {
      throw new Error(
        `AI_PROVIDER is set to "${explicit}" but ${requiredApiKey(explicit)} is missing.`
      );
    }
    return explicit;
  }
  if (env.ANTHROPIC_API_KEY) return 'anthropic';
  if (env.DEEPSEEK_API_KEY) return 'deepseek';
  return null;
}

export function buildChatUrl(
  provider: AIProvider,
  env: Record<string, string | undefined> = {}
): string {
  switch (provider) {
    case 'deepseek':
      return env.DEEPSEEK_API_BASE_URL ?? DEFAULT_ENDPOINTS.deepseek;
    case 'anthropic':
      throw new Error('Anthropic uses SDK, not direct URL.');
  }
}
