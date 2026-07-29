export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface ChatSource {
  type: 'knowledge' | 'web' | 'inferred';
  title: string;
  url: string;
  trustLevel: 'verified' | 'community' | 'ai-inferred';
}

export interface KnowledgeAtom {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  sourceUrl: string;
  trustLevel: 'verified' | 'community' | 'ai-inferred';
  lastUpdated: string;
}
