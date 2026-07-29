import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    client: 'src/client.ts',
    streaming: 'src/streaming.ts',
    'web-search': 'src/web-search.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
});
