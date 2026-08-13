# Maven

A TypeScript monorepo providing `maven-core`, a framework-agnostic AI companion
toolkit: provider routing, streaming helpers, web search, a generic data store,
and a session state machine.

## Install

This repo uses [pnpm](https://pnpm.io) with workspaces.

```bash
pnpm install
```

The publishable package lives in `packages/core` (`maven-core`). Its subpath
exports are `client`, `streaming`, `web-search`, `data-store`, and `session`.

## Build

```bash
pnpm build
```

Runs `turbo build` (each package builds via `tsup`; `maven-core` emits ESM +
type declarations into `dist/`).

## Test

```bash
pnpm test
```

Runs `turbo test` (Vitest unit tests in each package).

## Typecheck

```bash
pnpm typecheck
```

## Usage

### Client — provider routing

```ts
import { pickProvider, buildChatUrl } from 'maven-core';

const provider = pickProvider(process.env); // 'anthropic' | 'deepseek' | null
if (provider === 'deepseek') {
  const url = buildChatUrl(provider);
}
```

### Streaming — parsing streamed lines

```ts
import { parseSourcesLine, stripDoneMarker } from 'maven-core/streaming';

const sources = parseSourcesLine('{"type":"sources","data":[...]}');
const clean = stripDoneMarker('some text[DONE]');
```

### Web search

```ts
import { searchWeb } from 'maven-core/web-search';

const results = await searchWeb({
  query: 'typescript monorepo',
  maxResults: 5,
  provider: 'duckduckgo', // or 'brave' when BRAVE_API_KEY is set
});
```

### Data store — generic fetch-backed cache

```ts
import { createDataStore } from 'maven-core/data-store';

interface Item { id: string; name: string }

const store = createDataStore<Item>({ endpoint: 'https://example.com/items' });
await store.load();
const all = store.getAll();
const one = store.findById('abc');
```

### Session — stage machine

```ts
import { createSessionMachine } from 'maven-core/session';

const machine = createSessionMachine({
  dimensions: [
    { key: 'topic', label: 'Topic', question: 'What is the topic?' },
  ],
  collectThreshold: 1,
});

machine.setValue('topic', 'astronomy');
console.log(machine.getStage()); // 'ready'
```

### Utilities

```ts
import { cn, escapeHtml, safeMarkdown } from 'maven-core';

const className = cn('base', 'override'); // tailwind-merge + clsx
const safe = safeMarkdown('**hello** & <world>');
```

## License

MIT — see [LICENSE](./LICENSE).
