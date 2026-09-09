import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(
        new URL('./packages/yauit/src/index.js', import.meta.url)
      ),
      formats: ['es'],
      fileName: 'yauit'
    },
    minify: false,
    sourcemap: true
  }
});
