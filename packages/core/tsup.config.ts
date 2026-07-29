import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/client.ts',
    streaming: 'src/streaming.ts',
    'web-search': 'src/web-search.ts',
    'data-store': 'src/data-store.ts',
    session: 'src/session.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
});
